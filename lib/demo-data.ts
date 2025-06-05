// Demo data for the SETA Smart Inventory app
export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  whatsapp?: string
  gstin?: string
  type: "Retail" | "Contractor" | "Bulk"
  address?: string
  lastOrderDate?: string
  totalOrders: number
  totalValue: number
  active: boolean
  creditLimit?: number
  paymentTerms?: string
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  brand: string
  hsnCode?: string
  warranty?: string
  unit: string
  basePrice: number
  salePrice: number
  quantity: number
  reorderLevel: number
  location?: string
  barcode?: string
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  orderDate: string
  totalAmount: number
  gstAmount: number
  grandTotal: number
  status: "Pending" | "Processing" | "Completed" | "Cancelled"
  paymentStatus: "Pending" | "Paid" | "Overdue"
  orderChannel: "WhatsApp" | "Phone" | "In-Person" | "Online"
  notes?: string
}

export const DEMO_CUSTOMERS: Customer[] = [
  {
    id: "cust1",
    name: "Rajesh Electrical Works",
    phone: "+91 9876543210",
    email: "info@rajeshelectrical.com",
    whatsapp: "+91 9876543210",
    gstin: "36ABCDE1234F1Z5",
    type: "Contractor",
    address: "123 Industrial Area, Secunderabad",
    lastOrderDate: "2024-01-25",
    totalOrders: 45,
    totalValue: 125000,
    active: true,
    creditLimit: 50000,
    paymentTerms: "30 days",
  },
  {
    id: "cust2",
    name: "Modern Electronics",
    phone: "+91 9876543211",
    email: "sales@modernelectronics.com",
    whatsapp: "+91 9876543211",
    gstin: "36FGHIJ5678K2L6",
    type: "Retail",
    address: "456 Market Street, Hyderabad",
    lastOrderDate: "2024-01-24",
    totalOrders: 28,
    totalValue: 85000,
    active: true,
    creditLimit: 30000,
    paymentTerms: "15 days",
  },
  {
    id: "cust3",
    name: "Power Solutions Ltd",
    phone: "+91 9876543212",
    email: "contact@powersolutions.com",
    whatsapp: "+91 9876543212",
    gstin: "36MNOPQ9012R3S7",
    type: "Bulk",
    address: "789 Tech Park, Gachibowli",
    lastOrderDate: "2024-01-23",
    totalOrders: 67,
    totalValue: 450000,
    active: true,
    creditLimit: 100000,
    paymentTerms: "45 days",
  },
  {
    id: "cust4",
    name: "City Electrical Store",
    phone: "+91 9876543213",
    email: "orders@cityelectrical.com",
    type: "Retail",
    address: "321 Main Road, Secunderabad",
    lastOrderDate: "2024-01-20",
    totalOrders: 15,
    totalValue: 35000,
    active: true,
    creditLimit: 20000,
    paymentTerms: "Cash",
  },
  {
    id: "cust5",
    name: "Industrial Supplies Co",
    phone: "+91 9876543214",
    email: "procurement@industrialsupplies.com",
    type: "Bulk",
    address: "654 Industrial Estate, Medchal",
    lastOrderDate: "2024-01-22",
    totalOrders: 89,
    totalValue: 680000,
    active: true,
    creditLimit: 150000,
    paymentTerms: "60 days",
  },
]

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "prod1",
    name: "MCB 32A Single Pole",
    sku: "MCB-32A-SP",
    category: "Circuit Breakers",
    brand: "Schneider",
    hsnCode: "85363000",
    warranty: "2 years",
    unit: "Piece",
    basePrice: 480,
    salePrice: 520,
    quantity: 25,
    reorderLevel: 15,
    location: "Rack A1",
    barcode: "1234567890123",
  },
  {
    id: "prod2",
    name: "LED Panel Light 40W",
    sku: "LED-40W-PNL",
    category: "Lighting",
    brand: "Philips",
    hsnCode: "94054000",
    warranty: "3 years",
    unit: "Piece",
    basePrice: 1350,
    salePrice: 1450,
    quantity: 8,
    reorderLevel: 15,
    location: "Rack B2",
    barcode: "2345678901234",
  },
  {
    id: "prod3",
    name: "Copper Cable 2.5mm²",
    sku: "CBL-CU-2.5",
    category: "Cables",
    brand: "Havells",
    hsnCode: "85444900",
    warranty: "1 year",
    unit: "Meter",
    basePrice: 45,
    salePrice: 52,
    quantity: 500,
    reorderLevel: 200,
    location: "Rack C1",
    barcode: "3456789012345",
  },
  {
    id: "prod4",
    name: "Distribution Panel 8-Way",
    sku: "DP-8WAY-MCB",
    category: "Panels",
    brand: "Legrand",
    hsnCode: "85371000",
    warranty: "5 years",
    unit: "Piece",
    basePrice: 2800,
    salePrice: 3200,
    quantity: 0,
    reorderLevel: 5,
    location: "Rack D1",
    barcode: "4567890123456",
  },
  {
    id: "prod5",
    name: "Modular Switch Socket",
    sku: "MOD-SW-SOC",
    category: "Switches",
    brand: "Anchor",
    hsnCode: "85366900",
    warranty: "2 years",
    unit: "Piece",
    basePrice: 180,
    salePrice: 220,
    quantity: 2,
    reorderLevel: 20,
    location: "Rack E1",
    barcode: "5678901234567",
  },
  {
    id: "prod6",
    name: "ELCB 63A Double Pole",
    sku: "ELCB-63A-DP",
    category: "Circuit Breakers",
    brand: "Siemens",
    hsnCode: "85363000",
    warranty: "3 years",
    unit: "Piece",
    basePrice: 2400,
    salePrice: 2800,
    quantity: 12,
    reorderLevel: 8,
    location: "Rack A2",
    barcode: "6789012345678",
  },
  {
    id: "prod7",
    name: "PVC Conduit Pipe 25mm",
    sku: "PVC-PIPE-25",
    category: "Cables",
    brand: "Finolex",
    hsnCode: "39172900",
    warranty: "10 years",
    unit: "Meter",
    basePrice: 35,
    salePrice: 42,
    quantity: 300,
    reorderLevel: 100,
    location: "Rack C2",
    barcode: "7890123456789",
  },
  {
    id: "prod8",
    name: "LED Tube Light 20W",
    sku: "LED-TUBE-20W",
    category: "Lighting",
    brand: "Bajaj",
    hsnCode: "94054000",
    warranty: "2 years",
    unit: "Piece",
    basePrice: 320,
    salePrice: 380,
    quantity: 45,
    reorderLevel: 25,
    location: "Rack B1",
    barcode: "8901234567890",
  },
]

