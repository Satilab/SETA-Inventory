// Client-side Salesforce integration that uses API routes
interface SalesforceProductData {
  Productname__c: string
  Model__c: string
  Phase__c?: string
  Stage__c?: number
  Voltage__c?: string
  Frequency__c?: string
  Price__c?: number
  Quantity__c?: number
  H_p__c?: number
  Category__c?: string
}

interface CreateProductResponse {
  id: string
  success: boolean
  error?: string
  salesforceError?: string
  demoMode?: boolean
}

interface ConnectionTestResponse {
  connected: boolean
  error?: string
  details?: any
  demoMode?: boolean
}

class SalesforceAPI {
  /**
   * Create a product record in Salesforce via API route
   */
  async createProduct(productData: any, category = ""): Promise<CreateProductResponse> {
    try {
      const response = await fetch("/api/salesforce/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productData, category }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Salesforce API call error:", error)
      return {
        id: `demo-${Date.now()}`,
        success: true,
        error: error instanceof Error ? error.message : "Unknown error",
        demoMode: true,
      }
    }
  }

  /**
   * Test Salesforce connection via API route
   */
  async testConnection(): Promise<ConnectionTestResponse> {
    try {
      const response = await fetch("/api/test-connection")

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Connection test error:", error)
      return {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
        demoMode: true,
      }
    }
  }

  /**
   * Get Salesforce object description via API route
   */
  async describeObject(objectName = "VENKATA_RAMANA_MOTORS__c") {
    try {
      const response = await fetch(`/api/salesforce/describe-object?object=${objectName}`)

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Describe object error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        demoMode: true,
      }
    }
  }

  /**
   * Update stock and create Salesforce record via API route
   */
  async updateStock(attributes: any, category = ""): Promise<CreateProductResponse> {
    try {
      const response = await fetch("/api/stock-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ attributes, category }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Stock update error:", error)
      return {
        id: `demo-${Date.now()}`,
        success: true,
        error: error instanceof Error ? error.message : "Unknown error",
        demoMode: true,
      }
    }
  }

  /**
   * Check if we're in demo mode (client-side detection)
   */
  isDemoMode(): boolean {
    // Check if we're on localhost or development environment
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      return (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.endsWith(".local")
      )
    }
    return true
  }

  /**
   * Get configuration status via API route
   */
  async getConfigurationStatus() {
    try {
      const response = await fetch("/api/debug/salesforce")

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Configuration status error:", error)
      return {
        configured: false,
        error: error instanceof Error ? error.message : "Unknown error",
        demoMode: true,
      }
    }
  }
}

// Export singleton instance
export const salesforceAPI = new SalesforceAPI()

// Export types for use in components
export type { SalesforceProductData, CreateProductResponse, ConnectionTestResponse }
