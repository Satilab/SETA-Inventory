"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, ExternalLink, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react"
import { SalesforceUrlFixer } from "@/components/salesforce-url-fixer"

export default function UrlFixPage() {
  const [step, setStep] = useState(1)
  const [foundUrl, setFoundUrl] = useState("")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Fix Your Salesforce URL</h1>
        <p className="text-muted-foreground">Let's find your correct Salesforce instance URL step by step</p>
      </div>

      {/* Current Error */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Current Issue:</strong> "URL No Longer Exists" - Your SALESFORCE_INSTANCE_URL is incorrect
        </AlertDescription>
      </Alert>

      {/* Step-by-step process */}
      <div className="space-y-6">
        {/* Step 1: Open Salesforce */}
        <Card className={step >= 1 ? "border-blue-500" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                1
              </span>
              Open Salesforce in a New Tab
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>First, let's log into your Salesforce org to find the correct URL.</p>
            <div className="flex gap-2">
              <Button asChild>
                <a href="https://login.salesforce.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Salesforce (Production)
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://test.salesforce.com" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Salesforce (Sandbox/Dev)
                </a>
              </Button>
            </div>
            <Button onClick={() => setStep(2)} variant="outline" className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              I've logged into Salesforce
            </Button>
          </CardContent>
        </Card>

        {/* Step 2: Find URL */}
        {step >= 2 && (
          <Card className={step >= 2 ? "border-blue-500" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                Copy Your Instance URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <p>After logging in, look at your browser's address bar. You should see something like:</p>
                <div className="bg-muted p-3 rounded-lg space-y-2">
                  <div className="text-sm font-mono">
                    ✅ https://yourcompany-dev-ed.my.salesforce.com/lightning/page/home
                  </div>
                  <div className="text-sm font-mono">✅ https://yourcompany.my.salesforce.com/home/home.jsp</div>
                  <div className="text-sm font-mono">
                    ✅ https://yourcompany--sandbox.my.salesforce.com/lightning/setup/
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Copy everything <strong>before</strong> "/lightning" or "/home" - that's your instance URL!
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="found-url">Paste your URL here:</Label>
                <Input
                  id="found-url"
                  value={foundUrl}
                  onChange={(e) => setFoundUrl(e.target.value)}
                  placeholder="https://yourcompany-dev-ed.my.salesforce.com"
                />
              </div>

              {foundUrl && (
                <Button onClick={() => setStep(3)} className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Validate This URL
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Validate and Fix */}
        {step >= 3 && foundUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                  3
                </span>
                Validate & Update Environment Variable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SalesforceUrlFixer currentUrl={foundUrl} onUrlFixed={(newUrl) => setStep(4)} />
            </CardContent>
          </Card>
        )}

        {/* Step 4: Update Vercel */}
        {step >= 4 && (
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Update Your Environment Variable
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  Great! Now update your environment variable in Vercel with this URL:
                  <div className="flex items-center justify-between mt-2 p-2 bg-background rounded border">
                    <code className="text-sm">{foundUrl}</code>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(foundUrl)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-medium">How to update in Vercel:</h4>
                <div className="space-y-2">
                  {[
                    "Go to your Vercel dashboard",
                    "Select your project",
                    "Go to Settings → Environment Variables",
                    "Find SALESFORCE_INSTANCE_URL",
                    "Update it with the URL above",
                    "Redeploy your application",
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button asChild className="w-full">
                <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Vercel Dashboard
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
