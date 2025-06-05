import { type NextRequest, NextResponse } from "next/server"
import { dynamicDataService } from "@/lib/dynamic-data-service"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching dynamic dashboard metrics...")

    // Generate fresh dashboard metrics
    const metrics = dynamicDataService.getDashboardMetrics()
    const alerts = dynamicDataService.getRealTimeAlerts()

    console.log("✅ Generated dynamic dashboard metrics and alerts")

    return NextResponse.json({
      success: true,
      metrics,
      alerts,
      dataType: "dynamic",
      lastUpdated: new Date().toISOString(),
      message: "Dynamic dashboard metrics generated successfully",
    })
  } catch (error) {
    console.error("❌ Error generating dashboard metrics:", error)

    return NextResponse.json({
      success: false,
      metrics: {
        todayRevenue: 0,
        todayOrders: 0,
        activeCustomers: 0,
        lowStockItems: 0,
        pendingOrders: 0,
        overduePayments: 0,
        revenueGrowth: "0.0",
        orderGrowth: "0.0",
        lastUpdated: new Date().toISOString(),
      },
      alerts: [],
      message: "Failed to generate dashboard metrics",
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
