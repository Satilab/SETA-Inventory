"use client"

import { useState, useEffect } from "react"

export interface ChurnCustomer {
  Id: string
  Name: string
  Phone__c?: string
  Email__c?: string
  Last_Order_Date__c?: string
  Churn_Risk_Score__c?: number
  Churn_Reason__c?: string
  Days_Inactive__c?: number
  Last_Interaction_Date__c?: string
  Recommended_Action__c?: string
}

export function useChurnCustomers() {
  const [data, setData] = useState<ChurnCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const getDemoData = (): ChurnCustomer[] => [
    {
      Id: "demo-1",
      Name: "Rajesh Electronics",
      Phone__c: "9876543210",
      Email__c: "rajesh@example.com",
      Last_Order_Date__c: "2023-12-15",
      Churn_Risk_Score__c: 85,
      Churn_Reason__c: "Competitor pricing",
      Days_Inactive__c: 45,
      Last_Interaction_Date__c: "2023-12-15",
      Recommended_Action__c: "Offer discount on next purchase",
    },
    {
      Id: "demo-2",
      Name: "Venkata Electrical",
      Phone__c: "8765432109",
      Email__c: "venkata@example.com",
      Last_Order_Date__c: "2024-01-05",
      Churn_Risk_Score__c: 72,
      Churn_Reason__c: "Service issues",
      Days_Inactive__c: 30,
      Last_Interaction_Date__c: "2024-01-05",
      Recommended_Action__c: "Follow up call by manager",
    },
    {
      Id: "demo-3",
      Name: "Suresh Traders",
      Phone__c: "7654321098",
      Email__c: "suresh@example.com",
      Last_Order_Date__c: "2024-02-10",
      Churn_Risk_Score__c: 65,
      Churn_Reason__c: "Product availability",
      Days_Inactive__c: 25,
      Last_Interaction_Date__c: "2024-02-10",
      Recommended_Action__c: "Send product catalog",
    },
    {
      Id: "demo-4",
      Name: "Krishna Electricals",
      Phone__c: "6543210987",
      Email__c: "krishna@example.com",
      Last_Order_Date__c: "2024-03-01",
      Churn_Risk_Score__c: 58,
      Churn_Reason__c: "Payment terms",
      Days_Inactive__c: 20,
      Last_Interaction_Date__c: "2024-03-01",
      Recommended_Action__c: "Offer extended payment terms",
    },
    {
      Id: "demo-5",
      Name: "Lakshmi Enterprises",
      Phone__c: "5432109876",
      Email__c: "lakshmi@example.com",
      Last_Order_Date__c: "2024-03-15",
      Churn_Risk_Score__c: 45,
      Churn_Reason__c: "Delivery delays",
      Days_Inactive__c: 15,
      Last_Interaction_Date__c: "2024-03-15",
      Recommended_Action__c: "Priority shipping on next order",
    },
  ]

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching churn customers using dedicated API...")

      // Use the new dedicated churn customers API endpoint
      const response = await fetch("/api/salesforce/query-churn", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Churn customers API response status:", response.status)

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const result = await response.json()
      console.log("Churn customers API response data:", result)

      // Set the data from the response
      setData(result.records || getDemoData())
      setIsDemoMode(result.usingDemoMode || false)

      if (result.salesforceError) {
        setError(result.salesforceError)
      }

      console.log("Churn customers loaded:", {
        count: result.records?.length || 0,
        demoMode: result.usingDemoMode,
        message: result.message,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      console.error("Churn customers fetch error:", err)
      setError(errorMessage)

      // Always provide demo data as fallback
      setData(getDemoData())
      setIsDemoMode(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData, isDemoMode }
}
