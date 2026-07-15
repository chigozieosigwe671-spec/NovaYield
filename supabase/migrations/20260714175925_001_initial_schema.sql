/*
# NovaYield - Initial Database Schema

## Overview
Creates the complete schema for the NovaYield AI investment platform.

## New Tables
1. profiles, 2. wallets, 3. payment_methods, 4. investment_plans, 5. investments,
6. deposits, 7. withdrawals, 8. transactions, 9. notifications, 10. support_tickets,
11. support_replies, 12. news, 13. testimonials, 14. faqs, 15. settings,
16. announcements, 17. dismissed_announcements, 18. referrals, 19. referral_levels,
20. referral_commissions, 21. referral_rewards, 22. referral_logs, 23. activity_logs

## Security
- RLS enabled on ALL tables.
- Users can read/update only their own data.
- Public read for landing page content.
*/

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  phone text DEFAULT '',
  country text DEFAULT '',
  avatar_url text DEFAULT '',
  account_status text NOT NULL DEFAULT 'active' CHECK (account_status IN ('active','pending','suspended','deleted')),
  is_admin boolean NOT NULL DEFAULT false,
  referral_code text UNIQUE DEFAULT upper(substr(encode(gen_random_bytes(8),'hex'),1,8)),
  referred_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  email_verified boolean NOT NULL DEFAULT false,
  two_factor_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id OR referred_by = auth.uid());
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ WALLETS ============
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  main_balance numeric(18,2) NOT NULL DEFAULT 0,
  profit_balance numeric(18,2) NOT NULL DEFAULT 0,
  bonus_balance numeric(18,2) NOT NULL DEFAULT 0,
  referral_balance numeric(18,2) NOT NULL DEFAULT 0,
  total_deposits numeric(18,2) NOT NULL DEFAULT 0,
  total_withdrawals numeric(18,2) NOT NULL DEFAULT 0,
  total_profit numeric(18,2) NOT NULL DEFAULT 0,
  total_investment_value numeric(18,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "wallets_select_own" ON wallets;
CREATE POLICY "wallets_select_own" ON wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "wallets_insert_own" ON wallets;
CREATE POLICY "wallets_insert_own" ON wallets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "wallets_update_own" ON wallets;
CREATE POLICY "wallets_update_own" ON wallets FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ PAYMENT METHODS ============
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'deposit' CHECK (type IN ('deposit','withdrawal','both')),
  network text DEFAULT '',
  wallet_address text DEFAULT '',
  bank_details text DEFAULT '',
  qr_code_url text DEFAULT '',
  logo_url text DEFAULT '',
  instructions text DEFAULT '',
  min_amount numeric(18,2) NOT NULL DEFAULT 0,
  max_amount numeric(18,2) NOT NULL DEFAULT 0,
  fee_percentage numeric(5,2) NOT NULL DEFAULT 0,
  processing_time text DEFAULT '1-24 hours',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','maintenance')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "paymethods_select_all" ON payment_methods;
CREATE POLICY "paymethods_select_all" ON payment_methods FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "paymethods_insert_auth" ON payment_methods;
CREATE POLICY "paymethods_insert_auth" ON payment_methods FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "paymethods_update_auth" ON payment_methods;
CREATE POLICY "paymethods_update_auth" ON payment_methods FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "paymethods_delete_auth" ON payment_methods;
CREATE POLICY "paymethods_delete_auth" ON payment_methods FOR DELETE TO authenticated USING (true);

-- ============ INVESTMENT PLANS ============
CREATE TABLE IF NOT EXISTS investment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  min_amount numeric(18,2) NOT NULL DEFAULT 0,
  max_amount numeric(18,2) NOT NULL DEFAULT 0,
  daily_roi numeric(5,2) NOT NULL DEFAULT 0,
  duration_days integer NOT NULL DEFAULT 30,
  total_roi numeric(5,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "plans_select_all" ON investment_plans;
CREATE POLICY "plans_select_all" ON investment_plans FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "plans_insert_auth" ON investment_plans;
CREATE POLICY "plans_insert_auth" ON investment_plans FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "plans_update_auth" ON investment_plans;
CREATE POLICY "plans_update_auth" ON investment_plans FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "plans_delete_auth" ON investment_plans;
CREATE POLICY "plans_delete_auth" ON investment_plans FOR DELETE TO authenticated USING (true);

-- ============ INVESTMENTS ============
CREATE TABLE IF NOT EXISTS investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES investment_plans(id) ON DELETE SET NULL,
  amount numeric(18,2) NOT NULL,
  daily_profit numeric(18,2) NOT NULL DEFAULT 0,
  total_profit_earned numeric(18,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','completed','cancelled')),
  start_date timestamptz,
  end_date timestamptz,
  last_profit_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "investments_select_own" ON investments;
CREATE POLICY "investments_select_own" ON investments FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "investments_insert_own" ON investments;
CREATE POLICY "investments_insert_own" ON investments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "investments_update_own" ON investments;
CREATE POLICY "investments_update_own" ON investments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ DEPOSITS ============
CREATE TABLE IF NOT EXISTS deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric(18,2) NOT NULL,
  payment_method_id uuid REFERENCES payment_methods(id) ON DELETE SET NULL,
  payment_method_name text DEFAULT '',
  receipt_url text DEFAULT '',
  admin_remarks text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "deposits_select_own" ON deposits;
CREATE POLICY "deposits_select_own" ON deposits FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "deposits_insert_own" ON deposits;
CREATE POLICY "deposits_insert_own" ON deposits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "deposits_update_own" ON deposits;
CREATE POLICY "deposits_update_own" ON deposits FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ WITHDRAWALS ============
CREATE TABLE IF NOT EXISTS withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric(18,2) NOT NULL,
  payment_method_id uuid REFERENCES payment_methods(id) ON DELETE SET NULL,
  payment_method_name text DEFAULT '',
  wallet_address text DEFAULT '',
  bank_details text DEFAULT '',
  admin_remarks text DEFAULT '',
  transaction_id text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','completed','cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "withdrawals_select_own" ON withdrawals;
CREATE POLICY "withdrawals_select_own" ON withdrawals FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "withdrawals_insert_own" ON withdrawals;
CREATE POLICY "withdrawals_insert_own" ON withdrawals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "withdrawals_update_own" ON withdrawals;
CREATE POLICY "withdrawals_update_own" ON withdrawals FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ TRANSACTIONS ============
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit','withdrawal','investment','profit','bonus','referral','wallet_transfer','admin_adjustment')),
  amount numeric(18,2) NOT NULL,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending','completed','failed','cancelled')),
  description text DEFAULT '',
  reference_id uuid,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tx_select_own" ON transactions;
CREATE POLICY "tx_select_own" ON transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "tx_insert_own" ON transactions;
CREATE POLICY "tx_insert_own" ON transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info','success','warning','error','deposit','withdrawal','investment','referral','support','security')),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notif_select_own" ON notifications;
CREATE POLICY "notif_select_own" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "notif_insert_own" ON notifications;
CREATE POLICY "notif_insert_own" ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "notif_update_own" ON notifications;
CREATE POLICY "notif_update_own" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "notif_delete_own" ON notifications;
CREATE POLICY "notif_delete_own" ON notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ SUPPORT TICKETS ============
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','pending','closed')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tickets_select_own" ON support_tickets;
CREATE POLICY "tickets_select_own" ON support_tickets FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "tickets_insert_own" ON support_tickets;
CREATE POLICY "tickets_insert_own" ON support_tickets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "tickets_update_own" ON support_tickets;
CREATE POLICY "tickets_update_own" ON support_tickets FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ SUPPORT REPLIES ============
CREATE TABLE IF NOT EXISTS support_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  message text NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE support_replies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "replies_select_own" ON support_replies;
CREATE POLICY "replies_select_own" ON support_replies FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM support_tickets t WHERE t.id = support_replies.ticket_id AND t.user_id = auth.uid())
);
DROP POLICY IF EXISTS "replies_insert_own" ON support_replies;
CREATE POLICY "replies_insert_own" ON support_replies FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM support_tickets t WHERE t.id = support_replies.ticket_id AND t.user_id = auth.uid())
);

