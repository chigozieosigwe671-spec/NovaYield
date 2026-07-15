'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { TrendingUp, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Investment, InvestmentPlan } from '@/lib/supabase/types';

export default function InvestmentsPage() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('investments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('investment_plans').select('*').eq('status', 'active').order('sort_order'),
    ]).then(([inv, pl]) => {
      setInvestments((inv.data as Investment[]) || []);
      setPlans((pl.data as InvestmentPlan[]) || []);
      setLoading(false);
    });
  }, [user]);

  const stats = {
    active: investments.filter(i => i.status === 'active').length,
    completed: investments.filter(i => i.status === 'completed').length,
    pending: investments.filter(i => i.status === 'pending').length,
    profit: investments.reduce((sum, i) => sum + Number(i.total_profit_earned), 0),
  };

  if (loading) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">My Investments</h1>
        <p className="text-muted-foreground mt-1">Track your investment performance and history.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active', value: stats.active, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Total Profit', value: `$${stats.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: AlertCircle, color: 'text-red-600 bg-red-50' },
        ].map((s, i) => (
          <Card key={i} className="rounded-2xl p-5 card-shadow border-0">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold text-navy dark:text-white">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {investments.length === 0 ? (
        <Card className="rounded-2xl p-12 card-shadow border-0 text-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-bold text-navy dark:text-white mb-2">No Investments Yet</h3>
          <p className="text-muted-foreground mb-6">Choose an investment plan to start earning daily profits.</p>
          <Link href="/dashboard/plans">
            <Button className="bg-red-brand hover:bg-red-dark text-white rounded-xl">
              Browse Plans <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {investments.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="rounded-2xl p-6 card-shadow border-0 hover:card-shadow-hover transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-navy dark:text-white">Investment #{inv.id.slice(0, 8)}</h3>
                      <Badge className={
                        inv.status === 'active' ? 'bg-green-100 text-green-700' :
                        inv.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        inv.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {inv.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Amount: ${Number(inv.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} • Daily: ${Number(inv.daily_profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    {inv.start_date && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Started: {new Date(inv.start_date).toLocaleDateString()}
                        {inv.end_date && ` • Ends: ${new Date(inv.end_date).toLocaleDateString()}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                    <p className="text-xl font-bold text-green-600">
                      ${Number(inv.total_profit_earned).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
