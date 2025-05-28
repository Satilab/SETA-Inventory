# SETA Smart Inventory - Static Deployment Guide

This guide explains how to deploy the SETA Smart Inventory app as a static website.

## 🚀 Quick Deploy

### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy
4. Your app will be available at `https://your-app.vercel.app`

### Option 2: Netlify
1. Run `npm run build` locally
2. Upload the `out` folder to Netlify
3. Or connect your GitHub repository to Netlify

### Option 3: GitHub Pages
1. Run `npm run build`
2. Push the `out` folder contents to your `gh-pages` branch
3. Enable GitHub Pages in repository settings

## 📦 Build Commands

\`\`\`bash
# Install dependencies
npm install

# Build for production (static export)
npm run build

# The static files will be in the 'out' directory
\`\`\`

## 🔧 Configuration

The app is configured for static export with:
- `output: 'export'` in `next.config.mjs`
- `trailingSlash: true` for better static hosting compatibility
- `images.unoptimized: true` for static image handling

## 📁 File Structure After Build

\`\`\`
out/
├── index.html              # Dashboard
├── inventory/
│   ├── index.html          # Inventory page
│   ├── scanner/
│   │   └── index.html      # Scanner page
│   └── alerts/
│       └── index.html      # Alerts page
├── customers/
│   └── index.html          # Customers page
├── whatsapp/
│   └── index.html          # WhatsApp page
├── analytics/
│   └── index.html          # Analytics page
├── finance/
│   └── index.html          # Finance page
├── reports/
│   └── index.html          # Reports page
├── _next/                  # Next.js assets
└── static/                 # Static assets
\`\`\`

## 🌐 Custom Domain

To use a custom domain:
1. Add a `CNAME` file to the `public` folder with your domain
2. Configure DNS to point to your hosting provider
3. Enable HTTPS in your hosting provider settings

## 📱 PWA Features (Optional)

To make the app installable on mobile devices, you can add:
- Web App Manifest (`public/manifest.json`)
- Service Worker for offline functionality
- App icons in various sizes

## 🔒 Environment Variables

For static deployment, any environment variables must be prefixed with `NEXT_PUBLIC_` to be available in the browser.

Example:
\`\`\`bash
NEXT_PUBLIC_SALESFORCE_API_URL=https://your-salesforce-instance.com
\`\`\`

## 📊 Analytics

You can add analytics by including tracking scripts in the `app/layout.tsx` file or using Next.js built-in analytics.

## 🚨 Limitations of Static Export

- No server-side API routes
- No server-side rendering (SSR)
- No incremental static regeneration (ISR)
- All data must be fetched client-side

For full Salesforce integration, you'll need to use client-side API calls or a separate backend service.
\`\`\`

Let's also add a simple build script for easier deployment:
