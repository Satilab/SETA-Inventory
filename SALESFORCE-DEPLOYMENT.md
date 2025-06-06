# 🚀 Salesforce Deployment Guide

## Environment Variables Setup

When deploying to Vercel, you need to configure the Salesforce environment variables in your Vercel project settings.

### 📋 Required Environment Variables

Add these environment variables in your Vercel project dashboard:

\`\`\`bash
# Salesforce Configuration (Client-side accessible for this app)
NEXT_PUBLIC_SALESFORCE_INSTANCE_URL=https://your-instance.my.salesforce.com
NEXT_PUBLIC_SALESFORCE_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_SALESFORCE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_SALESFORCE_USERNAME=your_username_here
NEXT_PUBLIC_SALESFORCE_PASSWORD=your_password_here
NEXT_PUBLIC_SALESFORCE_SECURITY_TOKEN=your_security_token_here
\`\`\`

### ✅ Your Current Configuration

Based on your Vercel settings, you have correctly configured:
- ✅ NEXT_PUBLIC_SALESFORCE_INSTANCE_URL
- ✅ NEXT_PUBLIC_SALESFORCE_CLIENT_ID
- ✅ NEXT_PUBLIC_SALESFORCE_CLIENT_SECRET
- ✅ NEXT_PUBLIC_SALESFORCE_USERNAME
- ✅ NEXT_PUBLIC_SALESFORCE_PASSWORD
- ✅ NEXT_PUBLIC_SALESFORCE_SECURITY_TOKEN

### 🔧 Vercel Deployment Steps

1. **Environment Variables** (✅ Already Done):
   - Your environment variables are correctly configured in Vercel
   - All 6 required variables are present with NEXT_PUBLIC_ prefix

2. **Redeploy**:
   - After updating the code, redeploy your app
   - Go to Deployments tab and click "Redeploy"

### 🔍 Troubleshooting

**Common Issues:**

1. **"Salesforce not configured"** (✅ Should be fixed now)
   - Code now uses NEXT_PUBLIC_ prefixed environment variables
   - Matches your Vercel configuration

2. **"Authentication Failed"**
   - ✅ Check your Salesforce credentials
   - ✅ Verify security token is current
   - ✅ For sandbox, use `test.salesforce.com` in instance URL

3. **"Invalid request, only public URLs are supported"**
   - ✅ Use format: `https://yourinstance.my.salesforce.com`
   - ✅ Don't use `login.salesforce.com` or `test.salesforce.com`

### 📊 Testing Deployment

After deployment, test these URLs:
- `/debug/salesforce` - Check configuration status
- `/customers` - Test customer data fetching
- `/inventory` - Test inventory data fetching
- `/inventory/alerts` - Test alerts data fetching

### 🔐 Security Notes

- Environment variables use NEXT_PUBLIC_ prefix for this application
- Credentials are accessible in the browser (consider server-side only for production)
- Use Vercel's secure environment variable storage
- Rotate security tokens periodically

### 🚀 Next Steps

1. Redeploy your application (code has been updated)
2. Test the connection at `/debug/salesforce`
3. Verify customer data loads at `/customers`
4. Check inventory data at `/inventory`
\`\`\`

Let's also update the debug page to show the correct environment variable names:
