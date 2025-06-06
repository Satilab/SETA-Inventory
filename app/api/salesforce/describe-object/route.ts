import { type NextRequest, NextResponse } from "next/server"
import { getSalesforceToken } from "@/lib/salesforce-auth"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const objectName = searchParams.get("object")

    if (!objectName) {
      return NextResponse.json({
        success: false,
        error: "Object name is required",
      })
    }

    console.log(`🔍 Fetching details for Salesforce object: ${objectName}`)

    // Get Salesforce authentication token
    const authResult = await getSalesforceToken()

    if (!authResult.success || !authResult.access_token) {
      console.log("❌ Salesforce authentication failed:", authResult.error)
      return NextResponse.json({
        success: false,
        error: authResult.error || "Salesforce authentication failed",
      })
    }

    console.log("✅ Salesforce authentication successful")

    // Use the instance URL from the auth response
    const apiUrl = authResult.instance_url

    // Get the object details
    const objectResponse = await fetch(`${apiUrl}/services/data/v58.0/sobjects/${objectName}/describe`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authResult.access_token}`,
        "Content-Type": "application/json",
      },
    })

    if (!objectResponse.ok) {
      const errorText = await objectResponse.text()
      console.log(`❌ Failed to fetch details for ${objectName}:`, errorText)
      return NextResponse.json({
        success: false,
        error: `Failed to fetch details for ${objectName}: ${objectResponse.status} ${objectResponse.statusText}`,
        details: errorText.substring(0, 500),
      })
    }

    const objectData = await objectResponse.json()

    // Extract relevant information
    const objectDetails = {
      name: objectData.name,
      label: objectData.label,
      custom: objectData.custom,
      queryable: objectData.queryable,
      searchable: objectData.searchable,
      createable: objectData.createable,
      updateable: objectData.updateable,
      fields: objectData.fields.map((field: any) => ({
        name: field.name,
        label: field.label,
        type: field.type,
        custom: field.custom,
        nillable: field.nillable,
        defaultValue: field.defaultValue,
        picklistValues: field.picklistValues,
        referenceTo: field.referenceTo,
      })),
    }

    console.log(`✅ Successfully fetched details for ${objectName} with ${objectDetails.fields.length} fields`)

    return NextResponse.json({
      success: true,
      objectDetails,
      message: `Successfully fetched details for ${objectName}`,
    })
  } catch (error) {
    console.error("❌ Error fetching Salesforce object details:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error fetching Salesforce object details",
    })
  }
}
