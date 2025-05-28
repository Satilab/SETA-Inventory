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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Scan, Plus, Minus, Package, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function BarcodeScannerPage() {
  const [scannedCode, setScannedCode] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [operation, setOperation] = useState("in")
  const [isScanning, setIsScanning] = useState(false)
  const { toast } = useToast()

  const mockProduct = {
    name: "MCB 32A Single Pole",
    sku: "MCB-32A-SP",
    brand: "Schneider",
    currentStock: 25,
    price: 520,
  }

  const handleScan = () => {
    setIsScanning(true)
    // Simulate barcode scanning
    setTimeout(() => {
      setScannedCode("MCB-32A-SP")
      setIsScanning(false)
      toast({
        title: "Barcode Scanned",
        description: "Product found in inventory",
      })
    }, 2000)
  }

  const handleStockUpdate = () => {
    const action = operation === "in" ? "added to" : "removed from"
    toast({
      title: "Stock Updated",
      description: `${quantity} units ${action} inventory`,
    })
    setScannedCode("")
    setQuantity(1)
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
                <BreadcrumbLink asChild>
                  <Link href="/">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/inventory">Inventory</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Barcode Scanner</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-bold">Barcode Scanner</h1>
          <p className="text-muted-foreground">Scan products to update inventory quickly</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Scanner Interface */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Product</CardTitle>
              <CardDescription>Use your camera to scan product barcodes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Camera Preview Simulation */}
              <div className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
                {isScanning ? (
                  <div className="text-center">
                    <Scan className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                    <p className="text-sm text-muted-foreground">Scanning...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="manual-code">Or enter barcode manually</Label>
                <Input
                  id="manual-code"
                  placeholder="Enter barcode or SKU"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                />
              </div>

              <Button onClick={handleScan} className="w-full" disabled={isScanning}>
                <Scan className="mr-2 h-4 w-4" />
                {isScanning ? "Scanning..." : "Start Scanning"}
              </Button>
            </CardContent>
          </Card>

          {/* Product Details & Stock Update */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Update stock levels for scanned products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scannedCode ? (
                <>
                  {/* Product Info */}
                  <div className="flex items-center space-x-3 p-3 rounded-lg border bg-muted/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{mockProduct.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {mockProduct.brand} • SKU: {mockProduct.sku}
                      </p>
                    </div>
                    <Badge variant="outline">₹{mockProduct.price}</Badge>
                  </div>

                  {/* Current Stock */}
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm font-medium">Current Stock</span>
                    <Badge variant="secondary">{mockProduct.currentStock} units</Badge>
                  </div>

                  {/* Operation Type */}
                  <div className="space-y-2">
                    <Label>Operation</Label>
                    <Select value={operation} onValueChange={setOperation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">Stock In (Add)</SelectItem>
                        <SelectItem value="out">Stock Out (Remove)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity Input */}
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                        className="text-center"
                        min="1"
                      />
                      <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Update Button */}
                  <Button onClick={handleStockUpdate} className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Update Stock ({operation === "in" ? "+" : "-"}
                    {quantity})
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Scan className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Scan a barcode to view product details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Recently scanned products and stock updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { product: "LED Panel Light 40W", operation: "Stock In", quantity: 10, time: "2 minutes ago" },
                { product: "Copper Cable 2.5mm²", operation: "Stock Out", quantity: 50, time: "15 minutes ago" },
                { product: "MCB 32A Single Pole", operation: "Stock In", quantity: 25, time: "1 hour ago" },
              ].map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{scan.product}</p>
                      <p className="text-sm text-muted-foreground">{scan.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={scan.operation === "Stock In" ? "default" : "secondary"}>
                      {scan.operation === "Stock In" ? "+" : "-"}
                      {scan.quantity}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{scan.operation}</p>
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
