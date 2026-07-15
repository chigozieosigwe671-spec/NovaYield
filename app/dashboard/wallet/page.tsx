'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Gift, Users } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Wallet as WalletType } from '@/lib/supabase/types';

export default function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('wallets').select('*').eq('user_id', user.id).maybeSingle().then(({ data }) => {
      setWallet(data as WalletType | null);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <div className="h-64 rounded-2xl bg-muted animate-pulse" />;

  const balances = [
    { label: 'Main Balance', value: wallet?.main_balance || 0, icon: Wallet, color: 'text-navy bg-navy/10' },
    { label: 'Profit Balance', value: wallet?.profit_balance || 0, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { label: 'Bonus Balance', value: wallet?.bonus_balance || 0, icon: Gift, color: 'text-purple-600 bg-purple-50' },
    { label: 'Referral Balance', value: wallet?.referral_balance || 0, icon: Users, color: 'text-pink-600 bg-pink-50' },
  ];

  const totals = [
    { label: 'Total Deposits', value: wallet?.total_deposits || 0 },
    { label: 'Total Withdrawals', value: wallet?.total_withdrawals || 0 },
    { label: 'Total Profit', value: wallet?.total_profit || 0 },
    { label: 'Investment Value', value: wallet?.total_investment_value || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">My Wallet</h1>
        <p className="text-muted-foreground mt-1">Manage your balances and transactions.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="rounded-2xl p-6 card-shadow border-0 gradient-navy text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-white/60 text-sm">Total Balance</p>
              <p className="text-4xl font-bold">
                ${(Number(wallet?.main_balance || 0) + Number(wallet?.profit_balance || 0) + Number(wallet?.bonus_balance || 0) + Number(wallet?.referral_balance || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {balances.map((b, i) => (
          <motion.div key={b.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-2xl p-5 card-shadow border-0">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${b.color}`}>
                <b.icon className="h-5 w-5" />
              </div>
              <p className="text-lg font-bold text-navy dark:text-white">
                ${Number(b.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{b.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {totals.map((t, i) => (
          <motion.div key={t.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-2xl p-5 card-shadow border-0 bg-muted/20">
              <p className="text-sm text-muted-foreground">{t.label}</p>
              <p className="text-xl font-bold text-navy dark:text-white mt-1">
                ${Number(t.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
