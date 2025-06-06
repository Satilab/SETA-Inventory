import { NextResponse } from "next/server"
import { validateSalesforceUrl, getSalesforceLoginUrl } from "@/lib/salesforce-url-validator"

export async function GET() {
  try {
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL || ""
    const clientId = process.env.SALESFORCE_CLIENT_ID || ""
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET || ""
    const username = process.env.SALESFORCE_USERNAME || ""
    const password = process.env.SALESFORCE_PASSWORD || ""
    const securityToken = process.env.SALESFORCE_SECURITY_TOKEN || ""

    const validation = validateSalesforceUrl(instanceUrl)
    const recommendedLoginUrl = instanceUrl ? getSalesforceLoginUrl(instanceUrl) : ""

    return NextResponse.json({
      currentUrl: instanceUrl,
      validation,
      recommendedLoginUrl,
      environmentCheck: {
        hasInstanceUrl: !!instanceUrl,
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        hasUsername: !!username,
        hasPassword: !!password,
        hasSecurityToken: !!securityToken,
      },
    })
  } catch (error) {
    console.error("URL validation error:", error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
