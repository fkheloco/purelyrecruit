# Purely Recruit

AI-powered recruiting platform with multi-tenant architecture, intelligent candidate matching, and seamless hiring workflows.

## Overview

**Purely Recruit** is a next-generation recruiting platform that combines AI-enhanced candidate matching with powerful recruiting workflows. Built for staffing firms, recruiting agencies, and high-volume hiring teams, it automates job processing, candidate ranking, and communication at scale.

**Purely Works**: We build this with our signature approach—AI does the initial work, humans refine and deliver. The platform handles millions of vectors for semantic search and matching, powered by Claude AI and PostgreSQL with pgvector.

## Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Database:** PostgreSQL with pgvector (Neon)
* **Auth:** Clerk
* **AI:** Anthropic Claude API
* **Storage:** Vercel Blob
* **ORM:** Drizzle ORM
* **Styling:** Tailwind CSS + shadcn/ui
* **Deployment:** Vercel
* **Cron Jobs:** Vercel Crons

## Key Features

* **Intelligent Job Processing** — AI-powered job extraction and standardization
* **Semantic Candidate Matching** — Vector-based matching powered by Claude embeddings
* **Multi-Tenant Architecture** — Isolated organizations with role-based access
* **Real-time Notifications** — Email and in-app alerts for matches and updates
* **Bulk Upload & Processing** — Handle 100s of resumes with intelligent parsing
* **Scoring & Ranking** — Automated candidate ranking by fit
* **Communication Workflows** — Templated outreach and follow-up sequences
* **Analytics Dashboard** — Placement metrics, conversion funnels, team performance

## Quick Start

### Prerequisites

* Node.js 18.17+
* npm or yarn
* Git

### 1. Clone & Install

```bash
git clone <repository-url>
cd purely-recruit
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

See [Environment Variables](#environment-variables) section below for detailed setup.

### 3. Set Up Database

Initialize your Neon PostgreSQL database and run migrations:

```bash
npm run db:push
```

Or use the provided script:

```bash
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Sign In

Create an account via Clerk auth, or log in with an existing account.

## Environment Variables

All variables are defined in `.env.local`. Here's what you need:

| Variable | Type | Purpose | Example |
|----------|------|---------|---------|
| `DATABASE_URL` | Required | Neon PostgreSQL connection (pooled) | `postgresql://user:pass@host/db?sslmode=require` |
| `DATABASE_URL_DIRECT` | Required | Neon PostgreSQL direct connection (for migrations) | `postgresql://user:pass@host/db?sslmode=require` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Required | Clerk public key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Required | Clerk secret key | `sk_test_...` |
| `CLERK_WEBHOOK_SECRET` | Required | Webhook signing secret from Clerk dashboard | `whsec_...` |
| `ANTHROPIC_API_KEY` | Required | Claude API key for embeddings and processing | `sk-ant-...` |
| `BLOB_READ_WRITE_TOKEN` | Required | Vercel Blob storage token | `vercel_blob_...` |
| `CRON_SECRET` | Required | Secret for cron job authentication | Random string (at least 32 chars) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Required | Clerk sign-in page path | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Required | Clerk sign-up page path | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Required | Redirect after sign-in | `/` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Required | Redirect after sign-up | `/` |
| `NEXT_PUBLIC_APP_URL` | Required | App base URL (local or production) | `http://localhost:3000` |
| `RESEND_API_KEY` | Optional | Resend email API (for notifications) | `re_...` |
| `RESEND_FROM_EMAIL` | Optional | Sender email for notifications | `noreply@yourdomain.com` |

### Getting Credentials

