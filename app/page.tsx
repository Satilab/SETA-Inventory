"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Users, MessageSquare, TrendingUp, AlertTriangle, DollarSign, ShoppingCart, Plus, Loader2 } from "lucide-react"
import { useDashboardMetrics, useLowStockProducts, useRecentOrders } from "@/hooks/use-demo-data"
import Link from "next/link"

export default function Dashboard() {
  const { metrics, loading: metricsLoading, error: metricsError } = useDashboardMetrics()
  const { data: lowStockProducts, loading: stockLoading } = useLowStockProducts()
  const { data: recentOrders, loading: ordersLoading } = useRecentOrders(5)

  return (
    <SidebarInset>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h1 className="text-2xl font-bold">SETA Smart Inventory</h1>
          <p className="text-muted-foreground">Your electrical trade management dashboard</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">₹{metrics.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{metrics.activeOrders}</div>
                  <p className="text-xs text-muted-foreground">Pending & processing</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{metrics.activeCustomers}</div>
                  <p className="text-xs text-muted-foreground">Registered customers</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stockLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{metrics.lowStockItems}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/inventory">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/whatsapp">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Process WhatsApp Orders
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/customers">
                  <Users className="mr-2 h-4 w-4" />
                  Add New Customer
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/reports">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Report
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important notifications from Salesforce</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stockLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading alerts...</span>
                </div>
              ) : (
                <>
                  <Link href="/inventory/alerts" className="block">
                    <div className="flex items-start space-x-3 rounded-lg border border-orange-200 bg-orange-50 p-3 hover:bg-orange-100 transition-colors">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">Low Stock Alert</p>
                        <p className="text-xs text-orange-600">{metrics.lowStockItems} items below reorder threshold</p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/whatsapp" className="block">
                    <div className="flex items-start space-x-3 rounded-lg border border-blue-200 bg-blue-50 p-3 hover:bg-blue-100 transition-colors">
                      <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Recent Orders</p>
                        <p className="text-xs text-blue-600">
                          {ordersLoading ? "Loading..." : `${recentOrders.length} recent orders`}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/customers" className="block">
                    <div className="flex items-start space-x-3 rounded-lg border border-green-200 bg-green-50 p-3 hover:bg-green-100 transition-colors">
                      <Users className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Demo Mode Active</p>
                        <p className="text-xs text-green-600">Using sample data</p>
                      </div>
                    </div>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
