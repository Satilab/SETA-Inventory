import { NextResponse } from "next/server"
import { validateSalesforceUrl, getSalesforceLoginUrl } from "@/lib/salesforce-url-validator"

export async function GET() {
  try {
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL || ""

    const validation = validateSalesforceUrl(instanceUrl)
    const loginUrl = getSalesforceLoginUrl(instanceUrl)

    return NextResponse.json({
      currentUrl: instanceUrl,
      validation,
      recommendedLoginUrl: loginUrl,
      environmentCheck: {
        hasInstanceUrl: !!process.env.SALESFORCE_INSTANCE_URL,
        hasClientId: !!process.env.SALESFORCE_CLIENT_ID,
        hasClientSecret: !!process.env.SALESFORCE_CLIENT_SECRET,
        hasUsername: !!process.env.SALESFORCE_USERNAME,
        hasPassword: !!process.env.SALESFORCE_PASSWORD,
        hasSecurityToken: !!process.env.SALESFORCE_SECURITY_TOKEN,
      },
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      currentUrl: process.env.SALESFORCE_INSTANCE_URL || "Not set",
    })
  }
}
