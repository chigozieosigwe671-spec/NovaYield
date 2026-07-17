'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Gift,
  Activity,
  Bell,
  X,
  ChevronRight,
  Zap,
  User,
  Headphones,
  History,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { toast } from 'sonner';

type WalletData = {
  main_balance: number;
  profit_balance: number;
  bonus_balance: number;
  referral_balance: number;
  total_deposits: number;
  total_withdrawals: number;
  total_profit: number;
  total_investment_value: number;
};

type TxRow = {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  created_at: string;
};

type Announcement = {
  id: string;
  title: string;
  message: string;
  type: string;
  dismissible?: boolean;
};

const quickActions = [
  { label: 'Deposit Funds', href: '/dashboard/deposit', icon: ArrowDownToLine, color: 'bg-green-500' },
  { label: 'Withdraw Funds', href: '/dashboard/withdraw', icon: ArrowUpFromLine, color: 'bg-blue-500' },
  { label: 'Invest Now', href: '/dashboard/plans', icon: Zap, color: 'bg-red-brand' },
  { label: 'Referral Program', href: '/dashboard/referrals', icon: Users, color: 'bg-purple-500' },
  { label: 'Transactions', href: '/dashboard/transactions', icon: History, color: 'bg-amber-500' },
  { label: 'Profile', href: '/dashboard/profile', icon: User, color: 'bg-teal-500' },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, color: 'bg-gray-500' },
  { label: 'Support', href: '#', icon: Headphones, color: 'bg-pink-500' },
];

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<TxRow[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeInvestments: 0,
    completedInvestments: 0,
    pendingInvestments: 0,
    totalReferrals: 0,
    activeReferrals: 0,
    referralEarnings: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [{ data: w }, { data: tx }, { data: ann }, { data: inv }, { data: refs }, { data: comm }] = await Promise.all([
        supabase.from('wallets').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('announcements').select('*').eq('is_active', true),
        supabase.from('investments').select('status').eq('user_id', user.id),
        supabase.from('referrals').select('status').eq('referrer_id', user.id),
        supabase.from('referral_commissions').select('amount, status').eq('referrer_id', user.id),
      ]);

      setWallet(w as WalletData | null);
      setTransactions((tx as TxRow[]) || []);
      setAnnouncements((ann as Announcement[]) || []);

      const investments = inv || [];
      setStats({
        activeInvestments: investments.filter((i: any) => i.status === 'active').length,
        completedInvestments: investments.filter((i: any) => i.status === 'completed').length,
        pendingInvestments: investments.filter((i: any) => i.status === 'pending').length,
        totalReferrals: refs?.length || 0,
        activeReferrals: refs?.filter((r: any) => r.status === 'active').length || 0,
        referralEarnings: comm?.filter((c: any) => c.status === 'paid').reduce((sum: number, c: any) => sum + Number(c.amount), 0) || 0,
      });

      setLoading(false);
    };

    fetchData();

const walletChannel = supabase
  .channel('wallet-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'wallets',
      filter: `user_id=eq.${user.id}`,
    },
    () => {
      fetchData();
      toast.success('Your wallet has been updated.');
    }
  )
  .subscribe();

