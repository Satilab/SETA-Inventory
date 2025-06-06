"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react"
import { validateSalesforceUrl } from "@/lib/salesforce-url-validator"

interface UrlFixerProps {
  currentUrl?: string
  onUrlFixed?: (newUrl: string) => void
}

export function SalesforceUrlFixer({ currentUrl = "", onUrlFixed }: UrlFixerProps) {
  const [testUrl, setTestUrl] = useState(currentUrl)
  const [validation, setValidation] = useState(validateSalesforceUrl(currentUrl))

  const handleUrlChange = (url: string) => {
    setTestUrl(url)
    setValidation(validateSalesforceUrl(url))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStepsToFindUrl = () => [
    "Open a new browser tab and go to salesforce.com",
    "Click 'Log In' and enter your credentials",
    "After logging in, look at the URL in your browser address bar",
    "Copy everything before '/lightning' or '/home'",
    "Example: If you see 'https://mycompany-dev-ed.my.salesforce.com/lightning/page/home'",
    "Your instance URL is: 'https://mycompany-dev-ed.my.salesforce.com'",
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Fix Salesforce URL
        </CardTitle>
        <CardDescription>Your current URL is incorrect. Let's find the right one.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current URL Issue */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Current URL:</strong> {currentUrl}
            <br />
            <strong>Issue:</strong> {validation.error}
          </AlertDescription>
        </Alert>

        {/* Steps to Find Correct URL */}
        <div className="space-y-4">
          <h4 className="font-medium">How to Find Your Correct Salesforce URL:</h4>
          <div className="space-y-2">
            {getStepsToFindUrl().map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* URL Tester */}
        <div className="space-y-3">
          <Label htmlFor="test-url">Test Your URL Here:</Label>
          <div className="flex gap-2">
            <Input
              id="test-url"
              value={testUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://yourcompany.my.salesforce.com"
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={() => copyToClipboard(testUrl)} disabled={!testUrl}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* Validation Result */}
          {testUrl && (
            <Alert variant={validation.isValid ? "default" : "destructive"}>
              {validation.isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>
                {validation.isValid ? "✅ This URL format looks correct!" : `❌ ${validation.error}`}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Corrected URL Suggestion */}
        {validation.correctedUrl && (
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription>
              <strong>Suggested correction:</strong>
              <div className="flex items-center justify-between mt-2 p-2 bg-background rounded border">
                <code className="text-sm">{validation.correctedUrl}</code>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(validation.correctedUrl!)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Common Examples */}
        <div className="space-y-3">
          <h4 className="font-medium">Common URL Formats:</h4>
          <div className="space-y-2">
            {[
              { type: "Production", url: "https://yourcompany.my.salesforce.com" },
              { type: "Developer Edition", url: "https://yourcompany-dev-ed.my.salesforce.com" },
              { type: "Sandbox", url: "https://yourcompany--sandbox.my.salesforce.com" },
              { type: "Trailhead", url: "https://yourcompany-dev-ed.lightning.force.com" },
            ].map((example) => (
              <div key={example.type} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium text-sm">{example.type}</div>
                  <code className="text-xs text-muted-foreground">{example.url}</code>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleUrlChange(example.url)}>
                  Try This
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button asChild variant="outline">
            <a href="https://login.salesforce.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Salesforce
            </a>
          </Button>
          {validation.isValid && onUrlFixed && <Button onClick={() => onUrlFixed(testUrl)}>Use This URL</Button>}
        </div>
      </CardContent>
    </Card>
  )
}
