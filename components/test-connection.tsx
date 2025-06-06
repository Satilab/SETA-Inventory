"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, CheckCircle, XCircle } from "lucide-react"

export function TestConnection() {
  const [status, setStatus] = useState<{
    connected: boolean
    error?: string
    details?: any
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-connection", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.json()
      setStatus(result)
    } catch (error) {
      console.error("Connection test error:", error)
      setStatus({
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        details: { error: error instanceof Error ? error.message : "Unknown error" },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Connection Test</h2>
        <Button onClick={testConnection} disabled={isLoading} variant="default">
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Test Connection
            </>
          )}
        </Button>
      </div>

      {status && (
        <Alert variant={status.connected ? "default" : "destructive"}>
          {status.connected ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4" />}
          <AlertDescription>
            {status.connected
              ? "Connection successful! Salesforce API is accessible."
              : `Connection failed: ${status.error || "Unknown error"}`}
          </AlertDescription>
        </Alert>
      )}

      {status && status.details && (
        <div className="bg-muted p-3 rounded-md mt-2">
          <pre className="text-xs overflow-auto whitespace-pre-wrap">{JSON.stringify(status.details, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
