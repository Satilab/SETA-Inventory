interface SalesforceAuthResult {
  success: boolean
  access_token?: string
  instance_url?: string
  error?: string
}

// Add this enhanced logging function at the top of the file
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
        error: `Missing Salesforce configuration: ${Object.entries(missingCreds)
          .filter(([_, missing]) => missing)
          .map(([key, _]) => key)
          .join(", ")}`,
      }
    }

    // Normalize and validate the instance URL
    let normalizedInstanceUrl = instanceUrl.trim()

    // Remove trailing slash if present
    if (normalizedInstanceUrl.endsWith("/")) {
      normalizedInstanceUrl = normalizedInstanceUrl.slice(0, -1)
    }

    // Validate URL format
    if (!normalizedInstanceUrl.startsWith("https://")) {
      console.log("Instance URL must start with https://")
      return {
        success: false,
        error: "Instance URL must be a valid HTTPS URL (e.g., https://yourinstance.my.salesforce.com)",
      }
    }

    // Check if it's a valid Salesforce domain
    const validDomains = [".salesforce.com", ".force.com", ".my.salesforce.com", ".lightning.force.com"]

    const isValidDomain = validDomains.some((domain) => normalizedInstanceUrl.includes(domain))

    if (!isValidDomain) {
      console.log("Invalid Salesforce domain:", normalizedInstanceUrl)
      return {
        success: false,
        error: "Instance URL must be a valid Salesforce domain (e.g., https://yourinstance.my.salesforce.com)",
      }
    }

    // Determine the correct login URL based on the instance URL
    let loginUrl = "https://login.salesforce.com"

    // Use test.salesforce.com for sandbox instances
    if (
      normalizedInstanceUrl.includes("test.salesforce.com") ||
      normalizedInstanceUrl.includes("sandbox") ||
      normalizedInstanceUrl.includes("cs") ||
      normalizedInstanceUrl.includes("dev")
    ) {
      loginUrl = "https://test.salesforce.com"
    }

    console.log("Using login URL:", loginUrl)
    console.log("For instance:", normalizedInstanceUrl)

    // Add logging before the fetch request:
    logAuthAttempt("Attempting Authentication", {
      loginUrl,
      instanceUrl: normalizedInstanceUrl,
      username: username.substring(0, 3) + "***", // Partial username for security
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

    console.log("Attempting Salesforce authentication to:", tokenUrl)

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "SETA-Smart-Inventory/1.0",
      },
      body: params.toString(),
    })

    console.log("Auth response status:", response.status, response.statusText)

    // Always get response as text first
    const responseText = await response.text()
    console.log("Auth response (first 200 chars):", responseText.substring(0, 200))

    // Check if response is HTML (error page)
    const isHtmlResponse =
      responseText.includes("<!DOCTYPE html>") ||
      responseText.includes("<html>") ||
      responseText.includes("<HTML>") ||
      responseText.includes("Invalid") ||
      responseText.includes("Error") ||
      responseText.trim().startsWith("<")

    if (isHtmlResponse) {
      console.log("Received HTML response from Salesforce")

      // Try to extract error message from HTML
      let errorMessage = "Salesforce returned an HTML error page"

      // Look for common error patterns
      if (responseText.includes("Invalid request")) {
        errorMessage = "Invalid request - only public URLs are supported. Please check your instance URL format."
      } else if (responseText.includes("Invalid")) {
        const invalidMatch = responseText.match(/Invalid[^<\n]*/i)
        if (invalidMatch) {
          errorMessage = invalidMatch[0].trim()
        }
      } else if (responseText.includes("Error")) {
        const errorMatch = responseText.match(/Error[^<\n]*/i)
        if (errorMatch) {
          errorMessage = errorMatch[0].trim()
        }
      }

      return {
        success: false,
        error: `${errorMessage}. Current instance URL: ${normalizedInstanceUrl}`,
      }
    }

    // If not HTML, try to parse as JSON
    if (!response.ok) {
      let errorMessage = `Authentication failed: ${response.status} ${response.statusText}`

      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.error_description || errorData.error || errorMessage
      } catch (jsonError) {
        // If JSON parsing fails, use the text response
        errorMessage = `Authentication failed: ${responseText.substring(0, 200)}`
      }

      return {
        success: false,
        error: errorMessage,
      }
    }

    // Try to parse successful response as JSON
    try {
      const data = JSON.parse(responseText)

      if (!data.access_token || !data.instance_url) {
        return {
          success: false,
          error: "Invalid response from Salesforce: missing access token or instance URL",
        }
      }

      console.log("Salesforce authentication successful")
      return {
        success: true,
        access_token: data.access_token,
        instance_url: data.instance_url,
      }
    } catch (parseError) {
      console.error("Error parsing auth response as JSON:", parseError)
      console.log("Response was not valid JSON:", responseText.substring(0, 200))

      return {
        success: false,
        error: "Salesforce returned an invalid response format. Please check your instance URL and credentials.",
      }
    }
  } catch (error) {
    console.error("Error getting Salesforce token:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown authentication error",
    }
  }
}
