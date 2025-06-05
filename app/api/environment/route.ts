import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const host = url.host
  const protocol = url.protocol

  // Determine environment type
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1")
  const isVercelPreview = host.includes("vercel.app")
  const isProduction = !isLocalhost && !isVercelPreview

  // Check if Salesforce can work in this environment
  const salesforceCompatible = !isLocalhost

  return NextResponse.json({
    host,
    protocol,
    baseUrl: `${protocol}//${host}`,
    environment: {
      isLocalhost,
      isVercelPreview,
      isProduction,
      salesforceCompatible,
      type: isLocalhost ? "development" : isVercelPreview ? "preview" : "production",
    },
    salesforce: {
      canAuthenticate: salesforceCompatible,
      reason: salesforceCompatible ? "Public URL available" : "Salesforce requires public URLs",
      recommendation: isLocalhost ? "Deploy to Vercel or use ngrok for testing" : "Ready for Salesforce integration",
    },
  })
}
