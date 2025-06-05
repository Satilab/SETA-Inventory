import { NextResponse } from "next/server"
import { getSalesforceToken } from "@/lib/salesforce-auth"

// Demo reorder data for fallback
const DEMO_REORDER_DATA = [
  {
    Id: "demo-reorder-001",
    Name: "LED Panel Light 40W",
    H_p__c: 40,
    Model__c: "LED-40W-PNL",
    stage__c: 2,
    Current_Stocks__c: 8,
  },
  {
    Id: "demo-reorder-002",
    Name: "Distribution Panel 8-Way",
    H_p__c: null,
    Model__c: "DP-8WAY-MCB",
    stage__c: 1,
    Current_Stocks__c: 0,
  },
  {
    Id: "demo-reorder-003",
    Name: "Modular Switch Socket",
    H_p__c: null,
    Model__c: "MOD-SW-SOC",
    stage__c: 3,
    Current_Stocks__c: 2,
  },
]

export async function POST(request: Request) {
  try {
    console.log("=== Salesforce Reorder Query API Called ===")

    // Check if running on localhost
    const host = request.headers.get("host") || ""
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1")

    console.log("Host:", host, "Is localhost:", isLocalhost)

    // Use demo data for localhost
    if (isLocalhost) {
      console.log("Using demo data for localhost")
      return NextResponse.json({
        records: DEMO_REORDER_DATA,
        isDemoMode: true,
        totalSize: DEMO_REORDER_DATA.length,
        message: "Running in demo mode on localhost",
      })
    }

    // Get Salesforce token
    console.log("Attempting Salesforce authentication...")
    const authResult = await getSalesforceToken()

    if (!authResult.success) {
      console.log("Authentication failed:", authResult.error)
      return NextResponse.json({
        records: DEMO_REORDER_DATA,
        isDemoMode: true,
        totalSize: DEMO_REORDER_DATA.length,
        error: authResult.error,
        message: "Using demo data due to authentication failure",
      })
    }

    console.log("Authentication successful, querying Salesforce...")

    // Query Reorder__c object
    const query = `
      SELECT Id, Name, H_p__c, Model__c, stage__c, Current_Stocks__c
      FROM Reorder__c
      ORDER BY Current_Stocks__c ASC, Name ASC
    `

    const { instance_url, access_token } = authResult
    const queryUrl = `${instance_url}/services/data/v58.0/query?q=${encodeURIComponent(query)}`

    console.log("Query URL:", queryUrl)

    const response = await fetch(queryUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })

    console.log("Query response status:", response.status, response.statusText)

    if (!response.ok) {
      let errorMessage = "Failed to query Salesforce Reorder__c object"

      try {
        const text = await response.text()
        console.log("Query error response (first 500 chars):", text.substring(0, 500))

        if (text.includes("<!DOCTYPE html>") || text.includes("<html>")) {
          errorMessage = "Received HTML error page from Salesforce. Check Reorder__c object permissions."
        } else {
          try {
            const errorData = JSON.parse(text)
            errorMessage = errorData.message || errorData.error || errorMessage
          } catch (e) {
            errorMessage = `HTTP ${response.status}: ${text.substring(0, 200)}`
          }
        }
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }

      console.log("Using demo data due to query failure:", errorMessage)
      return NextResponse.json({
        records: DEMO_REORDER_DATA,
        isDemoMode: true,
        totalSize: DEMO_REORDER_DATA.length,
        error: errorMessage,
        message: "Using demo data due to query failure",
      })
    }

    try {
      const data = await response.json()
      console.log("Query successful, returned", data.totalSize, "reorder records")

      return NextResponse.json({
        ...data,
        isDemoMode: false,
        message: "Successfully fetched from Salesforce Reorder__c",
      })
    } catch (parseError) {
      console.error("Error parsing query response:", parseError)
      return NextResponse.json({
        records: DEMO_REORDER_DATA,
        isDemoMode: true,
        totalSize: DEMO_REORDER_DATA.length,
        error: "Failed to parse Salesforce response",
        message: "Using demo data due to parse error",
      })
    }
  } catch (error) {
    console.error("Error in reorder query API:", error)
    return NextResponse.json({
      records: DEMO_REORDER_DATA,
      isDemoMode: true,
      totalSize: DEMO_REORDER_DATA.length,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "Using demo data due to unexpected error",
    })
  }
}
