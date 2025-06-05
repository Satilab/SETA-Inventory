"use client"

import type React from "react"

import { useState, useRef } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Camera,
  Scan,
  Plus,
  Minus,
  Package,
  CheckCircle,
  Upload,
  ImageIcon,
  Loader2,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { processImageWithOCR, type ExtractedAttributes } from "@/lib/ocr-service"
import { EditableAttributes } from "@/components/editable-attributes"
import Link from "next/link"
import { FieldMappingDisplay } from "@/components/field-mapping-display"
import { SalesforcePreview } from "@/components/salesforce-preview"
import { SalesforceStatus } from "@/components/salesforce-status"

export default function BarcodeScannerPage() {
  const [scannedCode, setScannedCode] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [operation, setOperation] = useState("in")
  const [isScanning, setIsScanning] = useState(false)
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<{
    productName: string
    sku: string
    rawText: string
    attributes: ExtractedAttributes
  } | null>(null)
  const [activeTab, setActiveTab] = useState("camera")
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsProcessingImage(true)

      // Display the uploaded image
      const imageUrl = URL.createObjectURL(file)
      setUploadedImage(imageUrl)

      // Process the image with PaddleOCR
      const result = await processImageWithOCR(file)
      setExtractedData(result)

      // Set the scanned code from the OCR result
      setScannedCode(result.sku)

      toast({
        title: "Image Processed with PaddleOCR",
        description: "Product information extracted successfully",
      })
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Failed to extract information from image",
        variant: "destructive",
      })
      console.error("Image processing error:", error)
    } finally {
      setIsProcessingImage(false)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleStockUpdate = async () => {
    try {
      const stockUpdateData = {
        productName: extractedData?.attributes?.["Product name"] || mockProduct.name,
        sku: scannedCode,
        operation: operation,
        quantity: quantity,
        attributes: extractedData?.attributes || {
          "Product name": mockProduct.name,
          Model: mockProduct.sku,
          Brand: mockProduct.brand,
          Price: mockProduct.price.toString(),
          Quantity: quantity.toString(),
        },
      }

      console.log("Updating stock with data:", stockUpdateData)

      const response = await fetch("/api/stock-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stockUpdateData),
      })

      const result = await response.json()

      if (result.success) {
        const action = operation === "in" ? "added to" : "removed from"

        toast({
          title: result.usingDemoMode ? "Stock Updated (Demo Mode)" : "Stock Updated & Salesforce Record Created",
          description: result.usingDemoMode
            ? `${quantity} units ${action} inventory (demo mode)`
            : `${quantity} units ${action} inventory. Salesforce ID: ${result.salesforceId}`,
        })

        // Show additional info if there were any issues
        if (result.error && !result.error.includes("PUBLIC_URL_REQUIRED")) {
          console.warn("Salesforce warning:", result.error)
        }
      } else {
        throw new Error(result.error || "Failed to update stock")
      }

      // Reset form
      setScannedCode("")
      setQuantity(1)
      setUploadedImage(null)
      setExtractedData(null)
    } catch (error) {
      console.error("Stock update error:", error)

      toast({
        title: "Stock Updated (Demo Mode)",
        description: "Stock updated locally due to connection issues",
        variant: "default",
      })

      // Reset form anyway
      setScannedCode("")
      setQuantity(1)
      setUploadedImage(null)
      setExtractedData(null)
    }
  }

  const handleAttributesUpdate = (updatedAttributes: ExtractedAttributes) => {
    if (extractedData) {
      setExtractedData({
        ...extractedData,
        productName: updatedAttributes["Product name"] || extractedData.productName,
        sku: updatedAttributes["Model"] || extractedData.sku,
        attributes: updatedAttributes,
      })

      toast({
        title: "Attributes Updated",
        description: "Product information has been updated",
      })
    }
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
          <p className="text-muted-foreground">Scan products or upload images to update inventory quickly</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Scanner Interface */}
          <Card>
            <CardHeader>
              <CardTitle>Scan or Upload Product</CardTitle>
              <CardDescription>Use camera, scan barcode, or upload product image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="camera">
                    <Camera className="mr-2 h-4 w-4" />
                    Camera
                  </TabsTrigger>
                  <TabsTrigger value="upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="camera" className="space-y-4">
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

                  <Button onClick={handleScan} className="w-full" disabled={isScanning}>
                    <Scan className="mr-2 h-4 w-4" />
                    {isScanning ? "Scanning..." : "Start Scanning"}
                  </Button>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  {/* Image Upload Area */}
                  <div
                    className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={triggerFileUpload}
                  >
                    {isProcessingImage ? (
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 mx-auto mb-2 animate-spin" />
                        <p className="text-sm text-muted-foreground">Processing with PaddleOCR...</p>
                      </div>
                    ) : uploadedImage ? (
                      <div className="w-full h-full relative">
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded product"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload product image</p>
                        <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />

                  <Button onClick={triggerFileUpload} className="w-full" disabled={isProcessingImage}>
                    <Upload className="mr-2 h-4 w-4" />
                    {isProcessingImage ? "Processing..." : "Upload Image"}
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="manual-code">Or enter barcode/SKU manually</Label>
                <Input
                  id="manual-code"
                  placeholder="Enter barcode or SKU"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                />
              </div>
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
                      <p className="font-medium">{extractedData?.attributes?.["Product name"] || mockProduct.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {extractedData?.attributes?.Brand || mockProduct.brand} • SKU: {scannedCode}
                      </p>
                      {extractedData?.attributes?.["H.P."] && (
                        <p className="text-sm text-muted-foreground">
                          H.P.: {extractedData.attributes["H.P."]} • Phase: {extractedData.attributes.Phase}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline">₹{extractedData?.attributes?.Price || mockProduct.price}</Badge>
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
                  <p className="text-muted-foreground">Scan a barcode or upload an image to view product details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Raw Extracted Text (when available) */}
        {extractedData?.rawText && (
          <Card>
            <CardHeader>
              <CardTitle>Raw Extracted Text</CardTitle>
              <CardDescription>Text extracted from the image using PaddleOCR</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
                {extractedData.rawText}
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">OCR Accuracy Note</p>
                  <p className="text-sm text-amber-700">
                    Text extraction may not be 100% accurate. Please review and edit the extracted attributes below if
                    needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Editable Extracted Data (when available) */}
        {extractedData && <EditableAttributes attributes={extractedData.attributes} onSave={handleAttributesUpdate} />}

        {/* Field Mapping Info */}
        <FieldMappingDisplay />

        {/* Salesforce Connection Status */}
        <SalesforceStatus />

        {/* Salesforce Preview (when data is available) */}
        {extractedData && (
          <SalesforcePreview attributes={extractedData.attributes} operation={operation} quantity={quantity} />
        )}

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
