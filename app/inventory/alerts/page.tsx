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
import { AlertTriangle, Package, TrendingDown, RefreshCw, Database } from "lucide-react"
import Link from "next/link"
import { useReorderAlerts } from "@/hooks/use-reorder-alerts"

export default function InventoryAlertsPage() {
  const { data: alerts, loading, error, refetch, isDemoMode } = useReorderAlerts()

  const getSeverityBadge = (currentStock: number) => {
    if (currentStock === 0) {
      return <Badge variant="destructive">Critical</Badge>
    } else if (currentStock <= 5) {
      return <Badge variant="secondary">High</Badge>
    } else if (currentStock <= 15) {
      return <Badge variant="outline">Medium</Badge>
    }
    return <Badge variant="outline">Low</Badge>
  }

  const getAlertIcon = (currentStock: number) => {
    if (currentStock === 0) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    } else if (currentStock <= 5) {
      return <Package className="h-4 w-4 text-orange-500" />
    }
    return <TrendingDown className="h-4 w-4 text-yellow-500" />
  }

  const getAlertType = (currentStock: number) => {
    if (currentStock === 0) return "Out of Stock"
    if (currentStock <= 5) return "Critical Low"
    if (currentStock <= 15) return "Low Stock"
    return "Monitor"
  }

  const getStageText = (stage: number) => {
    switch (stage) {
      case 1:
        return "Stage 1"
      case 2:
        return "Stage 2"
      case 3:
        return "Stage 3"
      default:
        return `Stage ${stage}`
    }
  }

  const criticalAlerts = alerts.filter((alert) => alert.Current_Stocks__c === 0).length
  const highAlerts = alerts.filter((alert) => alert.Current_Stocks__c > 0 && alert.Current_Stocks__c <= 5).length
  const mediumAlerts = alerts.filter((alert) => alert.Current_Stocks__c > 5 && alert.Current_Stocks__c <= 15).length

  if (loading) {
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
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </SidebarInset>
    )
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Inventory Alerts</h1>
            <p className="text-sm text-muted-foreground">
              Monitor stock levels from Salesforce Reorder__c object
              {isDemoMode && (
                <span className="ml-2 inline-flex items-center gap-1 text-orange-600">
                  <Database className="h-3 w-3" />
                  Demo Mode
                </span>
              )}
            </p>
          </div>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Connection Error:</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alert Summary */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{criticalAlerts}</div>
              <p className="text-xs text-muted-foreground">Out of stock items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">High Priority</CardTitle>
              <Package className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{highAlerts}</div>
              <p className="text-xs text-muted-foreground">≤5 units remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Medium Priority</CardTitle>
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{mediumAlerts}</div>
              <p className="text-xs text-muted-foreground">6-15 units remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Items</CardTitle>
              <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{alerts.length}</div>
              <p className="text-xs text-muted-foreground">Monitored products</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Reorder Alerts ({alerts.length})</CardTitle>
            <CardDescription>Items from Salesforce Reorder__c requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No alerts found</h3>
                <p className="text-muted-foreground">
                  {error
                    ? "Unable to fetch alerts from Salesforce. Check your connection."
                    : "All inventory levels are healthy or no records exist in Reorder__c object."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.Id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      {getAlertIcon(alert.Current_Stocks__c)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{alert.Name}</p>
                        <p className="text-sm text-muted-foreground">
                          Model: {alert.Model__c}
                          {alert.H_p__c && ` • ${alert.H_p__c} HP`}
                          {` • ${getStageText(alert.stage__c)}`}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span
                            className={`text-xs ${
                              alert.Current_Stocks__c === 0
                                ? "text-red-600"
                                : alert.Current_Stocks__c <= 5
                                  ? "text-orange-600"
                                  : "text-yellow-600"
                            }`}
                          >
                            {alert.Current_Stocks__c === 0
                              ? "Out of stock - Reorder immediately"
                              : `${alert.Current_Stocks__c} units remaining`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">
                        {getAlertType(alert.Current_Stocks__c)}
                      </Badge>
                      {getSeverityBadge(alert.Current_Stocks__c)}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                        <Button variant="outline" size="sm">
                          Update Stock
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
