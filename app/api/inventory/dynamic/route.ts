import { type NextRequest, NextResponse } from "next/server"
import { dynamicDataService } from "@/lib/dynamic-data-service"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching dynamic inventory data...")

    // Generate fresh dynamic inventory data
    const dynamicInventory = dynamicDataService.generateDynamicInventory(50)

    console.log(`✅ Generated ${dynamicInventory.length} dynamic inventory items`)

    return NextResponse.json({
      success: true,
      records: dynamicInventory,
      totalSize: dynamicInventory.length,
      done: true,
      message: `Successfully generated ${dynamicInventory.length} dynamic inventory items`,
      dataType: "dynamic",
      lastUpdated: new Date().toISOString(),
      note: "Inventory data is dynamically generated with real-time stock movements",
    })
  } catch (error) {
    console.error("❌ Error generating dynamic inventory data:", error)

    return NextResponse.json({
      success: false,
      records: [],
      totalSize: 0,
      done: true,
      message: "Failed to generate dynamic inventory data",
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
