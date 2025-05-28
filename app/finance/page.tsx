"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, FileText, Download, Eye, DollarSign, TrendingUp, CreditCard, Receipt } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, ResponsiveContainer, Bar, BarChart } from "recharts"
import Link from "next/link"

const mockInvoices = [
  {
    id: "INV-2024-001",
    customer: "Rajesh Electrical Works",
    date: "2024-01-25",
    amount: 26000,
    gst: 4680,
    total: 30680,
    status: "Paid",
    paymentMethod: "UPI",
  },
  {
    id: "INV-2024-002",
    customer: "Modern Electronics",
    date: "2024-01-24",
    amount: 15600,
    gst: 2808,
    total: 18408,
    status: "Pending",
    paymentMethod: "Credit",
  },
  {
    id: "INV-2024-003",
    customer: "Power Solutions Ltd",
    date: "2024-01-23",
    amount: 45000,
    gst: 8100,
    total: 53100,
    status: "Paid",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "INV-2024-004",
    customer: "City Electrical Store",
    date: "2024-01-22",
    amount: 8500,
    gst: 1530,
    total: 10030,
    status: "Overdue",
    paymentMethod: "Cash",
  },
]

const revenueData = [
  { month: "Jan", revenue: 328000, profit: 65600, gst: 59040 },
  { month: "Feb", revenue: 285000, profit: 57000, gst: 51300 },
  { month: "Mar", revenue: 412000, profit: 82400, gst: 74160 },
  { month: "Apr", revenue: 375000, profit: 75000, gst: 67500 },
  { month: "May", revenue: 445000, profit: 89000, gst: 80100 },
  { month: "Jun", revenue: 398000, profit: 79600, gst: 71640 },
]

const customerLedger = [
  {
    customer: "Rajesh Electrical Works",
    totalOrders: 45,
    totalValue: 125000,
    outstanding: 0,
    creditLimit: 50000,
    paymentTerms: "30 days",
  },
  {
    customer: "Modern Electronics",
    totalOrders: 28,
    totalValue: 85000,
    outstanding: 18408,
    creditLimit: 30000,
    paymentTerms: "15 days",
  },
  {
    customer: "Power Solutions Ltd",
    totalOrders: 67,
    totalValue: 450000,
    outstanding: 0,
    creditLimit: 100000,
    paymentTerms: "45 days",
  },
]

export default function FinancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month")

  const getStatusBadge = (status: string) => {
    const variants = {
      Paid: "default",
      Pending: "secondary",
      Overdue: "destructive",
    } as const
    return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status}</Badge>
  }

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalProfit = revenueData.reduce((sum, item) => sum + item.profit, 0)
  const totalGST = revenueData.reduce((sum, item) => sum + item.gst, 0)
  const totalOutstanding = customerLedger.reduce((sum, item) => sum + item.outstanding, 0)

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
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
                <BreadcrumbPage>Finance</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Finance Management</h1>
            <p className="text-muted-foreground">GST-compliant invoicing and financial tracking</p>
          </div>

          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Current Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12.5% from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalProfit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{Math.round((totalProfit / totalRevenue) * 100)}% margin</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">GST Collected</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalGST.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">18% GST rate applied</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalOutstanding.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Pending receivables</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Profit Trends</CardTitle>
            <CardDescription>Monthly financial performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
                profit: {
                  label: "Profit",
                  color: "hsl(var(--chart-2))",
                },
                gst: {
                  label: "GST",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                  <Bar dataKey="profit" fill="var(--color-profit)" />
                  <Bar dataKey="gst" fill="var(--color-gst)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Invoices and Customer Ledger */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Latest GST-compliant invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                        <p className="text-xs text-muted-foreground">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{invoice.total.toLocaleString()}</p>
                      {getStatusBadge(invoice.status)}
                      <div className="flex space-x-1 mt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Ledger */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Ledger</CardTitle>
              <CardDescription>Customer credit and payment tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customerLedger.map((customer) => (
                  <div key={customer.customer} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{customer.customer}</p>
                      <Badge variant={customer.outstanding > 0 ? "destructive" : "default"}>
                        {customer.outstanding > 0 ? "Outstanding" : "Clear"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Orders</p>
                        <p className="font-medium">{customer.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Value</p>
                        <p className="font-medium">₹{customer.totalValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Outstanding</p>
                        <p className="font-medium">₹{customer.outstanding.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Credit Limit</p>
                        <p className="font-medium">₹{customer.creditLimit.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GST Summary */}
        <Card>
          <CardHeader>
            <CardTitle>GST Summary</CardTitle>
            <CardDescription>Tax compliance and filing information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">CGST (9%)</p>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">₹{Math.round(totalGST / 2).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Central GST collected</p>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">SGST (9%)</p>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">₹{Math.round(totalGST / 2).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">State GST collected</p>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Next Filing</p>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">Feb 20</p>
                <p className="text-xs text-muted-foreground">GSTR-1 due date</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download GSTR-1
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download GSTR-3B
              </Button>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                File GST Return
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
