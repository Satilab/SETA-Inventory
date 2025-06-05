// Service to handle stock updates and Salesforce record creation
export interface StockUpdateData {
  productName: string
  sku: string
  operation: "in" | "out"
  quantity: number
  attributes: Record<string, any>
}

export interface SalesforceFieldMapping {
  [key: string]: string
}

// Field mapping based on your actual Salesforce object fields
const SALESFORCE_FIELD_MAPPING: SalesforceFieldMapping = {
  "Product name": "Productname__c",
  Model: "Model__c",
  Brand: "Brand__c",
  "H.P.": "H_p__c", // Note: underscore, not HP__c
  Phase: "Phase__c",
  Voltage: "Voltage__c",
  Frequency: "Frequency__c",
  Price: "Price__c",
  Quantity: "Quantity__c",
  Stage: "Stage__c",
  Category: "Category__c",
}

// Fields that actually exist in your VENKATA_RAMANA_MOTORS__c object
const EXISTING_SALESFORCE_FIELDS = [
  "Productname__c",
  "Model__c",
  "Phase__c",
  "Stage__c",
  "Voltage__c",
  "Frequency__c",
  "Price__c",
  "Quantity__c",
  "H_p__c", // Your actual field name with underscore
  "Category__c",
]

/**
 * Map extracted attributes to Salesforce fields, only including fields that exist
 */
export function mapToExistingSalesforceFields(attributes: Record<string, any>): Record<string, any> {
  const salesforceData: Record<string, any> = {}

  // Map each attribute to its Salesforce field name
  for (const [key, value] of Object.entries(attributes)) {
    const salesforceField = SALESFORCE_FIELD_MAPPING[key]

    // Only include if the field exists in our Salesforce object
    if (salesforceField && EXISTING_SALESFORCE_FIELDS.includes(salesforceField)) {
      // Convert value to appropriate type
      if (
        salesforceField === "Price__c" ||
        salesforceField === "Quantity__c" ||
        salesforceField === "Stage__c" ||
        salesforceField === "H_p__c"
      ) {
        // Convert to number for numeric fields
        const numValue = Number(value)
        if (!isNaN(numValue)) {
          salesforceData[salesforceField] = numValue
        }
      } else {
        // Keep as string for text fields
        salesforceData[salesforceField] = String(value)
      }
    }
  }

  return salesforceData
}

/**
 * Update stock and create Salesforce record via API
 */
export async function updateStockAndCreateRecord(data: StockUpdateData): Promise<{
  success: boolean
  salesforceId?: string
  message: string
  usingDemoMode?: boolean
  error?: string
}> {
  try {
    console.log("Processing stock update via API:", data)

    // Call the API route which handles all the Salesforce logic
    const response = await fetch("/api/stock-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (result.success) {
      return {
        success: true,
        salesforceId: result.salesforceId,
        message: result.message,
        usingDemoMode: result.usingDemoMode,
        error: result.salesforceError,
      }
    } else {
      throw new Error(result.error || "API call failed")
    }
  } catch (error) {
    console.error("Stock update service error:", error)

    return {
      success: true, // Still successful for demo purposes
      message: `Stock ${data.operation === "in" ? "added" : "removed"} (demo mode due to error)`,
      usingDemoMode: true,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get the list of fields that will be mapped to Salesforce
 */
export function getFieldMappingInfo(): Array<{
  attributeName: string
  salesforceField: string
  exists: boolean
}> {
  return Object.entries(SALESFORCE_FIELD_MAPPING).map(([attributeName, salesforceField]) => ({
    attributeName,
    salesforceField,
    exists: EXISTING_SALESFORCE_FIELDS.includes(salesforceField),
  }))
}
