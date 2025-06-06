"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Settings, ExternalLink } from "lucide-react"
import { SalesforceUrlFixer } from "@/components/salesforce-url-fixer"

interface ConnectionResult {
  connected: boolean
  error?: string
  errorType?: string
  details?: any
}

interface EnvironmentStatus {
  [key: string]: boolean
}

export default function SalesforceDebugPage() {
  const [connectionResult, setConnectionResult] = useState<ConnectionResult | null>(null)
  const [environmentStatus, setEnvironmentStatus] = useState<EnvironmentStatus>({})
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-connection")
      const result = await response.json()
      setConnectionResult(result)
    } catch (error) {
      setConnectionResult({
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
        errorType: "FETCH_ERROR",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkEnvironment = async () => {
    try {
      const response = await fetch("/api/debug/environment")
      const result = await response.json()
      setEnvironmentStatus(result.environment || {})
    } catch (error) {
      console.error("Environment check failed:", error)
    }
  }

  useEffect(() => {
    checkEnvironment()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getErrorSuggestions = (errorType?: string) => {
    switch (errorType) {
      case "URL_NOT_EXISTS":
        return [
          "Log into Salesforce manually and copy the URL from your browser",
          "Check if your Salesforce org is active and accessible",
          "Verify you're using the correct URL format for your org type",
          "For Developer Edition: use https://yourcompany-dev-ed.my.salesforce.com",
          "For Sandbox: use https://yourcompany--sandbox.my.salesforce.com",
        ]
      case "INVALID_URL_FORMAT":
        return [
          "Use the format: https://yourcompany.my.salesforce.com",
          "Remove any trailing slashes from the URL",
          "Ensure the URL starts with https://",
          "Check for typos in the domain name",
        ]
      case "INVALID_CREDENTIALS":
        return [
          "Verify your username and password are correct",
          "Reset your security token and append it to your password",
          "Check if your user account is active in Salesforce",
          "Ensure you have API access enabled",
        ]
      case "INVALID_CLIENT_ID":
        return [
          "Verify your Connected App Consumer Key (Client ID)",
          "Check if the Connected App is approved and active",
          "Ensure the Connected App has the correct OAuth settings",
        ]
      default:
        return [
          "Check all environment variables are set correctly",
          "Verify your Salesforce credentials",
          "Test logging into Salesforce manually",
          "Check the Salesforce trust status at trust.salesforce.com",
        ]
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Salesforce Configuration Debug</h1>
          <p className="text-muted-foreground">Check your secure Salesforce integration status</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Security Notice */}
      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          <strong>🔒 Secure Configuration:</strong> All Salesforce credentials are server-side only and not exposed to
          the client browser.
        </AlertDescription>
      </Alert>

      {/* URL Fixer - Show if we detect URL issues */}
      {connectionResult && connectionResult.errorType === "URL_NOT_EXISTS" && (
        <SalesforceUrlFixer
          currentUrl={process.env.NEXT_PUBLIC_SALESFORCE_INSTANCE_URL || "Not set"}
          onUrlFixed={(newUrl) => {
            // Show instructions for updating environment variable
            alert(`Copy this URL and update your SALESFORCE_INSTANCE_URL environment variable in Vercel: ${newUrl}`)
          }}
        />
      )}

      {/* Environment Variables Check */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>Server-side Salesforce credentials (secure, not exposed to client)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "SALESFORCE_INSTANCE_URL",
              "SALESFORCE_CLIENT_ID",
              "SALESFORCE_CLIENT_SECRET",
              "SALESFORCE_USERNAME",
              "SALESFORCE_PASSWORD",
              "SALESFORCE_SECURITY_TOKEN",
            ].map((envVar) => (
              <div key={envVar} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium text-sm">{envVar}</span>
                {environmentStatus[envVar] ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Configured
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Not configured
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Test</CardTitle>
          <CardDescription>Test the actual connection to Salesforce</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testConnection} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>

          {connectionResult && (
            <Tabs defaultValue="result" className="w-full">
              <TabsList>
                <TabsTrigger value="result">Result</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>

              <TabsContent value="result" className="space-y-4">
                <Alert variant={connectionResult.connected ? "default" : "destructive"}>
                  {connectionResult.connected ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {connectionResult.connected
                      ? "✅ Connection successful! Salesforce API is accessible."
                      : `❌ Connection failed: ${connectionResult.error}`}
                  </AlertDescription>
                </Alert>

                {connectionResult.errorType && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">Error Type: {connectionResult.errorType}</span>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                {connectionResult.details && (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Technical Details</h4>
                      <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-64">
                        {JSON.stringify(connectionResult.details, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Troubleshooting Steps:</h4>
                  {getErrorSuggestions(connectionResult.errorType).map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" asChild>
                    <a href="/debug/url-validator" className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      URL Validator
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/debug/environment" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Environment Debug
                    </a>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
