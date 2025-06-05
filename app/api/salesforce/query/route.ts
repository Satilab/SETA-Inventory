import { NextResponse } from "next/server"
import { getSalesforceToken } from "@/lib/salesforce-auth"

// Demo customer data for fallback
const DEMO_CUSTOMERS = [
  {
    Id: "demo-001",
    Name: "Rajesh Electrical Works",
    Phone__c: "+91 9876543210",
    Email__c: "rajesh@electricalworks.com",
    WhatsApp__c: "+91 9876543210",
    GSTIN__c: "36ABCDE1234F1Z5",
    Type__c: "Contractor",
    Address__c: "Shop 15, Electrical Market, Secunderabad",
    Last_Order_Date__c: "2024-01-15",
    Total_Orders__c: 25,
    Total_Value__c: 125000,
    Active__c: true,
    Credit_Limit__c: 50000,
    Payment_Terms__c: "Net 30",
  },
  {
    Id: "demo-002",
    Name: "Modern Electronics",
    Phone__c: "+91 9876543211",
    Email__c: "info@modernelectronics.com",
    WhatsApp__c: "+91 9876543211",
    GSTIN__c: "36FGHIJ5678K2L6",
    Type__c: "Retail",
    Address__c: "Plot 42, Electronics Complex, Hyderabad",
    Last_Order_Date__c: "2024-01-10",
    Total_Orders__c: 18,
    Total_Value__c: 89000,
    Active__c: true,
    Credit_Limit__c: 30000,
    Payment_Terms__c: "Net 15",
  },
  {
    Id: "demo-003",
    Name: "Power Solutions Ltd",
    Phone__c: "+91 9876543212",
    Email__c: "sales@powersolutions.com",
    WhatsApp__c: "+91 9876543212",
    GSTIN__c: "36MNOPQ9012R3S7",
    Type__c: "Bulk",
    Address__c: "Industrial Area, Phase 2, Secunderabad",
    Last_Order_Date__c: "2023-12-20",
    Total_Orders__c: 45,
    Total_Value__c: 350000,
    Active__c: false,
    Credit_Limit__c: 100000,
    Payment_Terms__c: "Net 45",
  },
  {
    Id: "demo-004",
    Name: "City Electrical Supplies",
    Phone__c: "+91 9876543213",
    Email__c: "orders@cityelectrical.com",
    WhatsApp__c: "+91 9876543213",
    GSTIN__c: "36TUVWX3456Y4Z8",
    Type__c: "Retail",
    Address__c: "Main Road, Commercial Complex, Hyderabad",
    Last_Order_Date__c: "2024-01-12",
    Total_Orders__c: 32,
    Total_Value__c: 156000,
    Active__c: true,
    Credit_Limit__c: 40000,
    Payment_Terms__c: "Net 20",
  },
  {
    Id: "demo-005",
    Name: "Industrial Power Systems",
    Phone__c: "+91 9876543214",
    Email__c: "procurement@industrialpower.com",
    WhatsApp__c: "+91 9876543214",
    GSTIN__c: "36ABCXY7890Z1A2",
    Type__c: "Bulk",
    Address__c: "Industrial Estate, Sector 5, Secunderabad",
    Last_Order_Date__c: "2024-01-08",
    Total_Orders__c: 67,
    Total_Value__c: 890000,
    Active__c: true,
    Credit_Limit__c: 200000,
    Payment_Terms__c: "Net 60",
  },
]

export async function POST(request: Request) {
  try {
    console.log("=== Salesforce Query API Called ===")

    const body = await request.json()
    const { query } = body

    if (!query) {
      console.log("No query provided, returning demo data")
      return NextResponse.json(
        {
          error: "Query is required",
          records: DEMO_CUSTOMERS,
          isDemoMode: true,
          totalSize: DEMO_CUSTOMERS.length,
          message: "No query provided",
        },
        { status: 400 },
      )
    }

    console.log("Query:", query)

    // Check if running on localhost
    const host = request.headers.get("host") || ""
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1")

    console.log("Host:", host, "Is localhost:", isLocalhost)

    // Use demo data for localhost
    if (isLocalhost) {
      console.log("Using demo data for localhost")
      return NextResponse.json({
        records: DEMO_CUSTOMERS,
        isDemoMode: true,
        totalSize: DEMO_CUSTOMERS.length,
        message: "Running in demo mode on localhost",
      })
    }

    // Get Salesforce token
    console.log("Attempting Salesforce authentication...")
    const authResult = await getSalesforceToken()

    if (!authResult.success) {
      console.log("Authentication failed:", authResult.error)
      return NextResponse.json({
        records: DEMO_CUSTOMERS,
        isDemoMode: true,
        totalSize: DEMO_CUSTOMERS.length,
        error: authResult.error,
        message: "Using demo data due to authentication failure",
      })
    }

    console.log("Authentication successful, querying Salesforce...")

    // Query Salesforce
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
      let errorMessage = "Failed to query Salesforce"

      try {
        const text = await response.text()
        console.log("Query error response (first 500 chars):", text.substring(0, 500))

        // Check if response is HTML (error page)
        if (text.includes("<!DOCTYPE html>") || text.includes("<html>")) {
          errorMessage = "Received HTML error page from Salesforce. Check object permissions and field names."
        } else {
          // Try to parse as JSON for specific error
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
        records: DEMO_CUSTOMERS,
        isDemoMode: true,
        totalSize: DEMO_CUSTOMERS.length,
        error: errorMessage,
        message: "Using demo data due to query failure",
      })
    }

    try {
      const data = await response.json()
      console.log("Query successful, returned", data.totalSize, "records")

      return NextResponse.json({
        ...data,
        isDemoMode: false,
        message: "Successfully fetched from Salesforce",
      })
    } catch (parseError) {
      console.error("Error parsing query response:", parseError)
      return NextResponse.json({
        records: DEMO_CUSTOMERS,
        isDemoMode: true,
        totalSize: DEMO_CUSTOMERS.length,
        error: "Failed to parse Salesforce response",
        message: "Using demo data due to parse error",
      })
    }
  } catch (error) {
    console.error("Error in query API:", error)
    return NextResponse.json({
      records: DEMO_CUSTOMERS,
      isDemoMode: true,
      totalSize: DEMO_CUSTOMERS.length,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      message: "Using demo data due to unexpected error",
    })
  }
}
