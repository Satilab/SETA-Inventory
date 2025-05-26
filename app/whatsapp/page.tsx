"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, Phone, User, CheckCircle, Package, FileText, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockChats = [
  {
    id: 1,
    customerName: "Rajesh Electrical Works",
    phone: "+91 9876543210",
    lastMessage: "Can you send me the quote for 50 MCBs?",
    timestamp: "2 min ago",
    unread: 2,
    status: "active",
  },
  {
    id: 2,
    customerName: "Modern Electronics",
    phone: "+91 9876543211",
    lastMessage: "Order confirmed. When will it be delivered?",
    timestamp: "15 min ago",
    unread: 0,
    status: "pending",
  },
  {
    id: 3,
    customerName: "Power Solutions Ltd",
    phone: "+91 9876543212",
    lastMessage: "Thank you for the quick delivery!",
    timestamp: "1 hour ago",
    unread: 0,
    status: "completed",
  },
]

const mockMessages = [
  {
    id: 1,
    sender: "customer",
    message: "Hi, I need 50 pieces of MCB 32A. What's the price?",
    timestamp: "10:30 AM",
    type: "text",
  },
  {
    id: 2,
    sender: "business",
    message:
      "Hello! MCB 32A is available at ₹520 per piece. For 50 pieces, total would be ₹26,000. Would you like me to create an order?",
    timestamp: "10:32 AM",
    type: "text",
  },
  {
    id: 3,
    sender: "customer",
    message: "Yes, please create the order. My GSTIN is 36ABCDE1234F1Z5",
    timestamp: "10:35 AM",
    type: "text",
  },
  {
    id: 4,
    sender: "business",
    message: "Order created successfully! Order ID: ORD-2024-001. I'll send you the invoice shortly.",
    timestamp: "10:36 AM",
    type: "order",
  },
  {
    id: 5,
    sender: "business",
    message: "Invoice-ORD-2024-001.pdf",
    timestamp: "10:37 AM",
    type: "document",
  },
]

export default function WhatsAppPage() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0])
  const [newMessage, setNewMessage] = useState("")
  const { toast } = useToast()

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the customer",
      })
      setNewMessage("")
    }
  }

  const handleCreateOrder = () => {
    toast({
      title: "Order Created",
      description: "Order has been automatically created in Salesforce",
    })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      completed: "outline",
    } as const
    return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status}</Badge>
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>WhatsApp</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp Integration</h1>
          <p className="text-muted-foreground">Manage customer conversations and process orders</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 h-[600px]">
          {/* Chat List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Active Chats</CardTitle>
              <CardDescription>Recent customer conversations</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 p-4">
                  {mockChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedChat.id === chat.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{chat.customerName}</p>
                            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                          {chat.unread > 0 && (
                            <Badge variant="destructive" className="mt-1 text-xs">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">{chat.phone}</p>
                        {getStatusBadge(chat.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedChat.customerName}</CardTitle>
                    <CardDescription>{selectedChat.phone}</CardDescription>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCreateOrder}>
                    <Package className="h-4 w-4" />
                    Create Order
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[400px]">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {mockMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "business" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "business" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.type === "text" && <p className="text-sm">{message.message}</p>}
                        {message.type === "order" && (
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4" />
                            <p className="text-sm">{message.message}</p>
                          </div>
                        )}
                        {message.type === "document" && (
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <p className="text-sm">{message.message}</p>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs opacity-70">{message.timestamp}</p>
                          {message.sender === "business" && <CheckCircle className="h-3 w-3 opacity-70" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex space-x-2 mt-4">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 min-h-[40px] max-h-[100px]"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>WhatsApp orders awaiting processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Need immediate attention</p>
              <Button className="w-full mt-3" variant="outline">
                Process All Orders
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auto-Generated Invoices</CardTitle>
              <CardDescription>Invoices created from WhatsApp orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">This week</p>
              <Button className="w-full mt-3" variant="outline">
                View Invoices
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Interactions</CardTitle>
              <CardDescription>Total interactions synced to CRM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">Synced to Salesforce</p>
              <Button className="w-full mt-3" variant="outline">
                Sync Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
