"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Bar, BarChart, PieChart, Pie, Cell } from "recharts"
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Target, Zap } from "lucide-react"
import Link from "next/link"

const demandForecastData = [
  { month: "Jan", actual: 120, predicted: 115 },
  { month: "Feb", actual: 135, predicted: 140 },
  { month: "Mar", actual: 128, predicted: 125 },
  { month: "Apr", actual: 155, predicted: 160 },
  { month: "May", actual: 142, predicted: 145 },
  { month: "Jun", actual: 168, predicted: 170 },
  { month: "Jul", actual: null, predicted: 185 },
  { month: "Aug", actual: null, predicted: 195 },
]

const topSellingProducts = [
  { name: "MCB 32A", sales: 245, trend: "up", growth: 12 },
  { name: "LED Panel 40W", sales: 189, trend: "up", growth: 8 },
  { name: "Copper Cable", sales: 156, trend: "down", growth: -3 },
  { name: "Switch Socket", sales: 134, trend: "up", growth: 15 },
  { name: "Distribution Panel", sales: 89, trend: "down", growth: -7 },
]

const churnRiskData = [
  { risk: "Low", count: 45, color: "#22c55e" },
  { risk: "Medium", count: 23, color: "#f59e0b" },
  { risk: "High", count: 12, color: "#ef4444" },
]

const inventoryMovement = [
  { category: "Circuit Breakers", fast: 65, slow: 15, dead: 5 },
  { category: "Lighting", fast: 45, slow: 25, dead: 8 },
  { category: "Cables", fast: 78, slow: 12, dead: 3 },
  { category: "Switches", fast: 56, slow: 18, dead: 6 },
  { category: "Panels", fast: 34, slow: 22, dead: 12 },
]

export default function AnalyticsPage() {
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
                <BreadcrumbPage>AI Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-bold">AI Analytics Dashboard</h1>
          <p className="text-muted-foreground">AI-powered insights for inventory and customer management</p>
        </div>

        {/* AI Insights Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demand Accuracy</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">AI prediction accuracy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">High-risk customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">Inventory efficiency</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto Actions</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Automated this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Demand Forecasting */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Demand Forecasting</CardTitle>
              <CardDescription>AI-powered sales predictions vs actual performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  actual: {
                    label: "Actual Sales",
                    color: "hsl(var(--chart-1))",
                  },
                  predicted: {
                    label: "AI Prediction",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demandForecastData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="var(--color-actual)"
                      strokeWidth={2}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="var(--color-predicted)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Product Performance & Churn Risk */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>AI-analyzed product performance trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellingProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{product.sales} sold</Badge>
                          <div className="flex items-center space-x-1">
                            {product.trend === "up" ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            <span className={`text-xs ${product.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                              {product.growth > 0 ? "+" : ""}
                              {product.growth}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Churn Risk</CardTitle>
              <CardDescription>AI-powered customer retention analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  low: { label: "Low Risk", color: "#22c55e" },
                  medium: { label: "Medium Risk", color: "#f59e0b" },
                  high: { label: "High Risk", color: "#ef4444" },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={churnRiskData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="count">
                      {churnRiskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 space-y-2">
                {churnRiskData.map((item) => (
                  <div key={item.risk} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.risk} Risk</span>
                    </div>
                    <span className="text-sm font-medium">{item.count} customers</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Movement Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Movement Analysis</CardTitle>
            <CardDescription>AI categorization of product movement patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                fast: {
                  label: "Fast Moving",
                  color: "hsl(var(--chart-1))",
                },
                slow: {
                  label: "Slow Moving",
                  color: "hsl(var(--chart-2))",
                },
                dead: {
                  label: "Dead Stock",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryMovement}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="fast" stackId="a" fill="var(--color-fast)" />
                  <Bar dataKey="slow" stackId="a" fill="var(--color-slow)" />
                  <Bar dataKey="dead" stackId="a" fill="var(--color-dead)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Automated insights and suggested actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Reorder Recommendation</p>
                  <p className="text-sm text-blue-600">
                    AI suggests ordering 100 units of "LED Panel 40W" based on demand forecast. Current stock will run
                    out in 8 days.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Create Purchase Order
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800">Customer Retention Alert</p>
                  <p className="text-sm text-orange-600">
                    "Modern Electronics" shows 78% churn probability. Recommend immediate follow-up with special offer
                    or personalized attention.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Send Retention Campaign
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3 rounded-lg border border-green-200 bg-green-50 p-4">
                <Target className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Pricing Optimization</p>
                  <p className="text-sm text-green-600">
                    AI analysis suggests increasing "MCB 32A" price by 5% based on demand elasticity. Potential revenue
                    increase: ₹12,000/month.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Apply Pricing
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
