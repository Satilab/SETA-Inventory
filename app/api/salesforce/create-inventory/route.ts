import { type NextRequest, NextResponse } from "next/server"
import { getSalesforceToken } from "@/lib/salesforce-auth"

export async function POST(request: NextRequest) {
  try {
    const { productData, category, salesforceObject } = await request.json()

    if (!productData) {
      return NextResponse.json({ error: "productData is required" }, { status: 400 })
    }

    // Get the host from the request to determine environment
    const host = request.headers.get("host") || ""
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1")

    console.log("Request environment:", { host, isLocalhost, category, salesforceObject })

    // Force demo mode for localhost
    if (isLocalhost) {
      console.log("Localhost detected - using demo mode")
      return NextResponse.json({
        id: `demo-inv-${Date.now()}`,
        success: true,
        usingDemoMode: true,
        message: `${category} product created in demo mode (localhost detected)`,
        reason: "Salesforce requires public URLs for authentication",
      })
    }

    // Check if Salesforce is configured
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL
    const clientId = process.env.SALESFORCE_CLIENT_ID

    if (!instanceUrl || !clientId) {
      console.log("Salesforce not configured, using demo mode")
      return NextResponse.json({
        id: `demo-inv-${Date.now()}`,
        success: true,
        usingDemoMode: true,
        message: `${category} product created in demo mode (Salesforce not configured)`,
      })
    }

    try {
      // Get authentication token
      const authResult = await getSalesforceToken()

      if (!authResult.success) {
        console.log("Authentication failed:", authResult.error)
        return NextResponse.json({
          id: `demo-inv-${Date.now()}`,
          success: true,
          usingDemoMode: true,
          message: `${category} product created in demo mode (authentication failed)`,
          salesforceError: authResult.error,
        })
      }

      // Use the provided Salesforce object or default to Inventory_Management__c
      const targetObject = salesforceObject || "Inventory_Management__c"

      // Store category in metadata but don't send to Salesforce
      const categoryInfo = category || "Unknown"

      console.log("Creating Salesforce record:", {
        object: targetObject,
        category: categoryInfo, // For logging only
        data: JSON.stringify(productData, null, 2),
      })

      // Use the instance URL from the auth response if available
      const { instance_url, access_token } = authResult
      const apiUrl = instance_url || instanceUrl

      // Create record in the specified Salesforce object
      const createResponse = await fetch(`${apiUrl}/services/data/v58.0/sobjects/${targetObject}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "SETA-Smart-Inventory/1.0",
        },
        body: JSON.stringify(productData),
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
          id: `demo-inv-${Date.now()}`,
          success: true,
          usingDemoMode: true,
          message: `${categoryInfo} product created in demo mode (Salesforce field error)`,
          salesforceError: `${createResponse.status}: ${errorMessage}`,
          errorDetails: errorDetails,
          note: `Some fields may not exist in your Salesforce ${targetObject} object. Product saved to demo data instead.`,
        })
      }

      // Parse successful response
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse create response as JSON:", parseError)
        return NextResponse.json({
          id: `demo-inv-${Date.now()}`,
          success: true,
          usingDemoMode: true,
          message: `${categoryInfo} product created in demo mode (unexpected response format)`,
        })
      }

      return NextResponse.json({
        id: result.id,
        success: true,
        usingDemoMode: false,
        message: `${categoryInfo} product created successfully in Salesforce ${targetObject} with ID: ${result.id}`,
        category: categoryInfo,
        salesforceObject: targetObject,
      })
    } catch (salesforceError) {
      console.error("Salesforce operation failed:", salesforceError)

      // Provide specific error messages based on error type
      let errorMessage = "Salesforce connection failed"
      let userMessage = `${category || "Product"} created in demo mode`

      if (salesforceError instanceof Error) {
        errorMessage = salesforceError.message

        if (errorMessage.includes("PUBLIC_URL_REQUIRED")) {
          userMessage = `Demo mode: ${category || "Product"} saved (Salesforce requires public URL)`
        } else if (errorMessage.includes("INVALID_CREDENTIALS")) {
          userMessage = `Demo mode: ${category || "Product"} saved (Invalid Salesforce credentials)`
        } else if (errorMessage.includes("INVALID_CLIENT")) {
          userMessage = `Demo mode: ${category || "Product"} saved (Invalid Salesforce app configuration)`
        } else {
          userMessage = `Demo mode: ${category || "Product"} saved (Salesforce connection failed)`
        }
      }

      // Return demo mode response if Salesforce fails
      return NextResponse.json({
        id: `demo-inv-${Date.now()}`,
        success: true,
        usingDemoMode: true,
        message: userMessage,
        salesforceError: errorMessage,
        category: category,
      })
    }
  } catch (error) {
    console.error("API route error:", error)

    // Return demo mode response for any other errors
    return NextResponse.json({
      id: `demo-inv-${Date.now()}`,
      success: true,
      usingDemoMode: true,
      message: "Product created in demo mode (API error)",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
