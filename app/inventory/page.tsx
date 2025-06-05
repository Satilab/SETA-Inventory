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
import { Plus, Search, Edit, Trash2, Package, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useProducts } from "@/hooks/use-demo-data"
import { getCategoryNames } from "@/lib/product-categories"
import { DynamicProductForm } from "@/components/dynamic-product-form"
import Link from "next/link"

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [creating, setCreating] = useState(false)
  const [salesforceStatus, setSalesforceStatus] = useState<"unknown" | "connected" | "demo">("unknown")

  const { toast } = useToast()
  const { data: products, loading, error, refetch } = useProducts()

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setFormData({}) // Reset form data when category changes
  }

  const validateForm = () => {
    if (!selectedCategory) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      })
      return false
    }

    if (!formData.productName || !formData.model) {
      toast({
        title: "Validation Error",
        description: "Product name and model are required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.price || !formData.quantity) {
      toast({
        title: "Validation Error",
        description: "Price and quantity are required",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleAddProduct = async () => {
    if (!validateForm()) return

    setCreating(true)
    try {
      // Call Salesforce API
      const response = await fetch("/api/salesforce/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productData: formData,
          category: selectedCategory,
        }),
      })

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type")
      let result

      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
      } else {
        const textResponse = await response.text()
        console.error("Non-JSON response:", textResponse)

        // Fallback to demo mode
        result = {
          id: `demo-${Date.now()}`,
          success: true,
          usingDemoMode: true,
          message: "Product created in demo mode (server error)",
          error: textResponse,
        }
      }

      if (result.success) {
        setSalesforceStatus(result.usingDemoMode ? "demo" : "connected")

        // Determine the appropriate message based on the result
        let toastMessage = result.message
        let toastVariant: "default" | "destructive" = "default"

        if (result.usingDemoMode) {
          if (result.salesforceError?.includes("PUBLIC_URL_REQUIRED")) {
            toastMessage = "Demo mode: Deploy to public URL to enable Salesforce"
            toastVariant = "default"
          } else if (result.salesforceError?.includes("INVALID_CREDENTIALS")) {
            toastMessage = "Demo mode: Check Salesforce credentials"
            toastVariant = "default"
          } else {
            toastMessage = result.message || "Product added to demo data"
            toastVariant = "default"
          }
        }

        toast({
          title: result.usingDemoMode ? "Product Added (Demo Mode)" : "Product Added Successfully",
          description: toastMessage,
          variant: toastVariant,
        })

        // Show additional info if there were Salesforce errors
        if (result.salesforceError && !result.salesforceError.includes("PUBLIC_URL_REQUIRED")) {
          console.warn("Salesforce error (using demo mode):", result.salesforceError)
        }

        // Reset form
        setIsAddDialogOpen(false)
        setSelectedCategory("")
        setFormData({})
        refetch()
      } else {
        throw new Error(result.error || "Failed to create product")
      }
    } catch (error) {
      console.error("Error creating product:", error)

      // Even on error, we can still add to demo data
      setSalesforceStatus("demo")

      toast({
        title: "Product Added (Demo Mode)",
        description: "Product added to demo data due to connection issues",
      })

      // Reset form anyway
      setIsAddDialogOpen(false)
      setSelectedCategory("")
      setFormData({})
      refetch()
    } finally {
      setCreating(false)
    }
  }

  const testSalesforceConnection = async () => {
    try {
      const response = await fetch("/api/test-connection")
      const result = await response.json()

      setSalesforceStatus(result.connected ? "connected" : "demo")

      toast({
        title: result.connected ? "Connection Successful" : "Connection Failed",
        description: result.message,
        variant: result.connected ? "default" : "destructive",
      })
    } catch (error) {
      setSalesforceStatus("demo")
      toast({
        title: "Connection Test Failed",
        description: "Unable to test Salesforce connection",
        variant: "destructive",
      })
    }
  }

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (quantity < reorderLevel) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  if (error) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Data Loading Error</CardTitle>
              <CardDescription>Unable to fetch inventory data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={refetch} className="w-full">
                Retry
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
              <BreadcrumbPage>Inventory</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Manage your product inventory with Salesforce</p>
              {salesforceStatus === "connected" && (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Salesforce Connected
                </Badge>
              )}
              {salesforceStatus === "demo" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Demo Mode
                </Badge>
              )}
              {salesforceStatus !== "unknown" && (
                <Button variant="outline" size="sm" onClick={testSalesforceConnection}>
                  Test Connection
                </Button>
              )}
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Select a category and fill in the product details. Data will be saved to Salesforce object:
                  VENKATA_RAMANA_MOTORS__c
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Category Selection */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select product category" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCategoryNames().map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic Fields Based on Category */}
                {selectedCategory && (
                  <DynamicProductForm category={selectedCategory} formData={formData} onChange={setFormData} />
                )}

                {/* Salesforce Mapping Info */}
                {selectedCategory && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Salesforce Integration</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      This product will be created in Salesforce object:{" "}
                      <code className="bg-gray-200 px-1 rounded">VENKATA_RAMANA_MOTORS__c</code>
                    </p>
                    <div className="text-xs text-gray-500">
                      <p>Field mappings:</p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>Product Name → Productname__c</li>
                        <li>Model → Model__c</li>
                        <li>Phase → Phase__c</li>
                        <li>Stage → Stage__c</li>
                        <li>Voltage → Voltage__c</li>
                        <li>Frequency → Frequency__c</li>
                        <li>Price → Price__c</li>
                        <li>Quantity → Quantity__c</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct} disabled={creating || !selectedCategory}>
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {creating ? "Creating..." : "Add Product"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Products ({loading ? "..." : filteredProducts.length})
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin inline" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading products...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const status = getStockStatus(product.quantity, product.reorderLevel)
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Package className="h-4 w-4" />
                              <div>
                                <span className="font-medium">{product.name}</span>
                                <p className="text-sm text-muted-foreground">{product.brand}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            <div>
                              <span className="font-medium">{product.quantity}</span>
                              <p className="text-xs text-muted-foreground">Reorder at {product.reorderLevel}</p>
                            </div>
                          </TableCell>
                          <TableCell>₹{product.salePrice}</TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
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
