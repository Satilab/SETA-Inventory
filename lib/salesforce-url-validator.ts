interface UrlValidationResult {
  isValid: boolean
  correctedUrl?: string
  error?: string
  suggestions: string[]
}

export function validateSalesforceUrl(instanceUrl: string): UrlValidationResult {
  if (!instanceUrl) {
    return {
      isValid: false,
      error: "Instance URL is required",
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

  // Add https:// if missing
  if (!cleanUrl.startsWith("http")) {
    cleanUrl = "https://" + cleanUrl
  }

  // Common URL patterns and their corrections
  const urlPatterns = [
    {
      // Standard production org
      pattern: /^https:\/\/([a-zA-Z0-9-]+)\.my\.salesforce\.com$/,
      isValid: true,
      type: "Production",
    },
    {
      // Sandbox org
      pattern: /^https:\/\/([a-zA-Z0-9-]+)--([a-zA-Z0-9-]+)\.my\.salesforce\.com$/,
      isValid: true,
      type: "Sandbox",
    },
    {
      // Developer org
      pattern: /^https:\/\/([a-zA-Z0-9-]+)-dev-ed\.my\.salesforce\.com$/,
      isValid: true,
      type: "Developer",
    },
    {
      // Trailhead Playground
      pattern: /^https:\/\/([a-zA-Z0-9-]+)-dev-ed\.lightning\.force\.com$/,
      isValid: true,
      type: "Trailhead Playground",
    },
    {
      // Legacy format (needs correction)
      pattern: /^https:\/\/([a-zA-Z0-9-]+)\.salesforce\.com$/,
      isValid: false,
      correction: (match: RegExpMatchArray) => `https://${match[1]}.my.salesforce.com`,
      type: "Legacy (needs correction)",
    },
  ]

  for (const pattern of urlPatterns) {
    const match = cleanUrl.match(pattern.pattern)
    if (match) {
      if (pattern.isValid) {
        return {
          isValid: true,
          correctedUrl: cleanUrl,
          suggestions: [],
        }
      } else if (pattern.correction) {
        return {
          isValid: false,
          correctedUrl: pattern.correction(match),
          error: `URL format is outdated. Use the corrected format.`,
          suggestions: [pattern.correction(match)],
        }
      }
    }
  }

  // If no pattern matches, provide suggestions
  const domain = cleanUrl.replace(/^https?:\/\//, "").split(".")[0]

  return {
    isValid: false,
    error: "Invalid Salesforce URL format",
    suggestions: [
      `https://${domain}.my.salesforce.com`,
      `https://${domain}--sandbox.my.salesforce.com`,
      `https://${domain}-dev-ed.my.salesforce.com`,
      `https://${domain}-dev-ed.lightning.force.com`,
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
