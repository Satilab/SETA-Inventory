import { NextResponse } from "next/server"
import { getSalesforceToken } from "@/lib/salesforce-auth"

// Demo inventory data for fallback
const DEMO_INVENTORY_DATA = [
  {
    Id: "demo-inv-001",
    Productname__c: "LED Panel Light 40W",
    Model__c: "LED-40W-PNL",
    H_p__c: 40,
    Phase__c: "Single",
    stage__c: 2,
    Price__c: 1450,
    Quantity__c: 25,
  },
  {
    Id: "demo-inv-002",
    Productname__c: "Distribution Panel 8-Way",
    Model__c: "DP-8WAY-MCB",
    H_p__c: null,
    Phase__c: "Three",
    stage__c: 1,
    Price__c: 3200,
    Quantity__c: 12,
  },
  {
    Id: "demo-inv-003",
    Productname__c: "Modular Switch Socket",
    Model__c: "MOD-SW-SOC",
    H_p__c: null,
    Phase__c: "Single",
    stage__c: 3,
    Price__c: 220,
    Quantity__c: 45,
  },
]

export async function POST(request: Request) {
  try {
    console.log("=== Salesforce Inventory Query API Called ===")

    // Check if running on localhost
    const host = request.headers.get("host") || ""
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1")

    console.log("Host:", host, "Is localhost:", isLocalhost)

    // Use demo data for localhost
    if (isLocalhost) {
      console.log("Using demo data for localhost")
      return NextResponse.json({
        records: DEMO_INVENTORY_DATA,
        isDemoMode: true,
        totalSize: DEMO_INVENTORY_DATA.length,
        message: "Running in demo mode on localhost",
      })
    }

    // Get Salesforce token
    console.log("Attempting Salesforce authentication...")
    const authResult = await getSalesforceToken()

    if (!authResult.success) {
      console.log("Authentication failed:", authResult.error)
      return NextResponse.json({
        records: DEMO_INVENTORY_DATA,
        isDemoMode: true,
        totalSize: DEMO_INVENTORY_DATA.length,
        error: authResult.error,
        message: "Using demo data due to authentication failure",
      })
    }

    console.log("Authentication successful, querying Salesforce...")

    // Query VENKATA_RAMANA_MOTORS__c object with correct field name
    const query = `
      SELECT Id, Productname__c, Model__c, H_p__c, Phase__c, stage__c, 
             Price__c, Quantity__c
      FROM VENKATA_RAMANA_MOTORS__c
      ORDER BY Productname__c ASC
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
      let errorMessage = "Failed to query Salesforce VENKATA_RAMANA_MOTORS__c object"

      try {
        const text = await response.text()
        console.log("Query error response (first 500 chars):", text.substring(0, 500))

        if (text.includes("<!DOCTYPE html>") || text.includes("<html>")) {
          errorMessage = "Received HTML error page from Salesforce. Check VENKATA_RAMANA_MOTORS__c object permissions."
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
        records: DEMO_INVENTORY_DATA,
        isDemoMode: true,
        totalSize: DEMO_INVENTORY_DATA.length,
        error: errorMessage,
        message: "Using demo data due to query failure",
      })
    }

    try {
      const data = await response.json()
      console.log("Query successful, returned", data.totalSize, "inventory records")

      return NextResponse.json({
        ...data,
        isDemoMode: false,
        message: "Successfully fetched from Salesforce VENKATA_RAMANA_MOTORS__c",
      })
    } catch (parseError) {
      console.error("Error parsing query response:", parseError)
      return NextResponse.json({
        records: DEMO_INVENTORY_DATA,
        isDemoMode: true,
        totalSize: DEMO_INVENTORY_DATA.length,
        error: "Failed to parse Salesforce response",
        message: "Using demo data due to parse error",
      })
    }
  } catch (error) {
    console.error("Error in inventory query API:", error)
    return NextResponse.json({
      records: DEMO_INVENTORY_DATA,
      isDemoMode: true,
      totalSize: DEMO_INVENTORY_DATA.length,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "Using demo data due to unexpected error",
    })
  }
}
