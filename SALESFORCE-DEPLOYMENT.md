# 🚀 Salesforce Deployment Guide

## Environment Variables Setup

When deploying to Vercel, you need to configure the Salesforce environment variables in your Vercel project settings.

### 📋 Required Environment Variables

Add these environment variables in your Vercel project dashboard:

\`\`\`bash
# Salesforce Configuration (Server-side only)
SALESFORCE_INSTANCE_URL=https://your-instance.my.salesforce.com
SALESFORCE_CLIENT_ID=your_client_id_here
SALESFORCE_CLIENT_SECRET=your_client_secret_here
SALESFORCE_USERNAME=your_username_here
SALESFORCE_PASSWORD=your_password_here
SALESFORCE_SECURITY_TOKEN=your_security_token_here
\`\`\`

### 🔧 Vercel Deployment Steps

1. **Deploy to Vercel**:
   \`\`\`bash
   # Deploy using Vercel CLI
   vercel --prod
   
   # Or connect your GitHub repo to Vercel
   \`\`\`

2. **Add Environment Variables**:
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add each Salesforce variable listed above
   - Set Environment to "Production" and "Preview"

3. **Redeploy**:
   - After adding environment variables, redeploy your app
   - Go to Deployments tab and click "Redeploy"

### 🔍 Troubleshooting

**Common Issues:**

1. **"Salesforce not configured"**
   - ✅ Check all 6 environment variables are set in Vercel
   - ✅ Ensure no typos in variable names
   - ✅ Verify values don't have extra spaces

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

- Environment variables are server-side only
- Never expose Salesforce credentials in client-side code
- Use Vercel's secure environment variable storage
- Rotate security tokens periodically
\`\`\`

Now let's improve the environment variable detection:
