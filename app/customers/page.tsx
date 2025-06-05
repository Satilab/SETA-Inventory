"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSalesforceCustomers } from "@/hooks/use-salesforce-customers"
import { CustomerDetailsDialog } from "@/components/customer-details-dialog"
import {
  Phone,
  Plus,
  Search,
  RefreshCw,
  Users,
  CheckCircle,
  XCircle,
  Database,
  Settings,
  ExternalLink,
  Mail,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function CustomersPage() {
  const { data: customers, loading, error, refetch, lastUpdated, salesforceInfo, hasData } = useSalesforceCustomers()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  // Safe getter functions for your specific fields
  const getName = (customer: any): string => {
    return customer?.Name || "Unknown Customer"
  }

  const getCustomerEmail = (customer: any): string => {
    return customer?.Customer_Email__c || ""
  }

  const getPhoneNumber = (customer: any): string => {
    return customer?.Phone_Number__c || ""
  }

  const getQuoteDate = (customer: any): string => {
    if (!customer?.Quote_Date__c) return ""
    try {
      return new Date(customer.Quote_Date__c).toLocaleDateString("en-IN")
    } catch {
      return customer.Quote_Date__c
    }
  }

  const getReason = (customer: any): string => {
    return customer?.reason__c || ""
  }

  const getTotalAmount = (customer: any): number => {
    return customer?.Total_amount__c || 0
  }

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) => {
    if (!searchTerm) return true

    const name = getName(customer).toLowerCase()
    const email = getCustomerEmail(customer).toLowerCase()
    const phone = getPhoneNumber(customer).toLowerCase()
    const reason = getReason(customer).toLowerCase()
    const search = searchTerm.toLowerCase()

    return name.includes(search) || email.includes(search) || phone.includes(search) || reason.includes(search)
  })

  // Filter by amount ranges (instead of customer type)
  const getCustomersByAmountRange = (range: string) => {
    if (range === "all") return filteredCustomers

    return filteredCustomers.filter((customer) => {
      const amount = getTotalAmount(customer)
      switch (range) {
        case "low":
          return amount < 10000
        case "medium":
          return amount >= 10000 && amount < 50000
        case "high":
          return amount >= 50000 && amount < 100000
        case "premium":
          return amount >= 100000
        default:
          return true
      }
    })
  }

  const handleCall = (phone: string) => {
    if (phone) {
      window.open(`tel:${phone}`, "_self")
      toast({
        title: "Calling Customer",
        description: `Initiating call to ${phone}`,
      })
    }
  }

  const handleEmail = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`, "_blank")
      toast({
        title: "Opening Email",
        description: `Composing email to ${email}`,
      })
    }
  }

  const handleWhatsApp = (phone: string) => {
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "")
      window.open(`https://wa.me/${cleanPhone}`, "_blank")
      toast({
        title: "Opening WhatsApp",
        description: `Starting WhatsApp chat with ${phone}`,
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("en-IN")
    } catch {
      return "N/A"
    }
  }

  const getAmountRangeColor = (amount: number) => {
    if (amount >= 100000) return "text-purple-600 bg-purple-50"
    if (amount >= 50000) return "text-blue-600 bg-blue-50"
    if (amount >= 10000) return "text-green-600 bg-green-50"
    return "text-gray-600 bg-gray-50"
  }

  const getAmountRangeLabel = (amount: number) => {
    if (amount >= 100000) return "Premium"
    if (amount >= 50000) return "High Value"
    if (amount >= 10000) return "Medium Value"
    return "Low Value"
  }

  // Show empty state when no data and not loading
  if (!loading && !hasData && error) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Customer Management
            </h1>
            <p className="text-muted-foreground">Manage your electrical trade customers from Salesforce</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={refetch} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Retry Connection
            </Button>
            <Link href="/debug/salesforce">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Debug Setup
              </Button>
            </Link>
          </div>
        </div>

        {/* Error State */}
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-700">No Customer Data Available</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-red-600">{error}</div>

            <div className="bg-red-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-red-800">Expected Fields:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>
                  • <code>Name</code> - Customer name
                </li>
                <li>
                  • <code>Customer_Email__c</code> - Customer email address
                </li>
                <li>
                  • <code>Phone_Number__c</code> - Customer phone number
                </li>
                <li>
                  • <code>Quote_Date__c</code> - Quote date
                </li>
                <li>
                  • <code>reason__c</code> - Reason or notes
                </li>
                <li>
                  • <code>Total_amount__c</code> - Total amount
                </li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button onClick={refetch} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Retry Connection
              </Button>
              <Link href="/debug/salesforce">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Debug Configuration
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show empty state when no data but no error (successful connection but no records)
  if (!loading && !hasData && !error) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Customer Management
            </h1>
            <p className="text-muted-foreground">Manage your electrical trade customers from Salesforce</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={refetch} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <CardTitle className="text-green-700">Connected to Salesforce</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-green-600">
              Successfully connected to Salesforce, but no customer records were found.
            </div>
            {salesforceInfo && (
              <div className="text-sm text-muted-foreground mt-2">
                Checked objects: {salesforceInfo.objectsChecked?.join(", ") || "Multiple objects"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Customer Records Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Your Salesforce connection is working, but no customer records were found with the expected fields.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 max-w-md mx-auto">
              <h4 className="font-medium text-blue-800 mb-2">Expected Fields:</h4>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>
                  • <code>Name</code>
                </li>
                <li>
                  • <code>Customer_Email__c</code>
                </li>
                <li>
                  • <code>Phone_Number__c</code>
                </li>
                <li>
                  • <code>Quote_Date__c</code>
                </li>
                <li>
                  • <code>reason__c</code>
                </li>
                <li>
                  • <code>Total_amount__c</code>
                </li>
              </ul>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button variant="outline" asChild>
                <a href={salesforceInfo?.instanceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Salesforce
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Customer Management
          </h1>
          <p className="text-muted-foreground">Manage your electrical trade customers from Salesforce</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={refetch} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" placeholder="Customer name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" placeholder="customer@example.com" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input id="phone" placeholder="+91 9876543210" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input id="amount" placeholder="50000" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">
                    Reason
                  </Label>
                  <Textarea id="reason" placeholder="Quote reason or notes" className="col-span-3" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Customer Added",
                      description: "New customer has been added successfully.",
                    })
                    setIsAddDialogOpen(false)
                  }}
                >
                  Add Customer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Salesforce Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              Salesforce Data Source
            </CardTitle>
            {salesforceInfo && <Badge variant="outline">{salesforceInfo.objectUsed || "Unknown"}</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700 font-medium">Connected to Salesforce</span>
            </div>
            {salesforceInfo && (
              <div className="text-sm text-muted-foreground">
                {salesforceInfo.recordCount} records from {salesforceInfo.objectUsed}
              </div>
            )}
            {lastUpdated && (
              <div className="text-sm text-muted-foreground ml-auto">Last updated: {formatDate(lastUpdated)}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email, phone, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Amount Range Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({filteredCustomers.length})</TabsTrigger>
          <TabsTrigger value="low">Low (&lt;₹10K) ({getCustomersByAmountRange("low").length})</TabsTrigger>
          <TabsTrigger value="medium">Medium (₹10K-50K) ({getCustomersByAmountRange("medium").length})</TabsTrigger>
          <TabsTrigger value="high">High (₹50K-100K) ({getCustomersByAmountRange("high").length})</TabsTrigger>
          <TabsTrigger value="premium">Premium (₹100K+) ({getCustomersByAmountRange("premium").length})</TabsTrigger>
        </TabsList>

        {["all", "low", "medium", "high", "premium"].map((range) => (
          <TabsContent key={range} value={range} className="space-y-4">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : getCustomersByAmountRange(range).length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No customers found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "No customers match your search criteria."
                      : `No ${range === "all" ? "" : range + " value"} customers found in Salesforce.`}
                  </p>
                  <Button onClick={refetch} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getCustomersByAmountRange(range).map((customer) => (
                  <Card key={customer.Id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{getName(customer)}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getAmountRangeColor(getTotalAmount(customer))}`}>
                              {getAmountRangeLabel(getTotalAmount(customer))}
                            </Badge>
                            {customer.SourceObject && (
                              <Badge variant="outline" className="text-xs">
                                {customer.SourceObject}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(getTotalAmount(customer))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Contact Information */}
                      <div className="space-y-2">
                        {getPhoneNumber(customer) && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Phone:</span>
                            <div className="flex items-center gap-1">
                              <span className="text-sm">{getPhoneNumber(customer)}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => handleCall(getPhoneNumber(customer))}
                              >
                                <Phone className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {getCustomerEmail(customer) && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Email:</span>
                            <div className="flex items-center gap-1">
                              <span className="text-sm truncate max-w-[120px]">{getCustomerEmail(customer)}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => handleEmail(getCustomerEmail(customer))}
                              >
                                <Mail className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quote Information */}
                      <div className="space-y-2">
                        {getQuoteDate(customer) && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Quote Date:</span>
                            <span className="text-sm font-medium">{getQuoteDate(customer)}</span>
                          </div>
                        )}
                        {getReason(customer) && (
                          <div>
                            <span className="text-sm text-muted-foreground">Reason:</span>
                            <div className="text-sm mt-1 bg-gray-50 p-2 rounded text-gray-700 line-clamp-2">
                              {getReason(customer)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Customer Details Dialog */}
      {selectedCustomer && (
        <CustomerDetailsDialog
          customer={selectedCustomer}
          open={!!selectedCustomer}
          onOpenChange={(open) => !open && setSelectedCustomer(null)}
          onCall={handleCall}
          onEmail={handleEmail}
          onWhatsApp={handleWhatsApp}
        />
      )}
    </div>
  )
}