return () => {
  supabase.removeChannel(walletChannel);
};
  }, [user]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const dismissAnnouncement = (id: string) => {
    setDismissed([...dismissed, id]);
    if (user) {
      supabase.from('dismissed_announcements').insert({ user_id: user.id, announcement_id: id }).then();
    }
  };

  // Chart data
  const walletGrowthData = [
    { name: 'Jan', value: wallet?.total_deposits ? Number(wallet.total_deposits) * 0.3 : 0 },
    { name: 'Feb', value: wallet?.total_deposits ? Number(wallet.total_deposits) * 0.5 : 0 },
    { name: 'Mar', value: wallet?.total_deposits ? Number(wallet.total_deposits) * 0.65 : 0 },
    { name: 'Apr', value: wallet?.total_deposits ? Number(wallet.total_deposits) * 0.75 : 0 },
    { name: 'May', value: wallet?.total_deposits ? Number(wallet.total_deposits) * 0.85 : 0 },
    { name: 'Jun', value: wallet?.total_deposits ? Number(wallet.total_deposits) : 0 },
  ];

  const monthlyData = [
    { name: 'Jan', deposits: 4200, withdrawals: 1200 },
    { name: 'Feb', deposits: 3800, withdrawals: 1900 },
    { name: 'Mar', deposits: 5200, withdrawals: 2300 },
    { name: 'Apr', deposits: 4780, withdrawals: 1600 },
    { name: 'May', deposits: 6890, withdrawals: 3100 },
    { name: 'Jun', deposits: 5390, withdrawals: 2400 },
  ];

  const portfolioData = [
    { name: 'Main Balance', value: wallet ? Number(wallet.main_balance) : 0, color: 'hsl(222 47% 18%)' },
    { name: 'Profit', value: wallet ? Number(wallet.profit_balance) : 0, color: 'hsl(0 84% 50%)' },
    { name: 'Bonus', value: wallet ? Number(wallet.bonus_balance) : 0, color: 'hsl(142 71% 45%)' },
    { name: 'Referral', value: wallet ? Number(wallet.referral_balance) : 0, color: 'hsl(43 74% 66%)' },
  ];

  const statCards = [
    { label: 'Portfolio Value', value: wallet?.total_investment_value || 0, icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Profit', value: wallet?.total_profit || 0, icon: Activity, color: 'text-green-600 bg-green-50' },
    { label: 'Bonus Balance', value: wallet?.bonus_balance || 0, icon: Gift, color: 'text-purple-600 bg-purple-50' },
    { label: 'Total Deposits', value: wallet?.total_deposits || 0, icon: ArrowDownToLine, color: 'text-teal-600 bg-teal-50' },
    { label: 'Total Withdrawals', value: wallet?.total_withdrawals || 0, icon: ArrowUpFromLine, color: 'text-orange-600 bg-orange-50' },
    { label: 'Active Investments', value: stats.activeInvestments, icon: Zap, color: 'text-red-600 bg-red-50', isCount: true },
    { label: 'Investment Value', value: wallet?.total_investment_value || 0, icon: Wallet, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Referral Earnings', value: stats.referralEarnings, icon: Users, color: 'text-pink-600 bg-pink-50' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">
          {greeting()}, {profile?.first_name || 'User'}!
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Here's your account overview.</p>
      </motion.div>

      {/* Announcements */}
      {announcements.filter((a) => !dismissed.includes(a.id)).map((ann) => (
        <motion.div
          key={ann.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-xl p-4 flex items-start gap-3 ${
            ann.type === 'success' ? 'bg-green-50 border border-green-200' :
            ann.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
            ann.type === 'promotion' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}
        >
          <div className="flex-1">
            <p className="font-semibold text-navy dark:text-white text-sm">{ann.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{ann.message}</p>
          </div>
          {ann.dismissible !== false && (
            <button onClick={() => dismissAnnouncement(ann.id)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>
      ))}

      {/* Account Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="rounded-2xl p-6 card-shadow border-0 gradient-navy text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-white/60 text-xs mb-1">Total Wallet Balance</p>
              <p className="text-3xl font-bold">
                ${(Number(wallet?.main_balance || 0) + Number(wallet?.profit_balance || 0) + Number(wallet?.bonus_balance || 0) + Number(wallet?.referral_balance || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">
                  Account: {profile?.account_status || 'Active'}
                </Badge>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/deposit">
                <Button className="bg-red-brand hover:bg-red-dark text-white rounded-xl">
                  <ArrowDownToLine className="h-4 w-4 mr-2" /> Deposit
                </Button>
              </Link>
              <Link href="/dashboard/withdraw">
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl">
                  <ArrowUpFromLine className="h-4 w-4 mr-2" /> Withdraw
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="rounded-2xl p-5 card-shadow border-0 hover:card-shadow-hover transition-all">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-xl font-bold text-navy dark:text-white">
                {stat.isCount
                  ? stat.value
                  : `${Number(stat.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-2xl p-6 card-shadow border-0">
            <h3 className="font-bold text-navy dark:text-white mb-4">Wallet Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={walletGrowthData}>
                <defs>
                  <linearGradient id="colorWallet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0 84% 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0 84% 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                <Area type="monotone" dataKey="value" stroke="hsl(0 84% 50%)" fill="url(#colorWallet)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-2xl p-6 card-shadow border-0">
            <h3 className="font-bold text-navy dark:text-white mb-4">Deposits vs Withdrawals</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="deposits" fill="hsl(222 47% 18%)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="withdrawals" fill="hsl(0 84% 50%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Portfolio Pie + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="rounded-2xl p-6 card-shadow border-0 h-full">
            <h3 className="font-bold text-navy dark:text-white mb-4">Portfolio Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={portfolioData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                  {portfolioData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="rounded-2xl p-6 card-shadow border-0 h-full">
            <h3 className="font-bold text-navy dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all hover:-translate-y-1"
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-navy dark:text-white text-center">{action.label}</span>
                </Link>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="rounded-2xl p-6 card-shadow border-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-navy dark:text-white">Recent Transactions</h3>
            <Link href="/dashboard/transactions">
              <Button variant="ghost" size="sm" className="text-red-brand">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-sm font-medium text-muted-foreground pb-3">Date</th>
                    <th className="text-left text-sm font-medium text-muted-foreground pb-3">Type</th>
                    <th className="text-left text-sm font-medium text-muted-foreground pb-3">Amount</th>
                    <th className="text-left text-sm font-medium text-muted-foreground pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border/50">
                      <td className="py-3 text-sm text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-sm font-medium text-navy dark:text-white capitalize">
                        {tx.type}
                      </td>
                      <td className="py-3 text-sm font-semibold text-navy dark:text-white">
                        ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3">
                        <Badge className={
                          tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                          tx.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
