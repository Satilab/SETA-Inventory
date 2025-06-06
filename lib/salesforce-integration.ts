// lib/salesforce-integration.ts

import jsforce from "jsforce"
import { OAuth2 } from "jsforce"

// Environment variables (replace with your actual values)
const SALESFORCE_INSTANCE_URL = process.env.SALESFORCE_INSTANCE_URL || ""
const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID || ""
const SALESFORCE_CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET || ""
const SALESFORCE_USERNAME = process.env.SALESFORCE_USERNAME || ""
const SALESFORCE_PASSWORD = process.env.SALESFORCE_PASSWORD || ""
const SALESFORCE_SECURITY_TOKEN = process.env.SALESFORCE_SECURITY_TOKEN || ""
const SALESFORCE_API_VERSION = process.env.SALESFORCE_API_VERSION || "58.0"

// OAuth2 instance for authentication
const oauth2 = new OAuth2({
  loginUrl: SALESFORCE_INSTANCE_URL,
  clientId: SALESFORCE_CLIENT_ID,
  clientSecret: SALESFORCE_CLIENT_SECRET,
  redirectUri: process.env.SALESFORCE_REDIRECT_URI || "http://localhost:3000/api/oauth/callback", // Replace with your redirect URI
})

// Connection instance (will be initialized after authentication)
let conn: jsforce.Connection | null = null

const salesforceAuth = {
  getAuthorizationUrl: (state: string) => {
    return oauth2.getAuthorizationUrl({ scope: "api refresh_token offline_access", state: state })
  },

  getAccessToken: async (code?: string) => {
    try {
      if (code) {
        // Exchange authorization code for access token
        const auth = await oauth2.getToken(code)
        conn = new jsforce.Connection({
          oauth2: oauth2,
          instanceUrl: SALESFORCE_INSTANCE_URL,
          accessToken: auth.access_token,
          refreshToken: auth.refresh_token,
          version: SALESFORCE_API_VERSION,
        })
        return auth
      } else {
        // Use username/password flow for server-side authentication
        conn = new jsforce.Connection({
          loginUrl: SALESFORCE_INSTANCE_URL,
          version: SALESFORCE_API_VERSION,
        })

        await conn.login(SALESFORCE_USERNAME, SALESFORCE_PASSWORD + SALESFORCE_SECURITY_TOKEN)

        return {
          access_token: conn.accessToken,
          instance_url: conn.instanceUrl,
        }
      }
    } catch (error) {
      console.error("Error getting access token:", error)
      throw error
    }
  },

  refreshToken: async () => {
    if (conn && conn.refreshToken) {
      try {
        await conn.refreshAccessToken((err, oauth) => {
          if (err) {
            console.error("Error refreshing access token:", err)
            throw err
          }
          if (oauth) {
            conn!.accessToken = oauth.access_token
          }
        })
      } catch (error) {
        console.error("Error refreshing access token:", error)
        throw error
      }
    } else {
      throw new Error("No refresh token available.")
    }
  },

  getConnection: () => {
    if (!conn) {
      throw new Error("Salesforce connection not initialized. Call getAccessToken first.")
    }
    return conn
  },
}

const salesforceAPI = {
  query: async (soql: string) => {
    try {
      const connection = salesforceAuth.getConnection()
      const result = await connection.query(soql)
      return result
    } catch (error) {
      console.error("Error executing SOQL query:", error)
      throw error
    }
  },

  create: async (sobjectType: string, data: any) => {
    try {
      const connection = salesforceAuth.getConnection()
      const result = await connection.sobject(sobjectType).create(data)
      return result
    } catch (error) {
      console.error(`Error creating ${sobjectType}:`, error)
      throw error
    }
  },

  update: async (sobjectType: string, id: string, data: any) => {
    try {
      const connection = salesforceAuth.getConnection()
      const result = await connection.sobject(sobjectType).update({ Id: id, ...data })
      return result
    } catch (error) {
      console.error(`Error updating ${sobjectType} with ID ${id}:`, error)
      throw error
    }
  },

  delete: async (sobjectType: string, id: string) => {
    try {
      const connection = salesforceAuth.getConnection()
      const result = await connection.sobject(sobjectType).destroy(id)
      return result
    } catch (error) {
      console.error(`Error deleting ${sobjectType} with ID ${id}:`, error)
      throw error
    }
  },

  testConnection: async () => {
    try {
      // Check if we're in a development environment
      const isLocalhost =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")

      if (isLocalhost) {
        return {
          connected: false,
          error: "LOCALHOST_DETECTED",
          details: {
            message: "Running on localhost. Salesforce requires a public URL for OAuth callbacks.",
            suggestion: "Deploy to Vercel to test with real Salesforce integration.",
          },
        }
      }

      // Check if environment variables are set
      const requiredVars = [
        "SALESFORCE_INSTANCE_URL",
        "SALESFORCE_CLIENT_ID",
        "SALESFORCE_CLIENT_SECRET",
        "SALESFORCE_USERNAME",
        "SALESFORCE_PASSWORD",
        "SALESFORCE_SECURITY_TOKEN",
      ]

      const missingVars = requiredVars.filter((varName) => !process.env[varName])

      if (missingVars.length > 0) {
        return {
          connected: false,
          error: "SALESFORCE_NOT_CONFIGURED",
          details: {
            missingVariables: missingVars,
            message: "Required Salesforce environment variables are missing.",
          },
        }
      }

      // Attempt to authenticate with Salesforce
      const authResult = await salesforceAuth.getAccessToken()

      if (!authResult || !authResult.access_token) {
        return {
          connected: false,
          error: "SALESFORCE_AUTH_ERROR",
          details: {
            message: "Failed to authenticate with Salesforce.",
            suggestion: "Check your credentials and security token.",
          },
        }
      }

      // Test a simple query to verify connection
      const testQuery = "SELECT Id FROM Account LIMIT 1"
      const queryResult = await salesforceAPI.query(testQuery)

      return {
        connected: true,
        details: {
          message: "Successfully connected to Salesforce",
          instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
          tokenExpiry: authResult.instance_url,
          testQuery: {
            query: testQuery,
            result: queryResult,
          },
        },
      }
    } catch (error) {
      console.error("Salesforce connection test failed:", error)

      // Check for specific error types
      const errorMessage = error instanceof Error ? error.message : String(error)

      if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("getaddrinfo")) {
        return {
          connected: false,
          error: "SALESFORCE_CONNECTION_ERROR",
          details: {
            message: "Could not connect to Salesforce instance.",
            suggestion: "Check your instance URL and internet connection.",
            error: errorMessage,
          },
        }
      }

      if (errorMessage.includes("invalid_client")) {
        return {
          connected: false,
          error: "SALESFORCE_INVALID_CLIENT",
          details: {
            message: "Invalid client credentials (client_id or client_secret).",
            suggestion: "Verify your Connected App settings in Salesforce.",
            error: errorMessage,
          },
        }
      }

      if (errorMessage.includes("invalid_grant")) {
        return {
          connected: false,
          error: "SALESFORCE_INVALID_GRANT",
          details: {
            message: "Invalid username, password, or security token.",
            suggestion: "Reset your security token and verify credentials.",
            error: errorMessage,
          },
        }
      }

      return {
        connected: false,
        error: "SALESFORCE_UNKNOWN_ERROR",
        details: { error: errorMessage },
      }
    }
  },
}

export { salesforceAuth, salesforceAPI }
