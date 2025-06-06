"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Copy } from "lucide-react"

interface ValidationResult {
  currentUrl: string
  validation: {
    isValid: boolean
    correctedUrl?: string
    error?: string
    suggestions: string[]
  }
  recommendedLoginUrl: string
  environmentCheck: {
    hasInstanceUrl: boolean
    hasClientId: boolean
    hasClientSecret: boolean
    hasUsername: boolean
    hasPassword: boolean
    hasSecurityToken: boolean
  }
}

export default function UrlValidatorPage() {
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateUrl = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/validate-url")
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    validateUrl()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Salesforce URL Validator</h1>
          <p className="text-muted-foreground">Validate and fix your Salesforce instance URL</p>
        </div>
        <Button onClick={validateUrl} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="grid gap-6">
          {/* Current URL Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.validation.isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Current Instance URL
              </CardTitle>
              <CardDescription>
                {result.validation.isValid
                  ? "Your Salesforce instance URL is correctly formatted"
                  : "Your Salesforce instance URL needs to be fixed"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">{result.currentUrl || "Not set"}</code>
                {result.currentUrl && (
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.currentUrl)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {result.validation.error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{result.validation.error}</AlertDescription>
                </Alert>
              )}

              {result.validation.correctedUrl && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Suggested correction:</strong>
                    <div className="flex items-center justify-between mt-2 p-2 bg-background rounded border">
                      <code className="text-sm">{result.validation.correctedUrl}</code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(result.validation.correctedUrl!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* URL Suggestions */}
          {result.validation.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>URL Format Examples</CardTitle>
                <CardDescription>Common Salesforce URL formats you can try</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.validation.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <code className="text-sm">{suggestion}</code>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(suggestion)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Environment Variables Check */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables Status</CardTitle>
              <CardDescription>Check which Salesforce environment variables are configured</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(result.environmentCheck).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </span>
                    <Badge variant={value ? "default" : "destructive"}>{value ? "Set" : "Missing"}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Login URL Info */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Login URL</CardTitle>
              <CardDescription>The authentication endpoint that should be used for your org type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <code className="text-sm">{result.recommendedLoginUrl}</code>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.recommendedLoginUrl)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
