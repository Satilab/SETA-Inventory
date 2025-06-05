"use client"

import { useState, useEffect } from "react"
import {
  DEMO_CUSTOMERS,
  DEMO_PRODUCTS,
  getDashboardMetrics,
  getLowStockProducts,
  getRecentOrders,
  type Customer,
  type Product,
  type Order,
} from "@/lib/demo-data"

// Generic hook for demo data
export function useDemoData<T>(data: T[], delay = 500) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(data)
      setLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [data, delay])

  const addItem = (item: T) => {
    setItems((prev) => [...prev, item])
  }

  const updateItem = (index: number, item: T) => {
    setItems((prev) => prev.map((existing, i) => (i === index ? item : existing)))
  }

  const deleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  return {
    data: items,
    loading,
    error,
    refetch: () => {
      setLoading(true)
      setTimeout(() => {
        setItems(data)
        setLoading(false)
      }, delay)
    },
    addItem,
    updateItem,
    deleteItem,
  }
}

// Customers hook
export function useCustomers() {
  return useDemoData<Customer>(DEMO_CUSTOMERS)
}

// Products hook
export function useProducts() {
  return useDemoData<Product>(DEMO_PRODUCTS)
}

// Low stock products hook
export function useLowStockProducts() {
  return useDemoData<Product>(getLowStockProducts())
}

// Recent orders hook
export function useRecentOrders(limit = 10) {
  return useDemoData<Order>(getRecentOrders(limit))
}

// Dashboard metrics hook
export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    activeCustomers: 0,
    lowStockItems: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMetrics(getDashboardMetrics())
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return { metrics, loading, error }
}

// Create customer hook
export function useCreateCustomer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCustomer = async (customerData: Omit<Customer, "id">) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newCustomer: Customer = {
        ...customerData,
        id: `cust${Date.now()}`,
      }

      // In a real app, this would be saved to a database
      DEMO_CUSTOMERS.push(newCustomer)

      return { id: newCustomer.id, success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create customer")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createCustomer, loading, error }
}

// Create product hook
export function useCreateProduct() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProduct = async (productData: Omit<Product, "id">) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newProduct: Product = {
        ...productData,
        id: `prod${Date.now()}`,
      }

      // In a real app, this would be saved to a database
      DEMO_PRODUCTS.push(newProduct)

      return { id: newProduct.id, success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createProduct, loading, error }
}
