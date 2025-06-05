// Server-side only Salesforce configuration
export const salesforceConfig = {
  instanceUrl: process.env.SALESFORCE_INSTANCE_URL || "",
  clientId: process.env.SALESFORCE_CLIENT_ID || "",
  clientSecret: process.env.SALESFORCE_CLIENT_SECRET || "",
  username: process.env.SALESFORCE_USERNAME || "",
  password: process.env.SALESFORCE_PASSWORD || "",
  securityToken: process.env.SALESFORCE_SECURITY_TOKEN || "",
}

// Helper function to check if Salesforce is properly configured (server-side only)
export function isSalesforceConfigured(): boolean {
  const config = salesforceConfig
  const isConfigured = Boolean(
    config.instanceUrl &&
      config.clientId &&
      config.clientSecret &&
      config.username &&
      config.password &&
      config.securityToken,
  )

  console.log("🔍 Salesforce Configuration Check:", {
    hasInstanceUrl: Boolean(config.instanceUrl),
    hasClientId: Boolean(config.clientId),
    hasClientSecret: Boolean(config.clientSecret),
    hasUsername: Boolean(config.username),
    hasPassword: Boolean(config.password),
    hasSecurityToken: Boolean(config.securityToken),
    isConfigured,
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  })

  return isConfigured
}

// Helper function to get configuration status without exposing secrets
export function getSalesforceConfigStatus() {
  const config = salesforceConfig
  return {
    hasInstanceUrl: Boolean(config.instanceUrl),
    hasClientId: Boolean(config.clientId),
    hasClientSecret: Boolean(config.clientSecret),
    hasUsername: Boolean(config.username),
    hasPassword: Boolean(config.password),
    hasSecurityToken: Boolean(config.securityToken),
    instanceUrl: config.instanceUrl ? config.instanceUrl.substring(0, 30) + "..." : "Not configured",
    environment: process.env.NODE_ENV || "unknown",
    vercelEnv: process.env.VERCEL_ENV || "not-vercel",
    deploymentUrl: process.env.VERCEL_URL || "localhost",
  }
}

// Helper function to validate instance URL format
export function validateInstanceUrl(url: string): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: false, error: "Instance URL is required" }
  }

  if (!url.startsWith("https://")) {
    return { valid: false, error: "Instance URL must start with https://" }
  }

  if (url.includes("login.salesforce.com")) {
    return { valid: false, error: "Use your specific instance URL, not login.salesforce.com" }
  }

  if (!url.includes(".my.salesforce.com") && !url.includes(".sandbox.my.salesforce.com")) {
    return { valid: false, error: "Instance URL should be in format: https://yourinstance.my.salesforce.com" }
  }

  return { valid: true }
}
