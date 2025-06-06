# Salesforce Deployment Guide

## Environment Variables Setup

### For Vercel Deployment

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add the following environment variables** (WITHOUT NEXT_PUBLIC_ prefix for security):

\`\`\`bash
# Server-side only environment variables (SECURE)
SALESFORCE_INSTANCE_URL=https://your-instance.my.salesforce.com
SALESFORCE_CLIENT_ID=your_client_id_here
SALESFORCE_CLIENT_SECRET=your_client_secret_here
SALESFORCE_USERNAME=your_username_here
SALESFORCE_PASSWORD=your_password_here
SALESFORCE_SECURITY_TOKEN=your_security_token_here
\`\`\`

4. **Set Environment Scope**: 
   - Select "Production" and "Preview" for each variable
   - This ensures they're available in all deployments

5. **Redeploy your application** after adding all variables

### Security Notes

- ✅ **DO NOT** use `NEXT_PUBLIC_` prefix for Salesforce credentials
- ✅ These variables are server-side only and not exposed to the client
- ✅ Credentials are kept secure and not visible in browser
- ✅ Only server components and API routes can access these values

### Getting Your Salesforce Credentials

1. **Instance URL**: 
   - Format: `https://yourinstance.my.salesforce.com`
   - For sandbox: `https://yourinstance.sandbox.my.salesforce.com`

2. **Client ID & Secret**: 
   - Create a Connected App in Salesforce Setup
   - Enable OAuth settings
   - Copy Consumer Key (Client ID) and Consumer Secret (Client Secret)

3. **Username & Password**: 
   - Your Salesforce login credentials

4. **Security Token**: 
   - Go to Personal Settings → Reset My Security Token
   - Check your email for the new token

### Troubleshooting

- **Authentication Failed**: Check username, password, and security token
- **Invalid Instance URL**: Use your specific instance URL, not login.salesforce.com
- **Permission Errors**: Ensure your user has API access and object permissions

### Testing

After deployment, visit `/debug/salesforce` to verify your configuration.
\`\`\`

Now let's create a server action to safely get configuration status:
