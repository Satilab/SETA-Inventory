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

    console.log("Request environment:", { host, origin, isLocalhost })

    // Force demo mode for localhost
    if (isLocalhost) {
      console.log("Localhost detected - using demo mode")
      return NextResponse.json({
        fields: [
          { name: "Id", type: "id" },
          { name: "Name", type: "string" },
          { name: "Phone__c", type: "phone" },
          { name: "Email__c", type: "email" },
        ],
        usingDemoMode: true,
        message: "Field description in demo mode (localhost detected)",
      })
    }

    // Check if Salesforce is configured
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL
    const clientId = process.env.SALESFORCE_CLIENT_ID

    if (!instanceUrl || !clientId) {
      console.log("Salesforce not configured, using demo mode")
      return NextResponse.json({
        fields: [
          { name: "Id", type: "id" },
          { name: "Name", type: "string" },
        ],
        usingDemoMode: true,
        message: "Field description in demo mode (Salesforce not configured)",
      })
    }

    try {
      // Get authentication token
      const authData = await getSalesforceToken()

      // Use the instance URL from the auth response if available
      const apiUrl = authData.instance_url || instanceUrl

      console.log("Describing Churn_customers__c object...")

      const describeResponse = await fetch(`${apiUrl}/services/data/v58.0/sobjects/Churn_customers__c/describe`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "SETA-Smart-Inventory/1.0",
        },
      })

      const responseText = await describeResponse.text()
      console.log("Describe response status:", describeResponse.status)

      if (!describeResponse.ok) {
        console.error("Salesforce describe error:", responseText)
        return NextResponse.json({
          fields: [
            { name: "Id", type: "id" },
            { name: "Name", type: "string" },
          ],
          usingDemoMode: true,
          message: "Field description in demo mode (Salesforce describe error)",
          salesforceError: responseText.substring(0, 500),
        })
      }

      // Parse successful response
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse describe response as JSON:", parseError)
        return NextResponse.json({
          fields: [
            { name: "Id", type: "id" },
            { name: "Name", type: "string" },
          ],
          usingDemoMode: true,
          message: "Field description in demo mode (unexpected response format)",
        })
      }

      console.log(`Successfully described Churn_customers__c object with ${result.fields?.length || 0} fields`)

      // Extract field information
      const fields =
        result.fields?.map((field: any) => ({
          name: field.name,
          type: field.type,
          label: field.label,
          custom: field.custom,
          updateable: field.updateable,
          createable: field.createable,
        })) || []

      return NextResponse.json({
        fields,
        objectName: result.name,
        label: result.label,
        usingDemoMode: false,
        message: `Successfully described ${result.name} object with ${fields.length} fields`,
      })
    } catch (salesforceError) {
      console.error("Salesforce operation failed:", salesforceError)
      return NextResponse.json({
        fields: [
          { name: "Id", type: "id" },
          { name: "Name", type: "string" },
        ],
        usingDemoMode: true,
        message: "Field description in demo mode (Salesforce connection failed)",
        salesforceError: salesforceError instanceof Error ? salesforceError.message : String(salesforceError),
      })
    }
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({
      fields: [
        { name: "Id", type: "id" },
        { name: "Name", type: "string" },
      ],
      usingDemoMode: true,
      message: "Field description in demo mode (API error)",
    })
  }
}
