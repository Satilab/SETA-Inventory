"use client"

import { useState, useEffect } from "react"
import { salesforceAPI } from "@/lib/salesforce-client"
import type { Customer, Product, Order } from "@/lib/salesforce-client"

// Generic hook for Salesforce data fetching
export function useSalesforceQuery<T>(soql: string, dependencies: any[] = []) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await salesforceAPI.query<T>(soql)
      setData(response.records)
      setIsDemoMode(response.usingDemoMode || false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Salesforce query error:", err)
      setData([])
      setIsDemoMode(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  return { data, loading, error, refetch: () => fetchData(), isDemoMode }
}

// Customers hook
export function useCustomers() {
  const soql = `
    SELECT Id, Name, Phone__c, Email__c, WhatsApp__c, GSTIN__c, Type__c, 
           Address__c, Last_Order_Date__c, Total_Orders__c, Total_Value__c, 
           Active__c, Credit_Limit__c, Payment_Terms__c
    FROM Customer__c
    ORDER BY Name ASC
  `

  return useSalesforceQuery<Customer>(soql)
}

// Products hook
export function useProducts() {
  const soql = `
    SELECT Id, Name, SKU__c, Category__c, Brand__c, HSN_Code__c, Warranty__c,
           Unit__c, Base_Price__c, Sale_Price__c, Quantity__c, Reorder_Level__c,
           Location__c, Barcode__c
    FROM Product__c
    ORDER BY Name ASC
  `

  return useSalesforceQuery<Product>(soql)
}

// Low stock products hook
export function useLowStockProducts() {
  const soql = `
    SELECT Id, Name, SKU__c, Quantity__c, Reorder_Level__c
    FROM Product__c
    WHERE Quantity__c < Reorder_Level__c
    ORDER BY Quantity__c ASC
  `

  return useSalesforceQuery<Product>(soql)
}

// Recent orders hook
export function useRecentOrders(limit = 10) {
  const soql = `
    SELECT Id, Customer__c, Customer__r.Name, Order_Date__c, Total_Amount__c,
           Grand_Total__c, Status__c, Payment_Status__c, Order_Channel__c
    FROM Order__c
    ORDER BY Order_Date__c DESC
    LIMIT ${limit}
  `

  return useSalesforceQuery<Order>(soql)
}

// Dashboard metrics hook with fallback data
export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    activeCustomers: 0,
    lowStockItems: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        setError(null)

        // Test connection first
        const isConnected = await salesforceAPI.testConnection()
        const usingDemoMode = salesforceAPI.isDemoMode()
        setIsDemoMode(usingDemoMode)

        if (!isConnected || usingDemoMode) {
          // Use mock data if Salesforce is not available
          setMetrics({
            totalRevenue: 328000,
            activeOrders: 168,
            activeCustomers: 1247,
            lowStockItems: 12,
          })

          if (!isConnected) {
            setError("Using demo data - Salesforce connection not available")
          }
          return
        }

        // Fetch real metrics if connected
        const [revenueResult, ordersResult, customersResult, stockResult] = await Promise.all([
          salesforceAPI.query(`
            SELECT SUM(Grand_Total__c) revenue
            FROM Order__c
            WHERE Order_Date__c = THIS_MONTH
          `),
          salesforceAPI.query(`
            SELECT COUNT() total
            FROM Order__c
            WHERE Status__c != 'Completed'
          `),
          salesforceAPI.query(`
            SELECT COUNT() total
            FROM Customer__c
            WHERE Active__c = true
          `),
          salesforceAPI.query(`
            SELECT COUNT() total
            FROM Product__c
            WHERE Quantity__c < Reorder_Level__c
          `),
        ])

        setMetrics({
          totalRevenue: revenueResult.records[0]?.revenue || 0,
          activeOrders: ordersResult.totalSize,
          activeCustomers: customersResult.totalSize,
          lowStockItems: stockResult.totalSize,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch metrics")
        console.error("Dashboard metrics error:", err)
        // Fallback to demo data
        setMetrics({
          totalRevenue: 328000,
          activeOrders: 168,
          activeCustomers: 1247,
          lowStockItems: 12,
        })
        setIsDemoMode(true)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  return { metrics, loading, error, isDemoMode }
}

// Mutation hooks for creating/updating data
export function useCreateCustomer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(salesforceAPI.isDemoMode())

  const createCustomer = async (customerData: Omit<Customer, "Id">) => {
    try {
      setLoading(true)
      setError(null)
      const result = await salesforceAPI.create("Customer__c", customerData)
      setIsDemoMode(salesforceAPI.isDemoMode())
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create customer")
      setIsDemoMode(true)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createCustomer, loading, error, isDemoMode }
}

export function useCreateProduct() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(salesforceAPI.isDemoMode())

  const createProduct = async (productData: Omit<Product, "Id">) => {
    try {
      setLoading(true)
      setError(null)
      const result = await salesforceAPI.create("Product__c", productData)
      setIsDemoMode(salesforceAPI.isDemoMode())
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product")
      setIsDemoMode(true)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createProduct, loading, error, isDemoMode }
}
