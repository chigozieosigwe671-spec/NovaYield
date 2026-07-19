'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowUpFromLine, Check } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { PaymentMethod, Wallet } from '@/lib/supabase/types';

export default function WithdrawPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [completedPlans, setCompletedPlans] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    walletAddress: '',
    confirmAddress: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('wallets').select('*').eq('user_id', user.id).maybeSingle().then(({ data }) => setWallet(data as Wallet | null));
    supabase.from('payment_methods').select('*').or('type.eq.withdrawal,type.eq.both').eq('status', 'active').order('sort_order').then(({ data }) => {
      if (data && data.length > 0) setMethods(data as PaymentMethod[]);
      else setMethods([
        { id: '1', name: 'USDT (TRC20)', network: 'TRC20', min_amount: 50, max_amount: 100000, fee_percentage: 0, processing_time: '1-24 hours', status: 'active' } as PaymentMethod,
        { id: '2', name: 'Bitcoin (BTC)', network: 'BTC', min_amount: 50, max_amount: 100000, fee_percentage: 0, processing_time: '1-24 hours', status: 'active' } as PaymentMethod,
        { id: '3', name: 'Ethereum (ETH)', network: 'ERC20', min_amount: 50, max_amount: 100000, fee_percentage: 0, processing_time: '1-24 hours', status: 'active' } as PaymentMethod,
      ]);
    });
    supabase.from('withdrawals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10).then(({ data }) => setWithdrawals(data || []));
    supabase
      .from("investments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "completed")
      .then(({ count }) => {
        setCompletedPlans(count || 0);
      });
  }, [user]);

  const availableBalance = wallet ? Number(wallet.main_balance) + Number(wallet.profit_balance) : 0;
  const accountBalance = wallet ? Number(wallet.main_balance) : 0;
  const profitBalance = wallet ? Number(wallet.profit_balance) : 0;
  const bonusBalance = wallet ? Number(wallet.bonus_balance) : 0;
  const withdrawalsLocked = completedPlans < 3;

  const handleSubmit = async () => {
    if (!user || !selectedMethod) return;
    const amt = parseFloat(formData.amount);
          // Prevent withdrawals until 3 completed plans
      if (completedPlans < 3) {
        toast.error(
          `Withdrawals are locked. Complete ${
            3 - completedPlans
          } more investment plan(s) to unlock withdrawals.`
        );
        return;
      }

    if (amt < selectedMethod.min_amount || amt > selectedMethod.max_amount) {
      toast.error(`Amount must be between $${selectedMethod.min_amount} and $${selectedMethod.max_amount}`);
      return;
    }
    if (amt > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }
    if (selectedMethod.network !== 'BANK' && formData.walletAddress !== formData.confirmAddress) {
      toast.error('Wallet addresses do not match');
      return;
    }
    if (selectedMethod.network === 'BANK' && (!formData.accountName || !formData.accountNumber || !formData.bankName)) {
      toast.error('Please fill in all bank details');
      return;
    }

    setLoading(true);
    try {
      const bankDetails = selectedMethod.network === 'BANK'
        ? `Bank: ${formData.bankName}, Account: ${formData.accountName} - ${formData.accountNumber}, Routing: ${formData.routingNumber}`
        : '';

      const { error } = await supabase.from('withdrawals').insert({
        user_id: user.id,
        amount: amt,
        payment_method_id: selectedMethod.id,
        payment_method_name: selectedMethod.name,
        wallet_address: formData.walletAddress,
        bank_details: bankDetails,
        status: 'pending',
      });

      if (error) throw error;

      // Deduct from balance (hold)
      await supabase.from('wallets').update({
        main_balance: Math.max(0, Number(wallet?.main_balance) - amt),
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id);

      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'withdrawal',
        amount: amt,
        status: 'pending',
        description: `Withdrawal via ${selectedMethod.name}`,
      });

      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Withdrawal Submitted',
        message: `Your withdrawal of $${amt} via ${selectedMethod.name} is pending approval.`,
        type: 'withdrawal',
      });

      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'withdrawal_submitted',
        details: `Withdrawal of $${amt} via ${selectedMethod.name}`,
      });

      toast.success('Withdrawal request submitted!');
      setDialogOpen(false);
      setFormData({ amount: '', walletAddress: '', confirmAddress: '', bankName: '', accountName: '', accountNumber: '', routingNumber: '', note: '' });
      setSelectedMethod(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Withdraw Funds</h1>
        <p className="text-muted-foreground mt-1">Request a withdrawal to your preferred payment method.</p>
      </div>

      {/* Wallet Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Available Balance', value: availableBalance, color: 'text-green-600' },
          { label: 'Account Balance', value: accountBalance, color: 'text-navy dark:text-white' },
          { label: 'Profit Balance', value: profitBalance, color: 'text-red-brand' },
          { label: 'Bonus Balance', value: bonusBalance, color: 'text-purple-600' },
        ].map((s, i) => (
          <Card key={i} className="rounded-2xl p-5 card-shadow border-0">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>
              ${s.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </Card>
        ))}
      </div>
            {withdrawalsLocked && (
            <Card className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
              <h3 className="text-lg font-bold text-amber-700">
                🔒 Withdrawals Locked
              </h3>

              <p className="mt-2 text-sm text-amber-700">
                Withdrawals will become available after you successfully complete
                <strong> 3 investment plans.</strong>
              </p>

              <p className="mt-4 font-semibold">
                Completed Plans: {completedPlans}/3
              </p>
            </Card>
        )}
      {/* Withdrawal Methods */}
      <div>
        <h3 className="font-bold text-navy dark:text-white mb-4">Withdrawal Methods</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {methods.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="rounded-2xl p-5 card-shadow border-0 hover:card-shadow-hover transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-navy dark:text-white">{m.name}</h4>
                  <Badge variant="outline" className="text-xs">{m.network}</Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <p>Min: ${m.min_amount} • Max: ${m.max_amount}</p>
                  <p>Fee: {m.fee_percentage}%</p>
                  <p>Processing: {m.processing_time}</p>
                </div>
                <Dialog open={dialogOpen && selectedMethod?.id === m.id} onOpenChange={(open) => { if (!open) setSelectedMethod(null); setDialogOpen(open); }}>
                  <DialogTrigger asChild>
                    <Button
                          disabled={withdrawalsLocked}
                          onClick={() => setSelectedMethod(m)}
                          className="w-full bg-navy hover:bg-navy-light text-white rounded-xl">
                           {withdrawalsLocked ? "Withdrawals Locked" : "Request Withdrawal"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>Withdraw via {m.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="wAmount">Amount (USD)</Label>
                        <Input
                          id="wAmount"
                          type="number"
                          className="mt-1 rounded-xl"
                          placeholder="Enter amount"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Available: ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>

                      {m.network !== 'BANK' ? (
                        <>
                          <div>
                            <Label>Wallet Address ({m.network})</Label>
                            <Input
                              className="mt-1 rounded-xl font-mono text-sm"
                              placeholder="Enter your wallet address"
                              value={formData.walletAddress}
                              onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Confirm Wallet Address</Label>
                            <Input
                              className="mt-1 rounded-xl font-mono text-sm"
                              placeholder="Confirm wallet address"
                              value={formData.confirmAddress}
                              onChange={(e) => setFormData({ ...formData, confirmAddress: e.target.value })}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <Label>Account Holder Name</Label>
                            <Input
                              className="mt-1 rounded-xl"
                              placeholder="John Doe"
                              value={formData.accountName}
                              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Bank Name</Label>
                            <Input
                              className="mt-1 rounded-xl"
                              placeholder="Bank of America"
                              value={formData.bankName}
                              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Account Number</Label>
                            <Input
                              className="mt-1 rounded-xl"
                              placeholder="0000000000"
                              value={formData.accountNumber}
                              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Routing / SWIFT Code</Label>
                            <Input
                              className="mt-1 rounded-xl"
                              placeholder="XXXXX"
                              value={formData.routingNumber}
                              onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <Label>Note (Optional)</Label>
                        <Textarea
                          className="mt-1 rounded-xl"
                          placeholder="Additional notes..."
                          value={formData.note}
                          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                          rows={2}
                        />
                      </div>

                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-red-brand hover:bg-red-dark text-white rounded-xl"
                      >
                        {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Withdrawal History */}
      <Card className="rounded-2xl p-6 card-shadow border-0">
        <h3 className="font-bold text-navy dark:text-white mb-4">Withdrawal History</h3>
        {withdrawals.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No withdrawals yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Date</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Amount</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Method</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Status</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-border/50">
                    <td className="py-3 text-sm text-muted-foreground">{new Date(w.created_at).toLocaleDateString()}</td>
                    <td className="py-3 text-sm font-semibold text-navy dark:text-white">${Number(w.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 text-sm text-navy dark:text-white">{w.payment_method_name}</td>
                    <td className="py-3">
                      <Badge className={w.status === 'completed' || w.status === 'approved' ? 'bg-green-100 text-green-700' : w.status === 'pending' ? 'bg-amber-100 text-amber-700' : w.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}>
                        {w.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{w.admin_remarks || '—'}</td>
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
