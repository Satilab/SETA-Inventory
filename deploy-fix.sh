#!/bin/bash

echo "🔧 Fixing deployment issues..."

# Clean up any build artifacts
rm -rf .next
rm -rf node_modules
rm -rf .vercel

# Reinstall dependencies
echo "📦 Installing dependencies..."
npm install

# Type check
echo "🔍 Type checking..."
npm run type-check

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!"
echo "🚀 Ready for deployment"
