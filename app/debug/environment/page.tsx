"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnvVar {
  exists: boolean
  value: string
  length?: number
}

interface EnvironmentData {
  serverSide: Record<string, EnvVar>
  clientSide: Record<string, EnvVar>
  environment: Record<string, string>
  summary: {
    allServerVarsConfigured: boolean
    hasOldClientVars: boolean
    timestamp: string
  }
}

export default function EnvironmentDebugPage() {
  const [envData, setEnvData] = useState<EnvironmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchEnvironmentData()
  }, [])

  const fetchEnvironmentData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/debug/environment")
      const result = await response.json()
      if (result.success) {
        setEnvData(result.data)
      } else {
        console.error("Failed to fetch environment data:", result.error)
      }
    } catch (error) {
      console.error("Error fetching environment data:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyVercelCommands = () => {
    const commands = `# Add these environment variables to your Vercel project:
vercel env add SALESFORCE_INSTANCE_URL
vercel env add SALESFORCE_CLIENT_ID
vercel env add SALESFORCE_CLIENT_SECRET
vercel env add SALESFORCE_USERNAME
vercel env add SALESFORCE_PASSWORD
vercel env add SALESFORCE_SECURITY_TOKEN

# Then redeploy:
vercel --prod`

    navigator.clipboard.writeText(commands)
    toast({
      title: "Vercel Commands Copied",
      description: "Run these commands in your terminal or add via Vercel dashboard",
    })
  }

  const getStatusIcon = (exists: boolean) => {
    return exists ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading environment data...</span>
        </div>
      </div>
    )
  }

  if (!envData) {
    return (
      <div className="container mx-auto p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Failed to load environment data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Environment Variables Debug</h1>
          <p className="text-muted-foreground">Comprehensive environment variable analysis</p>
        </div>
        <Button onClick={fetchEnvironmentData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Alert */}
      <Alert
        className={
          envData.summary.allServerVarsConfigured ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
        }
      >
        <AlertCircle
          className={`h-4 w-4 ${envData.summary.allServerVarsConfigured ? "text-green-600" : "text-red-600"}`}
        />
        <AlertDescription className={envData.summary.allServerVarsConfigured ? "text-green-800" : "text-red-800"}>
          {envData.summary.allServerVarsConfigured
            ? "✅ All server-side Salesforce environment variables are configured!"
            : "❌ Server-side Salesforce environment variables are missing or incomplete."}
        </AlertDescription>
      </Alert>

      {/* Old Client Variables Warning */}
      {envData.summary.hasOldClientVars && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            ⚠️ Old NEXT_PUBLIC_ environment variables detected. These should be removed for security.
          </AlertDescription>
        </Alert>
      )}

      {/* Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Information</CardTitle>
          <CardDescription>Current deployment environment details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span>Environment</span>
              <Badge variant="outline">{envData.environment.NODE_ENV || "unknown"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Vercel Environment</span>
              <Badge variant="outline">{envData.environment.VERCEL_ENV || "not-vercel"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Deployment URL</span>
              <Badge variant="outline">{envData.environment.VERCEL_URL || "localhost"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Region</span>
              <Badge variant="outline">{envData.environment.region || "unknown"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Server-side Variables */}
      <Card>
        <CardHeader>
          <CardTitle>Server-side Environment Variables</CardTitle>
          <CardDescription>Required Salesforce credentials (secure, server-only)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(envData.serverSide).map(([key, data]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="font-medium">{key}</div>
                  <div className="text-sm text-muted-foreground">
                    Value: {data.value} {data.length ? `(${data.length} chars)` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(data.exists)}
                  <Badge variant={data.exists ? "default" : "destructive"}>
                    {data.exists ? "Configured" : "Missing"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client-side Variables (should be empty) */}
      <Card>
        <CardHeader>
          <CardTitle>Client-side Variables (Legacy)</CardTitle>
          <CardDescription>Old NEXT_PUBLIC_ variables that should be removed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(envData.clientSide).map(([key, data]) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="font-medium">{key}</div>
                  <div className="text-sm text-muted-foreground">Value: {data.value}</div>
                </div>
                <div className="flex items-center gap-2">
                  {data.exists ? (
                    <XCircle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <Badge variant={data.exists ? "destructive" : "default"}>
                    {data.exists ? "Should Remove" : "Not Present"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      {!envData.summary.allServerVarsConfigured && (
        <Card>
          <CardHeader>
            <CardTitle>Required Actions</CardTitle>
            <CardDescription>Steps to fix the environment variable configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Add Missing Environment Variables</h4>
              <p className="text-sm text-muted-foreground">
                Go to your Vercel project settings and add the missing server-side variables.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">2. Use Vercel CLI (Optional)</h4>
              <Button onClick={copyVercelCommands} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy Vercel Commands
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">3. Redeploy Application</h4>
              <p className="text-sm text-muted-foreground">
                After adding variables, redeploy your application for changes to take effect.
              </p>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="default" size="sm">
                <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Vercel Dashboard
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Actions */}
      {envData.summary.allServerVarsConfigured && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">🎉 Environment Variables Configured!</CardTitle>
            <CardDescription className="text-green-700">
              All required Salesforce environment variables are properly set. Test your application now.
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
                <a href="/debug/salesforce">Salesforce Debug</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timestamp */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {new Date(envData.summary.timestamp).toLocaleString()}
      </div>
    </div>
  )
}
