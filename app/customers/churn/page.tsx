"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Search, Phone, MessageSquare, Calendar, Loader2, UserX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useChurnCustomers, type ChurnCustomer } from "@/hooks/use-churn-customers"
import Link from "next/link"

export default function ChurnCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const { data: churnCustomers, loading, error, refetch, isDemoMode } = useChurnCustomers()

  const filteredCustomers = churnCustomers.filter(
    (customer) =>
      customer.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.Phone__c && customer.Phone__c.includes(searchTerm)),
  )

  const getRiskBadgeVariant = (score?: number) => {
    if (!score) return "outline"
    if (score >= 75) return "destructive"
    if (score >= 50) return "warning"
    return "secondary"
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const handleContactCustomer = (customer: ChurnCustomer) => {
    toast({
      title: "Contact Initiated",
      description: `Contacting ${customer.Name} via WhatsApp`,
    })
  }

  if (error) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Salesforce Connection Error</CardTitle>
              <CardDescription>Unable to fetch churn customer data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => refetch()} className="w-full">
                Retry Connection
              </Button>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
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
                <Link href="/customers">Customers</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Churn Risk</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Churn Risk Customers</h1>
            <p className="text-muted-foreground">
              Customers at risk of churning based on Salesforce AI analysis
              {isDemoMode && " (Demo Mode)"}
            </p>
          </div>
          <Button onClick={() => refetch()}>Refresh Data</Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              Churn Risk Customers ({loading ? "..." : filteredCustomers.length})
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin inline" />}
            </CardTitle>
            <CardDescription>Customers who haven't ordered recently or show signs of disengagement</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading churn data from Salesforce...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead>Days Inactive</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Recommended Action</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.Id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <UserX className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">{customer.Name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{customer.Phone__c || "N/A"}</p>
                            <p className="text-xs text-muted-foreground">{customer.Email__c || "N/A"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(customer.Last_Order_Date__c)}</TableCell>
                        <TableCell>{customer.Days_Inactive__c || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={getRiskBadgeVariant(customer.Churn_Risk_Score__c)}>
                            {customer.Churn_Risk_Score__c || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{customer.Churn_Reason__c || "Unknown"}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{customer.Recommended_Action__c || "Contact customer"}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleContactCustomer(customer)}>
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