-- ============ NEWS ============
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text DEFAULT '',
  excerpt text DEFAULT '',
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "news_select_all" ON news;
CREATE POLICY "news_select_all" ON news FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "news_insert_auth" ON news;
CREATE POLICY "news_insert_auth" ON news FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "news_update_auth" ON news;
CREATE POLICY "news_update_auth" ON news FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "news_delete_auth" ON news;
CREATE POLICY "news_delete_auth" ON news FOR DELETE TO authenticated USING (true);

-- ============ TESTIMONIALS ============
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text DEFAULT '',
  content text NOT NULL,
  avatar_url text DEFAULT '',
  rating integer NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "testimonials_select_all" ON testimonials;
CREATE POLICY "testimonials_select_all" ON testimonials FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "testimonials_insert_auth" ON testimonials;
CREATE POLICY "testimonials_insert_auth" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_update_auth" ON testimonials;
CREATE POLICY "testimonials_update_auth" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_delete_auth" ON testimonials;
CREATE POLICY "testimonials_delete_auth" ON testimonials FOR DELETE TO authenticated USING (true);

-- ============ FAQS ============
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general',
  sort_order integer DEFAULT 0,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "faqs_select_all" ON faqs;
CREATE POLICY "faqs_select_all" ON faqs FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "faqs_insert_auth" ON faqs;
CREATE POLICY "faqs_insert_auth" ON faqs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "faqs_update_auth" ON faqs;
CREATE POLICY "faqs_update_auth" ON faqs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "faqs_delete_auth" ON faqs;
CREATE POLICY "faqs_delete_auth" ON faqs FOR DELETE TO authenticated USING (true);

