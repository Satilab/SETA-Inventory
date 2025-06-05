import { NextResponse } from "next/server"
import { getSalesforceToken } from "@/lib/salesforce-auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { objectName, fields } = body

    if (!objectName || !fields) {
      return NextResponse.json({ error: "Object name and fields are required" }, { status: 400 })
    }

    // Check if running on localhost
    const host = request.headers.get("host") || ""
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1")

    // Use demo mode for localhost
    if (isLocalhost) {
      console.log("Using demo mode for localhost")
      return NextResponse.json({
        id: `demo-${Date.now()}`,
        success: true,
        isDemoMode: true,
      })
    }

    // Get Salesforce token
    const authResult = await getSalesforceToken()

    if (!authResult.success) {
      console.log("Using demo mode due to auth failure:", authResult.error)
      return NextResponse.json({
        id: `demo-${Date.now()}`,
        success: true,
        isDemoMode: true,
        error: authResult.error,
      })
    }

    // Create record in Salesforce
    const { instance_url, access_token } = authResult
    const createUrl = `${instance_url}/services/data/v58.0/sobjects/${objectName}`

    const response = await fetch(createUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    })

    if (!response.ok) {
      // Try to parse error response
      let errorMessage = `Failed to create ${objectName} record`
      try {
        const errorData = await response.json()
        errorMessage =
          Array.isArray(errorData) && errorData.length > 0 ? errorData[0].message : errorData.message || errorMessage
      } catch (e) {
        // If can't parse JSON, might be HTML error page
        const text = await response.text()
        if (text.includes("<html>")) {
          errorMessage = "Received HTML error page from Salesforce"
        }
      }

      console.log("Using demo mode due to create failure:", errorMessage)
      return NextResponse.json({
        id: `demo-${Date.now()}`,
        success: true,
        isDemoMode: true,
        error: errorMessage,
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in create record API:", error)
    return NextResponse.json({
      id: `demo-${Date.now()}`,
      success: true,
      isDemoMode: true,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}
