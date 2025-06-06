import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get all environment variables (safely)
    const envCheck = {
      // Check for server-side variables
      serverSide: {
        SALESFORCE_INSTANCE_URL: {
          exists: Boolean(process.env.SALESFORCE_INSTANCE_URL),
          value: process.env.SALESFORCE_INSTANCE_URL
            ? process.env.SALESFORCE_INSTANCE_URL.substring(0, 30) + "..."
            : "Not set",
          length: process.env.SALESFORCE_INSTANCE_URL?.length || 0,
        },
        SALESFORCE_CLIENT_ID: {
          exists: Boolean(process.env.SALESFORCE_CLIENT_ID),
          value: process.env.SALESFORCE_CLIENT_ID
            ? process.env.SALESFORCE_CLIENT_ID.substring(0, 10) + "..."
            : "Not set",
          length: process.env.SALESFORCE_CLIENT_ID?.length || 0,
        },
        SALESFORCE_CLIENT_SECRET: {
          exists: Boolean(process.env.SALESFORCE_CLIENT_SECRET),
          value: process.env.SALESFORCE_CLIENT_SECRET ? "***HIDDEN***" : "Not set",
          length: process.env.SALESFORCE_CLIENT_SECRET?.length || 0,
        },
        SALESFORCE_USERNAME: {
          exists: Boolean(process.env.SALESFORCE_USERNAME),
          value: process.env.SALESFORCE_USERNAME ? process.env.SALESFORCE_USERNAME.substring(0, 10) + "..." : "Not set",
          length: process.env.SALESFORCE_USERNAME?.length || 0,
        },
        SALESFORCE_PASSWORD: {
          exists: Boolean(process.env.SALESFORCE_PASSWORD),
          value: process.env.SALESFORCE_PASSWORD ? "***HIDDEN***" : "Not set",
          length: process.env.SALESFORCE_PASSWORD?.length || 0,
        },
        SALESFORCE_SECURITY_TOKEN: {
          exists: Boolean(process.env.SALESFORCE_SECURITY_TOKEN),
          value: process.env.SALESFORCE_SECURITY_TOKEN ? "***HIDDEN***" : "Not set",
          length: process.env.SALESFORCE_SECURITY_TOKEN?.length || 0,
        },
      },
      // Check for old client-side variables (should not exist)
      clientSide: {
        NEXT_PUBLIC_SALESFORCE_INSTANCE_URL: {
          exists: Boolean(process.env.NEXT_PUBLIC_SALESFORCE_INSTANCE_URL),
          value: process.env.NEXT_PUBLIC_SALESFORCE_INSTANCE_URL
            ? process.env.NEXT_PUBLIC_SALESFORCE_INSTANCE_URL.substring(0, 30) + "..."
            : "Not set",
        },
        NEXT_PUBLIC_SALESFORCE_CLIENT_ID: {
          exists: Boolean(process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_ID),
          value: process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_ID
            ? process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_ID.substring(0, 10) + "..."
            : "Not set",
        },
      },
      // Environment info
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_URL: process.env.VERCEL_URL,
        deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
        region: process.env.VERCEL_REGION,
      },
      // Summary
      summary: {
        allServerVarsConfigured: Boolean(
          process.env.SALESFORCE_INSTANCE_URL &&
            process.env.SALESFORCE_CLIENT_ID &&
            process.env.SALESFORCE_CLIENT_SECRET &&
            process.env.SALESFORCE_USERNAME &&
            process.env.SALESFORCE_PASSWORD &&
            process.env.SALESFORCE_SECURITY_TOKEN,
        ),
        hasOldClientVars: Boolean(
          process.env.NEXT_PUBLIC_SALESFORCE_INSTANCE_URL || process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_ID,
        ),
        timestamp: new Date().toISOString(),
      },
    }

    return NextResponse.json({
      success: true,
      data: envCheck,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })
  }
}