-- ============ SETTINGS ============
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "settings_select_all" ON settings;
CREATE POLICY "settings_select_all" ON settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "settings_insert_auth" ON settings;
CREATE POLICY "settings_insert_auth" ON settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "settings_update_auth" ON settings;
CREATE POLICY "settings_update_auth" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ============ ANNOUNCEMENTS ============
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info','success','warning','promotion')),
  is_active boolean NOT NULL DEFAULT true,
  dismissible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ann_select_all" ON announcements;
CREATE POLICY "ann_select_all" ON announcements FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "ann_insert_auth" ON announcements;
CREATE POLICY "ann_insert_auth" ON announcements FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "ann_update_auth" ON announcements;
CREATE POLICY "ann_update_auth" ON announcements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "ann_delete_auth" ON announcements;
CREATE POLICY "ann_delete_auth" ON announcements FOR DELETE TO authenticated USING (true);

-- ============ DISMISSED ANNOUNCEMENTS ============
CREATE TABLE IF NOT EXISTS dismissed_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  announcement_id uuid NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  dismissed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, announcement_id)
);
ALTER TABLE dismissed_announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dismiss_select_own" ON dismissed_announcements;
CREATE POLICY "dismiss_select_own" ON dismissed_announcements FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "dismiss_insert_own" ON dismissed_announcements;
CREATE POLICY "dismiss_insert_own" ON dismissed_announcements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "dismiss_delete_own" ON dismissed_announcements;
CREATE POLICY "dismiss_delete_own" ON dismissed_announcements FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ REFERRALS ============
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  level integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','inactive')),
  qualified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ref_select_own" ON referrals;
CREATE POLICY "ref_select_own" ON referrals FOR SELECT TO authenticated USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
DROP POLICY IF EXISTS "ref_insert_own" ON referrals;
CREATE POLICY "ref_insert_own" ON referrals FOR INSERT TO authenticated WITH CHECK (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- ============ REFERRAL LEVELS ============
CREATE TABLE IF NOT EXISTS referral_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level integer NOT NULL UNIQUE,
  name text NOT NULL,
  commission_percentage numeric(5,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE referral_levels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reflevels_select_all" ON referral_levels;
CREATE POLICY "reflevels_select_all" ON referral_levels FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "reflevels_insert_auth" ON referral_levels;
CREATE POLICY "reflevels_insert_auth" ON referral_levels FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "reflevels_update_auth" ON referral_levels;
CREATE POLICY "reflevels_update_auth" ON referral_levels FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "reflevels_delete_auth" ON referral_levels;
CREATE POLICY "reflevels_delete_auth" ON referral_levels FOR DELETE TO authenticated USING (true);

-- ============ REFERRAL COMMISSIONS ============
CREATE TABLE IF NOT EXISTS referral_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  level integer NOT NULL DEFAULT 1,
  amount numeric(18,2) NOT NULL,
  source_type text NOT NULL DEFAULT 'deposit' CHECK (source_type IN ('deposit','investment','profit')),
  source_amount numeric(18,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE referral_commissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "refcomm_select_own" ON referral_commissions;
CREATE POLICY "refcomm_select_own" ON referral_commissions FOR SELECT TO authenticated USING (auth.uid() = referrer_id);
DROP POLICY IF EXISTS "refcomm_insert_own" ON referral_commissions;
CREATE POLICY "refcomm_insert_own" ON referral_commissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = referrer_id);

-- ============ REFERRAL REWARDS ============
CREATE TABLE IF NOT EXISTS referral_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_type text NOT NULL DEFAULT 'commission' CHECK (reward_type IN ('commission','bonus','milestone')),
  amount numeric(18,2) NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "refrewards_select_own" ON referral_rewards;
CREATE POLICY "refrewards_select_own" ON referral_rewards FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "refrewards_insert_own" ON referral_rewards;
CREATE POLICY "refrewards_insert_own" ON referral_rewards FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============ REFERRAL LOGS ============
CREATE TABLE IF NOT EXISTS referral_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  referred_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  details text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE referral_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reflogs_select_own" ON referral_logs;
CREATE POLICY "reflogs_select_own" ON referral_logs FOR SELECT TO authenticated USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
DROP POLICY IF EXISTS "reflogs_insert_own" ON referral_logs;
CREATE POLICY "reflogs_insert_own" ON referral_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ============ ACTIVITY LOGS ============
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  details text DEFAULT '',
  ip_address text DEFAULT '',
  user_agent text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "logs_select_own" ON activity_logs;
CREATE POLICY "logs_select_own" ON activity_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "logs_insert_own" ON activity_logs;
CREATE POLICY "logs_insert_own" ON activity_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_user ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_refcomm_referrer ON referral_commissions(referrer_id);
