// This service would connect to a backend API that uses PaddleOCR
// In a real implementation, the backend would use the Python PaddleOCR library

export interface ExtractedAttributes {
  [key: string]: string
}

export interface OCRResult {
  productName: string
  sku: string
  rawText: string // Full raw text extracted from the image
  attributes: ExtractedAttributes
}

// Mock attribute mappings similar to the Python script
const ATTRIBUTE_MAPPING: Record<string, string> = {
  "Product name": "Productname__c",
  Model: "Model__c",
  Colour: "Colour__c",
  Motortype: "Motortype__c",
  Frequency: "Frequency__c",
  Grossweight: "Grossweight__c",
  Ratio: "Ratio__c",
  MotorFrame: "Motorframe__c",
  Speed: "Speed__c",
  Quantity: "Quantity__c",
  Voltage: "Voltage__c",
  Material: "Material__c",
  Type: "Type__c",
  Horsepower: "Horsepower__c",
  Stage: "Stage__c",
  Phase: "Phase__c",
  Size: "Size__c",
  MRP: "MRP__c",
  "H.P.": "H_p__c",
  Price: "Price__c",
  Brand: "Brand__c",
}

// Mock raw text extraction results
const MOCK_RAW_TEXT = {
  "fusion-motor": `
Product name: Fusion Motor 5HP
Model: FM-5HP-001
Brand: Fusion
H.P.: 5
Phase: Three Phase
Voltage: 440V
Price: 12500
Stage: 3
Quantity: 10
Warranty: 2 years
Manufacturer: Fusion Electric Motors Ltd.
Customer Care: 1800-123-4567
`,
  mcb: `
Product name: MCB 32A Single Pole
Model: MCB-32A-SP
Brand: Schneider
Phase: Single Phase
Voltage: 220V
Price: 520
Stage: 2
Quantity: 25
`,
  "led-panel": `
Product name: LED Panel Light 40W
Model: LED-40W-PNL
Brand: Philips
Phase: Single Phase
Voltage: 220V
Price: 1450
Stage: 1
Quantity: 8
Warranty: 3 years
`,
}

/**
 * Extract attributes from raw text using regex patterns
 * This simulates how the Python script extracts attributes
 */
function extractAttributesFromText(text: string): ExtractedAttributes {
  const attributes: ExtractedAttributes = {}

  // Extract key-value pairs using regex
  const lines = text.split("\n")
  for (const line of lines) {
    // Match patterns like "Key: Value" or "Key - Value"
    const match = line.match(/([^:]+)[:]\s*(.+)/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      attributes[key] = value
    }
  }

  return attributes
}

/**
 * Process an image using OCR to extract product information
 * In a real implementation, this would call a backend API with PaddleOCR
 */
export async function processImageWithOCR(imageFile: File): Promise<OCRResult> {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      try {
        // In a real implementation, we would send the image to a backend API with PaddleOCR
        // For now, we'll just return a mock result

        // Choose a random mock text sample
        const mockKeys = Object.keys(MOCK_RAW_TEXT)
        const randomKey = mockKeys[Math.floor(Math.random() * mockKeys.length)]
        const rawText = MOCK_RAW_TEXT[randomKey as keyof typeof MOCK_RAW_TEXT]

        // Extract attributes from the raw text
        const attributes = extractAttributesFromText(rawText)

        // Create the result object
        const result: OCRResult = {
          productName: attributes["Product name"] || "Unknown Product",
          sku: attributes["Model"] || "Unknown SKU",
          rawText: rawText,
          attributes: attributes,
        }

        resolve(result)
      } catch (error) {
        reject(new Error("Failed to process image with PaddleOCR"))
      }
    }, 2000)
  })
}

/**
 * Map extracted attributes to Salesforce field names
 */
export function mapToSalesforceFields(attributes: ExtractedAttributes): Record<string, string> {
  const salesforceFields: Record<string, string> = {}

  for (const [key, value] of Object.entries(attributes)) {
    if (ATTRIBUTE_MAPPING[key]) {
      salesforceFields[ATTRIBUTE_MAPPING[key]] = value
    }
  }

  return salesforceFields
}

/**
 * Send extracted data to Salesforce
 * In a real implementation, this would call a backend API
 */
export async function sendToSalesforce(
  mode: string,
  entryType: string,
  quantity: number,
  attributes: ExtractedAttributes,
): Promise<string> {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // In a real implementation, we would send the data to a backend API
      resolve(
        `Successfully ${mode === "in" ? "added" : "removed"} ${quantity} units of ${attributes["Product name"] || "product"}`,
      )
    }, 1000)
  })
}
