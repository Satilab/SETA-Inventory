import { NextResponse } from "next/server"
import { makeSalesforceRequest } from "@/lib/salesforce-auth"

export async function GET() {
  try {
    console.log("🔍 Testing Salesforce connection...")

    // Test with a simple query that should work in any org
    const result = await makeSalesforceRequest("/services/data/v58.0/sobjects/")

    console.log("✅ Connection test successful")

    return NextResponse.json({
      connected: true,
      message: "Successfully connected to Salesforce",
      details: {
        objectsAvailable: result.sobjects?.length || 0,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("❌ Connection test failed:", error)

    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "Unknown connection error",
      errorType: "CONNECTION_FAILED",
      details: {
        timestamp: new Date().toISOString(),
        errorDetails: error,
      },
    })
  }
}
