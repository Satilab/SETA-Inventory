"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, MessageSquare, Phone, AlertTriangle, Users } from "lucide-react"

const mockCustomers = [
  {
    id: 1,
    name: "Rajesh Electrical Works",
    phone: "+91 9876543210",
    email: "rajesh@electricalworks.com",
    whatsapp: "+91 9876543210",
    gstin: "36ABCDE1234F1Z5",
    type: "Contractor",
    address: "Shop 15, Electrical Market, Secunderabad",
    lastOrderDate: "2024-01-20",
    totalOrders: 45,
    totalValue: 125000,
    active: true,
    daysSinceLastOrder: 6,
  },
  {
    id: 2,
    name: "Modern Electronics",
    phone: "+91 9876543211",
    email: "info@modernelectronics.com",
    whatsapp: "+91 9876543211",
    gstin: "36FGHIJ5678K2L6",
    type: "Retail",
    address: "Plot 42, Electronics Complex, Hyderabad",
    lastOrderDate: "2024-01-15",
    totalOrders: 28,
    totalValue: 85000,
    active: true,
    daysSinceLastOrder: 11,
  },
  {
    id: 3,
    name: "Power Solutions Ltd",
    phone: "+91 9876543212",
    email: "orders@powersolutions.com",
    whatsapp: "+91 9876543212",
    gstin: "36MNOPQ9012R3S7",
    type: "Bulk",
    address: "Industrial Area, Phase 2, Secunderabad",
    lastOrderDate: "2024-01-25",
    totalOrders: 67,
    totalValue: 450000,
    active: true,
    daysSinceLastOrder: 1,
  },
  {
    id: 4,
    name: "City Electrical Store",
    phone: "+91 9876543213",
    email: "city@electrical.com",
    whatsapp: "+91 9876543213",
    gstin: "36TUVWX3456Y4Z8",
    type: "Retail",
    address: "Main Road, Begumpet, Hyderabad",
    lastOrderDate: "2024-01-05",
    totalOrders: 15,
    totalValue: 35000,
    active: false,
    daysSinceLastOrder: 21,
  },
  {
    id: 5,
    name: "Industrial Supplies Co",
    phone: "+91 9876543214",
    email: "supplies@industrial.com",
    whatsapp: "+91 9876543214",
    gstin: "36ABCDE7890F5G9",
    type: "Contractor",
    address: "Kukatpally Industrial Estate, Hyderabad",
    lastOrderDate: "2023-12-28",
    totalOrders: 8,
    totalValue: 22000,
    active: false,
    daysSinceLastOrder: 29,
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCustomerStatusBadge = (active: boolean, daysSinceLastOrder: number) => {
    if (!active || daysSinceLastOrder > 14) {
      return <Badge variant="destructive">Inactive</Badge>
    } else if (daysSinceLastOrder > 7) {
      return <Badge variant="secondary">At Risk</Badge>
    } else {
      return <Badge variant="default">Active</Badge>
    }
  }

  const getCustomerTypeBadge = (type: string) => {
    const variants = {
      Retail: "default",
      Contractor: "secondary",
      Bulk: "outline",
    } as const
    return <Badge variant={variants[type as keyof typeof variants] || "default"}>{type}</Badge>
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Customers</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Header Actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground">Manage your customer relationships and track engagement</p>
          </div>

          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>Enter the details for the new customer.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer-name" className="text-right">
                      Name
                    </Label>
                    <Input id="customer-name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer-phone" className="text-right">
                      Phone
                    </Label>
                    <Input id="customer-phone" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer-email" className="text-right">
                      Email
                    </Label>
                    <Input id="customer-email" type="email" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer-type" className="text-right">
                      Type
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                        <SelectItem value="bulk">Bulk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer-gstin" className="text-right">
                      GSTIN
                    </Label>
                    <Input id="customer-gstin" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setIsAddDialogOpen(false)}>
                    Add Customer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.filter((c) => c.active).length}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((customers.filter((c) => c.active).length / customers.length) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.filter((c) => c.daysSinceLastOrder > 7 && c.daysSinceLastOrder <= 14).length}
              </div>
              <p className="text-xs text-muted-foreground">Need follow-up</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹
                {Math.round(
                  customers.reduce((sum, c) => sum + c.totalValue, 0) /
                    customers.reduce((sum, c) => sum + c.totalOrders, 0),
                )}
              </div>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, phone, email, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="bulk">Bulk</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
            <CardDescription>Manage your customer relationships and track engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Last Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">GSTIN: {customer.gstin}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{customer.phone}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getCustomerTypeBadge(customer.type)}</TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>₹{customer.totalValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{customer.lastOrderDate}</p>
                          <p className="text-xs text-muted-foreground">{customer.daysSinceLastOrder} days ago</p>
                        </div>
                      </TableCell>
                      <TableCell>{getCustomerStatusBadge(customer.active, customer.daysSinceLastOrder)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
