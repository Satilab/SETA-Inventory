"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Database } from "lucide-react"
import { getFieldMappingInfo } from "@/lib/stock-update-service"

export function FieldMappingDisplay() {
  const fieldMappings = getFieldMappingInfo()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Salesforce Field Mapping
        </CardTitle>
        <CardDescription>Fields that will be mapped to VENKATA_RAMANA_MOTORS__c object</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fieldMappings.map((mapping) => (
            <div key={mapping.attributeName} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                {mapping.exists ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <div>
                  <p className="font-medium">{mapping.attributeName}</p>
                  <p className="text-sm text-muted-foreground font-mono">{mapping.salesforceField}</p>
                </div>
              </div>
              <Badge variant={mapping.exists ? "default" : "secondary"}>{mapping.exists ? "Mapped" : "Skipped"}</Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-1">Mapping Rules:</p>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• Only fields that exist in your Salesforce object will be mapped</li>
            <li>• Numeric fields (Price, Quantity, H.P., Stage) are converted to numbers</li>
            <li>• Text fields are converted to strings</li>
            <li>• Missing required fields (Product name, Model) are auto-filled</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
