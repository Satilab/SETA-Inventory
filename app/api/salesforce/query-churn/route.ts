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

export async function GET(request: NextRequest) {
  try {
    // Get the host from the request to determine environment
    const host = request.headers.get("host") || ""
    const origin = request.headers.get("origin") || ""
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1") || origin.includes("localhost")
    const isVercelPreview = host.includes("vercel.app")
    const isPublicUrl = !isLocalhost && (host.includes(".") || isVercelPreview)

    console.log("Request environment:", { host, origin, isLocalhost, isVercelPreview, isPublicUrl })

    // Demo churn customers data
    const demoChurnCustomers = [
      {
        Id: "demo-1",
        Name: "Rajesh Electronics",
        Phone__c: "9876543210",
        Email__c: "rajesh@example.com",
        Last_Order_Date__c: "2023-12-15",
        Churn_Risk_Score__c: 85,
        Churn_Reason__c: "Competitor pricing",
        Days_Inactive__c: 45,
        Last_Interaction_Date__c: "2023-12-15",
        Recommended_Action__c: "Offer discount on next purchase",
      },
      {
        Id: "demo-2",
        Name: "Venkata Electrical",
        Phone__c: "8765432109",
        Email__c: "venkata@example.com",
        Last_Order_Date__c: "2024-01-05",
        Churn_Risk_Score__c: 72,
        Churn_Reason__c: "Service issues",
        Days_Inactive__c: 30,
        Last_Interaction_Date__c: "2024-01-05",
        Recommended_Action__c: "Follow up call by manager",
      },
      {
        Id: "demo-3",
        Name: "Suresh Traders",
        Phone__c: "7654321098",
        Email__c: "suresh@example.com",
        Last_Order_Date__c: "2024-02-10",
        Churn_Risk_Score__c: 65,
        Churn_Reason__c: "Product availability",
        Days_Inactive__c: 25,
        Last_Interaction_Date__c: "2024-02-10",
        Recommended_Action__c: "Send product catalog",
      },
      {
        Id: "demo-4",
        Name: "Krishna Electricals",
        Phone__c: "6543210987",
        Email__c: "krishna@example.com",
        Last_Order_Date__c: "2024-03-01",
        Churn_Risk_Score__c: 58,
        Churn_Reason__c: "Payment terms",
        Days_Inactive__c: 20,
        Last_Interaction_Date__c: "2024-03-01",
        Recommended_Action__c: "Offer extended payment terms",
      },
      {
        Id: "demo-5",
        Name: "Lakshmi Enterprises",
        Phone__c: "5432109876",
        Email__c: "lakshmi@example.com",
        Last_Order_Date__c: "2024-03-15",
        Churn_Risk_Score__c: 45,
        Churn_Reason__c: "Delivery delays",
        Days_Inactive__c: 15,
        Last_Interaction_Date__c: "2024-03-15",
        Recommended_Action__c: "Priority shipping on next order",
      },
    ]

    // Force demo mode for localhost
    if (isLocalhost) {
      console.log("Localhost detected - using demo mode")
      return NextResponse.json({
        records: demoChurnCustomers,
        totalSize: demoChurnCustomers.length,
        done: true,
        usingDemoMode: true,
        message: "Churn customers loaded in demo mode (localhost detected)",
        reason: "Salesforce requires public URLs for authentication",
      })
    }

    // Check if Salesforce is configured
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL
    const clientId = process.env.SALESFORCE_CLIENT_ID

    if (!instanceUrl || !clientId) {
      console.log("Salesforce not configured, using demo mode")
      return NextResponse.json({
        records: demoChurnCustomers,
        totalSize: demoChurnCustomers.length,
        done: true,
        usingDemoMode: true,
        message: "Churn customers loaded in demo mode (Salesforce not configured)",
      })
    }

    try {
      // Get authentication token
      const authData = await getSalesforceToken()

      // Use the instance URL from the auth response if available
      const apiUrl = authData.instance_url || instanceUrl

      // Query churn customers from Salesforce
      const soql = `
        SELECT Id, Name, Phone__c, Email__c, Last_Order_Date__c, 
               Churn_Risk_Score__c, Churn_Reason__c, Days_Inactive__c,
               Last_Interaction_Date__c, Recommended_Action__c
        FROM Churn_customers__c
        ORDER BY Churn_Risk_Score__c DESC
      `

      const queryResponse = await fetch(`${apiUrl}/services/data/v58.0/query?q=${encodeURIComponent(soql)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "SETA-Smart-Inventory/1.0",
        },
      })

      const responseText = await queryResponse.text()
      console.log("Query response status:", queryResponse.status)

      if (!queryResponse.ok) {
        console.error("Salesforce query error:", responseText)

        // Parse error details
        let errorMessage = "Salesforce query operation failed"
        let errorDetails = ""

        try {
          const errorData = JSON.parse(responseText)
          if (Array.isArray(errorData) && errorData.length > 0) {
            const firstError = errorData[0]
            errorMessage = firstError.message || errorMessage

            // Check for object-related errors
            if (firstError.errorCode === "INVALID_TYPE") {
              errorDetails = `Object error: ${firstError.message}`
              console.log("Invalid object detected, falling back to demo mode")
            }
          }
        } catch (e) {
          errorMessage = responseText.substring(0, 100)
        }

        // Return demo mode if Salesforce fails
        return NextResponse.json({
          records: demoChurnCustomers,
          totalSize: demoChurnCustomers.length,
          done: true,
          usingDemoMode: true,
          message: "Churn customers loaded in demo mode (Salesforce query error)",
          salesforceError: `${queryResponse.status}: ${errorMessage}`,
          errorDetails: errorDetails,
          note: "Churn_customers__c object may not exist in your Salesforce org. Using demo data instead.",
        })
      }

      // Parse successful response
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse query response as JSON:", parseError)
        return NextResponse.json({
          records: demoChurnCustomers,
          totalSize: demoChurnCustomers.length,
          done: true,
          usingDemoMode: true,
          message: "Churn customers loaded in demo mode (unexpected response format)",
        })
      }

      return NextResponse.json({
        records: result.records || [],
        totalSize: result.totalSize || 0,
        done: result.done || true,
        usingDemoMode: false,
        message: `Successfully fetched ${result.totalSize || 0} churn customers from Salesforce`,
      })
    } catch (salesforceError) {
      console.error("Salesforce operation failed:", salesforceError)

      // Provide specific error messages based on error type
      let errorMessage = "Salesforce connection failed"
      let userMessage = "Churn customers loaded in demo mode"

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
        records: demoChurnCustomers,
        totalSize: demoChurnCustomers.length,
        done: true,
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
      records: [
        {
          Id: "demo-1",
          Name: "Rajesh Electronics",
          Phone__c: "9876543210",
          Email__c: "rajesh@example.com",
          Last_Order_Date__c: "2023-12-15",
          Churn_Risk_Score__c: 85,
          Churn_Reason__c: "Competitor pricing",
          Days_Inactive__c: 45,
          Last_Interaction_Date__c: "2023-12-15",
          Recommended_Action__c: "Offer discount on next purchase",
        },
      ],
      totalSize: 1,
      done: true,
      usingDemoMode: true,
      message: "Churn customers loaded in demo mode (API error)",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
