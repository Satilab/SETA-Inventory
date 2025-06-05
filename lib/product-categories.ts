// Product category definitions with dynamic fields and Salesforce mapping
export interface ProductField {
  name: string
  label: string
  type: "text" | "number" | "select"
  required: boolean
  options?: string[]
  placeholder?: string
  salesforceField?: string // Map to actual Salesforce field
}

export interface ProductCategory {
  name: string
  fields: ProductField[]
  salesforceObject?: string // Target Salesforce object
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    name: "Motors",
    salesforceObject: "VENKATA_RAMANA_MOTORS__c",
    fields: [
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        placeholder: "Enter motor name",
        salesforceField: "Productname__c",
      },
      {
        name: "model",
        label: "Model",
        type: "text",
        required: true,
        placeholder: "Enter model number",
        salesforceField: "Model__c",
      },
      {
        name: "hp",
        label: "H.P",
        type: "number",
        required: true,
        placeholder: "Enter horsepower",
        salesforceField: "H_p__c",
      },
      {
        name: "phase",
        label: "Phase",
        type: "select",
        required: true,
        options: ["Single", "Three"],
        salesforceField: "Phase__c",
      },
      {
        name: "stage",
        label: "Stage",
        type: "select",
        required: true,
        options: ["1", "2", "3"],
        salesforceField: "stage__c",
      },
      {
        name: "price",
        label: "Price",
        type: "number",
        required: true,
        placeholder: "Enter price",
        salesforceField: "Price__c",
      },
      {
        name: "quantity",
        label: "Quantity",
        type: "number",
        required: false,
        placeholder: "Enter quantity",
        salesforceField: "Quantity__c",
      },
    ],
  },
  {
    name: "Circuit Breakers",
    salesforceObject: "VENKATA_RAMANA_MOTORS__c",
    fields: [
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        placeholder: "Enter breaker name",
        salesforceField: "Productname__c",
      },
      {
        name: "model",
        label: "Model",
        type: "text",
        required: true,
        placeholder: "Enter model number",
        salesforceField: "Model__c",
      },
      {
        name: "phase",
        label: "Phase",
        type: "select",
        required: true,
        options: ["Single", "Three"],
        salesforceField: "Phase__c",
      },
      {
        name: "stage",
        label: "Stage",
        type: "select",
        required: true,
        options: ["1", "2", "3"],
        salesforceField: "stage__c",
      },
      {
        name: "price",
        label: "Price",
        type: "number",
        required: true,
        placeholder: "Enter price",
        salesforceField: "Price__c",
      },
      {
        name: "quantity",
        label: "Quantity",
        type: "number",
        required: false,
        placeholder: "Enter quantity",
        salesforceField: "Quantity__c",
      },
    ],
  },
  {
    name: "Lighting",
    salesforceObject: "VENKATA_RAMANA_MOTORS__c",
    fields: [
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        placeholder: "Enter light name",
        salesforceField: "Productname__c",
      },
      {
        name: "model",
        label: "Model",
        type: "text",
        required: true,
        placeholder: "Enter model number",
        salesforceField: "Model__c",
      },
      {
        name: "phase",
        label: "Phase",
        type: "select",
        required: true,
        options: ["Single", "Three"],
        salesforceField: "Phase__c",
      },
      {
        name: "stage",
        label: "Stage",
        type: "select",
        required: true,
        options: ["1", "2", "3"],
        salesforceField: "stage__c",
      },
      {
        name: "price",
        label: "Price",
        type: "number",
        required: true,
        placeholder: "Enter price",
        salesforceField: "Price__c",
      },
      {
        name: "quantity",
        label: "Quantity",
        type: "number",
        required: false,
        placeholder: "Enter quantity",
        salesforceField: "Quantity__c",
      },
    ],
  },
  {
    name: "Cables",
    salesforceObject: "VENKATA_RAMANA_MOTORS__c",
    fields: [
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        placeholder: "Enter cable name",
        salesforceField: "Productname__c",
      },
      {
        name: "model",
        label: "Model",
        type: "text",
        required: true,
        placeholder: "Enter model number",
        salesforceField: "Model__c",
      },
      {
        name: "phase",
        label: "Phase",
        type: "select",
        required: true,
        options: ["Single", "Three"],
        salesforceField: "Phase__c",
      },
      {
        name: "stage",
        label: "Stage",
        type: "select",
        required: true,
        options: ["1", "2", "3"],
        salesforceField: "stage__c",
      },
      {
        name: "price",
        label: "Price",
        type: "number",
        required: true,
        placeholder: "Enter price",
        salesforceField: "Price__c",
      },
      {
        name: "quantity",
        label: "Quantity",
        type: "number",
        required: false,
        placeholder: "Enter quantity",
        salesforceField: "Quantity__c",
      },
    ],
  },
  {
    name: "Switches",
    salesforceObject: "VENKATA_RAMANA_MOTORS__c",
    fields: [
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        placeholder: "Enter switch name",
        salesforceField: "Productname__c",
      },
      {
        name: "model",
        label: "Model",
        type: "text",
        required: true,
        placeholder: "Enter model number",
        salesforceField: "Model__c",
      },
      {
        name: "phase",
        label: "Phase",
        type: "select",
        required: true,
        options: ["Single", "Three"],
        salesforceField: "Phase__c",
      },
      {
        name: "stage",
        label: "Stage",
        type: "select",
        required: true,
        options: ["1", "2", "3"],
        salesforceField: "stage__c",
      },
      {
        name: "price",
        label: "Price",
        type: "number",
        required: true,
        placeholder: "Enter price",
        salesforceField: "Price__c",
      },
      {
        name: "quantity",
        label: "Quantity",
        type: "number",
        required: false,
        placeholder: "Enter quantity",
        salesforceField: "Quantity__c",
      },
    ],
  },
  {
    name: "Panels",
    salesforceObject: "VENKATA_RAMANA_MOTORS__c",
    fields: [
      {
        name: "productName",
        label: "Product Name",
        type: "text",
        required: true,
        placeholder: "Enter panel name",
        salesforceField: "Productname__c",
      },
      {
        name: "model",
        label: "Model",
        type: "text",
        required: true,
        placeholder: "Enter model number",
        salesforceField: "Model__c",
      },
      {
        name: "phase",
        label: "Phase",
        type: "select",
        required: true,
        options: ["Single", "Three"],
        salesforceField: "Phase__c",
      },
      {
        name: "stage",
        label: "Stage",
        type: "select",
        required: true,
        options: ["1", "2", "3"],
        salesforceField: "stage__c",
      },
      {
        name: "price",
        label: "Price",
        type: "number",
        required: true,
        placeholder: "Enter price",
        salesforceField: "Price__c",
      },
      {
        name: "quantity",
        label: "Quantity",
        type: "number",
        required: false,
        placeholder: "Enter quantity",
        salesforceField: "Quantity__c",
      },
    ],
  },
]

export function getCategoryByName(categoryName: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((category) => category.name === categoryName)
}

export function getCategoryNames(): string[] {
  return PRODUCT_CATEGORIES.map((category) => category.name)
}
