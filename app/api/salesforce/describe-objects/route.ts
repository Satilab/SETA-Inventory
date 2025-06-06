import { NextResponse } from "next/server"
import { getSalesforceToken } from "@/lib/salesforce-auth"

export async function GET() {
  try {
    console.log("🔍 Fetching Salesforce objects list...")

    // Get Salesforce authentication token
    const authResult = await getSalesforceToken()

    if (!authResult.success || !authResult.access_token) {
      console.log("❌ Salesforce authentication failed:", authResult.error)
      return NextResponse.json({
        success: false,
        objects: [],
        error: authResult.error || "Salesforce authentication failed",
      })
    }

    console.log("✅ Salesforce authentication successful")

    // Use the instance URL from the auth response
    const apiUrl = authResult.instance_url

    // Get the list of objects
    const objectsResponse = await fetch(`${apiUrl}/services/data/v58.0/sobjects`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authResult.access_token}`,
        "Content-Type": "application/json",
      },
    })

    if (!objectsResponse.ok) {
      const errorText = await objectsResponse.text()
      console.log("❌ Failed to fetch Salesforce objects:", errorText)
      return NextResponse.json({
        success: false,
        objects: [],
        error: `Failed to fetch Salesforce objects: ${objectsResponse.status} ${objectsResponse.statusText}`,
        details: errorText.substring(0, 500),
      })
    }

    const objectsData = await objectsResponse.json()

    // Filter to only include queryable objects and sort alphabetically
    const queryableObjects = objectsData.sobjects
      .filter((obj: any) => obj.queryable)
      .map((obj: any) => ({
        name: obj.name,
        label: obj.label,
        custom: obj.custom,
        queryable: obj.queryable,
        searchable: obj.searchable,
        createable: obj.createable,
        updateable: obj.updateable,
      }))
      .sort((a: any, b: any) => a.label.localeCompare(b.label))

    console.log(`✅ Found ${queryableObjects.length} queryable Salesforce objects`)

    return NextResponse.json({
      success: true,
      objects: queryableObjects,
      totalSize: queryableObjects.length,
      message: `Successfully fetched ${queryableObjects.length} Salesforce objects`,
    })
  } catch (error) {
    console.error("❌ Error fetching Salesforce objects:", error)
    return NextResponse.json({
      success: false,
      objects: [],
      error: error instanceof Error ? error.message : "Unknown error fetching Salesforce objects",
    })
  }
}
