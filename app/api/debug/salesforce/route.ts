import { NextResponse } from "next/server"

export async function GET() {
  try {
    const config = {
      hasInstanceUrl: !!process.env.SALESFORCE_INSTANCE_URL,
      hasClientId: !!process.env.SALESFORCE_CLIENT_ID,
      hasClientSecret: !!process.env.SALESFORCE_CLIENT_SECRET,
      hasUsername: !!process.env.SALESFORCE_USERNAME,
      hasPassword: !!process.env.SALESFORCE_PASSWORD,
      hasSecurityToken: !!process.env.SALESFORCE_SECURITY_TOKEN,
    }

    const environment = {
      instanceUrl: process.env.SALESFORCE_INSTANCE_URL?.substring(0, 30) + "..." || "Not configured",
      username: process.env.SALESFORCE_USERNAME || "Not configured",
      hostname: process.env.VERCEL_URL || "localhost",
    }

    return NextResponse.json({
      configured: config,
      environment: environment,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })
  }
}
