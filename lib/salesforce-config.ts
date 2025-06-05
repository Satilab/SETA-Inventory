// Server-side only Salesforce configuration
export const salesforceConfig = {
  instanceUrl: process.env.SALESFORCE_INSTANCE_URL || "https://login.salesforce.com",
  clientId: process.env.SALESFORCE_CLIENT_ID || "",
  clientSecret: process.env.SALESFORCE_CLIENT_SECRET || "",
  username: process.env.SALESFORCE_USERNAME || "",
  password: process.env.SALESFORCE_PASSWORD || "",
  securityToken: process.env.SALESFORCE_SECURITY_TOKEN || "",
}

// Helper function to check if Salesforce is properly configured (server-side only)
export function isSalesforceConfigured(): boolean {
  return Boolean(
    salesforceConfig.instanceUrl &&
      salesforceConfig.clientId &&
      salesforceConfig.clientSecret &&
      salesforceConfig.username &&
      salesforceConfig.password,
  )
}

// Helper function to get configuration status without exposing secrets
export function getSalesforceConfigStatus() {
  return {
    hasInstanceUrl: Boolean(process.env.SALESFORCE_INSTANCE_URL),
    hasClientId: Boolean(process.env.SALESFORCE_CLIENT_ID),
    hasClientSecret: Boolean(process.env.SALESFORCE_CLIENT_SECRET),
    hasUsername: Boolean(process.env.SALESFORCE_USERNAME),
    hasPassword: Boolean(process.env.SALESFORCE_PASSWORD),
    hasSecurityToken: Boolean(process.env.SALESFORCE_SECURITY_TOKEN),
    instanceUrl: process.env.SALESFORCE_INSTANCE_URL?.substring(0, 30) + "..." || "Not configured",
  }
}
