"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export interface SalesforceCustomer {
  Id: string
  Name: string
  Customer_Email__c: string
  Phone_Number__c: string
  Quote_Date__c: string
  reason__c: string
  Total_amount__c: number
  CreatedDate?: string
  LastModifiedDate?: string
  SourceObject?: string
  OriginalRecord?: any
}

export function useSalesforceCustomers() {
  const [customers, setCustomers] = useState<SalesforceCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [salesforceInfo, setSalesforceInfo] = useState<any>(null)
  const { toast } = useToast()

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔍 Fetching customers from Salesforce API...")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch("/api/salesforce/query-customers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("Salesforce API response status:", response.status)

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("Salesforce API response:", data)

      if (data.success && data.records && data.records.length > 0) {
        // Successfully got Salesforce data
        setCustomers(data.records)
        setLastUpdated(data.lastUpdated || new Date().toISOString())
        setSalesforceInfo(data.salesforceInfo)
        setError(null)

        toast({
          title: "Salesforce Data Loaded",
          description: `Successfully loaded ${data.records.length} customers from ${data.salesforceInfo?.objectUsed || "Salesforce"}.`,
          variant: "default",
        })
      } else {
        // No Salesforce data available - show empty state
        setCustomers([])
        setError(data.salesforceError || data.message || "No customer records found")
        setSalesforceInfo(data.salesforceInfo)

        toast({
          title: "No Customer Data",
          description: data.message || "No customer records found in Salesforce.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error fetching Salesforce customers:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      setCustomers([]) // Clear any existing data
      setSalesforceInfo(null)

      toast({
        title: "Salesforce Connection Failed",
        description: `Could not connect to Salesforce: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchCustomers()

    // Set up auto-refresh every 2 minutes for Salesforce data
    const interval = setInterval(() => {
      console.log("🔄 Auto-refreshing Salesforce customer data...")
      fetchCustomers()
    }, 120000) // 2 minutes

    return () => clearInterval(interval)
  }, [])

  return {
    data: customers,
    loading,
    error,
    refetch: fetchCustomers,
    lastUpdated,
    salesforceInfo,
    hasData: customers.length > 0,
  }
}