**Neon PostgreSQL:**
1. Sign up at [neon.tech](https://neon.tech)
2. Create a project
3. Copy the connection string (pooled) for `DATABASE_URL`
4. Copy the direct connection string for `DATABASE_URL_DIRECT`

**Clerk:**
1. Sign up at [clerk.com](https://clerk.com)
2. Create an application
3. Navigate to API Keys
4. Copy Publishable Key → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
5. Copy Secret Key → `CLERK_SECRET_KEY`
6. Go to Webhooks → Create webhook for user events
7. Copy signing secret → `CLERK_WEBHOOK_SECRET`

**Anthropic (Claude):**
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Navigate to API Keys
3. Create a new API key
4. Copy the key → `ANTHROPIC_API_KEY`

**Vercel Blob:**
1. In your Vercel project, go to Storage → Blob
2. Create a new store
3. Copy the token → `BLOB_READ_WRITE_TOKEN`

**Resend (Optional):**
1. Sign up at [resend.com](https://resend.com)
2. Navigate to API Keys
3. Create new key → `RESEND_API_KEY`
4. Set a from email → `RESEND_FROM_EMAIL`

## Database Setup

### Initial Migration

```bash
npm run db:push
```

This runs Drizzle migrations and creates all necessary tables.

### Manual PostgreSQL Extensions

For pgvector support, run the following in your Neon SQL Editor:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

-- pgvector is now available for use in tables
-- The schema already includes vector columns for embeddings
-- HNSW and GIN indexes are created automatically by Drizzle
```

Or reference `scripts/setup-extensions.sql` for the full setup.

## Project Structure

```
purely-recruit/
├── app/                           # Next.js App Router
│   ├── (auth)/                   # Auth pages (sign-in, sign-up)
│   ├── (app)/                    # Protected app routes
│   │   ├── dashboard/            # Main dashboard
│   │   ├── jobs/                 # Job management
│   │   ├── candidates/           # Candidate profiles and search
│   │   ├── placements/           # Placement tracking
│   │   └── settings/             # Org and user settings
│   ├── api/
│   │   ├── webhooks/             # Clerk and external webhooks
│   │   ├── cron/                 # Vercel cron handlers
│   │   └── [service]/            # API endpoints for services
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home/landing
├── lib/
│   ├── ai/                       # Claude AI integration
│   ├── db/                       # Database utilities and schema
│   ├── auth/                     # Auth helpers
│   ├── storage/                  # Blob storage utilities
│   └── utils/                    # Helper functions
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── dashboard/                # Dashboard-specific components
│   └── layout/                   # Layout components (header, sidebar)
├── hooks/                        # React custom hooks
├── types/                        # TypeScript type definitions
├── scripts/                      # Setup and utility scripts
├── public/                       # Static assets
├── .env.local                    # Environment variables (local)
├── .env.local.example            # Environment template
├── next.config.ts                # Next.js configuration
├── vercel.json                   # Vercel deployment config (crons)
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind CSS config
├── drizzle.config.ts             # Drizzle ORM config
└── package.json                  # Dependencies and scripts
```

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Database migrations
npm run db:push              # Push schema changes to DB
npm run db:generate          # Generate migration files
npm run db:studio            # Open Drizzle Studio

# Code quality
npm run lint                 # Run ESLint
npm run type-check          # Run TypeScript check

# Testing (when configured)
npm test
npm run test:watch
```

### Hot Reload

The dev server supports hot module replacement (HMR). Changes to:
* Server components auto-refresh
* Client components hot-reload
* CSS hot-updates
* API routes restart automatically

## Deployment to Vercel

### Prerequisites

* Vercel account (sign up at [vercel.com](https://vercel.com))
* GitHub repository connected to Vercel

### Step 1: Connect to Vercel

```bash
npm install -g vercel
vercel login
vercel link
```

### Step 2: Set Environment Variables in Vercel

In your Vercel project dashboard:

1. Go to Settings → Environment Variables
2. Add all variables from `.env.local`
3. Set for: Production, Preview, Development (or as needed)

**Critical variables:**
* `DATABASE_URL` (production)
* `DATABASE_URL_DIRECT` (production, only for migrations)
* `CLERK_SECRET_KEY`
* `ANTHROPIC_API_KEY`
* `BLOB_READ_WRITE_TOKEN`
* `CRON_SECRET`

### Step 3: Deploy

```bash
vercel deploy --prod
```

Or push to your GitHub connected branch for automatic deployments.

### Step 4: Configure Cron Jobs

Cron jobs are defined in `vercel.json`:

* **Process Jobs** — Every 2 minutes (`*/2 * * * *`)
* **Daily Digest** — 9:00 AM UTC daily (`0 9 * * *`)
* **Weekly Cleanup** — 3:00 AM UTC Sundays (`0 3 * * 0`)

These run automatically on Vercel. No additional setup needed.

### Step 5: Verify Deployment

Visit your production URL and confirm:
* Auth works (Clerk integration)
* Database queries work
* AI features respond correctly
* Cron jobs log successfully (check Vercel Logs)

## Database Backup & Maintenance

### Backup Strategy

Neon includes automated backups. To restore:

1. In Neon console, go to your project
2. Navigate to Backups
3. Select restore point
4. Confirm restore

### Monitoring

* Check database metrics in Neon dashboard
* Monitor query performance
* Review connection pool utilization

For vector performance:
* Monitor HNSW index size
* Check query execution times
* Scale pgvector index parameters if needed

## Troubleshooting

### Database Connection Issues

```
Error: connect ECONNREFUSED
```

* Verify `DATABASE_URL` is correct
* Check IP allowlist in Neon (whitelist Vercel IPs)
* Test connection: `psql $DATABASE_URL -c "SELECT 1"`

### Claude API Errors

```
Error: API request failed
```

* Check `ANTHROPIC_API_KEY` is valid
* Verify API quota in Anthropic console
* Check rate limits (100 RPM default)

### Clerk Auth Issues

```
Error: Missing or invalid CLERK_SECRET_KEY
```

* Regenerate keys in Clerk dashboard
* Update all environment variables
* Restart dev server

### Vercel Blob Upload Fails

```
Error: Invalid or expired token
```

* Regenerate `BLOB_READ_WRITE_TOKEN` in Vercel Storage
* Update environment variables
* Redeploy

## Performance Tips

* Use [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images) for avatars and media
* Enable [ISR (Incremental Static Regeneration)](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) for candidate profiles
* Leverage [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) for data fetching
* Use [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) to organize layouts
* Monitor vector search performance with pgvector indexes

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a pull request

## Support

For issues, questions, or feature requests:

* **Purely Works Email:** farid@purelyworks.com
* **Documentation:** See docs/ folder (if available)
* **Issues:** Report in GitHub Issues

---

**Built with AI-enhanced workflows by Purely Works** — *Helping You Build Smarter with AI*
