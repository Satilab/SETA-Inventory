"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Eye, EyeOff } from "lucide-react"

interface ConnectionStatus {
  connected: boolean
  error?: string
  details?: any
}

export function SalesforceStatus() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-connection")
      const result = await response.json()
      setStatus(result)
    } catch (error) {
      setStatus({
        connected: false,
        error: "Failed to test connection",
        details: { error: error instanceof Error ? error.message : "Unknown error" },
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="h-4 w-4 animate-spin" />
    if (status?.connected) return <CheckCircle className="h-4 w-4 text-green-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = () => {
    if (isLoading) return <Badge variant="secondary">Testing...</Badge>
    if (status?.connected) return <Badge variant="default">Connected</Badge>
    return <Badge variant="destructive">Disconnected</Badge>
  }

  const getErrorMessage = () => {
    if (!status?.error) return null

    if (status.error.includes("LOCALHOST_DETECTED")) {
      return "Running on localhost - Salesforce requires a public URL. Deploy to Vercel to test real integration."
    }
    if (status.error.includes("SALESFORCE_NOT_CONFIGURED")) {
      return "Salesforce environment variables are not configured. Check your .env.local file."
    }
    if (status.error.includes("SALESFORCE_HTML_ERROR")) {
      return "Salesforce returned an HTML error page. This usually indicates authentication issues."
    }
    if (status.error.includes("SALESFORCE_AUTH_ERROR")) {
      return "Authentication failed. Check your Salesforce credentials and security token."
    }
    if (status.error.includes("PUBLIC_URL_REQUIRED")) {
      return "Salesforce requires a public URL. Deploy your app to test the integration."
    }

    return status.error
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Salesforce Connection Status
            </CardTitle>
            <CardDescription>Real-time connection status and diagnostics</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Button variant="outline" size="sm" onClick={testConnection} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Test
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status?.error && (
          <Alert variant={status.error.includes("LOCALHOST") ? "default" : "destructive"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{getErrorMessage()}</AlertDescription>
          </Alert>
        )}

        {status?.connected && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Successfully connected to Salesforce. Records will be created in the VENKATA_RAMANA_MOTORS__c object.
            </AlertDescription>
          </Alert>
        )}

        {!status?.connected && !isLoading && (
          <Alert variant="secondary">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Using demo mode. Stock updates will be simulated locally. Deploy to a public URL to enable Salesforce
              integration.
            </AlertDescription>
          </Alert>
        )}

        {/* Debug Details */}
        {status?.details && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-muted-foreground"
            >
              {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showDetails ? "Hide" : "Show"} Debug Details
            </Button>

            {showDetails && (
              <div className="bg-muted p-3 rounded-md">
                <pre className="text-xs overflow-auto">{JSON.stringify(status.details, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* Configuration Status */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-medium">Environment</p>
            <p className="text-muted-foreground">
              {typeof window !== "undefined" ? window.location.hostname : "Server"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">Mode</p>
            <p className="text-muted-foreground">{status?.connected ? "Production" : "Demo"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
