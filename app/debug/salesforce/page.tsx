"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface ConfigStatus {
  hasInstanceUrl: boolean
  hasClientId: boolean
  hasClientSecret: boolean
  hasUsername: boolean
  hasPassword: boolean
  hasSecurityToken: boolean
  instanceUrl?: string
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

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

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
          <CardDescription>Common issues and solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Invalid request, only public URLs are supported</h4>
                <p className="text-sm text-muted-foreground">
                  Your instance URL format is incorrect. Use format: https://yourinstance.my.salesforce.com
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
                <h4 className="font-medium">Connected App Issues</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure your Connected App has the correct OAuth settings and API access enabled
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
