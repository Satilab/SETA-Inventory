"use client"

import { SalesforceObjectExplorer } from "@/components/salesforce-object-explorer"

export default function SalesforceObjectsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Salesforce Object Explorer</h1>
        <p className="text-muted-foreground">
          Explore your Salesforce objects to find where your customer data is stored
        </p>
      </div>

      <SalesforceObjectExplorer />
    </div>
  )
}
