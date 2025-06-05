"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { CheckCircle, XCircle, AlertTriangle, Loader2, Globe, Monitor, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function DebugPage() {
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [describingObject, setDescribingObject] = useState(false)
  const [objectDescription, setObjectDescription] = useState<any>(null)
  const [configStatus, setConfigStatus] = useState<any>(null)
  const { toast } = useToast()

  const testConnection = async () => {
    setTesting(true)
    try {
      const response = await fetch("/api/test-connection")
      const result = await response.json()
      setTestResult(result)

      toast({
        title: result.connected ? "Connection Successful" : "Connection Failed",
        description: result.message,
        variant: result.connected ? "default" : "destructive",
      })
    } catch (error) {
      setTestResult({
        connected: false,
        message: "Failed to test connection",
        error: error instanceof Error ? error.message : "Unknown error",
      })
      toast({
        title: "Test Failed",
        description: "Unable to test Salesforce connection",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  const describeObject = async () => {
    setDescribingObject(true)
    try {
      const response = await fetch("/api/salesforce/describe-object?object=VENKATA_RAMANA_MOTORS__c")
      const result = await response.json()
      setObjectDescription(result)

      toast({
        title: result.success ? "Object Described" : "Description Failed",
        description: result.success ? `Found ${result.fields.length} fields` : result.message,
        variant: result.success ? "default" : "destructive",
      })
    } catch (error) {
      setObjectDescription({
        success: false,
        message: "Failed to describe object",
        error: error instanceof Error ? error.message : "Unknown error",
      })
      toast({
        title: "Description Failed",
        description: "Unable to describe Salesforce object",
        variant: "destructive",
      })
    } finally {
      setDescribingObject(false)
    }
  }

  const checkConfigStatus = async () => {
    try {
      const response = await fetch("/api/debug/salesforce")
      const result = await response.json()
      setConfigStatus(result)
    } catch (error) {
      console.error("Failed to check config status:", error)
    }
  }

  // Check config status on component mount
  useState(() => {
    checkConfigStatus()
  })

  // Check if running on localhost
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Debug</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h1 className="text-2xl font-bold">Salesforce Debug Console</h1>
          <p className="text-muted-foreground">Troubleshoot Salesforce integration issues</p>
        </div>

        {/* Environment Check */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Check</CardTitle>
            <CardDescription>Current environment and URL requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  {isLocalhost ? (
                    <Monitor className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Globe className="h-4 w-4 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium">Current Environment</p>
                    <p className="text-sm text-muted-foreground">
                      {isLocalhost ? "Localhost (Development)" : "Public URL (Production)"}
                    </p>
                  </div>
                </div>
                <Badge variant={isLocalhost ? "secondary" : "default"}>{isLocalhost ? "Local" : "Public"}</Badge>
              </div>

              {isLocalhost && (
                <div className="p-4 rounded-lg border border-orange-200 bg-orange-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <h4 className="font-medium text-orange-800">Localhost Detected</h4>
                  </div>
                  <p className="text-sm text-orange-600 mb-3">
                    Salesforce requires a public URL for authentication. The app will automatically use demo mode on
                    localhost.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-orange-800">To test Salesforce integration:</p>
                    <ul className="list-disc list-inside text-sm text-orange-600 space-y-1">
                      <li>
                        Deploy to Vercel: <code className="bg-orange-100 px-1 rounded">vercel --prod</code>
                      </li>
                      <li>
                        Use ngrok for local testing: <code className="bg-orange-100 px-1 rounded">ngrok http 3000</code>
                      </li>
                      <li>Deploy to any public hosting service</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Environment Variables Check */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Check if all required Salesforce environment variables are configured</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button onClick={checkConfigStatus} variant="outline" size="sm">
                Refresh Configuration Status
              </Button>

              {configStatus && (
                <div className="space-y-3">
                  {Object.entries(configStatus.configured || {}).map(([key, isConfigured]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        {isConfigured ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">SALESFORCE_{key.toUpperCase()}</p>
                          <p className="text-sm text-muted-foreground">{isConfigured ? "Configured" : "Missing"}</p>
                        </div>
                      </div>
                      <Badge variant={isConfigured ? "default" : "destructive"}>{isConfigured ? "✓" : "✗"}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Test</CardTitle>
            <CardDescription>Test the connection to Salesforce</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={testConnection} disabled={testing} className="w-full">
                {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {testing ? "Testing Connection..." : "Test Salesforce Connection"}
              </Button>

              {testResult && (
                <div
                  className={`p-4 rounded-lg border ${
                    testResult.connected ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {testResult.connected ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <h4 className={`font-medium ${testResult.connected ? "text-green-800" : "text-red-800"}`}>
                      {testResult.connected ? "Connection Successful" : "Connection Failed"}
                    </h4>
                  </div>

                  <p className={`text-sm mb-2 ${testResult.connected ? "text-green-600" : "text-red-600"}`}>
                    {testResult.message}
                  </p>

                  {testResult.error && (
                    <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700">
                      <strong>Error:</strong> {testResult.error}
                    </div>
                  )}

                  {testResult.note && (
                    <div className="mt-2 p-2 bg-blue-100 border border-blue-200 rounded text-sm text-blue-700">
                      <strong>Note:</strong> {testResult.note}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Object Description */}
        <Card>
          <CardHeader>
            <CardTitle>Salesforce Object Analysis</CardTitle>
            <CardDescription>Analyze the VENKATA_RAMANA_MOTORS__c object structure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={describeObject} disabled={describingObject} className="w-full">
                {describingObject && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Database className="mr-2 h-4 w-4" />
                {describingObject ? "Analyzing Object..." : "Analyze Salesforce Object"}
              </Button>

              {objectDescription && (
                <div
                  className={`p-4 rounded-lg border ${
                    objectDescription.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {objectDescription.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <h4 className={`font-medium ${objectDescription.success ? "text-green-800" : "text-red-800"}`}>
                      {objectDescription.success ? "Object Analysis Complete" : "Analysis Failed"}
                    </h4>
                  </div>

                  {objectDescription.success && (
                    <div className="space-y-3">
                      <p className="text-sm text-green-600">
                        Found {objectDescription.fields.length} createable fields in {objectDescription.objectName}
                      </p>

                      <div className="bg-white border rounded-lg p-3">
                        <h5 className="font-medium mb-2">Available Fields:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {objectDescription.fields.map((field: any) => (
                            <div key={field.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="font-mono text-xs">{field.name}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {field.type}
                                </Badge>
                                {field.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {!objectDescription.success && (
                    <div>
                      <p className="text-sm text-red-600 mb-2">{objectDescription.message}</p>
                      {objectDescription.error && (
                        <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700">
                          <strong>Error:</strong> {objectDescription.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card>
          <CardHeader>
            <CardTitle>Security Notice</CardTitle>
            <CardDescription>Environment variable security information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-green-200 bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Secure Configuration</p>
                <p className="text-sm text-green-600">
                  All Salesforce credentials are now properly secured on the server side. Environment variables are no
                  longer exposed to the client, ensuring your sensitive data remains protected.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Mode Info */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Mode</CardTitle>
            <CardDescription>Information about demo mode operation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-blue-200 bg-blue-50">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Demo Mode Active</p>
                <p className="text-sm text-blue-600">
                  The application is currently running in demo mode. All data operations will use local demo data
                  instead of Salesforce. This ensures the app works even without Salesforce configuration or when field
                  mapping issues occur.
                </p>
                {isLocalhost && (
                  <p className="text-sm text-blue-600 mt-2">
                    <strong>Localhost detected:</strong> Demo mode is automatically enabled because Salesforce requires
                    public URLs.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
