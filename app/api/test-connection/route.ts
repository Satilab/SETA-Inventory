import { NextResponse } from "next/server"
import { salesforceAPI } from "@/lib/salesforce-integration"

export async function GET() {
  try {
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
