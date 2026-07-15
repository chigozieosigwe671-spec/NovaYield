'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Check, X, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<any | null>(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWithdrawals = async () => {
    const { data } = await supabase
      .from('withdrawals')
      .select('*, user:profiles!withdrawals_user_id_fkey(email, first_name, last_name)')
      .order('created_at', { ascending: false });
    setWithdrawals(data || []);
  };

  useEffect(() => { fetchWithdrawals(); }, []);

  const filtered = withdrawals.filter(w => {
    const matchesSearch = !search || w.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (w: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('withdrawals').update({
        status: 'completed',
        admin_remarks: remarks || 'Approved by admin',
        transaction_id: `TXN-${Date.now()}`,
        updated_at: new Date().toISOString(),
      }).eq('id', w.id);
      if (error) throw error;

      const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', w.user_id).maybeSingle();
      if (wallet) {
        await supabase.from('wallets').update({
          total_withdrawals: Number(wallet.total_withdrawals) + Number(w.amount),
          updated_at: new Date().toISOString(),
        }).eq('user_id', w.user_id);
      }

      await supabase.from('transactions').update({ status: 'completed' })
        .eq('user_id', w.user_id).eq('type', 'withdrawal').eq('amount', w.amount).eq('status', 'pending');

      await supabase.from('notifications').insert({
        user_id: w.user_id,
        title: 'Withdrawal Approved',
        message: `Your withdrawal of $${w.amount} has been approved and processed. Transaction ID: TXN-${Date.now()}`,
        type: 'withdrawal',
      });

      await supabase.from('activity_logs').insert({
        user_id: w.user_id,
        action: 'withdrawal_approved',
        details: `Withdrawal of $${w.amount} approved by admin`,
      });

      toast.success('Withdrawal approved and processed!');
      setSelected(null);
      setRemarks('');
      fetchWithdrawals();
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve withdrawal');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (w: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('withdrawals').update({
        status: 'rejected',
        admin_remarks: remarks || 'Rejected by admin',
        updated_at: new Date().toISOString(),
      }).eq('id', w.id);
      if (error) throw error;

      // Restore held funds
      const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', w.user_id).maybeSingle();
      if (wallet) {
        await supabase.from('wallets').update({
          main_balance: Number(wallet.main_balance) + Number(w.amount),
          updated_at: new Date().toISOString(),
        }).eq('user_id', w.user_id);
      }

      await supabase.from('transactions').update({ status: 'failed' })
        .eq('user_id', w.user_id).eq('type', 'withdrawal').eq('amount', w.amount).eq('status', 'pending');

      await supabase.from('notifications').insert({
        user_id: w.user_id,
        title: 'Withdrawal Rejected',
        message: `Your withdrawal of $${w.amount} was rejected. Funds restored to your balance. Reason: ${remarks || 'Please contact support.'}`,
        type: 'withdrawal',
      });

      toast.success('Withdrawal rejected and funds restored');
      setSelected(null);
      setRemarks('');
      fetchWithdrawals();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Withdrawal Management</h1>
        <p className="text-muted-foreground mt-1 text-sm">Review and process withdrawal requests.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10 rounded-xl" placeholder="Search by email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'completed', 'rejected'].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${statusFilter === f ? 'bg-red-brand text-white' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card className="rounded-2xl p-6 card-shadow border-0">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No withdrawals found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">User</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Amount</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Method</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Address</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Date</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Status</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w) => (
                  <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50">
                    <td className="py-3 text-sm text-navy dark:text-white">{w.user?.email}</td>
                    <td className="py-3 text-sm font-semibold text-navy dark:text-white">${Number(w.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 text-sm text-muted-foreground">{w.payment_method_name}</td>
                    <td className="py-3 text-sm text-muted-foreground font-mono text-xs">
                      {w.wallet_address ? `${w.wallet_address.slice(0, 8)}...${w.wallet_address.slice(-6)}` : w.bank_details?.slice(0, 20) || '—'}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{new Date(w.created_at).toLocaleDateString()}</td>
                    <td className="py-3">
                      <Badge className={w.status === 'completed' ? 'bg-green-100 text-green-700' : w.status === 'pending' ? 'bg-amber-100 text-amber-700' : w.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}>
                        {w.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      {w.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button size="sm" className="rounded-lg bg-green-600 hover:bg-green-700 text-white" onClick={() => { setSelected(w); setRemarks(''); }}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-lg border-red-200 text-red-600 hover:bg-red-50" onClick={() => { setSelected(w); setRemarks(''); }}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" className="rounded-lg" onClick={() => { setSelected(w); setRemarks(w.admin_remarks || ''); }}>
                          View
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader><DialogTitle>Withdrawal Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-xl">
                <div><p className="text-xs text-muted-foreground">User</p><p className="text-sm font-medium">{selected.user?.email}</p></div>
                <div><p className="text-xs text-muted-foreground">Amount</p><p className="text-sm font-bold">${Number(selected.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                <div><p className="text-xs text-muted-foreground">Method</p><p className="text-sm font-medium">{selected.payment_method_name}</p></div>
                <div><p className="text-xs text-muted-foreground">Date</p><p className="text-sm font-medium">{new Date(selected.created_at).toLocaleDateString()}</p></div>
                {selected.wallet_address && (
                  <div className="col-span-2"><p className="text-xs text-muted-foreground">Wallet Address</p><p className="text-sm font-mono break-all">{selected.wallet_address}</p></div>
                )}
                {selected.bank_details && (
                  <div className="col-span-2"><p className="text-xs text-muted-foreground">Bank Details</p><p className="text-sm">{selected.bank_details}</p></div>
                )}
              </div>
              <div>
                <Label htmlFor="wRemarks">Admin Remarks</Label>
                <Textarea id="wRemarks" className="mt-1 rounded-xl" placeholder="Add remarks..." value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} />
              </div>
              {selected.status === 'pending' && (
                <div className="flex gap-3">
                  <Button onClick={() => handleApprove(selected)} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl">
                    {loading ? 'Processing...' : 'Approve & Process'}
                  </Button>
                  <Button onClick={() => handleReject(selected)} disabled={loading} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl">
                    Reject & Refund
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
