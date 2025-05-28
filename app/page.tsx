"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Users, MessageSquare, TrendingUp, AlertTriangle, DollarSign, ShoppingCart, Plus } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
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
              <div className="text-2xl font-bold">₹3.28L</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">168</div>
              <p className="text-xs text-muted-foreground">+8 new orders today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+23 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
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
              <CardDescription>Important notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/inventory/alerts" className="block">
                <div className="flex items-start space-x-3 rounded-lg border border-orange-200 bg-orange-50 p-3 hover:bg-orange-100 transition-colors">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Low Stock Alert</p>
                    <p className="text-xs text-orange-600">12 items below reorder threshold</p>
                  </div>
                </div>
              </Link>

              <Link href="/whatsapp" className="block">
                <div className="flex items-start space-x-3 rounded-lg border border-blue-200 bg-blue-50 p-3 hover:bg-blue-100 transition-colors">
                  <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">WhatsApp Orders</p>
                    <p className="text-xs text-blue-600">5 new orders pending processing</p>
                  </div>
                </div>
              </Link>

              <Link href="/customers" className="block">
                <div className="flex items-start space-x-3 rounded-lg border border-red-200 bg-red-50 p-3 hover:bg-red-100 transition-colors">
                  <Users className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Inactive Customers</p>
                    <p className="text-xs text-red-600">8 customers haven't ordered in 14+ days</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
