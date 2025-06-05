import { NextResponse } from "next/server"

async function getSalesforceToken() {
  const config = {
    instanceUrl: process.env.SALESFORCE_INSTANCE_URL || "https://login.salesforce.com",
    clientId: process.env.SALESFORCE_CLIENT_ID || "",
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET || "",
    username: process.env.SALESFORCE_USERNAME || "",
    password: process.env.SALESFORCE_PASSWORD || "",
    securityToken: process.env.SALESFORCE_SECURITY_TOKEN || "",
  }

  const loginUrl = config.instanceUrl.includes("test.salesforce.com")
    ? "https://test.salesforce.com"
    : "https://login.salesforce.com"

  const response = await fetch(`${loginUrl}/services/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "password",
      client_id: config.clientId,
      client_secret: config.clientSecret,
      username: config.username,
      password: config.password + config.securityToken,
    }),
  })

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status}`)
  }

  return response.json()
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const objectName = url.searchParams.get("object") || "VENKATA_RAMANA_MOTORS__c"

    // Check if localhost
    const host = request.headers.get("host") || ""
    if (host.includes("localhost")) {
      return NextResponse.json({
        success: false,
        usingDemoMode: true,
        message: "Object description not available on localhost",
        fields: [
          "Productname__c",
          "Model__c",
          "Phase__c",
          "Stage__c",
          "Voltage__c",
          "Frequency__c",
          "Price__c",
          "Quantity__c",
          "HP__c",
        ],
      })
    }

    const authData = await getSalesforceToken()
    const apiUrl = authData.instance_url

    // Describe the Salesforce object to get available fields
    const describeResponse = await fetch(`${apiUrl}/services/data/v58.0/sobjects/${objectName}/describe/`, {
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
        Accept: "application/json",
      },
    })

    if (!describeResponse.ok) {
      throw new Error(`Failed to describe object: ${describeResponse.status}`)
    }

    const objectDescription = await describeResponse.json()

    // Extract field names
    const fields = objectDescription.fields.map((field: any) => ({
      name: field.name,
      label: field.label,
      type: field.type,
      required: !field.nillable && !field.defaultedOnCreate,
      createable: field.createable,
    }))

    // Filter to only createable fields
    const createableFields = fields.filter((field: any) => field.createable)

    return NextResponse.json({
      success: true,
      objectName: objectDescription.name,
      label: objectDescription.label,
      fields: createableFields,
      totalFields: fields.length,
    })
  } catch (error) {
    console.error("Error describing Salesforce object:", error)

    return NextResponse.json({
      success: false,
      usingDemoMode: true,
      message: "Failed to describe Salesforce object, using demo mode",
      error: error instanceof Error ? error.message : "Unknown error",
      // Provide fallback field list
      fields: [
        { name: "Productname__c", label: "Product Name", type: "string", required: true, createable: true },
        { name: "Model__c", label: "Model", type: "string", required: true, createable: true },
        { name: "Phase__c", label: "Phase", type: "picklist", required: false, createable: true },
        { name: "Stage__c", label: "Stage", type: "double", required: false, createable: true },
        { name: "Voltage__c", label: "Voltage", type: "picklist", required: false, createable: true },
        { name: "Frequency__c", label: "Frequency", type: "picklist", required: false, createable: true },
        { name: "Price__c", label: "Price", type: "currency", required: false, createable: true },
        { name: "Quantity__c", label: "Quantity", type: "double", required: false, createable: true },
        { name: "HP__c", label: "H.P", type: "double", required: false, createable: true },
      ],
    })
  }
}
