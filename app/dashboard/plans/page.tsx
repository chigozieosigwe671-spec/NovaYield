'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Check, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { InvestmentPlan, Wallet } from '@/lib/supabase/types';

export default function PlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('investment_plans').select('*').eq('status', 'active').order('sort_order').then(({ data }) => {
      if (data && data.length > 0) setPlans(data as InvestmentPlan[]);
      else setPlans([
        { id: '1', name: 'Starter', description: 'Perfect for beginners.', min_amount: 100, max_amount: 999, daily_roi: 2, duration_days: 30, total_roi: 60, status: 'active', sort_order: 1 } as InvestmentPlan,
        { id: '2', name: 'Silver', description: 'Enhanced returns.', min_amount: 500, max_amount: 4999, daily_roi: 3.5, duration_days: 30, total_roi: 105, status: 'active', sort_order: 2 } as InvestmentPlan,
        { id: '3', name: 'Gold', description: 'Premium tier.', min_amount: 1000, max_amount: 9999, daily_roi: 5, duration_days: 30, total_roi: 150, status: 'active', sort_order: 3 } as InvestmentPlan,
        { id: '4', name: 'VIP', description: 'Exclusive VIP.', min_amount: 10000, max_amount: 100000, daily_roi: 8, duration_days: 30, total_roi: 240, status: 'active', sort_order: 4 } as InvestmentPlan,
      ]);
    });
    if (user) {
      supabase.from('wallets').select('*').eq('user_id', user.id).maybeSingle().then(({ data }) => setWallet(data as Wallet | null));
    }
  }, [user]);

  const handleInvest = async () => {
    if (!user || !selectedPlan) return;
    const amt = parseFloat(investAmount);

    if (amt < selectedPlan.min_amount || amt > selectedPlan.max_amount) {
      toast.error(`Amount must be between $${selectedPlan.min_amount} and $${selectedPlan.max_amount}`);
      return;
    }

    const balance = Number(wallet?.main_balance || 0);
    if (amt > balance) {
      toast.error('Insufficient wallet balance. Please deposit first.');
      return;
    }

    setLoading(true);
    try {
      const dailyProfit = (amt * selectedPlan.daily_roi) / 100;
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedPlan.duration_days);

      const { error } = await supabase.from('investments').insert({
        user_id: user.id,
        plan_id: selectedPlan.id,
        amount: amt,
        daily_profit: dailyProfit,
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        last_profit_date: startDate.toISOString(),
      });

      if (error) throw error;

      // Deduct from wallet
      await supabase.from('wallets').update({
        main_balance: balance - amt,
        total_investment_value: Number(wallet?.total_investment_value || 0) + amt,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id);

      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'investment',
        amount: amt,
        status: 'completed',
        description: `Investment in ${selectedPlan.name} plan`,
      });

      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Investment Activated',
        message: `Your investment of $${amt} in the ${selectedPlan.name} plan is now active. Daily profit: $${dailyProfit.toFixed(2)}`,
        type: 'investment',
      });

      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'investment_purchased',
        details: `Invested $${amt} in ${selectedPlan.name} plan`,
      });

      toast.success(`Investment activated! Daily profit: $${dailyProfit.toFixed(2)}`);
      setInvestAmount('');
      setSelectedPlan(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to invest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Investment Plans</h1>
        <p className="text-muted-foreground mt-1">Choose a plan and start earning daily profits with AI.</p>
      </div>

      {wallet && (
        <Card className="rounded-2xl p-5 card-shadow border-0 bg-gradient-to-r from-navy to-navy-light text-white">
          <p className="text-white/60 text-sm">Available Balance</p>
          <p className="text-3xl font-bold">${Number(wallet.main_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, i) => {
          const isVip = plan.name === 'VIP';
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`relative h-full rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all hover:-translate-y-1 border-0 ${
                isVip ? 'gradient-navy text-white' : ''
              }`}>
                {isVip && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-brand text-white px-4">
                    Most Popular
                  </Badge>
                )}
                <h3 className={`text-xl font-bold mb-2 ${isVip ? 'text-white' : 'text-navy dark:text-white'}`}>{plan.name}</h3>
                <div className="mb-4">
                  <span className={`text-3xl font-bold ${isVip ? 'text-white' : 'text-navy dark:text-white'}`}>
                    ${plan.min_amount.toLocaleString()}
                  </span>
                  <span className={`text-sm ${isVip ? 'text-white/60' : 'text-muted-foreground'}`}> / entry</span>
                </div>
                <div className={`space-y-2 mb-6 ${isVip ? 'text-white/80' : 'text-muted-foreground'}`}>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-red-brand" /><span className="text-sm">{plan.daily_roi}% Daily Profit</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-red-brand" /><span className="text-sm">{plan.duration_days} Days Duration</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-red-brand" /><span className="text-sm">{plan.total_roi}% Total ROI</span></div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-red-brand" /><span className="text-sm">Max: ${plan.max_amount.toLocaleString()}</span></div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => { setSelectedPlan(plan); setInvestAmount(plan.min_amount.toString()); }}
                      className={`w-full rounded-xl font-semibold ${
                        isVip ? 'bg-red-brand hover:bg-red-dark text-white' : 'bg-navy hover:bg-navy-light text-white'
                      }`}
                    >
                      <Zap className="mr-2 h-4 w-4" /> Invest Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>Invest in {plan.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-xl space-y-2">
                        <div className="flex justify-between"><span className="text-sm text-muted-foreground">Daily ROI</span><span className="font-semibold">{plan.daily_roi}%</span></div>
                        <div className="flex justify-between"><span className="text-sm text-muted-foreground">Duration</span><span className="font-semibold">{plan.duration_days} days</span></div>
                        <div className="flex justify-between"><span className="text-sm text-muted-foreground">Total ROI</span><span className="font-semibold">{plan.total_roi}%</span></div>
                        <div className="flex justify-between"><span className="text-sm text-muted-foreground">Min / Max</span><span className="font-semibold">${plan.min_amount} - ${plan.max_amount}</span></div>
                      </div>
                      <div>
                        <Label htmlFor="investAmount">Investment Amount (USD)</Label>
                        <Input
                          id="investAmount"
                          type="number"
                          className="mt-1 rounded-xl text-lg"
                          placeholder="Enter amount"
                          value={investAmount}
                          onChange={(e) => setInvestAmount(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Available: ${Number(wallet?.main_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      {investAmount && (
                        <div className="p-3 bg-green-50 rounded-xl">
                          <p className="text-sm text-green-700">
                            Daily Profit: ${((parseFloat(investAmount) * plan.daily_roi) / 100).toFixed(2)}
                          </p>
                          <p className="text-sm text-green-700">
                            Total Profit: ${((parseFloat(investAmount) * plan.total_roi) / 100).toFixed(2)}
                          </p>
                        </div>
                      )}
                      <Button
                        onClick={handleInvest}
                        disabled={loading}
                        className="w-full bg-red-brand hover:bg-red-dark text-white rounded-xl"
                      >
                        {loading ? 'Processing...' : 'Confirm Investment'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
