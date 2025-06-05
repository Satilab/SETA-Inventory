import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Get the host from the request
  const url = new URL(request.url)
  const host = url.host
  const protocol = url.protocol
  const baseUrl = `${protocol}//${host}`

  // Determine if we're on localhost
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1")

  // Generate the URLs
  const urls = {
    baseUrl: baseUrl,
    appUrl: baseUrl,
    apiUrl: `${baseUrl}/api`,
    callbackUrl: `${baseUrl}/api/auth/callback/salesforce`,
    isLocalhost: isLocalhost,
    environment: isLocalhost ? "development" : "production",
    salesforceConnectedAppSetup: {
      callbackUrl: `${baseUrl}/api/auth/callback/salesforce`,
      logoUrl: `${baseUrl}/logo.png`,
      description: "SETA Smart Inventory - Salesforce Integration",
    },
  }

  return NextResponse.json(urls)
}
