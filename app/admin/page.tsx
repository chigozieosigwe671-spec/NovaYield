'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, Activity, ArrowDownToLine, ArrowUpFromLine, Headphones } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from 'recharts';

export default function AdminOverview() {
const [stats, setStats] = useState({
  totalUsers: 0,
  totalDeposits: 0,
  pendingDeposits: 0,
  totalWithdrawals: 0,
  pendingWithdrawals: 0,
  activeInvestments: 0,
  openTickets: 0,
  totalDepositAmount: 0,
  totalWithdrawalAmount: 0,
});

const [recentUsers, setRecentUsers] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [chartData, setChartData] = useState<any[]>([]);
const [recentDeposits, setRecentDeposits] = useState<any[]>([]);
const [recentWithdrawals, setRecentWithdrawals] = useState<any[]>([]);
const [recentInvestments, setRecentInvestments] = useState<any[]>([]);

useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();

      setStats({
        totalUsers: data.totalUsers ?? 0,
        totalDeposits: data.totalDeposits ?? 0,
        pendingDeposits: data.pendingDeposits ?? 0,
        totalWithdrawals: data.totalWithdrawals ?? 0,
        pendingWithdrawals: data.pendingWithdrawals ?? 0,
        activeInvestments: data.activeInvestments ?? 0,
        openTickets: data.openTickets ?? 0,
        totalDepositAmount: data.totalDepositAmount ?? 0,
        totalWithdrawalAmount: data.totalWithdrawalAmount ?? 0,
      });

      setChartData(data.chartData || []);
      setRecentDeposits(data.recentDeposits || []);
      setRecentWithdrawals(data.recentWithdrawals || []);
      setRecentInvestments(data.recentInvestments || []);

      const { data: recentUsers } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentUsers(recentUsers || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  fetchStats();

  const interval = setInterval(fetchStats, 30000);

  return () => clearInterval(interval);
}, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Deposits', value: `$${stats.totalDepositAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: ArrowDownToLine, color: 'text-green-600 bg-green-50' },
    { label: 'Total Withdrawals', value: `$${stats.totalWithdrawalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: ArrowUpFromLine, color: 'text-orange-600 bg-orange-50' },
    { label: 'Active Investments', value: stats.activeInvestments, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
    { label: 'Pending Deposits', value: stats.pendingDeposits, icon: DollarSign, color: 'text-amber-600 bg-amber-50' },
    { label: 'Pending Withdrawals', value: stats.pendingWithdrawals, icon: DollarSign, color: 'text-red-600 bg-red-50' },
    { label: 'Open Tickets', value: stats.openTickets, icon: Headphones, color: 'text-pink-600 bg-pink-50' },
    { label: 'Total Activity', value: stats.totalUsers + stats.totalDeposits + stats.totalWithdrawals, icon: Activity, color: 'text-teal-600 bg-teal-50' },
  ];



  if (loading) {
    return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-navy dark:text-white">Admin Overview</h1>
        <p className="text-muted-foreground mt-1">Platform statistics and recent activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-2xl p-5 card-shadow border-0">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-navy dark:text-white">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl p-6 card-shadow border-0">
          <h3 className="font-bold text-navy dark:text-white mb-4">Deposit vs Withdrawal Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Legend />
              <Bar dataKey="deposits" fill="hsl(142 71% 45%)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="withdrawals" fill="hsl(0 84% 50%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="rounded-2xl p-6 card-shadow border-0">
          <h3 className="font-bold text-navy dark:text-white mb-4">Deposit Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(222 47% 18%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(222 47% 18%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Area type="monotone" dataKey="deposits" stroke="hsl(222 47% 18%)" fill="url(#colorUsers)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="rounded-2xl p-6 card-shadow border-0">
        <h3 className="font-bold text-navy dark:text-white mb-4">Recent Users</h3>
        {recentUsers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Name</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Email</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Joined</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.id} className="border-b border-border/50">
                    <td className="py-3 text-sm font-medium text-navy dark:text-white">{u.first_name} {u.last_name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{u.email}</td>
                    <td className="py-3 text-sm text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="py-3">
                      <Badge className={u.account_status === 'active' ? 'bg-green-100 text-green-700' : u.account_status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                        {u.account_status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Card className="rounded-2xl p-6 card-shadow border-0 mt-6">
        <h3 className="font-bold text-navy dark:text-white mb-4">
          Recent Activity
        </h3>

        <div className="space-y-3">
          {[
            ...recentDeposits.map((d: any) => ({
              text: `Deposit of $${Number(d.amount).toLocaleString()} received`,
              date: new Date(d.created_at).toLocaleString(),
              color: "text-green-600",
            })),
            ...recentWithdrawals.map((w: any) => ({
              text: `Withdrawal request of $${Number(w.amount).toLocaleString()}`,
              date: new Date(w.created_at).toLocaleString(),
              color: "text-red-600",
            })),
            ...recentInvestments.map((i: any) => ({
              text: `New investment of $${Number(i.amount).toLocaleString()}`,
              date: new Date(i.created_at).toLocaleString(),
              color: "text-blue-600",
            })),
          ]
            .sort(
              (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 10)
            .map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-2"
              >
                <span className={`font-medium ${activity.color}`}>
                  {activity.text}
                </span>

                <span className="text-xs text-muted-foreground">
                  {activity.date}
                </span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
