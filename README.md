# 🐾 Wagabond Pets

AI-enabled digital health record system for pets with secure file storage, OCR capabilities, QR code sharing, and subscription management.

## 🚀 Overview

Wagabond Pets helps pet parents manage their furry family's health records in one secure, accessible place. Upload veterinary documents, share records instantly via QR codes, and get AI-powered health insights.

### Key Features

- 📁 **Secure Cloud Storage** - Store all pet medical records with AWS S3
- 🔍 **Smart OCR** - Automatically extract information from uploaded documents
- 📱 **QR Code Sharing** - Instantly share records with vets and daycare
- 🤖 **AI Health Insights** - Get intelligent analysis of your pet's health data
- 💳 **Flexible Subscriptions** - Affordable monthly/yearly plans with credit system
- 🐕 **Multi-Pet Support** - Manage unlimited pets per account

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Neon PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **File Storage**: AWS S3
- **OCR**: Google Cloud Vision API
- **Payments**: Stripe
- **AI**: OpenAI API
- **Styling**: TailwindCSS v3 + Shadcn/ui
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18.17 or higher
- npm or yarn package manager
- Git

### Required Accounts

1. **[Neon](https://neon.tech)** - PostgreSQL database
2. **[Clerk](https://clerk.com)** - Authentication
3. **[AWS](https://aws.amazon.com)** - S3 file storage
4. **[Google Cloud](https://cloud.google.com)** - Vision API for OCR
5. **[Stripe](https://stripe.com)** - Payment processing
6. **[OpenAI](https://openai.com)** - AI insights
7. **[Vercel](https://vercel.com)** - Deployment (optional for local dev)

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/TheExtravagantHobo/wagabondpets.git
cd wagabondpets
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (Neon)
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# AWS S3
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="wagabond-pets"

# Google Cloud Vision
GOOGLE_CLOUD_PROJECT_ID="..."
GOOGLE_CLOUD_CLIENT_EMAIL="..."
GOOGLE_CLOUD_PRIVATE_KEY="..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_MONTHLY_PRICE_ID="price_..."
STRIPE_YEARLY_PRICE_ID="price_..."
STRIPE_CREDIT_PRICE_ID="price_..."

# OpenAI
OPENAI_API_KEY="sk-..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Set Up Database

```bash
# Push database schema to Neon
npx prisma db push

# Generate Prisma client
npx prisma generate

# (Optional) Seed database with sample data
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
wagabond-pets/
├── app/                  # Next.js app directory
│   ├── (auth)/          # Authentication pages
│   ├── (dashboard)/     # Protected dashboard pages
│   ├── (public)/        # Public pages (shared records)
│   ├── api/             # API routes
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── pets/           # Pet-related components
│   ├── records/        # Record management components
│   ├── sharing/        # QR code & sharing components
│   └── layout/         # Layout components
├── lib/                # Utility functions & configurations
│   ├── db/            # Database queries
│   ├── aws/           # S3 upload functions
│   ├── stripe/        # Payment processing
│   └── utils/         # Helper functions
├── prisma/            # Database schema
├── public/            # Static assets
└── types/             # TypeScript definitions
```

## 🔧 Configuration

### File Upload Settings

- **Max file size**: 10MB per file
- **Allowed formats**: PDF, JPG, PNG, HEIC
- **Batch upload**: Up to 10 files simultaneously

### QR Code Sharing Options

- **Daycare Share**: Vaccinations, medications, feeding notes
- **Vet Share**: Complete medical history
- **Custom Share**: User-selected records
- **Duration**: 1 hour to 30 days (default: 24 hours)

### Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| Free Trial | 14 days | Full access (starts after first upload) |
| Monthly | $3/month | Unlimited pets & records |
| Yearly | $20/year | Includes 1 AI credit |
| AI Credits | $3 for 5 | For health insights |

## 🧪 Development

### Run Tests

```bash
npm run test
npm run test:e2e
```

### Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Create migration
npx prisma migrate dev --name migration-name

# Reset database
npx prisma migrate reset
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## 📦 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Or use Vercel CLI
vercel
```

### Production Checklist

- [ ] Set production environment variables
- [ ] Configure custom domain
- [ ] Set up Stripe webhooks for production
- [ ] Configure AWS S3 CORS policy
- [ ] Enable Google Cloud Vision API
- [ ] Set Clerk production keys
- [ ] Configure database backups
- [ ] Set up monitoring (optional)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Documentation: [docs.wagabondpets.com](https://docs.wagabondpets.com)
- Email: support@wagabondpets.com
- Discord: [Join our community](https://discord.gg/wagabondpets)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Neon for serverless PostgreSQL
- Clerk for authentication
- All our contributors and pet parents using Wagabond

---

Built with ❤️ for pet parents everywhere 🐾