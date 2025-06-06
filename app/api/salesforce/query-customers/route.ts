import { type NextRequest, NextResponse } from "next/server"
import { getSalesforceToken } from "@/lib/salesforce-auth"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching customers from Salesforce...")

    // Check if Salesforce is configured
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL
    const clientId = process.env.SALESFORCE_CLIENT_ID

    if (!instanceUrl || !clientId) {
      console.log("⚠️ Salesforce not configured")
      return NextResponse.json({
        success: false,
        records: [],
        totalSize: 0,
        done: true,
        message: "Salesforce not configured. Please set environment variables.",
        configurationStatus: {
          hasInstanceUrl: Boolean(instanceUrl),
          hasClientId: Boolean(clientId),
        },
      })
    }

    // Get Salesforce authentication token
    console.log("🔐 Authenticating with Salesforce...")
    const authResult = await getSalesforceToken()

    if (!authResult.success || !authResult.access_token) {
      console.log("❌ Salesforce authentication failed:", authResult.error)
      return NextResponse.json({
        success: false,
        records: [],
        totalSize: 0,
        done: true,
        message: "Salesforce authentication failed",
        salesforceError: authResult.error,
        troubleshooting: {
          suggestion: "Check your Salesforce credentials and instance URL",
          expectedFormat: "https://yourinstance.my.salesforce.com",
          currentUrl: instanceUrl?.substring(0, 50) + "...",
        },
      })
    }

    console.log("✅ Salesforce authentication successful")

    // Use the instance URL from the auth response
    const apiUrl = authResult.instance_url

    // Get URL parameters for customization
    const searchParams = request.nextUrl.searchParams
    const customObject = searchParams.get("object")
    const limit = searchParams.get("limit") || "100"
    const fields = searchParams.get("fields")

    // Try different customer objects with the specific fields you mentioned
    const customerQueries = []

    // If a custom object is specified, try that first
    if (customObject) {
      const fieldsToQuery = fields || "Id, Name, CreatedDate, LastModifiedDate"
      customerQueries.push({
        name: customObject,
        query: `SELECT ${fieldsToQuery} FROM ${customObject} LIMIT ${limit}`,
        custom: true,
      })
    }

    // Add standard queries
    customerQueries.push(
      // Try custom customer object first with your specific fields
      {
        name: "Churn_customers__c",
        query: `SELECT Id, Name, Customer_Email__c, Phone_Number__c, Quote_Date__c, reason__c, Total_amount__c, 
                CreatedDate, LastModifiedDate 
                FROM Churn_customers__c 
                ORDER BY LastModifiedDate DESC 
                LIMIT ${limit}`,
      },
      // Try VENKATA_RAMANA_MOTORS__c object with available fields
      {
        name: "VENKATA_RAMANA_MOTORS__c",
        query: `SELECT Id, Name, Productname__c, Model__c, Price__c, H_p__c, CreatedDate, LastModifiedDate 
                FROM VENKATA_RAMANA_MOTORS__c 
                ORDER BY LastModifiedDate DESC 
                LIMIT ${limit}`,
      },
      // Try Account object with standard fields
      {
        name: "Account",
        query: `SELECT Id, Name, Phone, Email__c, Website, Type, Industry, 
                BillingStreet, BillingCity, BillingState, BillingPostalCode,
                CreatedDate, LastModifiedDate
                FROM Account 
                ORDER BY LastModifiedDate DESC 
                LIMIT ${limit}`,
      },
      // Try Contact object with standard fields
      {
        name: "Contact",
        query: `SELECT Id, Name, Phone, Email, MailingStreet, MailingCity, MailingState, MailingPostalCode,
                AccountId, Account.Name, CreatedDate, LastModifiedDate
                FROM Contact 
                ORDER BY LastModifiedDate DESC 
                LIMIT ${limit}`,
      },
      // Try Lead object with standard fields
      {
        name: "Lead",
        query: `SELECT Id, Name, Phone, Email, Company, Status,
                Street, City, State, PostalCode,
                CreatedDate, LastModifiedDate
                FROM Lead 
                ORDER BY LastModifiedDate DESC 
                LIMIT ${limit}`,
      },
      // Try Opportunity object
      {
        name: "Opportunity",
        query: `SELECT Id, Name, AccountId, Account.Name, Amount, StageName, CloseDate,
                CreatedDate, LastModifiedDate
                FROM Opportunity 
                ORDER BY LastModifiedDate DESC 
                LIMIT ${limit}`,
      },
    )

    let salesforceRecords = []
    let queryUsed = ""
    let objectUsed = ""
    const queryResults = []
    const objectsChecked = []
    const objectErrors = {}

    // Try each query until one succeeds
    for (const queryConfig of customerQueries) {
      try {
        console.log(`🔍 Trying ${queryConfig.name} object...`)
        objectsChecked.push(queryConfig.name)

        const queryResponse = await fetch(
          `${apiUrl}/services/data/v58.0/query?q=${encodeURIComponent(queryConfig.query)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authResult.access_token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        )

        console.log(`Query response status for ${queryConfig.name}:`, queryResponse.status)

        if (!queryResponse.ok) {
          const errorText = await queryResponse.text()
          console.log(`❌ ${queryConfig.name} query failed:`, errorText.substring(0, 200))
          objectErrors[queryConfig.name] = {
            status: queryResponse.status,
            error: errorText.substring(0, 200),
          }
          continue
        }

        const result = await queryResponse.json()
        queryResults.push({
          object: queryConfig.name,
          recordCount: result.records?.length || 0,
          totalSize: result.totalSize || 0,
          custom: queryConfig.custom || false,
        })

        if (result.records && result.records.length > 0) {
          salesforceRecords = result.records
          queryUsed = queryConfig.query
          objectUsed = queryConfig.name
          console.log(`✅ Found ${salesforceRecords.length} records in ${queryConfig.name}`)
          break
        } else {
          console.log(`⚠️ No records found in ${queryConfig.name}`)
        }
      } catch (queryError) {
        console.log(`❌ Error querying ${queryConfig.name}:`, queryError)
        objectErrors[queryConfig.name] = {
          error: queryError instanceof Error ? queryError.message : String(queryError),
        }
        continue
      }
    }

    // If we found Salesforce records, normalize and return them
    if (salesforceRecords.length > 0) {
      console.log(`🎉 Successfully retrieved ${salesforceRecords.length} records from ${objectUsed}`)

      // Normalize the records to have consistent field names
      const normalizedRecords = salesforceRecords.map((record: any) => {
        // Handle different object types and map to your specific fields
        let customerName = ""
        let customerEmail = ""
        let phoneNumber = ""
        let quoteDate = ""
        let reason = ""
        let totalAmount = 0

        if (objectUsed === "Churn_customers__c") {
          // Direct mapping for your custom object
          customerName = record.Name || ""
          customerEmail = record.Customer_Email__c || ""
          phoneNumber = record.Phone_Number__c || ""
          quoteDate = record.Quote_Date__c || ""
          reason = record.reason__c || ""
          totalAmount = record.Total_amount__c || 0
        } else if (objectUsed === "VENKATA_RAMANA_MOTORS__c") {
          // Map from product object to customer-like fields
          customerName = record.Name || record.Productname__c || ""
          customerEmail = ""
          phoneNumber = ""
          quoteDate = record.CreatedDate || ""
          reason = record.Model__c || ""
          totalAmount = record.Price__c || 0
        } else if (objectUsed === "Account") {
          // Map from Account object
          customerName = record.Name || ""
          customerEmail = record.Email__c || record.Website || ""
          phoneNumber = record.Phone || ""
          quoteDate = record.CreatedDate || ""
          reason = record.Type || record.Industry || ""
          totalAmount = 0
        } else if (objectUsed === "Contact") {
          // Map from Contact object
          customerName = record.Name || ""
          customerEmail = record.Email || ""
          phoneNumber = record.Phone || ""
          quoteDate = record.CreatedDate || ""
          reason = record.Account?.Name || ""
          totalAmount = 0
        } else if (objectUsed === "Lead") {
          // Map from Lead object
          customerName = record.Name || record.Company || ""
          customerEmail = record.Email || ""
          phoneNumber = record.Phone || ""
          quoteDate = record.CreatedDate || ""
          reason = record.Status || ""
          totalAmount = 0
        } else if (objectUsed === "Opportunity") {
          // Map from Opportunity object
          customerName = record.Name || ""
          customerEmail = ""
          phoneNumber = ""
          quoteDate = record.CloseDate || ""
          reason = record.StageName || ""
          totalAmount = record.Amount || 0
        } else if (customObject) {
          // For custom object queries, just use the fields as they are
          customerName = record.Name || ""
          // Try to find email-like fields
          customerEmail = record.Email__c || record.Email || record.CustomerEmail__c || ""
          // Try to find phone-like fields
          phoneNumber = record.Phone__c || record.Phone || record.PhoneNumber__c || ""
          // Try to find date fields
          quoteDate = record.Date__c || record.CreatedDate || ""
          // Try to find description/notes fields
          reason = record.Description__c || record.Notes__c || record.Reason__c || ""
          // Try to find amount fields
          totalAmount = record.Amount__c || record.Total__c || record.Price__c || 0
        }

        return {
          Id: record.Id,
          // Your specific field mappings
          Name: customerName,
          Customer_Email__c: customerEmail,
          Phone_Number__c: phoneNumber,
          Quote_Date__c: quoteDate,
          reason__c: reason,
          Total_amount__c: totalAmount,
          // Additional metadata
          CreatedDate: record.CreatedDate,
          LastModifiedDate: record.LastModifiedDate,
          SourceObject: objectUsed,
          OriginalRecord: record,
        }
      })

      return NextResponse.json({
        success: true,
        records: normalizedRecords,
        totalSize: normalizedRecords.length,
        done: true,
        message: `Successfully fetched ${normalizedRecords.length} customers from Salesforce ${objectUsed} object`,
        salesforceInfo: {
          objectUsed: objectUsed,
          queryUsed: queryUsed,
          instanceUrl: apiUrl,
          recordCount: normalizedRecords.length,
          fieldsReturned: [
            "Name",
            "Customer_Email__c",
            "Phone_Number__c",
            "Quote_Date__c",
            "reason__c",
            "Total_amount__c",
          ],
          allQueriesRun: queryResults,
        },
        lastUpdated: new Date().toISOString(),
      })
    }

    // No records found in any object
    console.log("⚠️ No customer records found in any Salesforce object")
    return NextResponse.json({
      success: false,
      records: [],
      totalSize: 0,
      done: true,
      message: "No customer records found in Salesforce",
      salesforceInfo: {
        objectsChecked: objectsChecked,
        instanceUrl: apiUrl,
        authenticationStatus: "Success",
        queryResults: queryResults,
        objectErrors: objectErrors,
        expectedFields: [
          "Name",
          "Customer_Email__c",
          "Phone_Number__c",
          "Quote_Date__c",
          "reason__c",
          "Total_amount__c",
        ],
      },
      troubleshooting: {
        possibleReasons: [
          "No customer records exist in your Salesforce org",
          "Your user doesn't have permission to access these objects",
          "The objects we're querying don't exist in your org",
          "Your customer data is stored in a different object",
        ],
        suggestions: [
          "Create some test records in Salesforce",
          "Check your user permissions in Salesforce",
          "Try specifying a custom object with ?object=YourObject__c",
          "Check the Salesforce Setup to see which objects exist",
        ],
      },
    })
  } catch (error) {
    console.error("❌ Salesforce customer fetch error:", error)
    return NextResponse.json({
      success: false,
      records: [],
      totalSize: 0,
      done: true,
      message: "Failed to fetch customers from Salesforce",
      salesforceError: error instanceof Error ? error.message : String(error),
      troubleshooting: {
        suggestion: "Check Salesforce connection and object permissions",
        nextSteps: [
          "Verify Salesforce credentials",
          "Check object permissions",
          "Ensure objects exist in your org",
          "Visit /debug/salesforce for detailed diagnostics",
        ],
      },
    })
  }
}
