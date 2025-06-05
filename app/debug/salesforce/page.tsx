"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink, Copy } from "lucide-react"
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
SALESFORCE_INSTANCE_URL=https://your-instance.my.salesforce.com
SALESFORCE_CLIENT_ID=your_client_id_here
SALESFORCE_CLIENT_SECRET=your_client_secret_here
SALESFORCE_USERNAME=your_username_here
SALESFORCE_PASSWORD=your_password_here
SALESFORCE_SECURITY_TOKEN=your_security_token_here`

    navigator.clipboard.writeText(template)
    toast({
      title: "Environment Template Copied",
      description: "Paste this template in your Vercel environment variables",
    })
  }

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const isProduction = configStatus?.environment === "production"
  const isVercel = configStatus?.vercelEnv !== "not-vercel"

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
          <CardDescription>Check if all required Salesforce credentials are configured</CardDescription>
        </CardHeader>
        <CardContent>
          {configStatus ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>SALESFORCE_INSTANCE_URL</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(configStatus.hasInstanceUrl)}
                  {configStatus.instanceUrl && <Badge variant="outline">{configStatus.instanceUrl}</Badge>}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>SALESFORCE_CLIENT_ID</span>
                {getStatusIcon(configStatus.hasClientId)}
              </div>
              <div className="flex items-center justify-between">
                <span>SALESFORCE_CLIENT_SECRET</span>
                {getStatusIcon(configStatus.hasClientSecret)}
              </div>
              <div className="flex items-center justify-between">
                <span>SALESFORCE_USERNAME</span>
                {getStatusIcon(configStatus.hasUsername)}
              </div>
              <div className="flex items-center justify-between">
                <span>SALESFORCE_PASSWORD</span>
                {getStatusIcon(configStatus.hasPassword)}
              </div>
              <div className="flex items-center justify-between">
                <span>SALESFORCE_SECURITY_TOKEN</span>
                {getStatusIcon(configStatus.hasSecurityToken)}
              </div>
            </div>
          ) : (
            <p>Loading configuration status...</p>
          )}
        </CardContent>
      </Card>

      {/* Deployment Instructions */}
      {isVercel && !configStatus?.hasInstanceUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Vercel Environment Variables Setup</CardTitle>
            <CardDescription>Configure Salesforce credentials in your Vercel project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Environment variables are not configured in Vercel. Follow these steps to set them up.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-medium">Steps to Configure:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Go to your Vercel project dashboard</li>
                <li>Navigate to Settings → Environment Variables</li>
                <li>Add each Salesforce environment variable</li>
                <li>Set Environment to "Production" and "Preview"</li>
                <li>Redeploy your application</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button onClick={copyEnvTemplate} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy Environment Template
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Vercel Dashboard
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Test */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Test</CardTitle>
          <CardDescription>Test the actual connection to Salesforce</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={testConnection} disabled={loading}>
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

      {/* Troubleshooting Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Guide</CardTitle>
          <CardDescription>Common deployment issues and solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Salesforce not configured</h4>
                <p className="text-sm text-muted-foreground">
                  Add all 6 Salesforce environment variables in your Vercel project settings
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Authentication Failed</h4>
                <p className="text-sm text-muted-foreground">
                  Check your username, password, and security token. For sandbox, use test.salesforce.com
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Invalid instance URL</h4>
                <p className="text-sm text-muted-foreground">
                  Use format: https://yourinstance.my.salesforce.com (not login.salesforce.com)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
