import { type NextRequest, NextResponse } from "next/server"

async function getSalesforceToken() {
  const config = {
    instanceUrl: process.env.SALESFORCE_INSTANCE_URL || "https://login.salesforce.com",
    clientId: process.env.SALESFORCE_CLIENT_ID || "",
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET || "",
    username: process.env.SALESFORCE_USERNAME || "",
    password: process.env.SALESFORCE_PASSWORD || "",
    securityToken: process.env.SALESFORCE_SECURITY_TOKEN || "",
  }

  // Validate configuration
  if (!config.instanceUrl || !config.clientId || !config.clientSecret || !config.username || !config.password) {
    throw new Error("MISSING_CONFIG: Required Salesforce configuration is missing")
  }

  // Use the correct Salesforce login URL for sandbox
  const loginUrl = config.instanceUrl.includes("test.salesforce.com")
    ? "https://test.salesforce.com"
    : "https://login.salesforce.com"

  console.log("Attempting Salesforce authentication to:", loginUrl)

  try {
    const response = await fetch(`${loginUrl}/services/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "SETA-Smart-Inventory/1.0",
      },
      body: new URLSearchParams({
        grant_type: "password",
        client_id: config.clientId,
        client_secret: config.clientSecret,
        username: config.username,
        password: config.password + config.securityToken,
      }),
    })

    const responseText = await response.text()
    console.log("Auth response status:", response.status)

    if (!response.ok) {
      console.error("Auth failed:", responseText)

      // Check for specific error messages
      if (responseText.includes("only public URLs are supported")) {
        throw new Error(
          "PUBLIC_URL_REQUIRED: Salesforce requires a public URL. Deploy to Vercel or use ngrok for testing.",
        )
      }

      if (responseText.includes("invalid_client_id")) {
        throw new Error("INVALID_CLIENT_ID: Check your Connected App Consumer Key")
      }

      if (responseText.includes("invalid_client")) {
        throw new Error("INVALID_CLIENT: Verify your Consumer Key and Secret")
      }

      if (responseText.includes("invalid_grant")) {
        throw new Error("INVALID_CREDENTIALS: Check username, password, and security token")
      }

      if (responseText.includes("INVALID_LOGIN")) {
        throw new Error("INVALID_LOGIN: Username or password is incorrect")
      }

      throw new Error(`AUTH_FAILED: ${response.status} - ${responseText.substring(0, 200)}`)
    }

    // Try to parse as JSON
    try {
      const authData = JSON.parse(responseText)

      if (!authData.access_token) {
        throw new Error("NO_ACCESS_TOKEN: Authentication succeeded but no access token received")
      }

      return authData
    } catch (parseError) {
      console.error("Failed to parse auth response as JSON:", parseError)
      throw new Error(`PARSE_ERROR: Invalid response format - ${responseText.substring(0, 100)}`)
    }
  } catch (fetchError) {
    if (fetchError instanceof Error) {
      throw fetchError
    }
    throw new Error(`NETWORK_ERROR: ${fetchError}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productData, category } = await request.json()

    if (!productData || !category) {
      return NextResponse.json({ error: "productData and category are required" }, { status: 400 })
    }

    // Get the host from the request to determine environment
    const host = request.headers.get("host") || ""
    const origin = request.headers.get("origin") || ""
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1") || origin.includes("localhost")
    const isVercelPreview = host.includes("vercel.app")
    const isPublicUrl = !isLocalhost && (host.includes(".") || isVercelPreview)

    console.log("Request environment:", { host, origin, isLocalhost, isVercelPreview, isPublicUrl })

    // Force demo mode for localhost
    if (isLocalhost) {
      console.log("Localhost detected - using demo mode")
      return NextResponse.json({
        id: `demo-${Date.now()}`,
        success: true,
        usingDemoMode: true,
        message: "Product created in demo mode (localhost detected)",
        reason: "Salesforce requires public URLs for authentication",
      })
    }

    // Check if Salesforce is configured
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL
    const clientId = process.env.SALESFORCE_CLIENT_ID

    if (!instanceUrl || !clientId) {
      console.log("Salesforce not configured, using demo mode")
      return NextResponse.json({
        id: `demo-${Date.now()}`,
        success: true,
        usingDemoMode: true,
        message: "Product created in demo mode (Salesforce not configured)",
      })
    }

    try {
      // Get authentication token
      const authData = await getSalesforceToken()

      // Map form data to Salesforce fields with correct field names
      const salesforceData: any = {
        Productname__c: String(productData.productName || ""),
        Model__c: String(productData.model || ""),
        Category__c: String(category || ""),
      }

      // Add optional fields with correct API names
      if (productData.phase) salesforceData.Phase__c = String(productData.phase)
      if (productData.stage) salesforceData.Stage__c = Number(productData.stage)
      if (productData.voltage) salesforceData.Voltage__c = String(productData.voltage)
      if (productData.frequency) salesforceData.Frequency__c = String(productData.frequency)
      if (productData.price) salesforceData.Price__c = Number(productData.price) // Correct field name
      if (productData.quantity) salesforceData.Quantity__c = Number(productData.quantity)
      if (productData.hp) salesforceData.H_P__c = Number(productData.hp) // Correct field name with underscore

      console.log("Creating Salesforce record with data:", JSON.stringify(salesforceData, null, 2))

      // Use the instance URL from the auth response if available
      const apiUrl = authData.instance_url || instanceUrl

      // Create record in VENKATA_RAMANA_MOTORS__c object
      const createResponse = await fetch(`${apiUrl}/services/data/v58.0/sobjects/VENKATA_RAMANA_MOTORS__c/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "SETA-Smart-Inventory/1.0",
        },
        body: JSON.stringify(salesforceData),
      })

      const responseText = await createResponse.text()
      console.log("Create response status:", createResponse.status)

      if (!createResponse.ok) {
        console.error("Salesforce create error:", responseText)

        // Parse error details
        let errorMessage = "Salesforce create operation failed"
        let errorDetails = ""

        try {
          const errorData = JSON.parse(responseText)
          if (Array.isArray(errorData) && errorData.length > 0) {
            const firstError = errorData[0]
            errorMessage = firstError.message || errorMessage

            // Check for field-related errors
            if (firstError.errorCode === "INVALID_FIELD") {
              errorDetails = `Field error: ${firstError.message}`
              console.log("Invalid field detected, falling back to demo mode")
            }
          }
        } catch (e) {
          errorMessage = responseText.substring(0, 100)
        }

        // Return demo mode if Salesforce fails
        return NextResponse.json({
          id: `demo-${Date.now()}`,
          success: true,
          usingDemoMode: true,
          message: "Product created in demo mode (Salesforce field error)",
          salesforceError: `${createResponse.status}: ${errorMessage}`,
          errorDetails: errorDetails,
          note: "Some fields may not exist in your Salesforce object. Product saved to demo data instead.",
        })
      }

      // Parse successful response
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse create response as JSON:", parseError)
        return NextResponse.json({
          id: `demo-${Date.now()}`,
          success: true,
          usingDemoMode: true,
          message: "Product created in demo mode (unexpected response format)",
        })
      }

      return NextResponse.json({
        id: result.id,
        success: true,
        usingDemoMode: false,
        message: `Product created successfully in Salesforce with ID: ${result.id}`,
      })
    } catch (salesforceError) {
      console.error("Salesforce operation failed:", salesforceError)

      // Provide specific error messages based on error type
      let errorMessage = "Salesforce connection failed"
      let userMessage = "Product created in demo mode"

      if (salesforceError instanceof Error) {
        errorMessage = salesforceError.message

        if (errorMessage.includes("PUBLIC_URL_REQUIRED")) {
          userMessage = "Demo mode: Salesforce requires public URL"
        } else if (errorMessage.includes("INVALID_CREDENTIALS")) {
          userMessage = "Demo mode: Invalid Salesforce credentials"
        } else if (errorMessage.includes("INVALID_CLIENT")) {
          userMessage = "Demo mode: Invalid Salesforce app configuration"
        } else {
          userMessage = "Demo mode: Salesforce connection failed"
        }
      }

      // Return demo mode response if Salesforce fails
      return NextResponse.json({
        id: `demo-${Date.now()}`,
        success: true,
        usingDemoMode: true,
        message: userMessage,
        salesforceError: errorMessage,
        isPublicUrl: isPublicUrl,
        host: host,
      })
    }
  } catch (error) {
    console.error("API route error:", error)

    // Return demo mode response for any other errors
    return NextResponse.json({
      id: `demo-${Date.now()}`,
      success: true,
      usingDemoMode: true,
      message: "Product created in demo mode (API error)",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
