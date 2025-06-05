"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Eye } from "lucide-react"
import { mapToExistingSalesforceFields } from "@/lib/stock-update-service"

interface SalesforcePreviewProps {
  attributes: Record<string, any>
  operation: "in" | "out"
  quantity: number
}

export function SalesforcePreview({ attributes, operation, quantity }: SalesforcePreviewProps) {
  const mappedData = mapToExistingSalesforceFields(attributes)

  // Add operation-specific quantity
  const finalData = {
    ...mappedData,
    Quantity__c: operation === "in" ? quantity : -quantity,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Salesforce Record Preview
        </CardTitle>
        <CardDescription>Data that will be sent to VENKATA_RAMANA_MOTORS__c object</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(finalData).map(([field, value]) => (
            <div key={field} className="flex items-center justify-between p-2 rounded-lg border">
              <div className="flex items-center space-x-3">
                <Database className="h-4 w-4 text-blue-500" />
                <span className="font-mono text-sm">{field}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {typeof value === "number" ? "Number" : "String"}
                </Badge>
                <span className="text-sm font-medium">{String(value)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800 mb-1">
            Operation: Stock {operation === "in" ? "In (+)" : "Out (-)"}
          </p>
          <p className="text-sm text-green-600">
            Quantity field will be set to {operation === "in" ? "+" : "-"}
            {quantity} to track the operation type
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
