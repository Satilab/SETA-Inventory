// Dynamic data service that generates realistic, time-based business data
export interface DynamicCustomer {
  Id: string
  Customer_Name__c: string
  Name: string
  Phone__c: string
  Phone: string
  Email__c: string
  Email: string
  WhatsApp__c: string
  GSTIN__c: string
  Type__c: string
  Address__c: string
  Last_Order_Date__c: string
  Total_Orders__c: number
  Total_Value__c: number
  Active__c: boolean
  Credit_Limit__c: number
  Payment_Terms__c: string
  Churn_Risk_Score__c: number
  Days_Since_Last_Order__c: number
  Churn_Reason__c?: string
  Recommended_Action__c: string
  CreatedDate: string
  LastModifiedDate: string
  // Dynamic fields that change over time
  Current_Order_Value__c?: number
  Last_Activity__c?: string
  Engagement_Score__c?: number
  Payment_Status__c?: string
  Outstanding_Amount__c?: number
}

export interface DynamicInventoryItem {
  id: string
  name: string
  category: string
  brand: string
  sku: string
  quantity: number
  basePrice: number
  salePrice: number
  lastUpdated: string
  location: string
  reorderLevel: number
  supplier: string
  // Dynamic fields
  dailyMovement: number
  weeklyTrend: "up" | "down" | "stable"
  demandForecast: number
  stockStatus: "in-stock" | "low-stock" | "out-of-stock" | "overstock"
  lastSaleDate: string
  popularityScore: number
}

export interface DynamicOrder {
  id: string
  customerId: string
  customerName: string
  orderDate: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "overdue"
  channel: "whatsapp" | "phone" | "in-store" | "online"
  priority: "low" | "medium" | "high" | "urgent"
}

class DynamicDataService {
  private static instance: DynamicDataService
  private lastUpdate = 0
  private updateInterval = 30000 // 30 seconds

  // Base data templates
  private businessNames = [
    "Rajesh Electrical Works",
    "Modern Electronics",
    "Power Solutions Ltd",
    "City Electrical Supplies",
    "Supreme Electric Co",
    "Bright Light Electricals",
    "Metro Power Systems",
    "Elite Electronics Hub",
    "Golden Electric Store",
    "Prime Electrical Traders",
    "Voltage Masters",
    "Current Flow Systems",
    "Spark Electronics",
    "Thunder Electric Co",
    "Lightning Solutions",
    "Amp Power House",
    "Circuit Breaker Store",
    "Wire World",
    "Switch Point",
    "Electric Avenue",
    "Power Grid Supplies",
    "Ohm Electrical",
    "Watt Solutions",
  ]

  private productCategories = [
    "Cables & Wires",
    "MCBs & RCCBs",
    "Switches & Sockets",
    "LED Lights",
    "Fans & Motors",
    "Panels & Boards",
    "Transformers",
    "Inverters",
    "Batteries",
    "Conduits",
    "Junction Boxes",
    "Meters",
  ]

  private brands = [
    "Havells",
    "Anchor",
    "Legrand",
    "Schneider",
    "ABB",
    "Siemens",
    "Crompton",
    "Bajaj",
    "Orient",
    "Polycab",
    "KEI",
    "Finolex",
  ]

  private locations = [
    "Warehouse A",
    "Warehouse B",
    "Shop Floor",
    "Display Area",
    "Storage Room 1",
    "Storage Room 2",
    "Counter Stock",
    "Bulk Storage",
  ]

  static getInstance(): DynamicDataService {
    if (!DynamicDataService.instance) {
      DynamicDataService.instance = new DynamicDataService()
    }
    return DynamicDataService.instance
  }

  // Generate time-based seed for consistent but changing data
  private getTimeSeed(): number {
    const now = Date.now()
    // Change every 30 seconds but keep consistent within that period
    return Math.floor(now / this.updateInterval)
  }

