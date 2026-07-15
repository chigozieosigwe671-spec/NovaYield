export type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  avatar_url: string;
  account_status: 'active' | 'pending' | 'suspended' | 'deleted';
  is_admin: boolean;
  referral_code: string;
  referred_by: string | null;
  email_verified: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type Wallet = {
  id: string;
  user_id: string;
  main_balance: number;
  profit_balance: number;
  bonus_balance: number;
  referral_balance: number;
  total_deposits: number;
  total_withdrawals: number;
  total_profit: number;
  total_investment_value: number;
  created_at: string;
  updated_at: string;
};

export type InvestmentPlan = {
  id: string;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number;
  daily_roi: number;
  duration_days: number;
  total_roi: number;
  status: 'active' | 'inactive';
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Investment = {
  id: string;
  user_id: string;
  plan_id: string | null;
  amount: number;
  daily_profit: number;
  total_profit_earned: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  start_date: string | null;
  end_date: string | null;
  last_profit_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Deposit = {
  id: string;
  user_id: string;
  amount: number;
  payment_method_id: string | null;
  payment_method_name: string;
  receipt_url: string;
  admin_remarks: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
};

export type Withdrawal = {
  id: string;
  user_id: string;
  amount: number;
  payment_method_id: string | null;
  payment_method_name: string;
  wallet_address: string;
  bank_details: string;
  admin_remarks: string;
  transaction_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'profit' | 'bonus' | 'referral' | 'wallet_transfer' | 'admin_adjustment';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  reference_id: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
};

export type SupportTicket = {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'pending' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
};

export type PaymentMethod = {
  id: string;
  name: string;
  type: 'deposit' | 'withdrawal' | 'both';
  network: string;
  wallet_address: string;
  bank_details: string;
  qr_code_url: string;
  logo_url: string;
  instructions: string;
  min_amount: number;
  max_amount: number;
  fee_percentage: number;
  processing_time: string;
  status: 'active' | 'inactive' | 'maintenance';
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar_url: string;
  rating: number;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'promotion';
  is_active: boolean;
  dismissible?: boolean;
  created_at: string;
  updated_at: string;
};

export type Referral = {
  id: string;
  referrer_id: string;
  referred_id: string;
  level: number;
  status: 'pending' | 'active' | 'inactive';
  qualified: boolean;
  created_at: string;
};

export type ReferralLevel = {
  id: string;
  level: number;
  name: string;
  commission_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ReferralCommission = {
  id: string;
  referrer_id: string;
  referred_id: string;
  level: number;
  amount: number;
  source_type: string;
  source_amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
};

export type ActivityLog = {
  id: string;
  user_id: string | null;
  action: string;
  details: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
};
