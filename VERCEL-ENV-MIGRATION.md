# Vercel Environment Variable Migration Guide

## The Issue

Your application has been updated to use secure server-side environment variables, but your Vercel project still has the old client-exposed prefixed variables. This is causing the "Not configured" errors.

## Quick Fix Steps

1. **Go to your Vercel project dashboard**:
   - URL: https://vercel.com/dashboard
   - Select your project: `v0-new-project-kqwizimmuf3`

2. **Navigate to Settings → Environment Variables**

3. **Add NEW server-side variables WITHOUT the client prefix**:
   - Copy each value from your existing variables
   - Create new variables with the same values but without the client prefix

   | Old Variable (Delete Later) | New Variable (Add Now) |
   |----------------------------|------------------------|
   | [OLD_CLIENT_INSTANCE_URL] | SALESFORCE_INSTANCE_URL |
   | [OLD_CLIENT_ID] | SALESFORCE_CLIENT_ID |
   | [OLD_CLIENT_SECRET] | SALESFORCE_CLIENT_SECRET |
   | [OLD_CLIENT_USERNAME] | SALESFORCE_USERNAME |
   | [OLD_CLIENT_PASSWORD] | SALESFORCE_PASSWORD |
   | [OLD_CLIENT_TOKEN] | SALESFORCE_SECURITY_TOKEN |

4. **Set Environment Scope**:
   - Select "Production" and "Preview" for each variable

5. **Redeploy your application**:
   - Go to the Deployments tab
   - Click "Redeploy" on your latest deployment

6. **Verify the configuration**:
   - Visit `/debug/salesforce` after redeployment
   - All variables should show green checkmarks

7. **Optional: Delete old variables**:
   - After confirming everything works, you can delete the old client-exposed variables
   - This keeps your environment variables clean and secure

## Required Environment Variables

Your Vercel project needs these 6 server-side environment variables:

- `SALESFORCE_INSTANCE_URL` - Your Salesforce instance URL
- `SALESFORCE_CLIENT_ID` - Connected app consumer key
- `SALESFORCE_CLIENT_SECRET` - Connected app consumer secret
- `SALESFORCE_USERNAME` - Your Salesforce username
- `SALESFORCE_PASSWORD` - Your Salesforce password
- `SALESFORCE_SECURITY_TOKEN` - Your Salesforce security token

## Troubleshooting

If you still see "Not configured" after following these steps:

1. **Check for typos**:
   - Variable names must match exactly (case-sensitive)
   - No spaces before or after values

2. **Verify deployment**:
   - Make sure you've redeployed after adding the new variables
   - Check deployment logs for any errors

3. **Test connection**:
   - Use the "Test Connection" button on the debug page
   - Check error messages for specific issues

## Security Notes

- All Salesforce credentials are now server-side only
- No sensitive data is exposed to the client browser
- This follows Next.js security best practices
- Safe for production deployment
