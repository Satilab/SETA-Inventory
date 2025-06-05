"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, AlertTriangle, RefreshCw, Filter, Plus, Database } from "lucide-react"
import { useInventoryManagement } from "@/hooks/use-inventory-management"
import { useToast } from "@/hooks/use-toast"
import { DynamicProductForm } from "@/components/dynamic-product-form"
import { getCategoryNames, getCategoryByName } from "@/lib/product-categories"

export default function InventoryPage() {
  const { data: inventory, loading, refetch, isDemoMode } = useInventoryManagement()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPhase, setSelectedPhase] = useState("All")
  const [selectedStage, setSelectedStage] = useState("All")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Category-based form state
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categoryFormData, setCategoryFormData] = useState<Record<string, any>>({})

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.Productname__c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Model__c?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPhase = selectedPhase === "All" || item.Phase__c === selectedPhase
    const matchesStage = selectedStage === "All" || (item.stage__c?.toString() || "0") === selectedStage

    return matchesSearch && matchesPhase && matchesStage
  })

  const phases = ["All", ...Array.from(new Set(inventory.map((item) => item.Phase__c).filter(Boolean)))]
  const stages = [
    "All",
    ...Array.from(new Set(inventory.map((item) => item.stage__c?.toString() || "0").filter(Boolean))),
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCategoryFormData({}) // Reset form data when category changes
  }

  const validateForm = () => {
    if (!selectedCategory) return false

    const categoryConfig = getCategoryByName(selectedCategory)
    if (!categoryConfig) return false

    // Check all required fields
    for (const field of categoryConfig.fields) {
      if (field.required && !categoryFormData[field.name]) {
        return false
      }
    }
    return true
  }

  const handleAddProduct = async () => {
    try {
      setIsSubmitting(true)

      if (!validateForm()) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const categoryConfig = getCategoryByName(selectedCategory)
      if (!categoryConfig) {
        throw new Error("Invalid category selected")
      }

      // Map form data to Salesforce fields
      const salesforceData: Record<string, any> = {}

      categoryConfig.fields.forEach((field) => {
        const value = categoryFormData[field.name]
        if (value !== undefined && value !== "") {
          const salesforceField = field.salesforceField || field.name

          // Convert to appropriate type
          if (field.type === "number") {
            salesforceData[salesforceField] = Number(value)
          } else {
            salesforceData[salesforceField] = String(value)
          }
        }
      })

      console.log("Sending product data:", {
        category: selectedCategory,
        salesforceData,
        originalFormData: categoryFormData,
      })

      // Always use VENKATA_RAMANA_MOTORS__c as the Salesforce object
      const response = await fetch("/api/salesforce/create-inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productData: salesforceData,
          category: selectedCategory,
          salesforceObject: "VENKATA_RAMANA_MOTORS__c", // Always use this object
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Product Added Successfully",
          description: result.message,
        })
        setIsAddDialogOpen(false)
        setSelectedCategory("")
        setCategoryFormData({})
        refetch() // Refresh the inventory list
      } else {
        throw new Error(result.error || "Failed to add product")
      }
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error Adding Product",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Salesforce VENKATA_RAMANA_MOTORS__c records
            {isDemoMode && (
              <span className="ml-2 inline-flex items-center gap-1 text-orange-600">
                <Database className="h-3 w-3" />
                Demo Mode
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Select a category and fill in the product details to add to VENKATA_RAMANA_MOTORS__c.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">Product Category *</Label>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product category" />
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

                {/* Dynamic Form Based on Category */}
                {selectedCategory && (
                  <DynamicProductForm
                    category={selectedCategory}
                    formData={categoryFormData}
                    onChange={setCategoryFormData}
                  />
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setSelectedCategory("")
                    setCategoryFormData({})
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddProduct} disabled={isSubmitting || !validateForm()}>
                  {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inventory.reduce((sum, item) => sum + (item.Quantity__c || 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.length > 0
                ? formatCurrency(inventory.reduce((sum, item) => sum + item.Price__c, 0) / inventory.length)
                : formatCurrency(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by product name or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {phases.map((phase) => (
                <option key={phase} value={phase}>
                  {phase === "All" ? "All Phases" : `${phase} Phase`}
                </option>
              ))}
            </select>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage === "All" ? "All Stages" : `Stage ${stage}`}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredInventory.map((item) => (
          <Card key={item.Id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.Productname__c}</CardTitle>
                  <CardDescription>
                    Model: {item.Model__c}
                    {item.H_p__c && ` • ${item.H_p__c} HP`}
                  </CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Available</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-medium">{formatCurrency(item.Price__c)}</span>
                </div>

                {item.Phase__c && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Phase</span>
                    <span className="text-sm">{item.Phase__c}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stage</span>
                  <span className="text-sm">Stage {item.stage__c || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quantity</span>
                  <span className="text-sm">{item.Quantity__c || 0}</span>
                </div>

                {item.H_p__c && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">HP Rating</span>
                    <span className="text-sm">{item.H_p__c} HP</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="font-medium">{formatCurrency((item.Quantity__c || 0) * item.Price__c)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">
              {inventory.length === 0
                ? "No products exist in the VENKATA_RAMANA_MOTORS__c object. Add some products to get started."
                : "Try adjusting your search or filter criteria."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
