interface UrlValidationResult {
  isValid: boolean
  correctedUrl?: string
  error?: string
  suggestions: string[]
  errorType?: string
}

export function validateSalesforceUrl(instanceUrl: string): UrlValidationResult {
  if (!instanceUrl) {
    return {
      isValid: false,
      error: "Instance URL is required",
      errorType: "MISSING_URL",
      suggestions: [
        "https://yourcompany.my.salesforce.com",
        "https://yourcompany--sandbox.my.salesforce.com",
        "https://yourcompany-dev-ed.my.salesforce.com",
      ],
    }
  }

  // Clean up the URL
  let cleanUrl = instanceUrl.trim()

  // Remove trailing slash
  if (cleanUrl.endsWith("/")) {
    cleanUrl = cleanUrl.slice(0, -1)
  }

  // Remove query parameters (like ?locale=in)
  if (cleanUrl.includes("?")) {
    cleanUrl = cleanUrl.split("?")[0]
  }

  // Add https:// if missing
  if (!cleanUrl.startsWith("http")) {
    cleanUrl = "https://" + cleanUrl
  }

  // Check for common incorrect URLs
  const incorrectPatterns = [
    {
      pattern: /^https:\/\/login\.salesforce\.com/,
      error: "You're using the login endpoint, not your instance URL",
      errorType: "LOGIN_ENDPOINT_ERROR",
      suggestion: "Replace with your actual Salesforce instance URL like: https://yourcompany.my.salesforce.com",
    },
    {
      pattern: /^https:\/\/test\.salesforce\.com/,
      error: "You're using the test login endpoint, not your instance URL",
      errorType: "TEST_ENDPOINT_ERROR",
      suggestion:
        "Replace with your actual Salesforce instance URL like: https://yourcompany--sandbox.my.salesforce.com",
    },
    {
      pattern: /^https:\/\/([a-zA-Z0-9-]+)\.salesforce\.com$/,
      error: "Old URL format detected",
      errorType: "LEGACY_FORMAT",
      suggestion: "Update to new format: https://$1.my.salesforce.com",
    },
  ]

  // Check for incorrect patterns first
  for (const incorrectPattern of incorrectPatterns) {
    const match = cleanUrl.match(incorrectPattern.pattern)
    if (match) {
      let correctedUrl = incorrectPattern.suggestion
      if (incorrectPattern.suggestion.includes("$1") && match[1]) {
        correctedUrl = incorrectPattern.suggestion.replace("$1", match[1])
      }

      return {
        isValid: false,
        error: incorrectPattern.error,
        errorType: incorrectPattern.errorType,
        correctedUrl: correctedUrl.startsWith("https://") ? correctedUrl : undefined,
        suggestions: [
          "Log into Salesforce and copy the URL from your browser address bar",
          "Look for URLs like: https://yourcompany.my.salesforce.com",
          "For Developer Edition: https://yourcompany-dev-ed.my.salesforce.com",
          "For Sandbox: https://yourcompany--sandbox.my.salesforce.com",
        ],
      }
    }
  }

  // Valid URL patterns
  const validPatterns = [
    {
      pattern: /^https:\/\/[a-zA-Z0-9-]+\.my\.salesforce\.com$/,
      type: "Production",
    },
    {
      pattern: /^https:\/\/[a-zA-Z0-9-]+--[a-zA-Z0-9-]+\.my\.salesforce\.com$/,
      type: "Sandbox",
    },
    {
      pattern: /^https:\/\/[a-zA-Z0-9-]+-dev-ed\.my\.salesforce\.com$/,
      type: "Developer Edition",
    },
    {
      pattern: /^https:\/\/[a-zA-Z0-9-]+-dev-ed\.lightning\.force\.com$/,
      type: "Trailhead Playground",
    },
  ]

  // Check for valid patterns
  for (const validPattern of validPatterns) {
    if (validPattern.pattern.test(cleanUrl)) {
      return {
        isValid: true,
        correctedUrl: cleanUrl,
        suggestions: [],
      }
    }
  }

  // If no pattern matches, provide suggestions
  return {
    isValid: false,
    error: "Invalid Salesforce URL format",
    errorType: "INVALID_FORMAT",
    suggestions: [
      "https://yourcompany.my.salesforce.com (Production)",
      "https://yourcompany--sandbox.my.salesforce.com (Sandbox)",
      "https://yourcompany-dev-ed.my.salesforce.com (Developer Edition)",
      "https://yourcompany-dev-ed.lightning.force.com (Trailhead)",
    ],
  }
}

export function getSalesforceLoginUrl(instanceUrl: string): string {
  // For sandbox orgs, use test.salesforce.com
  if (
    instanceUrl.includes("--") ||
    instanceUrl.includes("sandbox") ||
    instanceUrl.includes("test") ||
    instanceUrl.includes("dev-ed")
  ) {
    return "https://test.salesforce.com"
  }

  // For production orgs, use login.salesforce.com
  return "https://login.salesforce.com"
}
