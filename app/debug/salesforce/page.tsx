"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConfigStatus {
  hasInstanceUrl: boolean
  hasClientId: boolean
  hasClientSecret: boolean
  hasUsername: boolean
  hasPassword: boolean
  hasSecurityToken: boolean
  instanceUrl?: string
  environment?: string
  vercelEnv?: string
  deploymentUrl?: string
}

interface ConnectionTest {
  success: boolean
  error?: string
  details?: any
}

export default function SalesforceDebugPage() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null)
  const [connectionTest, setConnectionTest] = useState<ConnectionTest | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchConfigStatus()
  }, [])

  const fetchConfigStatus = async () => {
    try {
      const response = await fetch("/api/debug/salesforce")
      const data = await response.json()
      setConfigStatus(data)
    } catch (error) {
      console.error("Error fetching config status:", error)
    }
  }

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-connection")
      const data = await response.json()
      setConnectionTest(data)
    } catch (error) {
      setConnectionTest({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyEnvTemplate = () => {
    const template = `# Salesforce Configuration (Add these to Vercel Environment Variables)
NEXT_PUBLIC_SALESFORCE_INSTANCE_URL=https://your-instance.my.salesforce.com
NEXT_PUBLIC_SALESFORCE_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_SALESFORCE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_SALESFORCE_USERNAME=your_username_here
NEXT_PUBLIC_SALESFORCE_PASSWORD=your_password_here
NEXT_PUBLIC_SALESFORCE_SECURITY_TOKEN=your_security_token_here`

    navigator.clipboard.writeText(template)
    toast({
      title: "Environment Template Copied",
      description: "These match your current Vercel configuration",
    })
  }

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const isProduction = configStatus?.environment === "production"
  const isVercel = configStatus?.vercelEnv !== "not-vercel"
  const allConfigured = configStatus && Object.values(configStatus).slice(0, 6).every(Boolean)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Salesforce Configuration Debug</h1>
          <p className="text-muted-foreground">Check your Salesforce integration status</p>
        </div>
        <Button onClick={fetchConfigStatus} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Configuration Status Alert */}
      {configStatus && (
        <Alert className={allConfigured ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertCircle className={`h-4 w-4 ${allConfigured ? "text-green-600" : "text-red-600"}`} />
          <AlertDescription className={allConfigured ? "text-green-800" : "text-red-800"}>
            {allConfigured
              ? "✅ All Salesforce environment variables are configured correctly!"
              : "❌ Some Salesforce environment variables are missing. Check the configuration below."}
          </AlertDescription>
        </Alert>
      )}

      {/* Deployment Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Environment</CardTitle>
          <CardDescription>Current deployment and environment information</CardDescription>
        </CardHeader>
        <CardContent>
          {configStatus && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Environment</span>
                <Badge variant={isProduction ? "default" : "secondary"}>{configStatus.environment || "unknown"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Platform</span>
                <Badge variant={isVercel ? "default" : "secondary"}>{isVercel ? "Vercel" : "Local/Other"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Deployment URL</span>
                <Badge variant="outline">{configStatus.deploymentUrl || "localhost"}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>
            Check if all required Salesforce credentials are configured (NEXT_PUBLIC_ prefixed)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {configStatus ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SALESFORCE_INSTANCE_URL</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(configStatus.hasInstanceUrl)}
                  {configStatus.instanceUrl && <Badge variant="outline">{configStatus.instanceUrl}</Badge>}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SALESFORCE_CLIENT_ID</span>
                {getStatusIcon(configStatus.hasClientId)}
              </div>
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SALESFORCE_CLIENT_SECRET</span>
                {getStatusIcon(configStatus.hasClientSecret)}
              </div>
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SALESFORCE_USERNAME</span>
                {getStatusIcon(configStatus.hasUsername)}
              </div>
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SALESFORCE_PASSWORD</span>
                {getStatusIcon(configStatus.hasPassword)}
              </div>
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SALESFORCE_SECURITY_TOKEN</span>
                {getStatusIcon(configStatus.hasSecurityToken)}
              </div>
            </div>
          ) : (
            <p>Loading configuration status...</p>
          )}
        </CardContent>
      </Card>

      {/* Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Test</CardTitle>
          <CardDescription>Test the actual connection to Salesforce</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={testConnection} disabled={loading || !allConfigured}>
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Connection"
              )}
            </Button>

            {connectionTest && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {connectionTest.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {connectionTest.success ? "Connection Successful" : "Connection Failed"}
                  </span>
                </div>
                {connectionTest.error && <p className="text-sm text-red-600 mt-2">{connectionTest.error}</p>}
                {connectionTest.details && (
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                    {JSON.stringify(connectionTest.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {allConfigured && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">🎉 Configuration Complete!</CardTitle>
            <CardDescription className="text-green-700">
              Your Salesforce environment variables are properly configured. You can now test the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button asChild variant="default" size="sm">
                <a href="/customers">Test Customer Data</a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/inventory">Test Inventory Data</a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/inventory/alerts">Test Alerts Data</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
