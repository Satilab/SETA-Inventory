#!/bin/bash

echo "🚀 Building SETA Smart Inventory for static deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build complete! Static files are in the 'out' directory."
echo ""
echo "📁 You can now deploy the 'out' folder to any static hosting service."
echo ""
echo "🌐 Deployment options:"
echo "  - Vercel: Connect your GitHub repo to Vercel"
echo "  - Netlify: Drag and drop the 'out' folder to Netlify"
echo "  - GitHub Pages: Push 'out' contents to gh-pages branch"
echo "  - Any static hosting: Upload 'out' folder contents"
echo ""
echo "🚀 To test locally, you can serve the 'out' directory with any static server"
echo "   Example: npx serve out"
