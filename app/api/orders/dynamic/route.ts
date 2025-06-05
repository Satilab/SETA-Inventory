import { type NextRequest, NextResponse } from "next/server"
import { dynamicDataService } from "@/lib/dynamic-data-service"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching dynamic orders data...")

    // Generate fresh dynamic orders data
    const dynamicOrders = dynamicDataService.generateDynamicOrders(30)

    console.log(`✅ Generated ${dynamicOrders.length} dynamic orders`)

    return NextResponse.json({
      success: true,
      records: dynamicOrders,
      totalSize: dynamicOrders.length,
      done: true,
      message: `Successfully generated ${dynamicOrders.length} dynamic orders`,
      dataType: "dynamic",
      lastUpdated: new Date().toISOString(),
      note: "Order data is dynamically generated with realistic business patterns",
    })
  } catch (error) {
    console.error("❌ Error generating dynamic orders data:", error)

    return NextResponse.json({
      success: false,
      records: [],
      totalSize: 0,
      done: true,
      message: "Failed to generate dynamic orders data",
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
