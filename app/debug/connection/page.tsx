import { TestConnection } from "@/components/test-connection"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

export default function ConnectionDebugPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Salesforce Connection Debugging</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connection Test</CardTitle>
            <CardDescription>Test the actual connection to Salesforce</CardDescription>
          </CardHeader>
          <CardContent>
            <TestConnection />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>
              Check if all required environment variables are set (values are not displayed for security)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "SALESFORCE_INSTANCE_URL",
                "SALESFORCE_CLIENT_ID",
                "SALESFORCE_CLIENT_SECRET",
                "SALESFORCE_USERNAME",
                "SALESFORCE_PASSWORD",
                "SALESFORCE_SECURITY_TOKEN",
              ].map((variable) => (
                <li key={variable} className="flex items-center">
                  <span className="font-mono text-sm">{variable}</span>
                  <span className="ml-2">
                    {process.env[variable] ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
