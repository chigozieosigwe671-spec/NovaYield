# How to Connect Your Own Supabase Backend

This guide walks you through replacing Bolt's provisioned backend with your own Supabase project.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com), sign up and log in
2. Click **New Project**
3. Choose a name, set a database password, pick a region close to your users
4. Wait 1-2 minutes for provisioning to complete

## 2. Get Your Credentials

In your Supabase dashboard, go to **Settings → API** and copy these three values:

| Setting | Where to find it | Looks like |
|---------|-----------------|------------|
| Project URL | Settings → API → Project URL | `https://abcdefgh.supabase.co` |
| Anon Key | Settings → API → Project API Keys → anon public | `eyJhbGciOi...` (long JWT) |
| Service Role Key | Settings → API → Project API Keys → service_role | `eyJhbGciOi...` (long JWT) |

**Important:** The service_role key bypasses Row Level Security. Never expose it in client-side code. It's only used in `lib/supabase/server.ts` for server-side admin operations.

## 3. Update Your `.env` File

Open the `.env` file in your project root and replace the values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

That's it — the app reads these environment variables everywhere:
- `lib/supabase/client.ts` — browser-side client (uses URL + anon key)
- `lib/supabase/server.ts` — server-side client (uses URL + anon key or service role)
- `supabase/functions/send-email/index.ts` — edge function (reads from Supabase env)

## 4. Run the Database Migrations

Your new Supabase project starts empty. You need to create all the tables, policies, and seed data.

### Option A: Using Supabase MCP Tools (recommended in this environment)

If you're running this in Bolt, the migrations have already been applied to Bolt's provisioned project. To apply them to YOUR project, you'll need to run them from the Supabase dashboard.

### Option B: Using the Supabase Dashboard SQL Editor

1. Go to your Supabase dashboard → **SQL Editor**
2. Open each migration file from `supabase/migrations/` in order:
   - `001_initial_schema.sql` — creates all 23 tables + RLS policies
   - `002_seed_data.sql` — seeds plans, payment methods, FAQs, testimonials, settings
   - `003_storage_bucket.sql` — creates the receipts storage bucket
3. Copy the SQL content, paste it into the SQL Editor, and click **Run**
4. Run them in order (001 first, then 002, then 003)

### Option C: Using Supabase CLI (local terminal)

```bash
# Install the Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push all migrations
supabase db push
```

## 5. Create the Storage Bucket

The `003_storage_bucket.sql` migration creates a public storage bucket called `receipts` for deposit receipt uploads. If you prefer to create it manually:

1. Go to your Supabase dashboard → **Storage**
2. Click **New Bucket**
3. Name it `receipts`
4. Set it to **Public**
5. Add these storage policies (or run the SQL from `003_storage_bucket.sql`)

## 6. Deploy the Email Edge Function (Optional)

The `send-email` edge function handles transactional emails (registration, deposits, withdrawals, etc.).

1. Go to your Supabase dashboard → **Edge Functions**
2. Create a new function called `send-email`
3. Copy the code from `supabase/functions/send-email/index.ts`
4. If using Resend for email delivery, add your API key:
   - Go to **Edge Functions → send-email → Secrets**
   - Add `RESEND_API_KEY` with your Resend API key
5. Deploy the function

## 7. Set Up Admin Access

After deploying, you need to give yourself admin access:

1. Register an account on your app (visit `/register`)
2. Go to your Supabase dashboard → **Table Editor → profiles**
3. Find your user row and set `is_admin` to `true`
4. Now you can access `/admin` in your app

## 8. Deploy to Vercel or Netlify

When deploying, set the same environment variables in your hosting platform:

**Vercel:** Project Settings → Environment Variables
**Netlify:** Site Settings → Environment Variables

Add all three:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Quick Checklist

- [ ] Created a Supabase project
- [ ] Copied URL, anon key, and service role key to `.env`
- [ ] Ran `001_initial_schema.sql` (tables + RLS)
- [ ] Ran `002_seed_data.sql` (seed data)
- [ ] Ran `003_storage_bucket.sql` (storage bucket)
- [ ] Deployed `send-email` edge function (optional)
- [ ] Added `RESEND_API_KEY` secret (optional, for emails)
- [ ] Registered an account and set `is_admin = true`
- [ ] Set environment variables on your hosting platform
