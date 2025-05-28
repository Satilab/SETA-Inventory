"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  MessageSquare,
  Send,
  Phone,
  User,
  CheckCircle,
  Package,
  FileText,
  Download,
  FileCheck,
  Plus,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

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
    message: "Can you send me a formal quotation first? I need to get approval.",
    timestamp: "10:35 AM",
    type: "text",
  },
  {
    id: 4,
    sender: "business",
    message: "Sure, I'll prepare a quotation for you right away. Anything else you'd like to include?",
    timestamp: "10:36 AM",
    type: "text",
  },
  {
    id: 5,
    sender: "customer",
    message: "Also add 10 LED panels if you have them in stock.",
    timestamp: "10:37 AM",
    type: "text",
  },
]

export default function WhatsAppPage() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0])
  const [newMessage, setNewMessage] = useState("")
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false)
  const [messages, setMessages] = useState(mockMessages)
  const { toast } = useToast()

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "business" as const,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text" as const,
      }

      setMessages([...messages, message])
      setNewMessage("")

      toast({
        title: "Message Sent",
        description: "Your message has been sent to the customer",
      })
    }
  }

  const handleCreateOrder = () => {
    toast({
      title: "Order Created",
      description: "Order has been automatically created and synced to CRM",
    })
  }

  const handleCreateQuotation = () => {
    toast({
      title: "Quotation Created",
      description: "Quotation has been created and sent to the customer",
    })
    setIsQuoteDialogOpen(false)
  }

  const handleProcessAllOrders = () => {
    toast({
      title: "Processing Orders",
      description: "All pending WhatsApp orders are being processed",
    })
  }

  const handleViewInvoices = () => {
    toast({
      title: "Opening Invoices",
      description: "Redirecting to finance section for invoice management",
    })
  }

  const handleSyncNow = () => {
    toast({
      title: "Syncing Data",
      description: "Syncing all customer interactions to Salesforce CRM",
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
                <BreadcrumbLink asChild>
                  <Link href="/">Dashboard</Link>
                </BreadcrumbLink>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast({ title: "Calling", description: `Calling ${selectedChat.customerName}` })}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCreateOrder}>
                    <Package className="h-4 w-4" />
                    Create Order
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsQuoteDialogOpen(true)}>
                    <FileCheck className="h-4 w-4" />
                    Create Quote
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[400px]">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
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

          {/* Quick Actions */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>WhatsApp orders awaiting processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Need immediate attention</p>
              <Button className="w-full mt-3" variant="outline" onClick={handleProcessAllOrders}>
                Process All Orders
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Auto-Generated Invoices</CardTitle>
              <CardDescription>Invoices created from WhatsApp orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">This week</p>
              <Button className="w-full mt-3" variant="outline" asChild onClick={handleViewInvoices}>
                <Link href="/finance">View Invoices</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Quotations</CardTitle>
              <CardDescription>Quotations awaiting customer approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Follow up required</p>
              <Button className="w-full mt-3" variant="outline" asChild>
                <Link href="/quotations">View Quotations</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Customer Interactions</CardTitle>
              <CardDescription>Total interactions synced to CRM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">Synced to Salesforce</p>
              <Button className="w-full mt-3" variant="outline" onClick={handleSyncNow}>
                Sync Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quote Dialog */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Quotation from Chat</DialogTitle>
            <DialogDescription>Generate a quotation based on this conversation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">
                Customer
              </Label>
              <Input id="customer" value={selectedChat.customerName} readOnly className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valid-until" className="text-right">
                Valid Until
              </Label>
              <Input id="valid-until" type="date" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Items</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center gap-2 p-2 border rounded-md">
                  <div className="flex-1">
                    <p className="font-medium">MCB 32A Single Pole</p>
                    <p className="text-sm text-muted-foreground">₹520 x 50 units</p>
                  </div>
                  <p className="font-medium">₹26,000</p>
                </div>
                <div className="flex items-center gap-2 p-2 border rounded-md">
                  <div className="flex-1">
                    <p className="font-medium">LED Panel Light 40W</p>
                    <p className="text-sm text-muted-foreground">₹1,450 x 10 units</p>
                  </div>
                  <p className="font-medium">₹14,500</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input id="notes" placeholder="Additional notes" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4 flex justify-end space-x-2">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">₹40,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span className="font-medium">₹7,290</span>
                  </div>
                  <div className="flex justify-between font-bold mt-1">
                    <span>Total:</span>
                    <span>₹47,790</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateQuotation}>Create & Send Quotation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}
