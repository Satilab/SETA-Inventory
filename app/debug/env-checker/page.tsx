"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Copy, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EnvStatus {
  hasInstanceUrl: boolean
  hasClientId: boolean
  hasClientSecret: boolean
  hasUsername: boolean
  hasPassword: boolean
  hasSecurityToken: boolean
  instanceUrl?: string
  username?: string
  environment?: string
  vercelEnv?: string
}

export default function EnvChecker() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [showValues, setShowValues] = useState(false)

  const checkEnvironment = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/environment")
      const data = await response.json()
      setEnvStatus(data)
    } catch (error) {
      console.error("Failed to check environment:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusIcon = (hasValue: boolean) => {
    return hasValue ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  const getStatusBadge = (hasValue: boolean) => {
    return <Badge variant={hasValue ? "default" : "destructive"}>{hasValue ? "Set" : "Missing"}</Badge>
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Environment Variables Checker</h1>
        <p className="text-muted-foreground mt-2">
          Check which Salesforce environment variables are configured in Vercel
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Check Current Environment</CardTitle>
          <CardDescription>
            This will check which environment variables are currently available to your app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={checkEnvironment} disabled={loading}>
            {loading ? "Checking..." : "Check Environment Variables"}
          </Button>
        </CardContent>
      </Card>

      {envStatus && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Environment Status
                <Button variant="ghost" size="sm" onClick={() => setShowValues(!showValues)}>
                  {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showValues ? "Hide" : "Show"} Values
                </Button>
              </CardTitle>
              <CardDescription>
                Running in: {envStatus.environment} | Vercel: {envStatus.vercelEnv}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: "SALESFORCE_INSTANCE_URL", hasValue: envStatus.hasInstanceUrl, value: envStatus.instanceUrl },
                  { key: "SALESFORCE_CLIENT_ID", hasValue: envStatus.hasClientId, value: "Hidden for security" },
                  {
                    key: "SALESFORCE_CLIENT_SECRET",
                    hasValue: envStatus.hasClientSecret,
                    value: "Hidden for security",
                  },
                  { key: "SALESFORCE_USERNAME", hasValue: envStatus.hasUsername, value: envStatus.username },
                  { key: "SALESFORCE_PASSWORD", hasValue: envStatus.hasPassword, value: "Hidden for security" },
                  {
                    key: "SALESFORCE_SECURITY_TOKEN",
                    hasValue: envStatus.hasSecurityToken,
                    value: "Hidden for security",
                  },
                ].map((env) => (
                  <div key={env.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(env.hasValue)}
                      <div>
                        <div className="font-medium">{env.key}</div>
                        {showValues && env.value && <div className="text-sm text-muted-foreground">{env.value}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(env.hasValue)}
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(env.key)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {(!envStatus.hasPassword || !envStatus.hasSecurityToken) && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Missing Required Variables:</strong> You need to set the missing environment variables in
                Vercel.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>How to Fix Missing Variables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Step 1: Go to Vercel Dashboard</h4>
                <p className="text-sm text-muted-foreground mb-2">Visit your project settings in Vercel</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://vercel.com/dashboard", "_blank")}
                >
                  Open Vercel Dashboard
                </Button>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Step 2: Add Missing Environment Variables</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  In your project → Settings → Environment Variables, add these:
                </p>
                <div className="space-y-2 text-sm font-mono">
                  {!envStatus.hasPassword && (
                    <div className="flex items-center justify-between p-2 bg-background rounded border">
                      <span>SALESFORCE_PASSWORD</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard("SALESFORCE_PASSWORD")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {!envStatus.hasSecurityToken && (
                    <div className="flex items-center justify-between p-2 bg-background rounded border">
                      <span>SALESFORCE_SECURITY_TOKEN</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard("SALESFORCE_SECURITY_TOKEN")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Step 3: Get Your Security Token</h4>
                <p className="text-sm text-muted-foreground mb-2">If you don't have your security token:</p>
                <ol className="text-sm space-y-1 ml-4 list-decimal">
                  <li>Log into your Salesforce org</li>
                  <li>Go to Settings → My Personal Information → Reset My Security Token</li>
                  <li>Click "Reset Security Token"</li>
                  <li>Check your email for the new token</li>
                </ol>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Step 4: Redeploy</h4>
                <p className="text-sm text-muted-foreground">
                  After adding the environment variables, redeploy your app for the changes to take effect.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
