"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AlertTriangle, Package, Clock, TrendingDown } from "lucide-react"
import Link from "next/link"

const alerts = [
  {
    id: 1,
    type: "low_stock",
    product: "LED Panel Light 40W",
    sku: "LED-40W-PNL",
    currentStock: 8,
    reorderLevel: 15,
    severity: "high",
    daysLeft: 3,
  },
  {
    id: 2,
    type: "out_of_stock",
    product: "Distribution Panel 8-Way",
    sku: "DP-8WAY-MCB",
    currentStock: 0,
    reorderLevel: 5,
    severity: "critical",
    daysLeft: 0,
  },
  {
    id: 3,
    type: "dead_stock",
    product: "Old Switch Model",
    sku: "OLD-SW-001",
    currentStock: 45,
    lastSold: "90 days ago",
    severity: "medium",
  },
  {
    id: 4,
    type: "low_stock",
    product: "Modular Switch Socket",
    sku: "MOD-SW-SOC",
    currentStock: 2,
    reorderLevel: 20,
    severity: "critical",
    daysLeft: 1,
  },
]

export default function InventoryAlertsPage() {
  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: "destructive",
      high: "secondary",
      medium: "outline",
    } as const
    return <Badge variant={variants[severity as keyof typeof variants] || "outline"}>{severity}</Badge>
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "out_of_stock":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "low_stock":
        return <Package className="h-4 w-4 text-orange-500" />
      case "dead_stock":
        return <TrendingDown className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/inventory/">Inventory</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Alerts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Inventory Alerts</h1>
          <p className="text-sm text-muted-foreground">Monitor stock levels and take action on critical items</p>
        </div>

        {/* Alert Summary */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Immediate action required</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Low Stock</CardTitle>
              <Package className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Below reorder level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Dead Stock</CardTitle>
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">No sales in 60+ days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Value at Risk</CardTitle>
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">₹45K</div>
              <p className="text-xs text-muted-foreground">Potential lost sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts ({alerts.length})</CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{alert.product}</p>
                      <p className="text-sm text-muted-foreground">SKU: {alert.sku}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {alert.type === "low_stock" && (
                          <span className="text-xs text-orange-600">
                            {alert.currentStock} left • Reorder at {alert.reorderLevel}
                          </span>
                        )}
                        {alert.type === "out_of_stock" && (
                          <span className="text-xs text-red-600">Out of stock • Reorder immediately</span>
                        )}
                        {alert.type === "dead_stock" && (
                          <span className="text-xs text-gray-600">
                            {alert.currentStock} units • Last sold {alert.lastSold}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getSeverityBadge(alert.severity)}
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                      <Button variant="outline" size="sm">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
