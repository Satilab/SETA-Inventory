"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Database, Check, X, AlertCircle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SalesforceObjectExplorer() {
  const [loading, setLoading] = useState(false)
  const [objects, setObjects] = useState<any[]>([])
  const [selectedObject, setSelectedObject] = useState("")
  const [objectDetails, setObjectDetails] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [customObject, setCustomObject] = useState("")
  const { toast } = useToast()

  const fetchObjects = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/salesforce/describe-objects")
      const data = await response.json()

      if (data.success && data.objects) {
        setObjects(data.objects)
        toast({
          title: "Objects Loaded",
          description: `Found ${data.objects.length} Salesforce objects`,
        })
      } else {
        setError(data.error || "Failed to fetch Salesforce objects")
        toast({
          title: "Error",
          description: data.error || "Failed to fetch Salesforce objects",
          variant: "destructive",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchObjectDetails = async (objectName: string) => {
    if (!objectName) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/salesforce/describe-object?object=${objectName}`)
      const data = await response.json()

      if (data.success && data.objectDetails) {
        setObjectDetails(data.objectDetails)
        toast({
          title: "Object Details Loaded",
          description: `Loaded details for ${objectName}`,
        })
      } else {
        setError(data.error || `Failed to fetch details for ${objectName}`)
        setObjectDetails(null)
        toast({
          title: "Error",
          description: data.error || `Failed to fetch details for ${objectName}`,
          variant: "destructive",
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      setObjectDetails(null)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchObjects()
  }, [])

  useEffect(() => {
    if (selectedObject) {
      fetchObjectDetails(selectedObject)
    }
  }, [selectedObject])

  const handleCustomObjectSubmit = () => {
    if (customObject) {
      setSelectedObject(customObject)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Salesforce Object Explorer
        </CardTitle>
        <CardDescription>
          Explore available Salesforce objects and their fields to find your customer data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-sm mb-4">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4" />
              Error
            </div>
            <p className="mt-1">{error}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3 space-y-4">
            <div className="space-y-2">
              <Label>Select Object</Label>
              <Select value={selectedObject} onValueChange={setSelectedObject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an object" />
                </SelectTrigger>
                <SelectContent>
                  {objects.map((obj) => (
                    <SelectItem key={obj.name} value={obj.name}>
                      {obj.label} {obj.custom && "(Custom)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Or Enter Custom Object Name</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Customer__c"
                  value={customObject}
                  onChange={(e) => setCustomObject(e.target.value)}
                />
                <Button variant="outline" onClick={handleCustomObjectSubmit} disabled={!customObject}>
                  Go
                </Button>
              </div>
            </div>

            <Button onClick={fetchObjects} variant="outline" disabled={loading} className="w-full">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh Objects
            </Button>
          </div>

          <div className="w-full md:w-2/3">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : objectDetails ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{objectDetails.label}</h3>
                  <Badge variant={objectDetails.custom ? "default" : "outline"}>
                    {objectDetails.custom ? "Custom Object" : "Standard Object"}
                  </Badge>
                </div>

                <Tabs defaultValue="fields">
                  <TabsList>
                    <TabsTrigger value="fields">Fields</TabsTrigger>
                    <TabsTrigger value="details">Object Details</TabsTrigger>
                    <TabsTrigger value="query">Sample Query</TabsTrigger>
                  </TabsList>

                  <TabsContent value="fields" className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-md">
                      <div className="flex items-center gap-2 text-blue-800 font-medium">
                        <Info className="h-4 w-4" />
                        Fields that could store customer data
                      </div>
                    </div>

                    <div className="border rounded-md divide-y">
                      {objectDetails.fields
                        .filter(
                          (field: any) =>
                            field.name.toLowerCase().includes("name") ||
                            field.name.toLowerCase().includes("email") ||
                            field.name.toLowerCase().includes("phone") ||
                            field.name.toLowerCase().includes("amount") ||
                            field.name.toLowerCase().includes("date") ||
                            field.name.toLowerCase().includes("reason") ||
                            field.name.toLowerCase().includes("notes") ||
                            field.name.toLowerCase().includes("description") ||
                            field.name.toLowerCase().includes("address") ||
                            field.name.toLowerCase().includes("customer") ||
                            field.name.toLowerCase().includes("contact"),
                        )
                        .map((field: any) => (
                          <div key={field.name} className="p-3 flex items-center justify-between">
                            <div>
                              <div className="font-medium">{field.label}</div>
                              <div className="text-sm text-muted-foreground">
                                API Name: <code>{field.name}</code> ({field.type})
                              </div>
                            </div>
                            <Badge variant="outline">{field.custom ? "Custom" : "Standard"}</Badge>
                          </div>
                        ))}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {objectDetails.fields.length} total fields available
                    </div>
                  </TabsContent>

                  <TabsContent value="details">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">API Name</Label>
                          <div className="font-mono">{objectDetails.name}</div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Label</Label>
                          <div>{objectDetails.label}</div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Queryable</Label>
                          <div className="flex items-center">
                            {objectDetails.queryable ? (
                              <Check className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                              <X className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            {objectDetails.queryable ? "Yes" : "No"}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Searchable</Label>
                          <div className="flex items-center">
                            {objectDetails.searchable ? (
                              <Check className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                              <X className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            {objectDetails.searchable ? "Yes" : "No"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="query">
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                        {`SELECT Id, Name, ${objectDetails.fields
                          .filter(
                            (field: any) =>
                              field.name !== "Id" &&
                              field.name !== "Name" &&
                              (field.name.toLowerCase().includes("email") ||
                                field.name.toLowerCase().includes("phone") ||
                                field.name.toLowerCase().includes("amount") ||
                                field.name.toLowerCase().includes("date")),
                          )
                          .slice(0, 5)
                          .map((field: any) => field.name)
                          .join(", ")}, CreatedDate, LastModifiedDate
FROM ${objectDetails.name}
ORDER BY LastModifiedDate DESC
LIMIT 100`}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={() => {
                            const fieldsToQuery = [
                              "Id",
                              "Name",
                              ...objectDetails.fields
                                .filter(
                                  (field: any) =>
                                    field.name !== "Id" &&
                                    field.name !== "Name" &&
                                    (field.name.toLowerCase().includes("email") ||
                                      field.name.toLowerCase().includes("phone") ||
                                      field.name.toLowerCase().includes("amount") ||
                                      field.name.toLowerCase().includes("date")),
                                )
                                .slice(0, 5)
                                .map((field: any) => field.name),
                              "CreatedDate",
                              "LastModifiedDate",
                            ].join(", ")

                            setCustomObject(objectDetails.name)
                            window.location.href = `/customers?object=${objectDetails.name}&fields=${fieldsToQuery}`
                          }}
                        >
                          <Database className="h-4 w-4 mr-2" />
                          Query This Object
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center flex-col">
                <Database className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select an object to view its details</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
