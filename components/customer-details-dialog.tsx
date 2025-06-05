"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageSquare, Building, FileText, Calendar, X } from "lucide-react"
import { useState } from "react"
import type { SalesforceCustomer } from "@/hooks/use-salesforce-customers"

interface CustomerDetailsDialogProps {
  customer: SalesforceCustomer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCall?: (phone: string) => void
  onEmail?: (email: string) => void
  onWhatsApp?: (phone: string) => void
}

export function CustomerDetailsDialog({
  customer,
  open,
  onOpenChange,
  onCall,
  onEmail,
  onWhatsApp,
}: CustomerDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<"details" | "quote" | "contact">("details")

  // Safe getter functions for your specific fields
  const getName = () => {
    return customer?.Name || "Unknown Customer"
  }

  const getCustomerEmail = () => {
    return customer?.Customer_Email__c || "N/A"
  }

  const getPhoneNumber = () => {
    return customer?.Phone_Number__c || "N/A"
  }

  const getQuoteDate = () => {
    if (!customer?.Quote_Date__c) return "N/A"
    try {
      const date = new Date(customer.Quote_Date__c)
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      return customer.Quote_Date__c
    }
  }

  const getReason = () => {
    return customer?.reason__c || "N/A"
  }

  const getTotalAmount = () => {
    if (customer?.Total_amount__c === undefined || customer?.Total_amount__c === null) return "N/A"
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(customer.Total_amount__c)
  }

  const getCreatedDate = () => {
    if (!customer?.CreatedDate) return "N/A"
    try {
      const date = new Date(customer.CreatedDate)
      return date.toLocaleDateString("en-IN")
    } catch (e) {
      return customer.CreatedDate
    }
  }

  const getLastModifiedDate = () => {
    if (!customer?.LastModifiedDate) return "N/A"
    try {
      const date = new Date(customer.LastModifiedDate)
      return date.toLocaleDateString("en-IN")
    } catch (e) {
      return customer.LastModifiedDate
    }
  }

  // Handle actions
  const handleCall = () => {
    const phone = getPhoneNumber()
    if (phone !== "N/A" && onCall) {
      onCall(phone)
    }
  }

  const handleEmail = () => {
    const email = getCustomerEmail()
    if (email !== "N/A" && onEmail) {
      onEmail(email)
    }
  }

  const handleWhatsApp = () => {
    const phone = getPhoneNumber()
    if (phone !== "N/A" && onWhatsApp) {
      onWhatsApp(phone)
    }
  }

  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            <span className="truncate">{getName()}</span>
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === "details" ? "border-b-2 border-primary font-medium" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "quote" ? "border-b-2 border-primary font-medium" : ""}`}
            onClick={() => setActiveTab("quote")}
          >
            Quote Info
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "contact" ? "border-b-2 border-primary font-medium" : ""}`}
            onClick={() => setActiveTab("contact")}
          >
            Contact
          </button>
        </div>

        {activeTab === "details" && (
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 font-medium text-sm text-muted-foreground">
                <Building className="h-4 w-4" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 gap-4 mt-2">
                <div>
                  <div className="text-xs text-muted-foreground">Customer Name</div>
                  <div className="font-medium">{getName()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Reason</div>
                  <div>{getReason()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Source Object</div>
                  <div className="text-sm">
                    {customer.SourceObject && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {customer.SourceObject}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 font-medium text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Record Information
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <div className="text-xs text-muted-foreground">Created Date</div>
                  <div className="text-sm">{getCreatedDate()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Last Modified</div>
                  <div className="text-sm">{getLastModifiedDate()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "quote" && (
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 font-medium text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                Quote Information
              </h3>
              <div className="grid grid-cols-1 gap-4 mt-2">
                <div>
                  <div className="text-xs text-muted-foreground">Quote Date</div>
                  <div className="font-medium">{getQuoteDate()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total Amount</div>
                  <div className="text-lg font-bold text-green-600">{getTotalAmount()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Reason/Notes</div>
                  <div className="bg-gray-50 p-3 rounded-md">{getReason()}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-4">
            <div>
              <h3 className="flex items-center gap-2 font-medium text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4 mt-2">
                <div>
                  <div className="text-xs text-muted-foreground">Phone Number</div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{getPhoneNumber()}</span>
                    {getPhoneNumber() !== "N/A" && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCall}>
                        <Phone className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Customer Email</div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium break-all">{getCustomerEmail()}</span>
                    {getCustomerEmail() !== "N/A" && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleEmail}>
                        <Mail className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              {getPhoneNumber() !== "N/A" && (
                <Button variant="outline" size="sm" onClick={handleCall} className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              )}
              {getCustomerEmail() !== "N/A" && (
                <Button variant="outline" size="sm" onClick={handleEmail} className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              )}
              {getPhoneNumber() !== "N/A" && (
                <Button variant="outline" size="sm" onClick={handleWhatsApp} className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <div className="text-xs text-muted-foreground">ID: {customer.Id}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {getPhoneNumber() !== "N/A" && (
              <Button variant="default" size="sm" onClick={handleCall}>
                <Phone className="h-4 w-4 mr-2" />
                Call Customer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
