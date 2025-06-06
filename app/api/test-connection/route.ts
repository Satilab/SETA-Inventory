import { NextResponse } from "next/server"
import { salesforceAPI } from "@/lib/salesforce-integration"

export async function GET() {
  try {
    // Check if we're running in a browser environment (client-side)
    if (typeof window !== "undefined") {
      return NextResponse.json({
        connected: false,
        error: "API routes cannot be called directly from the browser",
        details: { error: "This is a server-side API route" },
      })
    }

    const result = await salesforceAPI.testConnection()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Test connection API error:", error)
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: { error },
    })
  }
}
