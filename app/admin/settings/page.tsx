'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Save, Plus, Trash2, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { PaymentMethod } from '@/lib/supabase/types';

export default function AdminSettingsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    name: '', type: 'both', network: '', wallet_address: '', bank_details: '',
    instructions: '', min_amount: '50', max_amount: '100000', fee_percentage: '0',
    processing_time: '1-24 hours', status: 'active',
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [methodsRes, settingsRes] = await Promise.all([
      supabase.from('payment_methods').select('*').order('sort_order'),
      supabase.from('settings').select('*'),
    ]);
    setMethods((methodsRes.data as PaymentMethod[]) || []);
    const sMap: Record<string, string> = {};
    (settingsRes.data || []).forEach((s: any) => { sMap[s.key] = s.value; });
    setSettings(sMap);
  };

  useEffect(() => { fetchData(); }, []);

  const handleMethodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name, type: formData.type, network: formData.network,
        wallet_address: formData.wallet_address, bank_details: formData.bank_details,
        instructions: formData.instructions,
        min_amount: parseFloat(formData.min_amount), max_amount: parseFloat(formData.max_amount),
        fee_percentage: parseFloat(formData.fee_percentage), processing_time: formData.processing_time,
        status: formData.status,
      };

      if (editing) {
        await supabase.from('payment_methods').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id);
        toast.success('Payment method updated!');
      } else {
        await supabase.from('payment_methods').insert(payload);
        toast.success('Payment method created!');
      }
      setOpen(false);
      setEditing(null);
      setFormData({ name: '', type: 'both', network: '', wallet_address: '', bank_details: '', instructions: '', min_amount: '50', max_amount: '100000', fee_percentage: '0', processing_time: '1-24 hours', status: 'active' });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save payment method');
    } finally {
      setLoading(false);
    }
  };

  const editMethod = (m: PaymentMethod) => {
    setEditing(m);
    setFormData({
      name: m.name, type: m.type, network: m.network, wallet_address: m.wallet_address,
      bank_details: m.bank_details, instructions: m.instructions,
      min_amount: m.min_amount.toString(), max_amount: m.max_amount.toString(),
      fee_percentage: m.fee_percentage.toString(), processing_time: m.processing_time, status: m.status,
    });
    setOpen(true);
  };

  const deleteMethod = async (id: string) => {
    if (!confirm('Delete this payment method?')) return;
    await supabase.from('payment_methods').delete().eq('id', id);
    toast.success('Payment method deleted');
    fetchData();
  };

  const toggleMethod = async (m: PaymentMethod) => {
    await supabase.from('payment_methods').update({ status: m.status === 'active' ? 'inactive' : 'active' }).eq('id', m.id);
    fetchData();
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      }
      toast.success('Settings saved!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Platform Settings</h1>
        <p className="text-muted-foreground mt-1">Manage payment methods and platform configuration.</p>
      </div>

      {/* Payment Methods */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-navy dark:text-white">Payment Methods</h2>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setFormData({ name: '', type: 'both', network: '', wallet_address: '', bank_details: '', instructions: '', min_amount: '50', max_amount: '100000', fee_percentage: '0', processing_time: '1-24 hours', status: 'active' }); } }}>
            <DialogTrigger asChild>
              <Button className="bg-red-brand hover:bg-red-dark text-white rounded-xl">
                <Plus className="h-4 w-4 mr-2" /> Add Method
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editing ? 'Edit Payment Method' : 'Add Payment Method'}</DialogTitle></DialogHeader>
              <form onSubmit={handleMethodSubmit} className="space-y-4">
                <div><Label htmlFor="mName">Name</Label><Input id="mName" className="mt-1 rounded-xl" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Type</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                      <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="deposit">Deposit</SelectItem><SelectItem value="withdrawal">Withdrawal</SelectItem><SelectItem value="both">Both</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label htmlFor="mNetwork">Network</Label><Input id="mNetwork" className="mt-1 rounded-xl" value={formData.network} onChange={(e) => setFormData({ ...formData, network: e.target.value })} /></div>
                </div>
                <div><Label htmlFor="mWallet">Wallet Address</Label><Input id="mWallet" className="mt-1 rounded-xl font-mono text-sm" value={formData.wallet_address} onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })} /></div>
                <div><Label htmlFor="mBank">Bank Details</Label><Textarea id="mBank" className="mt-1 rounded-xl" value={formData.bank_details} onChange={(e) => setFormData({ ...formData, bank_details: e.target.value })} rows={2} /></div>
                <div><Label htmlFor="mInstructions">Instructions</Label><Textarea id="mInstructions" className="mt-1 rounded-xl" value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })} rows={2} /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label htmlFor="mMin">Min Amount</Label><Input id="mMin" type="number" className="mt-1 rounded-xl" value={formData.min_amount} onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })} required /></div>
                  <div><Label htmlFor="mMax">Max Amount</Label><Input id="mMax" type="number" className="mt-1 rounded-xl" value={formData.max_amount} onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })} required /></div>
                  <div><Label htmlFor="mFee">Fee (%)</Label><Input id="mFee" type="number" step="0.01" className="mt-1 rounded-xl" value={formData.fee_percentage} onChange={(e) => setFormData({ ...formData, fee_percentage: e.target.value })} required /></div>
                </div>
                <div><Label htmlFor="mProc">Processing Time</Label><Input id="mProc" className="mt-1 rounded-xl" value={formData.processing_time} onChange={(e) => setFormData({ ...formData, processing_time: e.target.value })} /></div>
                <Button type="submit" disabled={loading} className="w-full bg-red-brand hover:bg-red-dark text-white rounded-xl">
                  {loading ? 'Saving...' : editing ? 'Update Method' : 'Create Method'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {methods.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="rounded-2xl p-5 card-shadow border-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-navy dark:text-white" />
                    <h3 className="font-bold text-navy dark:text-white">{m.name}</h3>
                  </div>
                  <Badge className={m.status === 'active' ? 'bg-green-100 text-green-700' : m.status === 'maintenance' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}>
                    {m.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <p>Network: {m.network || '—'}</p>
                  <p>Min: ${m.min_amount} • Max: ${m.max_amount}</p>
                  <p>Fee: {m.fee_percentage}% • {m.processing_time}</p>
                  {m.wallet_address && <p className="font-mono text-xs break-all">Address: {m.wallet_address}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch checked={m.status === 'active'} onCheckedChange={() => toggleMethod(m)} />
                    <span className="text-xs text-muted-foreground">{m.status === 'active' ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="rounded-lg" onClick={() => editMethod(m)}>Edit</Button>
                    <Button size="sm" variant="outline" className="rounded-lg border-red-200 text-red-600 hover:bg-red-50" onClick={() => deleteMethod(m.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Platform Settings */}
      <Card className="rounded-2xl p-6 card-shadow border-0">
        <h2 className="text-lg font-bold text-navy dark:text-white mb-4">Platform Configuration</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label htmlFor="siteName">Site Name</Label><Input id="siteName" className="mt-1 rounded-xl" value={settings.site_name || ''} onChange={(e) => setSettings({ ...settings, site_name: e.target.value })} /></div>
          <div><Label htmlFor="supportEmail">Support Email</Label><Input id="supportEmail" className="mt-1 rounded-xl" value={settings.support_email || ''} onChange={(e) => setSettings({ ...settings, support_email: e.target.value })} /></div>
          <div><Label htmlFor="minDep">Minimum Deposit</Label><Input id="minDep" type="number" className="mt-1 rounded-xl" value={settings.min_deposit || ''} onChange={(e) => setSettings({ ...settings, min_deposit: e.target.value })} /></div>
          <div><Label htmlFor="maxDep">Maximum Deposit</Label><Input id="maxDep" type="number" className="mt-1 rounded-xl" value={settings.max_deposit || ''} onChange={(e) => setSettings({ ...settings, max_deposit: e.target.value })} /></div>
          <div><Label htmlFor="minWd">Minimum Withdrawal</Label><Input id="minWd" type="number" className="mt-1 rounded-xl" value={settings.min_withdrawal || ''} onChange={(e) => setSettings({ ...settings, min_withdrawal: e.target.value })} /></div>
          <div><Label htmlFor="maxWd">Maximum Withdrawal</Label><Input id="maxWd" type="number" className="mt-1 rounded-xl" value={settings.max_withdrawal || ''} onChange={(e) => setSettings({ ...settings, max_withdrawal: e.target.value })} /></div>
          <div><Label htmlFor="tagline">Platform Tagline</Label><Input id="tagline" className="mt-1 rounded-xl" value={settings.platform_tagline || ''} onChange={(e) => setSettings({ ...settings, platform_tagline: e.target.value })} /></div>
        </div>
        <Button onClick={saveSettings} disabled={loading} className="mt-6 bg-red-brand hover:bg-red-dark text-white rounded-xl">
          <Save className="h-4 w-4 mr-2" /> {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </Card>
    </div>
  );
}
