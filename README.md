# SETA Smart Inventory

A mobile-first inventory and customer engagement app designed for Secunderabad Electrical Trade Associations (SETA) businesses.

## 🌟 Features

### 📦 Inventory Management
- **Product Management**: Add, edit, and track electrical products with HSN codes, warranties, and pricing
- **Barcode Scanning**: Quick stock updates using mobile camera or manual entry
- **Smart Alerts**: Low stock, out of stock, and dead stock notifications
- **Multi-location Support**: Track inventory across different locations

### 👥 Customer Relationship Management
- **Customer Profiles**: Manage customer details with GSTIN, contact info, and purchase history
- **Customer Segmentation**: Retail, Contractor, and Bulk customer types
- **Engagement Tracking**: Monitor customer activity and identify at-risk customers
- **Tiered Pricing**: Different pricing based on customer type

### 💬 WhatsApp Integration
- **Order Processing**: Receive and process orders directly from WhatsApp
- **Auto-invoicing**: Generate GST-compliant invoices from WhatsApp orders
- **Customer Communication**: Manage conversations and order status updates
- **Catalog Sharing**: Share product catalogs via WhatsApp

### 🤖 AI Analytics
- **Demand Forecasting**: AI-powered sales predictions
- **Churn Risk Analysis**: Identify customers at risk of leaving
- **Inventory Optimization**: Smart reorder recommendations
- **Performance Insights**: Top-selling products and trends

### 💰 Finance Management
- **GST Compliance**: Generate GST-compliant invoices and returns
- **Customer Ledger**: Track payments, outstanding amounts, and credit limits
- **Financial Reports**: Revenue, profit, and tax analysis
- **Payment Tracking**: Monitor payment status and overdue accounts

### 📊 Reports & Analytics
- **Sales Reports**: Comprehensive sales analysis and trends
- **Inventory Reports**: Stock levels, movements, and valuation
- **Customer Analytics**: Behavior and engagement metrics
- **Financial Summaries**: Revenue, profit, and compliance reports

## 🚀 Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Mobile-First**: Responsive design optimized for mobile devices

## 📱 Mobile Optimization

- **Touch-Friendly**: Optimized for touch interactions
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Fast Loading**: Optimized for mobile networks
- **Offline Ready**: Can be enhanced with PWA features

## 🛠️ Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd seta-smart-inventory
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production**
   \`\`\`bash
   npm run build
   \`\`\`

## 📦 Static Deployment

This app is configured for static export and can be deployed to any static hosting service:

\`\`\`bash
# Build static version
npm run build

# The 'out' folder contains all static files
\`\`\`

### Deployment Options:
- **Vercel**: Connect GitHub repository for automatic deployment
- **Netlify**: Drag and drop the 'out' folder
- **GitHub Pages**: Push 'out' contents to gh-pages branch
- **Any Static Host**: Upload 'out' folder contents

## 🔧 Configuration

### Environment Variables
For production deployment, add environment variables with `NEXT_PUBLIC_` prefix:

\`\`\`bash
NEXT_PUBLIC_SALESFORCE_API_URL=https://your-salesforce-instance.com
NEXT_PUBLIC_WHATSAPP_API_URL=https://your-whatsapp-api.com
\`\`\`

### Salesforce Integration
To connect with Salesforce:
1. Set up Salesforce Connected App
2. Configure OAuth settings
3. Add API endpoints to environment variables
4. Implement client-side API calls

## 📋 Project Structure

\`\`\`
seta-smart-inventory/
├── app/                    # Next.js app directory
│   ├── analytics/         # AI Analytics pages
│   ├── customers/         # Customer management
│   ├── finance/           # Financial management
│   ├── inventory/         # Inventory management
│   │   ├── alerts/        # Stock alerts
│   │   └── scanner/       # Barcode scanner
│   ├── reports/           # Reports and analytics
│   ├── whatsapp/          # WhatsApp integration
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── app-sidebar.tsx   # Main navigation
├── lib/                  # Utility functions
├── public/               # Static assets
├── next.config.mjs       # Next.js configuration
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies
\`\`\`

## 🎯 Demo Data

The app includes comprehensive mock data for demonstration:
- **Products**: MCBs, LED panels, cables, switches, distribution panels
- **Customers**: Various customer types with realistic data
- **Orders**: Sample WhatsApp orders and invoices
- **Analytics**: AI insights and forecasting data

## 🔮 Future Enhancements

- **Real Salesforce Integration**: Connect with actual Salesforce CRM
- **WhatsApp Business API**: Live WhatsApp integration
- **Real Barcode Scanning**: Camera-based barcode scanning
- **PWA Features**: Offline functionality and app installation
- **Push Notifications**: Real-time alerts and updates
- **Multi-language Support**: Hindi and Telugu language options

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for SETA businesses**
\`\`\`

Finally, let me create a simple build script:
