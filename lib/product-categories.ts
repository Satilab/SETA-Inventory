// Product category definitions with dynamic fields
export interface ProductField {
  name: string
  label: string
  type: "text" | "number" | "select"
  required: boolean
  options?: string[]
  placeholder?: string
}

export interface ProductCategory {
  name: string
  fields: ProductField[]
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    name: "Motors",
    fields: [
      { name: "productName", label: "Product Name", type: "text", required: true, placeholder: "Enter motor name" },
      { name: "model", label: "Model", type: "text", required: true, placeholder: "Enter model number" },
      { name: "hp", label: "H.P", type: "number", required: true, placeholder: "Enter horsepower" },
      { name: "phase", label: "Phase", type: "select", required: true, options: ["Single Phase", "Three Phase"] },
      { name: "stage", label: "Stage", type: "number", required: true, placeholder: "Enter stage" },
      { name: "voltage", label: "Voltage", type: "select", required: true, options: ["110V", "220V", "440V", "480V"] },
      { name: "price", label: "Price", type: "number", required: true, placeholder: "Enter price" },
      { name: "quantity", label: "Quantity", type: "number", required: true, placeholder: "Enter quantity" },
    ],
  },
  {
    name: "Circuit Breakers",
    fields: [
      { name: "productName", label: "Product Name", type: "text", required: true, placeholder: "Enter breaker name" },
      { name: "model", label: "Model", type: "text", required: true, placeholder: "Enter model number" },
      { name: "frequency", label: "Frequency", type: "select", required: true, options: ["50Hz", "60Hz"] },
      { name: "voltage", label: "Voltage", type: "select", required: true, options: ["110V", "220V", "440V", "480V"] },
      { name: "phase", label: "Phase", type: "select", required: true, options: ["Single Phase", "Three Phase"] },
      { name: "price", label: "Price", type: "number", required: true, placeholder: "Enter price" },
      { name: "quantity", label: "Quantity", type: "number", required: true, placeholder: "Enter quantity" },
    ],
  },
  {
    name: "Lighting",
    fields: [
      { name: "productName", label: "Product Name", type: "text", required: true, placeholder: "Enter light name" },
      { name: "model", label: "Model", type: "text", required: true, placeholder: "Enter model number" },
      { name: "voltage", label: "Voltage", type: "select", required: true, options: ["12V", "24V", "110V", "220V"] },
      { name: "phase", label: "Phase", type: "select", required: true, options: ["Single Phase", "Three Phase"] },
      { name: "price", label: "Price", type: "number", required: true, placeholder: "Enter price" },
      { name: "quantity", label: "Quantity", type: "number", required: true, placeholder: "Enter quantity" },
    ],
  },
  {
    name: "Cables",
    fields: [
      { name: "productName", label: "Product Name", type: "text", required: true, placeholder: "Enter cable name" },
      { name: "model", label: "Model", type: "text", required: true, placeholder: "Enter model number" },
      { name: "voltage", label: "Voltage", type: "select", required: true, options: ["110V", "220V", "440V", "1000V"] },
      { name: "phase", label: "Phase", type: "select", required: true, options: ["Single Phase", "Three Phase"] },
      { name: "price", label: "Price", type: "number", required: true, placeholder: "Enter price" },
      { name: "quantity", label: "Quantity", type: "number", required: true, placeholder: "Enter quantity" },
    ],
  },
  {
    name: "Switches",
    fields: [
      { name: "productName", label: "Product Name", type: "text", required: true, placeholder: "Enter switch name" },
      { name: "model", label: "Model", type: "text", required: true, placeholder: "Enter model number" },
      { name: "voltage", label: "Voltage", type: "select", required: true, options: ["110V", "220V", "440V"] },
      { name: "phase", label: "Phase", type: "select", required: true, options: ["Single Phase", "Three Phase"] },
      { name: "price", label: "Price", type: "number", required: true, placeholder: "Enter price" },
      { name: "quantity", label: "Quantity", type: "number", required: true, placeholder: "Enter quantity" },
    ],
  },
  {
    name: "Panels",
    fields: [
      { name: "productName", label: "Product Name", type: "text", required: true, placeholder: "Enter panel name" },
      { name: "model", label: "Model", type: "text", required: true, placeholder: "Enter model number" },
      { name: "voltage", label: "Voltage", type: "select", required: true, options: ["220V", "440V", "480V"] },
      { name: "phase", label: "Phase", type: "select", required: true, options: ["Single Phase", "Three Phase"] },
      { name: "frequency", label: "Frequency", type: "select", required: true, options: ["50Hz", "60Hz"] },
      { name: "price", label: "Price", type: "number", required: true, placeholder: "Enter price" },
      { name: "quantity", label: "Quantity", type: "number", required: true, placeholder: "Enter quantity" },
    ],
  },
]

export function getCategoryByName(categoryName: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((category) => category.name === categoryName)
}

export function getCategoryNames(): string[] {
  return PRODUCT_CATEGORIES.map((category) => category.name)
}
