"use client"

import { useState, useEffect } from "react"

export interface InventoryItem {
  Id: string
  Productname__c: string
  Model__c: string
  H_p__c?: number
  Phase__c?: string
  stage__c: number
  Price__c: number
  Quantity__c: number
}

export function useInventoryManagement() {
  const [data, setData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching inventory management data...")

      const response = await fetch("/api/salesforce/query-inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Inventory management response:", result)

      setData(result.records || [])
      setIsDemoMode(result.isDemoMode || false)

      if (result.error) {
        setError(result.error)
      }
    } catch (err) {
      console.error("Error fetching inventory management data:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      setData([])
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