export const DEMO_ORDERS: Order[] = [
  {
    id: "ord1",
    customerId: "cust1",
    customerName: "Rajesh Electrical Works",
    orderDate: "2024-01-25",
    totalAmount: 26000,
    gstAmount: 4680,
    grandTotal: 30680,
    status: "Pending",
    paymentStatus: "Pending",
    orderChannel: "WhatsApp",
    notes: "Urgent delivery required",
  },
  {
    id: "ord2",
    customerId: "cust2",
    customerName: "Modern Electronics",
    orderDate: "2024-01-24",
    totalAmount: 15600,
    gstAmount: 2808,
    grandTotal: 18408,
    status: "Processing",
    paymentStatus: "Paid",
    orderChannel: "Phone",
  },
  {
    id: "ord3",
    customerId: "cust3",
    customerName: "Power Solutions Ltd",
    orderDate: "2024-01-23",
    totalAmount: 45000,
    gstAmount: 8100,
    grandTotal: 53100,
    status: "Completed",
    paymentStatus: "Paid",
    orderChannel: "In-Person",
  },
  {
    id: "ord4",
    customerId: "cust4",
    customerName: "City Electrical Store",
    orderDate: "2024-01-22",
    totalAmount: 8500,
    gstAmount: 1530,
    grandTotal: 10030,
    status: "Pending",
    paymentStatus: "Overdue",
    orderChannel: "WhatsApp",
  },
  {
    id: "ord5",
    customerId: "cust5",
    customerName: "Industrial Supplies Co",
    orderDate: "2024-01-21",
    totalAmount: 68000,
    gstAmount: 12240,
    grandTotal: 80240,
    status: "Completed",
    paymentStatus: "Paid",
    orderChannel: "Online",
  },
]

// Helper functions
export function getCustomerById(id: string): Customer | undefined {
  return DEMO_CUSTOMERS.find((customer) => customer.id === id)
}

export function getProductById(id: string): Product | undefined {
  return DEMO_PRODUCTS.find((product) => product.id === id)
}

export function getLowStockProducts(): Product[] {
  return DEMO_PRODUCTS.filter((product) => product.quantity < product.reorderLevel)
}

export function getRecentOrders(limit = 10): Order[] {
  return DEMO_ORDERS.slice(0, limit)
}

export function getDashboardMetrics() {
  const totalRevenue = DEMO_ORDERS.reduce((sum, order) => sum + order.grandTotal, 0)
  const activeOrders = DEMO_ORDERS.filter((order) => order.status !== "Completed").length
  const activeCustomers = DEMO_CUSTOMERS.filter((customer) => customer.active).length
  const lowStockItems = getLowStockProducts().length

  return {
    totalRevenue,
    activeOrders,
    activeCustomers,
    lowStockItems,
  }
}
