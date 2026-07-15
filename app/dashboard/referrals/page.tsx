'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Copy, Share2, Users, DollarSign, TrendingUp, Gift } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ReferralsPage() {
  const { user, profile } = useAuth();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, earnings: 0, available: 0 });

  const referralLink = profile?.referral_code
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${profile.referral_code}`
    : '';

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('referrals').select('*, referred:profiles!referrals_referred_id_fkey(email, first_name, last_name, created_at, account_status)').eq('referrer_id', user.id).order('created_at', { ascending: false }),
      supabase.from('referral_commissions').select('*').eq('referrer_id', user.id).order('created_at', { ascending: false }),
    ]).then(([refs, comm]) => {
      setReferrals(refs.data || []);
      setCommissions(comm.data || []);
      const refData = refs.data || [];
      const commData = comm.data || [];
      setStats({
        total: refData.length,
        active: refData.filter((r: any) => r.status === 'active').length,
        pending: refData.filter((r: any) => r.status === 'pending').length,
        earnings: commData.filter((c: any) => c.status === 'paid').reduce((s: number, c: any) => s + Number(c.amount), 0),
        available: commData.filter((c: any) => c.status === 'pending').reduce((s: number, c: any) => s + Number(c.amount), 0),
      });
    });
  }, [user]);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  const copyCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      toast.success('Referral code copied!');
    }
  };

  const shareLinks = [
    { label: 'WhatsApp', url: `https://wa.me/?text=${encodeURIComponent(`Join NovaYield and start earning! ${referralLink}`)}`, color: 'bg-green-500' },
    { label: 'Telegram', url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join NovaYield!')}`, color: 'bg-blue-500' },
    { label: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, color: 'bg-blue-600' },
    { label: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Join NovaYield and start earning with AI!')}&url=${encodeURIComponent(referralLink)}`, color: 'bg-sky-500' },
    { label: 'Email', url: `mailto:?subject=${encodeURIComponent('Join NovaYield')}&body=${encodeURIComponent(`Start earning with AI investments! ${referralLink}`)}`, color: 'bg-gray-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Referrals</h1>
        <p className="text-muted-foreground mt-1">Invite friends and earn referral rewards.</p>
      </div>

      {/* Referral Link Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="rounded-2xl p-6 card-shadow border-0 gradient-navy text-white">
          <h3 className="font-bold text-white mb-4">Your Referral Link</h3>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 bg-white/10 rounded-xl p-3 font-mono text-sm text-white/90 truncate">
              {referralLink}
            </div>
            <Button onClick={copyLink} className="bg-red-brand hover:bg-red-dark text-white rounded-xl">
              <Copy className="mr-2 h-4 w-4" /> Copy Link
            </Button>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={copyCode} variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl">
              <Copy className="mr-2 h-4 w-4" /> Copy Code: {profile?.referral_code}
            </Button>
            {shareLinks.map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl">
                  <Share2 className="mr-2 h-4 w-4" /> {s.label}
                </Button>
              </a>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Referrals', value: stats.total, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Active Referrals', value: stats.active, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
          { label: 'Total Earnings', value: `$${stats.earnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-red-600 bg-red-50' },
          { label: 'Available Bonus', value: `$${stats.available.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Gift, color: 'text-purple-600 bg-purple-50' },
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

      {/* Referral Table */}
      <Card className="rounded-2xl p-6 card-shadow border-0">
        <h3 className="font-bold text-navy dark:text-white mb-4">Referred Users</h3>
        {referrals.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No referrals yet. Share your link to start earning!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Name</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Email</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Date</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref, i) => (
                  <tr key={ref.id} className="border-b border-border/50">
                    <td className="py-3 text-sm font-medium text-navy dark:text-white">
                      {ref.referred?.first_name} {ref.referred?.last_name}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{ref.referred?.email}</td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {ref.referred?.created_at ? new Date(ref.referred.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3">
                      <Badge className={
                        ref.status === 'active' ? 'bg-green-100 text-green-700' :
                        ref.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {ref.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
