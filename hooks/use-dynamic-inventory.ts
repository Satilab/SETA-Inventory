"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { dynamicDataService, type DynamicInventoryItem } from "@/lib/dynamic-data-service"

export function useDynamicInventory() {
  const [inventory, setInventory] = useState<DynamicInventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchInventory = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Generating dynamic inventory data...")

      // Generate dynamic inventory data
      const dynamicInventory = dynamicDataService.generateDynamicInventory(100)
      setInventory(dynamicInventory)

      // Show alerts for critical stock levels
      const outOfStock = dynamicInventory.filter((item) => item.stockStatus === "out-of-stock").length
      const lowStock = dynamicInventory.filter((item) => item.stockStatus === "low-stock").length

      if (outOfStock > 0 || lowStock > 0) {
        toast({
          title: "Stock Alerts",
          description: `${outOfStock} items out of stock, ${lowStock} items low stock`,
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error generating dynamic inventory:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      setInventory([])

      toast({
        title: "Data Generation Error",
        description: `Could not generate inventory data: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()

    // Set up auto-refresh every 30 seconds for dynamic data
    const interval = setInterval(() => {
      console.log("Refreshing dynamic inventory data...")
      fetchInventory()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return {
    data: inventory,
    loading,
    error,
    refetch: fetchInventory,
  }
}
