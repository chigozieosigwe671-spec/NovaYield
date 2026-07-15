'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Check, X, Eye, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDeposit, setSelectedDeposit] = useState<any | null>(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDeposits = async () => {
    const { data } = await supabase
      .from('deposits')
      .select('*, user:profiles!deposits_user_id_fkey(email, first_name, last_name)')
      .order('created_at', { ascending: false });
    setDeposits(data || []);
  };

  useEffect(() => { fetchDeposits(); }, []);

  const filtered = deposits.filter(d => {
    const matchesSearch = !search ||
      d.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      d.payment_method_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (deposit: any) => {
  setLoading(true);

  try {
    const response = await fetch('/api/admin/approve-deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        depositId: deposit.id,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to approve deposit');
    }

     // Credit wallet
      toast.success('Deposit approved and wallet credited!');
      setSelectedDeposit(null);
      setRemarks('');
      fetchDeposits();
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve deposit');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (deposit: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('deposits').update({
        status: 'rejected',
        admin_remarks: remarks || 'Rejected by admin',
        updated_at: new Date().toISOString(),
      }).eq('id', deposit.id);

      if (error) throw error;

      await supabase.from('transactions').update({ status: 'failed' })
        .eq('user_id', deposit.user_id)
        .eq('type', 'deposit')
        .eq('amount', deposit.amount)
        .eq('status', 'pending');

      await supabase.from('notifications').insert({
        user_id: deposit.user_id,
        title: 'Deposit Rejected',
        message: `Your deposit of $${deposit.amount} was rejected. Reason: ${remarks || 'Please contact support for details.'}`,
        type: 'deposit',
      });

      toast.success('Deposit rejected');
      setSelectedDeposit(null);
      setRemarks('');
      fetchDeposits();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Deposit Management</h1>
        <p className="text-muted-foreground mt-1">Review and process deposit requests.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10 rounded-xl" placeholder="Search by email or method..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${statusFilter === f ? 'bg-red-brand text-white' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card className="rounded-2xl p-6 card-shadow border-0">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No deposits found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">User</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Amount</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Method</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Date</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Status</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50">
                    <td className="py-3 text-sm text-navy dark:text-white">{d.user?.email}</td>
                    <td className="py-3 text-sm font-semibold text-navy dark:text-white">${Number(d.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 text-sm text-muted-foreground">{d.payment_method_name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</td>
                    <td className="py-3">
                      <Badge className={d.status === 'approved' ? 'bg-green-100 text-green-700' : d.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}>
                        {d.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="rounded-lg" onClick={() => { setSelectedDeposit(d); setRemarks(d.admin_remarks || ''); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {d.status === 'pending' && (
                          <>
                            <Button size="sm" className="rounded-lg bg-green-600 hover:bg-green-700 text-white" onClick={() => { setSelectedDeposit(d); setRemarks(''); }}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-lg border-red-200 text-red-600 hover:bg-red-50" onClick={() => { setSelectedDeposit(d); setRemarks(''); }}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={!!selectedDeposit} onOpenChange={(open) => !open && setSelectedDeposit(null)}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle>Deposit Details</DialogTitle>
          </DialogHeader>
          {selectedDeposit && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-xl">
                <div><p className="text-xs text-muted-foreground">User</p><p className="text-sm font-medium">{selectedDeposit.user?.email}</p></div>
                <div><p className="text-xs text-muted-foreground">Amount</p><p className="text-sm font-bold">${Number(selectedDeposit.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                <div><p className="text-xs text-muted-foreground">Method</p><p className="text-sm font-medium">{selectedDeposit.payment_method_name}</p></div>
                <div><p className="text-xs text-muted-foreground">Date</p><p className="text-sm font-medium">{new Date(selectedDeposit.created_at).toLocaleDateString()}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><Badge className={selectedDeposit.status === 'approved' ? 'bg-green-100 text-green-700' : selectedDeposit.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}>{selectedDeposit.status}</Badge></div>
              </div>

              {selectedDeposit.receipt_url && (
                <div>
                  <Label>Receipt</Label>
                  <a href={selectedDeposit.receipt_url} target="_blank" rel="noopener noreferrer" className="block mt-1">
                    <img src={selectedDeposit.receipt_url} alt="Receipt" className="max-h-48 rounded-xl border border-border" />
                  </a>
                </div>
              )}

              <div>
                <Label htmlFor="remarks">Admin Remarks</Label>
                <Textarea id="remarks" className="mt-1 rounded-xl" placeholder="Add remarks..." value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} />
              </div>

              {selectedDeposit.status === 'pending' && (
                <div className="flex gap-3">
                  <Button onClick={() => handleApprove(selectedDeposit)} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl">
                    {loading ? 'Processing...' : 'Approve & Credit'}
                  </Button>
                  <Button onClick={() => handleReject(selectedDeposit)} disabled={loading} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl">
                    Reject
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
