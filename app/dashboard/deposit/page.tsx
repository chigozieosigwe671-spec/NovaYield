'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Copy, Upload, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { PaymentMethod } from '@/lib/supabase/types';

export default function DepositPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [deposits, setDeposits] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from('payment_methods')
      .select('*')
      .or('type.eq.deposit,type.eq.both')
      .eq('status', 'active')
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) setMethods(data as PaymentMethod[]);
        else
          setMethods([
            { id: '1', name: 'USDT (TRC20)', type: 'both', network: 'TRC20', wallet_address: 'TRqxYHgokLx7uTwy1r5XhN7QsWHV24i5bQ', min_amount: 50, max_amount: 100000, fee_percentage: 0, processing_time: '1-24 hours', status: 'active', sort_order: 1 } as PaymentMethod,
            { id: '2', name: 'Bitcoin (BTC)', type: 'both', network: 'BTC', wallet_address: 'bc1qj5xspjrzm7ukvn00w8t52nr248cge0els5v7j2', min_amount: 50, max_amount: 100000, fee_percentage: 0, processing_time: '1-24 hours', status: 'active', sort_order: 2 } as PaymentMethod,
            { id: '3', name: 'Ethereum (ETH)', type: 'both', network: 'ERC20', wallet_address: '0x4e856f9F77EB78763EA92c6a70826Ad2Cd385c3f', min_amount: 50, max_amount: 100000, fee_percentage: 0, processing_time: '1-24 hours', status: 'active', sort_order: 3 } as PaymentMethod,
            { id: '4', name: 'Litecoin (LTC)', type: 'both', network: 'LTC', wallet_address: 'ltc1qmalrnjtqajp25nuz0m7z39vylwsk3rnw2phrkd', min_amount: 50, max_amount: 100000, fee_percentage: 0, processing_time: '1-24 hours', status: 'active', sort_order: 4 } as PaymentMethod,
            { id: '5', name: 'Bank Transfer', type: 'both', network: 'BANK', wallet_address: '', min_amount: 100, max_amount: 100000, fee_percentage: 0, processing_time: '1-3 business days', status: 'active', sort_order: 5 } as PaymentMethod,
          ]);
      });

    if (user) {
      supabase
        .from('deposits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
        .then(({ data }) => setDeposits(data || []));
    }
  }, [user]);

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    toast.success('Address copied to clipboard');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB');
      return;
    }
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      toast.error('Only JPG, PNG, or PDF files are allowed');
      return;
    }
    setReceipt(file);
  };

  const handleSubmit = async () => {
    if (!user || !selectedMethod) return;
    const amt = parseFloat(amount);
    if (amt < selectedMethod.min_amount || amt > selectedMethod.max_amount) {
      toast.error(`Amount must be between $${selectedMethod.min_amount} and $${selectedMethod.max_amount}`);
      return;
    }

    setLoading(true);
    try {
      let receiptUrl = '';
      if (receipt) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(`${user.id}/${Date.now()}-${receipt.name}`, receipt);
        if (uploadError) {
          toast.error('Failed to upload receipt');
        } else {
          const { data: urlData } = supabase.storage.from('receipts').getPublicUrl(uploadData.path);
          receiptUrl = urlData.publicUrl;
        }
      }

      const { error } = await supabase.from('deposits').insert({
        user_id: user.id,
        amount: amt,
        payment_method_id: selectedMethod.id,
        payment_method_name: selectedMethod.name,
        receipt_url: receiptUrl,
        status: 'pending',
      });

      if (error) throw error;

      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'deposit',
        amount: amt,
        status: 'pending',
        description: `Deposit via ${selectedMethod.name}`,
      });

      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Deposit Submitted',
        message: `Your deposit of $${amt} via ${selectedMethod.name} is pending approval.`,
        type: 'deposit',
      });

      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'deposit_submitted',
        details: `Deposit of $${amt} via ${selectedMethod.name}`,
      });

      toast.success('Deposit request submitted successfully!');
      setStep(1);
      setAmount('');
      setSelectedMethod(null);
      setReceipt(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Fund Your Account</h1>
        <p className="text-muted-foreground mt-1">Choose a payment method and enter the amount.</p>
      </div>

      {/* Deposit Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Deposits', value: deposits.filter(d => d.status === 'approved').reduce((s, d) => s + Number(d.amount), 0), count: deposits.length },
          { label: 'Pending', value: deposits.filter(d => d.status === 'pending').reduce((s, d) => s + Number(d.amount), 0), count: deposits.filter(d => d.status === 'pending').length },
          { label: 'Approved', value: deposits.filter(d => d.status === 'approved').reduce((s, d) => s + Number(d.amount), 0), count: deposits.filter(d => d.status === 'approved').length },
          { label: 'Rejected', value: deposits.filter(d => d.status === 'rejected').reduce((s, d) => s + Number(d.amount), 0), count: deposits.filter(d => d.status === 'rejected').length },
        ].map((s, i) => (
          <Card key={i} className="rounded-2xl p-4 card-shadow border-0">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-xl font-bold text-navy dark:text-white mt-1">
              ${s.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{s.count} deposits</p>
          </Card>
        ))}
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
              step >= s ? 'bg-red-brand text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 4 && <div className={`h-1 w-12 ${step > s ? 'bg-red-brand' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      <Card className="rounded-2xl p-6 card-shadow border-0">
        {/* Step 1: Amount */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="font-bold text-navy dark:text-white mb-4">Step 1: Enter Amount</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Deposit Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  className="mt-1 rounded-xl text-lg"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-2">Minimum: $50 • Maximum: $100,000</p>
              </div>
              <Button
                onClick={() => {
                  if (!amount || parseFloat(amount) < 50) {
                    toast.error('Minimum deposit is $50');
                    return;
                  }
                  setStep(2);
                }}
                className="bg-red-brand hover:bg-red-dark text-white rounded-xl"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="font-bold text-navy dark:text-white mb-4">Step 2: Choose Payment Method</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedMethod(m); setStep(3); }}
                  className={`text-left p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    selectedMethod?.id === m.id ? 'border-red-brand bg-red-50' : 'border-border bg-muted/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-navy dark:text-white">{m.name}</span>
                    <Badge variant="outline" className="text-xs">{m.network}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Min: ${m.min_amount} • Max: ${m.max_amount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Fee: {m.fee_percentage}% • {m.processing_time}</p>
                </button>
              ))}
            </div>
            <Button variant="ghost" onClick={() => setStep(1)} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </motion.div>
        )}

        {/* Step 3: Payment Details */}
        {step === 3 && selectedMethod && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="font-bold text-navy dark:text-white mb-4">Step 3: Payment Details</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-xl">
                <p className="text-sm text-muted-foreground">Selected Amount</p>
                <p className="text-lg font-bold text-navy dark:text-white">${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="text-sm text-muted-foreground mt-1">via {selectedMethod.name}</p>
              </div>

              {selectedMethod.wallet_address && (
                <div>
                  <Label>Wallet Address</Label>
                  <div className="flex gap-2 mt-1">
                    <Input readOnly value={selectedMethod.wallet_address} className="rounded-xl font-mono text-sm" />
                    <Button onClick={() => copyAddress(selectedMethod.wallet_address)} variant="outline" className="rounded-xl">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {selectedMethod.bank_details && (
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-sm font-medium text-navy dark:text-white mb-2">Bank Details</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedMethod.bank_details}</p>
                </div>
              )}

              {selectedMethod.instructions && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-700">{selectedMethod.instructions}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(2)} className="rounded-xl">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(4)} className="bg-red-brand hover:bg-red-dark text-white rounded-xl">
                  Proceed to Upload <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Upload Proof */}
        {step === 4 && selectedMethod && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="font-bold text-navy dark:text-white mb-4">Step 4: Upload Proof of Payment</h3>
            <div className="space-y-4">
              <div>
                <Label>Upload Receipt (JPG, PNG, PDF - Max 10MB)</Label>
                <div className="mt-1 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-red-brand transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label htmlFor="receipt-upload" className="cursor-pointer">
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    {receipt ? (
                      <p className="text-sm font-medium text-green-600">
                        <Check className="inline h-4 w-4 mr-1" /> {receipt.name}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Click to upload payment receipt</p>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setStep(3)} className="rounded-xl">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-red-brand hover:bg-red-dark text-white rounded-xl"
                >
                  {loading ? 'Submitting...' : 'Submit Deposit Request'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Deposit History */}
      <Card className="rounded-2xl p-6 card-shadow border-0">
        <h3 className="font-bold text-navy dark:text-white mb-4">Recent Deposits</h3>
        {deposits.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No deposits yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Date</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Amount</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Method</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((d) => (
                  <tr key={d.id} className="border-b border-border/50">
                    <td className="py-3 text-sm text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</td>
                    <td className="py-3 text-sm font-semibold text-navy dark:text-white">${Number(d.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 text-sm text-navy dark:text-white">{d.payment_method_name}</td>
                    <td className="py-3">
                      <Badge className={d.status === 'approved' ? 'bg-green-100 text-green-700' : d.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}>
                        {d.status}
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
