import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Popular pages:</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Link href="/inventory" className="text-primary hover:underline">
                Inventory
              </Link>
              <span>•</span>
              <Link href="/customers" className="text-primary hover:underline">
                Customers
              </Link>
              <span>•</span>
              <Link href="/whatsapp" className="text-primary hover:underline">
                WhatsApp
              </Link>
              <span>•</span>
              <Link href="/quotations" className="text-primary hover:underline">
                Quotations
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
