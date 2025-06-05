"use client"

import { useState, useEffect } from "react"

export interface ReorderAlert {
  Id: string
  Name: string
  H_p__c?: number
  Model__c: string
  stage__c: number
  Current_Stocks__c: number
}

export function useReorderAlerts() {
  const [data, setData] = useState<ReorderAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching reorder alerts...")

      const response = await fetch("/api/salesforce/query-reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Reorder alerts response:", result)

      setData(result.records || [])
      setIsDemoMode(result.isDemoMode || false)

      if (result.error) {
        setError(result.error)
      }
    } catch (err) {
      console.error("Error fetching reorder alerts:", err)
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
