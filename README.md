# NovaYield — AI-Powered Investment Platform

A production-ready, full-featured AI investment platform built with Next.js, TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion, and Supabase.

## Features

### Landing Page
- Animated hero carousel (3 slides, auto-rotate, swipe, navigation arrows, pagination dots)
- About section with strategy card
- Sectors of Interest (Agriculture, Real Estate, Oil & Gas, Gold Mining, Precious Stones, AI)
- Why Choose Us (6 premium cards)
- Animated statistics counters
- Investment plans preview
- Testimonials slider
- FAQ accordion
- CTA section
- Footer with social links

### Authentication
- User registration with referral code support
- Login
- Logout
- Forgot password (email reset link)
- Reset password
- Session management
- Protected routes

### User Dashboard
- Overview with wallet balance, stats, charts (wallet growth, deposits vs withdrawals, portfolio distribution)
- Announcements with dismiss
- Quick actions
- Recent transactions table
- Wallet page (all balances)
- Deposit system (5-step flow: amount → method → details → upload receipt → submit)
- Withdrawal system (wallet summary, method cards, request form with validation)
- Investments (active/completed/pending tracking)
- Investment plans (purchase with wallet balance)
- Transaction history (searchable, filterable)
- Referral program (referral link, share buttons, stats, referral table)
- Notifications (mark read, delete)
- Profile management
- Settings (dark mode, notification preferences)
- Security (password change, activity log)
- Floating support widget on every dashboard page

### Admin Dashboard
- Overview with platform stats and charts
- User management (view, suspend/reactivate, adjust wallet balances)
- Deposit management (approve/reject with remarks, view receipts, credit wallets)
- Withdrawal management (approve/reject, restore funds on rejection)
- Investment plans CRUD
- Support ticket management (view, reply, close)
- Announcements (create, broadcast to all users, toggle active)
- Settings (payment methods CRUD, platform configuration)
- Activity logs (searchable audit trail)

### Backend (Supabase)
- 23 database tables with Row Level Security
- 4 CRUD policies per table (no FOR ALL)
- Storage bucket for deposit receipts
- Edge function for email delivery (Resend integration)
- Auto-refreshing dashboard data (30-second intervals)

## Tech Stack
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Email:** Resend (via edge function)
- **Charts:** Recharts
- **Icons:** Lucide React

## Environment Variables
The following are pre-configured in `.env`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional (for email delivery):
- `RESEND_API_KEY` — Add via Supabase dashboard edge function secrets

## Getting Started
The dev server runs automatically. No setup needed.

## Database Migrations
All migrations are applied via Supabase MCP tools:
1. `001_initial_schema` — All tables + RLS policies
2. `002_seed_data` — Initial plans, payment methods, FAQs, testimonials, settings
3. `003_storage_bucket` — Receipts storage bucket

## Admin Access
After registering, manually set `is_admin = true` on your profile in Supabase to access the admin panel at `/admin`.

## Deployment
Deploy to Vercel or Netlify. Ensure environment variables are set in the deployment platform.
