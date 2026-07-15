/*
# NovaYield - Seed Data

## Overview
Populates initial platform data: investment plans, payment methods, referral levels,
FAQs, testimonials, settings, and announcements.

## Notes
1. Uses ON CONFLICT to be idempotent.
2. All amounts in USD.
*/

-- Investment Plans
INSERT INTO investment_plans (name, description, min_amount, max_amount, daily_roi, duration_days, total_roi, status, sort_order)
VALUES
  ('Starter', 'Perfect for beginners looking to explore AI-powered investing.', 100, 999, 2.00, 30, 60.00, 'active', 1),
  ('Silver', 'Enhanced returns with AI-optimized portfolio allocation.', 500, 4999, 3.50, 30, 105.00, 'active', 2),
  ('Gold', 'Premium investment tier with maximum AI optimization.', 1000, 9999, 5.00, 30, 150.00, 'active', 3),
  ('VIP', 'Exclusive VIP tier with highest ROI and priority support.', 10000, 100000, 8.00, 30, 240.00, 'active', 4)
ON CONFLICT DO NOTHING;

-- Payment Methods
INSERT INTO payment_methods (name, type, network, wallet_address, min_amount, max_amount, fee_percentage, processing_time, status, sort_order, instructions)
VALUES
  ('USDT (TRC20)', 'both', 'TRC20', 'TRqxYHgokLx7uTwy1r5XhN7QsWHV24i5bQ', 50, 100000, 0.00, '1-24 hours', 'active', 1, 'Transfer USDT on the TRC20 network to the wallet address above.'),
  ('USDT (ERC20)', 'both', 'ERC20', '0x4e856f9F77EB78763EA92c6a70826Ad2Cd385c3f', 50, 100000, 0.00, '1-24 hours', 'active', 2, 'Transfer USDT on the ERC20 network to the wallet address above.'),
  ('Bitcoin (BTC)', 'both', 'BTC', 'bc1qj5xspjrzm7ukvn00w8t52nr248cge0els5v7j2', 50, 100000, 0.00, '1-24 hours', 'active', 3, 'Transfer BTC to the wallet address above.'),
  ('Ethereum (ETH)', 'both', 'ERC20', '0x4e856f9F77EB78763EA92c6a70826Ad2Cd385c3f', 50, 100000, 0.00, '1-24 hours', 'active', 4, 'Transfer ETH to the wallet address above.'),
  ('Litecoin (LTC)', 'both', 'LTC', 'ltc1qmalrnjtqajp25nuz0m7z39vylwsk3rnw2phrkd', 50, 100000, 0.00, '1-24 hours', 'active', 5, 'Transfer LTC to the wallet address above.'),
  ('Bank Transfer', 'both', 'BANK', '', 100, 100000, 0.00, '1-3 business days', 'active', 6, 'Contact support for bank transfer details.')
ON CONFLICT DO NOTHING;

-- Referral Levels
INSERT INTO referral_levels (level, name, commission_percentage, is_active)
VALUES
  (1, 'Level 1', 10.00, true),
  (2, 'Level 2', 5.00, true),
  (3, 'Level 3', 3.00, true),
  (4, 'Level 4', 2.00, true),
  (5, 'Level 5', 1.00, true)
ON CONFLICT (level) DO NOTHING;

-- FAQs
INSERT INTO faqs (question, answer, category, sort_order, status)
VALUES
  ('How do I invest?', 'Create an account, deposit funds using any of our supported payment methods, then choose an investment plan that fits your goals. Your investment will be activated immediately after deposit confirmation.', 'investing', 1, 'published'),
  ('How do withdrawals work?', 'Navigate to the Withdraw page, select your preferred withdrawal method, enter the amount and your wallet or bank details, then submit. Withdrawals are processed within 1-24 hours after approval.', 'withdrawals', 2, 'published'),
  ('Is my investment secure?', 'Yes. We use enterprise-grade encryption, AI-powered risk management, and secure payment infrastructure. All transactions are protected by bank-level security protocols.', 'security', 3, 'published'),
  ('How long does it take to receive profits?', 'Investment profits are calculated daily and credited to your profit balance automatically. You can withdraw profits at any time once your withdrawal request is approved.', 'investing', 4, 'published'),
  ('Can I withdraw anytime?', 'Yes, you can request a withdrawal at any time. Withdrawals are typically processed within 1-24 hours, depending on the payment method and network conditions.', 'withdrawals', 5, 'published')
ON CONFLICT DO NOTHING;

-- Testimonials
INSERT INTO testimonials (name, role, content, avatar_url, rating, status, sort_order)
VALUES
  ('James Carter', 'Entrepreneur', 'NovaYield transformed my approach to investing. The AI-driven insights have consistently delivered returns I never thought possible. Highly recommended!', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150', 5, 'published', 1),
  ('Sophia Martinez', 'Financial Analyst', 'The platform is intuitive and the daily profits are real. I have been with NovaYield for six months and my portfolio has grown significantly.', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150', 5, 'published', 2),
  ('Michael Chen', 'Investor', 'What sets NovaYield apart is the transparency. Every investment is tracked, every profit is visible, and withdrawals are fast.', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', 5, 'published', 3),
  ('Emily Roberts', 'Business Owner', 'I was skeptical at first, but NovaYield delivered on every promise. The referral program is an excellent bonus on top of the investment returns.', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', 5, 'published', 4),
  ('David Thompson', 'Retired Engineer', 'The AI investment plans are well-structured and the support team is always responsive. My retirement fund has never looked better.', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150', 5, 'published', 5)
ON CONFLICT DO NOTHING;

-- Settings
INSERT INTO settings (key, value, category)
VALUES
  ('site_name', 'NovaYield', 'general'),
  ('support_email', 'support@novayield.com', 'contact'),
  ('min_deposit', '50', 'limits'),
  ('max_deposit', '100000', 'limits'),
  ('min_withdrawal', '50', 'limits'),
  ('max_withdrawal', '100000', 'limits'),
  ('referral_enabled', 'true', 'referral'),
  ('referral_min_deposit', '50', 'referral'),
  ('referral_max_payout', '10000', 'referral'),
  ('email_verification_required', 'false', 'auth'),
  ('platform_tagline', 'AI-Powered Investments for Sustainable Wealth', 'general')
ON CONFLICT (key) DO NOTHING;

-- Announcements
INSERT INTO announcements (title, message, type, is_active, dismissible)
VALUES
  ('Welcome to NovaYield', 'Start your AI-powered investment journey today. Deposit now and earn daily profits!', 'info', true, true)
ON CONFLICT DO NOTHING;
