"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { FileText, Download, BarChart3, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const reportTypes = [
  { id: "sales", title: "Sales Report", description: "Sales analysis and trends", icon: TrendingUp },
  { id: "inventory", title: "Inventory Report", description: "Stock levels and movements", icon: BarChart3 },
]

export default function ReportsPage() {
  const { toast } = useToast()

  const handleGenerate = (reportTitle: string) => {
    toast({ title: "Generating Report", description: `${reportTitle} is being generated` })
  }

  const handleDownload = (reportTitle: string) => {
    toast({ title: "Download Started", description: `Downloading ${reportTitle}` })
  }

  return (
    <SidebarInset>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
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
              <BreadcrumbPage>Reports</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download business reports</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {reportTypes.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <report.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button className="flex-1" onClick={() => handleGenerate(report.title)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => handleDownload(report.title)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SidebarInset>
  )
}