  // Seeded random number generator for consistent results
  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  // Generate dynamic customer data
  generateDynamicCustomers(count = 20): DynamicCustomer[] {
    const customers: DynamicCustomer[] = []
    const timeSeed = this.getTimeSeed()

    for (let i = 0; i < count; i++) {
      const seed = timeSeed + i
      const random = () => this.seededRandom(seed + customers.length)

      const businessName = this.businessNames[Math.floor(random() * this.businessNames.length)]
      const customerTypes = ["Retail", "Contractor", "Bulk", "Wholesale"]
      const paymentTerms = ["Net 30", "Net 15", "COD", "Advance", "Credit"]
      const paymentStatuses = ["Current", "Overdue", "Advance Paid", "Credit Hold"]
      const activities = ["Order Placed", "Payment Received", "Inquiry Made", "Visit Scheduled", "Complaint Raised"]

      // Generate dynamic values that change over time
      const daysSinceLastOrder = Math.floor(random() * 90)
      const isActive = daysSinceLastOrder < 30
      const churnRisk = daysSinceLastOrder > 45 ? Math.floor(random() * 50) + 50 : Math.floor(random() * 40)
      const engagementScore = isActive ? Math.floor(random() * 40) + 60 : Math.floor(random() * 60)

      // Calculate dynamic order value (simulates current pending orders)
      const hasCurrentOrder = random() > 0.7
      const currentOrderValue = hasCurrentOrder ? Math.floor(random() * 100000) + 5000 : 0

      const customer: DynamicCustomer = {
        Id: `dyn-${String(i + 1).padStart(3, "0")}`,
        Customer_Name__c: businessName,
        Name: businessName,
        Phone__c: `+91 ${Math.floor(random() * 900000000) + 100000000}`,
        Phone: `+91 ${Math.floor(random() * 900000000) + 100000000}`,
        Email__c: `${businessName
          .toLowerCase()
          .replace(/[^a-z]/g, "")
          .substring(0, 8)}@gmail.com`,
        Email: `${businessName
          .toLowerCase()
          .replace(/[^a-z]/g, "")
          .substring(0, 8)}@gmail.com`,
        WhatsApp__c: `+91${Math.floor(random() * 900000000) + 100000000}`,
        GSTIN__c: `36${Math.random().toString().substring(2, 15)}`,
        Type__c: customerTypes[Math.floor(random() * customerTypes.length)],
        Address__c: `${Math.floor(random() * 100) + 1}, ${["Electrical Market", "Industrial Area", "Commercial Complex", "Trade Center", "Main Bazaar"][Math.floor(random() * 5)]}, ${["Secunderabad", "Hyderabad", "Begumpet", "Ameerpet", "Koti"][Math.floor(random() * 5)]}`,
        Last_Order_Date__c: new Date(Date.now() - daysSinceLastOrder * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        Total_Orders__c: Math.floor(random() * 100) + 1,
        Total_Value__c: Math.floor(random() * 1000000) + 50000,
        Active__c: isActive,
        Credit_Limit__c: Math.floor(random() * 500000) + 100000,
        Payment_Terms__c: paymentTerms[Math.floor(random() * paymentTerms.length)],
        Churn_Risk_Score__c: churnRisk,
        Days_Since_Last_Order__c: daysSinceLastOrder,
        Churn_Reason__c:
          churnRisk > 60
            ? ["Price sensitivity", "Better competitor offers", "Service quality issues", "Payment disputes"][
                Math.floor(random() * 4)
              ]
            : null,
        Recommended_Action__c:
          churnRisk > 60
            ? "Schedule urgent visit"
            : churnRisk > 30
              ? "Send promotional offer"
              : "Maintain regular contact",
        CreatedDate: new Date(Date.now() - Math.floor(random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
        LastModifiedDate: new Date(Date.now() - Math.floor(random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        // Dynamic fields
        Current_Order_Value__c: currentOrderValue,
        Last_Activity__c: activities[Math.floor(random() * activities.length)],
        Engagement_Score__c: engagementScore,
        Payment_Status__c: paymentStatuses[Math.floor(random() * paymentStatuses.length)],
        Outstanding_Amount__c: Math.floor(random() * 50000),
      }

      customers.push(customer)
    }

    return customers.sort((a, b) => a.Customer_Name__c.localeCompare(b.Customer_Name__c))
  }

  // Generate dynamic inventory data
  generateDynamicInventory(count = 50): DynamicInventoryItem[] {
    const inventory: DynamicInventoryItem[] = []
    const timeSeed = this.getTimeSeed()

    for (let i = 0; i < count; i++) {
      const seed = timeSeed + i + 1000
      const random = () => this.seededRandom(seed + inventory.length)

      const category = this.productCategories[Math.floor(random() * this.productCategories.length)]
      const brand = this.brands[Math.floor(random() * this.brands.length)]
      const location = this.locations[Math.floor(random() * this.locations.length)]

      // Generate product names based on category
      const productNames: { [key: string]: string[] } = {
        "Cables & Wires": ["PVC Cable", "Armoured Cable", "Flexible Wire", "House Wire"],
        "MCBs & RCCBs": ["Single Pole MCB", "Double Pole MCB", "Triple Pole MCB", "RCCB"],
        "Switches & Sockets": ["Modular Switch", "Socket Outlet", "Dimmer Switch", "Fan Regulator"],
        "LED Lights": ["LED Bulb", "LED Tube", "LED Panel", "LED Strip"],
        "Fans & Motors": ["Ceiling Fan", "Table Fan", "Exhaust Fan", "Motor"],
        "Panels & Boards": ["Distribution Board", "MCB Box", "Meter Board", "Junction Box"],
      }

      const nameOptions = productNames[category] || ["Electrical Item"]
      const productName = `${brand} ${nameOptions[Math.floor(random() * nameOptions.length)]}`

      // Dynamic calculations
      const baseQuantity = Math.floor(random() * 500) + 10
      const dailyMovement = Math.floor(random() * 20) - 10 // -10 to +10
      const currentQuantity = Math.max(0, baseQuantity + dailyMovement)
      const reorderLevel = Math.floor(baseQuantity * 0.2)

      // Determine stock status
      let stockStatus: "in-stock" | "low-stock" | "out-of-stock" | "overstock"
      if (currentQuantity === 0) stockStatus = "out-of-stock"
      else if (currentQuantity <= reorderLevel) stockStatus = "low-stock"
      else if (currentQuantity > baseQuantity * 1.5) stockStatus = "overstock"
      else stockStatus = "in-stock"

      // Weekly trend based on recent movement
      const weeklyTrend = dailyMovement > 5 ? "up" : dailyMovement < -5 ? "down" : "stable"

      const item: DynamicInventoryItem = {
        id: `inv-${String(i + 1).padStart(4, "0")}`,
        name: productName,
        category,
        brand,
        sku: `${brand.substring(0, 3).toUpperCase()}${String(i + 1).padStart(4, "0")}`,
        quantity: currentQuantity,
        basePrice: Math.floor(random() * 5000) + 100,
        salePrice: Math.floor(random() * 5500) + 120,
        lastUpdated: new Date().toISOString(),
        location,
        reorderLevel,
        supplier: `${brand} Distributors`,
        // Dynamic fields
        dailyMovement,
        weeklyTrend,
        demandForecast: Math.floor(random() * 100) + 20,
        stockStatus,
        lastSaleDate: new Date(Date.now() - Math.floor(random() * 30) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        popularityScore: Math.floor(random() * 100),
      }

      inventory.push(item)
    }

    return inventory.sort((a, b) => a.name.localeCompare(b.name))
  }

  // Generate dynamic orders
  generateDynamicOrders(count = 30): DynamicOrder[] {
    const orders: DynamicOrder[] = []
    const timeSeed = this.getTimeSeed()
    const customers = this.generateDynamicCustomers(10)
    const inventory = this.generateDynamicInventory(20)

    for (let i = 0; i < count; i++) {
      const seed = timeSeed + i + 2000
      const random = () => this.seededRandom(seed + orders.length)

      const customer = customers[Math.floor(random() * customers.length)]
      const orderDate = new Date(Date.now() - Math.floor(random() * 30) * 24 * 60 * 60 * 1000)

      // Generate order items
      const itemCount = Math.floor(random() * 5) + 1
      const orderItems = []
      let totalAmount = 0

      for (let j = 0; j < itemCount; j++) {
        const product = inventory[Math.floor(random() * inventory.length)]
        const quantity = Math.floor(random() * 10) + 1
        const price = product.salePrice

        orderItems.push({
          productId: product.id,
          productName: product.name,
          quantity,
          price,
        })

        totalAmount += quantity * price
      }

      const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const
      const paymentStatuses = ["pending", "paid", "overdue"] as const
      const channels = ["whatsapp", "phone", "in-store", "online"] as const
      const priorities = ["low", "medium", "high", "urgent"] as const

      const order: DynamicOrder = {
        id: `ord-${String(i + 1).padStart(4, "0")}`,
        customerId: customer.Id,
        customerName: customer.Customer_Name__c,
        orderDate: orderDate.toISOString().split("T")[0],
        items: orderItems,
        totalAmount,
        status: statuses[Math.floor(random() * statuses.length)],
        paymentStatus: paymentStatuses[Math.floor(random() * paymentStatuses.length)],
        channel: channels[Math.floor(random() * channels.length)],
        priority: priorities[Math.floor(random() * priorities.length)],
      }

      orders.push(order)
    }

    return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
  }

  // Get dashboard metrics that change over time
  getDashboardMetrics() {
    const timeSeed = this.getTimeSeed()
    const random = () => this.seededRandom(timeSeed + 5000)

    const baseRevenue = 250000
    const revenueVariation = Math.floor(random() * 50000) - 25000
    const todayRevenue = baseRevenue + revenueVariation

    const baseOrders = 45
    const orderVariation = Math.floor(random() * 20) - 10
    const todayOrders = Math.max(0, baseOrders + orderVariation)

    return {
      todayRevenue,
      todayOrders,
      activeCustomers: Math.floor(random() * 50) + 120,
      lowStockItems: Math.floor(random() * 15) + 5,
      pendingOrders: Math.floor(random() * 25) + 10,
      overduePayments: Math.floor(random() * 8) + 2,
      revenueGrowth: ((revenueVariation / baseRevenue) * 100).toFixed(1),
      orderGrowth: ((orderVariation / baseOrders) * 100).toFixed(1),
      lastUpdated: new Date().toISOString(),
    }
  }

  // Get real-time alerts
  getRealTimeAlerts() {
    const timeSeed = this.getTimeSeed()
    const random = () => this.seededRandom(timeSeed + 6000)

    const alerts = []
    const alertTypes = [
      { type: "stock", message: "Low stock alert", severity: "warning" },
      { type: "order", message: "New WhatsApp order received", severity: "info" },
      { type: "payment", message: "Payment overdue", severity: "error" },
      { type: "customer", message: "High-value customer inquiry", severity: "success" },
    ]

    // Generate 2-5 alerts
    const alertCount = Math.floor(random() * 4) + 2
    for (let i = 0; i < alertCount; i++) {
      const alertType = alertTypes[Math.floor(random() * alertTypes.length)]
      alerts.push({
        id: `alert-${i + 1}`,
        ...alertType,
        timestamp: new Date(Date.now() - Math.floor(random() * 3600000)).toISOString(), // Last hour
      })
    }

    return alerts
  }
}

export const dynamicDataService = DynamicDataService.getInstance()
