"use server"

import { getSalesforceConfigStatus } from "@/lib/salesforce-config"

export async function getSalesforceConfigAction() {
  try {
    const status = getSalesforceConfigStatus()
    return {
      success: true,
      data: status,
    }
  } catch (error) {
    console.error("Error getting Salesforce config:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
