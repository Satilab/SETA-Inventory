interface SalesforceAuthResult {
  success: boolean
  access_token?: string
  instance_url?: string
  error?: string
  errorType?: string
  details?: any
}

function logAuthAttempt(step: string, details: any) {
  console.log(`🔐 Salesforce Auth - ${step}:`, {
    timestamp: new Date().toISOString(),
    ...details,
  })
}

export async function getSalesforceToken(): Promise<SalesforceAuthResult> {
  try {
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL
    const clientId = process.env.SALESFORCE_CLIENT_ID
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET
    const username = process.env.SALESFORCE_USERNAME
    const password = process.env.SALESFORCE_PASSWORD
    const securityToken = process.env.SALESFORCE_SECURITY_TOKEN || ""

    logAuthAttempt("Starting Authentication", {
      hasInstanceUrl: Boolean(instanceUrl),
      hasClientId: Boolean(clientId),
      hasClientSecret: Boolean(clientSecret),
      hasUsername: Boolean(username),
      hasPassword: Boolean(password),
      hasSecurityToken: Boolean(securityToken),
      instanceUrl: instanceUrl?.substring(0, 50) + "..." || "Not set",
    })

    // Check if we have all required credentials
    if (!instanceUrl || !clientId || !clientSecret || !username || !password) {
      const missingCreds = {
        instanceUrl: !instanceUrl,
        clientId: !clientId,
        clientSecret: !clientSecret,
        username: !username,
        password: !password,
        securityToken: !securityToken,
      }

      logAuthAttempt("Missing Credentials", missingCreds)

      return {
        success: false,
        errorType: "MISSING_CREDENTIALS",
        error: `Missing Salesforce configuration: ${Object.entries(missingCreds)
          .filter(([_, missing]) => missing)
          .map(([key, _]) => key)
          .join(", ")}`,
        details: missingCreds,
      }
    }

    // Normalize and validate the instance URL
    let normalizedInstanceUrl = instanceUrl.trim()

    // Remove trailing slash if present
    if (normalizedInstanceUrl.endsWith("/")) {
      normalizedInstanceUrl = normalizedInstanceUrl.slice(0, -1)
    }

    // Add https:// if missing
    if (!normalizedInstanceUrl.startsWith("https://")) {
      if (normalizedInstanceUrl.startsWith("http://")) {
        normalizedInstanceUrl = normalizedInstanceUrl.replace("http://", "https://")
      } else {
        normalizedInstanceUrl = "https://" + normalizedInstanceUrl
      }
    }

    // Updated URL validation patterns to include your specific format
    const urlPatterns = [
      // Traditional formats
      /^https:\/\/[a-zA-Z0-9-]+\.my\.salesforce\.com$/, // Production
      /^https:\/\/[a-zA-Z0-9-]+--[a-zA-Z0-9-]+\.my\.salesforce\.com$/, // Sandbox
      /^https:\/\/[a-zA-Z0-9-]+-dev-ed\.my\.salesforce\.com$/, // Developer Edition (traditional)

      // Lightning/Force.com formats (newer)
      /^https:\/\/[a-zA-Z0-9-]+-dev-ed\.lightning\.force\.com$/, // Trailhead Playground
      /^https:\/\/[a-zA-Z0-9-]+-dev-ed\.develop\.lightning\.force\.com$/, // Developer Edition (new format)
      /^https:\/\/[a-zA-Z0-9-]+\.lightning\.force\.com$/, // Lightning Experience
      /^https:\/\/[a-zA-Z0-9-]+\.develop\.lightning\.force\.com$/, // Development instances

      // Enhanced Domain formats
      /^https:\/\/[a-zA-Z0-9-]+\.my\.salesforce-sites\.com$/, // Sites
      /^https:\/\/[a-zA-Z0-9-]+\.force\.com$/, // Force.com sites
    ]

    const isValidFormat = urlPatterns.some((pattern) => pattern.test(normalizedInstanceUrl))

    if (!isValidFormat) {
      return {
        success: false,
        errorType: "INVALID_URL_FORMAT",
        error: `Invalid Salesforce URL format: ${normalizedInstanceUrl}. Expected format like: https://yourcompany.my.salesforce.com`,
        details: {
          providedUrl: normalizedInstanceUrl,
          expectedFormats: [
            "https://yourcompany.my.salesforce.com (Production)",
            "https://yourcompany--sandbox.my.salesforce.com (Sandbox)",
            "https://yourcompany-dev-ed.my.salesforce.com (Developer Edition)",
            "https://yourcompany-dev-ed.lightning.force.com (Trailhead)",
            "https://yourcompany-dev-ed.develop.lightning.force.com (Developer Edition - New)",
          ],
        },
      }
    }

    // Determine the correct login URL based on the instance URL
    let loginUrl = "https://login.salesforce.com"

    // Use test.salesforce.com for sandbox/developer instances
    if (
      normalizedInstanceUrl.includes("--") ||
      normalizedInstanceUrl.includes("sandbox") ||
      normalizedInstanceUrl.includes("test") ||
      normalizedInstanceUrl.includes("dev-ed") ||
      normalizedInstanceUrl.includes("develop") ||
      normalizedInstanceUrl.includes("lightning.force.com")
    ) {
      loginUrl = "https://test.salesforce.com"
    }

    logAuthAttempt("Attempting Authentication", {
      loginUrl,
      instanceUrl: normalizedInstanceUrl,
      username: username.substring(0, 3) + "***", // Partial username for security
      urlFormat: "Developer Edition (Lightning)",
    })

    // Get access token
    const tokenUrl = `${loginUrl}/services/oauth2/token`
    const params = new URLSearchParams({
      grant_type: "password",
      client_id: clientId,
      client_secret: clientSecret,
      username: username,
      password: password + securityToken,
    })

    console.log("🔐 Attempting Salesforce authentication to:", tokenUrl)
    console.log("🔐 For instance URL:", normalizedInstanceUrl)

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "SETA-Smart-Inventory/1.0",
      },
      body: params.toString(),
    })

    console.log("🔐 Auth response status:", response.status, response.statusText)

    // Always get response as text first
    const responseText = await response.text()
    console.log("🔐 Auth response (first 300 chars):", responseText.substring(0, 300))

    // Check if response is HTML (error page)
    const isHtmlResponse =
      responseText.includes("<!DOCTYPE html>") ||
      responseText.includes("<html>") ||
      responseText.includes("<HTML>") ||
      responseText.includes("URL No Longer Exists") ||
      responseText.includes("Invalid") ||
      responseText.includes("Error") ||
      responseText.trim().startsWith("<")

    if (isHtmlResponse) {
      console.log("🚨 Received HTML error page from Salesforce")

      // Extract specific error messages
      let errorType = "SALESFORCE_HTML_ERROR"
      let errorMessage = "Salesforce returned an HTML error page"

      if (responseText.includes("URL No Longer Exists")) {
        errorType = "URL_NOT_EXISTS"
        errorMessage = `The Salesforce URL '${normalizedInstanceUrl}' does not exist. This usually means:
        1. The instance URL is incorrect
        2. The Salesforce org has been deactivated
        3. You're using the wrong URL format for your org type`
      } else if (responseText.includes("Invalid request")) {
        errorType = "INVALID_REQUEST"
        errorMessage = "Invalid request - the URL format or endpoint is not supported"
      }

      return {
        success: false,
        errorType,
        error: errorMessage,
        details: {
          instanceUrl: normalizedInstanceUrl,
          loginUrl,
          responseStatus: response.status,
          responsePreview: responseText.substring(0, 500),
          suggestions: [
            "Verify your Salesforce instance URL is correct",
            "Check if your Salesforce org is active",
            "Try logging into Salesforce manually to get the correct URL",
            "For Developer Edition, try both .my.salesforce.com and .lightning.force.com formats",
          ],
        },
      }
    }

    // Handle non-200 responses
    if (!response.ok) {
      let errorMessage = `Authentication failed: ${response.status} ${response.statusText}`
      let errorType = "AUTH_FAILED"

      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.error_description || errorData.error || errorMessage

        if (errorData.error === "invalid_client_id") {
          errorType = "INVALID_CLIENT_ID"
        } else if (errorData.error === "invalid_client") {
          errorType = "INVALID_CLIENT"
        } else if (errorData.error === "invalid_grant") {
          errorType = "INVALID_CREDENTIALS"
        }
      } catch (jsonError) {
        // If JSON parsing fails, use the text response
        errorMessage = `Authentication failed: ${responseText.substring(0, 200)}`
      }

      return {
        success: false,
        errorType,
        error: errorMessage,
        details: {
          status: response.status,
          statusText: response.statusText,
          responseBody: responseText.substring(0, 500),
        },
      }
    }

    // Try to parse successful response as JSON
    try {
      const data = JSON.parse(responseText)

      if (!data.access_token || !data.instance_url) {
        return {
          success: false,
          errorType: "INVALID_RESPONSE",
          error: "Invalid response from Salesforce: missing access token or instance URL",
          details: { responseData: data },
        }
      }

      console.log("✅ Salesforce authentication successful")
      logAuthAttempt("Authentication Success", {
        instanceUrl: data.instance_url,
        tokenLength: data.access_token?.length || 0,
      })

      return {
        success: true,
        access_token: data.access_token,
        instance_url: data.instance_url,
      }
    } catch (parseError) {
      console.error("❌ Error parsing auth response as JSON:", parseError)

      return {
        success: false,
        errorType: "PARSE_ERROR",
        error: "Salesforce returned an invalid response format",
        details: {
          parseError: parseError instanceof Error ? parseError.message : "Unknown parse error",
          responseBody: responseText.substring(0, 500),
        },
      }
    }
  } catch (error) {
    console.error("❌ Salesforce authentication error:", error)
    return {
      success: false,
      errorType: "NETWORK_ERROR",
      error: error instanceof Error ? error.message : "Unknown authentication error",
      details: { error },
    }
  }
}

// Helper function to make authenticated Salesforce API calls
export async function makeSalesforceRequest(endpoint: string, options: RequestInit = {}) {
  try {
    console.log(`🔍 Making Salesforce API request to: ${endpoint}`)

    const authResult = await getSalesforceToken()

    if (!authResult.success || !authResult.access_token) {
      console.log("❌ Authentication failed for API request:", authResult.error)
      throw new Error(`Salesforce authentication failed: ${authResult.error}`)
    }

    const apiUrl = authResult.instance_url
    const fullUrl = `${apiUrl}${endpoint}`

    console.log(`🔍 Full API URL: ${fullUrl}`)

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        Authorization: `Bearer ${authResult.access_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    })

    console.log(`🔍 API response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`❌ API request failed: ${errorText.substring(0, 200)}`)
      throw new Error(
        `Salesforce API request failed: ${response.status} ${response.statusText} - ${errorText.substring(0, 200)}`,
      )
    }

    const data = await response.json()
    console.log(`✅ API request successful, returned ${data.records?.length || "unknown"} records`)

    return data
  } catch (error) {
    console.error("❌ Salesforce API request error:", error)
    throw error
  }
}
