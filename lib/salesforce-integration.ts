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

interface QueryResponse<T> {
  records: T[]
  totalSize: number
  done: boolean
  demoMode?: boolean
  error?: string
}

class SalesforceAPI {
  /**
   * Safely parse API response, handling both JSON and HTML responses
   */
  private async safeParseResponse(response: Response): Promise<any> {
    try {
      const text = await response.text()

      // Check if response is HTML (common when Salesforce returns error pages)
      if (
        text.trim().startsWith("<!DOCTYPE") ||
        text.trim().startsWith("<html") ||
        text.includes("<title>") ||
        text.includes("Invalid request") ||
        text.includes("Error")
      ) {
        console.log("Received HTML response instead of JSON:", text.substring(0, 200) + "...")

        // Try to extract error message from HTML
        let errorMessage = "Salesforce returned an error page"
        if (text.includes("Invalid request")) {
          errorMessage = "Invalid Salesforce request - check credentials and configuration"
        } else if (text.includes("Unauthorized")) {
          errorMessage = "Salesforce authentication failed - check credentials"
        } else if (text.includes("Not Found")) {
          errorMessage = "Salesforce endpoint not found - check instance URL"
        }

        return {
          success: false,
          error: errorMessage,
          demoMode: true,
          records: [],
          totalSize: 0,
          done: true,
        }
      }

      // Try to parse as JSON
      return JSON.parse(text)
    } catch (error) {
      console.error("Error parsing API response:", error)
      return {
        success: false,
        error: "Failed to parse API response",
        demoMode: true,
        records: [],
        totalSize: 0,
        done: true,
      }
    }
  }

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

      const result = await this.safeParseResponse(response)

      if (result.error || result.demoMode) {
        return {
          id: `demo-${Date.now()}`,
          success: true,
          error: result.error,
          demoMode: true,
        }
      }

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
      const result = await this.safeParseResponse(response)

      if (result.error || result.demoMode) {
        return {
          connected: false,
          error: result.error || "Connection test failed",
          demoMode: true,
        }
      }

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
      const result = await this.safeParseResponse(response)

      if (result.error || result.demoMode) {
        return {
          success: false,
          error: result.error || "Failed to describe object",
          demoMode: true,
        }
      }

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

      const result = await this.safeParseResponse(response)

      if (result.error || result.demoMode) {
        return {
          id: `demo-${Date.now()}`,
          success: true,
          error: result.error,
          demoMode: true,
        }
      }

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
   * Query any Salesforce object via API route
   */
  async queryObject<T>(objectName: string, soql: string): Promise<QueryResponse<T>> {
    try {
      const encodedSoql = encodeURIComponent(soql)
      const response = await fetch(`/api/salesforce/query?object=${objectName}&soql=${encodedSoql}`)

      const result = await this.safeParseResponse(response)

      if (result.error || result.demoMode) {
        console.log(`Query ${objectName} failed, using demo mode:`, result.error)
        return {
          records: [],
          totalSize: 0,
          done: true,
          demoMode: true,
          error: result.error,
        }
      }

      return result
    } catch (error) {
      console.error(`Query ${objectName} error:`, error)
      return {
        records: [],
        totalSize: 0,
        done: true,
        demoMode: true,
        error: error instanceof Error ? error.message : "Unknown error",
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
      const result = await this.safeParseResponse(response)

      if (result.error || result.demoMode) {
        return {
          configured: false,
          error: result.error || "Configuration check failed",
          demoMode: true,
        }
      }

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
export type { SalesforceProductData, CreateProductResponse, ConnectionTestResponse, QueryResponse }
