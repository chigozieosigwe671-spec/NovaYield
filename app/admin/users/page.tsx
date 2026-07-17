'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Search, Ban, CheckCircle, Trash2, Eye, Wallet } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [walletData, setWalletData] = useState<any | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('Profiles:', data);
  console.log('Error:', error);

  setUsers(data || []);
};

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    !search ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.referral_code?.toLowerCase().includes(search.toLowerCase())
  );

  const viewUser = async (user: any) => {
    setSelected(user);
    const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', user.id).maybeSingle();
    setWalletData(wallet);
  };

  const toggleStatus = async (user: any) => {
    const newStatus = user.account_status === 'active' ? 'suspended' : 'active';
    await supabase.from('profiles').update({ account_status: newStatus, updated_at: new Date().toISOString() }).eq('id', user.id);
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: newStatus === 'suspended' ? 'user_suspended' : 'user_reactivated',
      details: `Admin ${newStatus === 'suspended' ? 'suspended' : 'reactivated'} user account`,
    });
    toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}`);
    fetchUsers();
  };

  const adjustWallet = async (type: 'add' | 'subtract') => {
    if (!selected || !walletData || !adjustAmount) return;
    const amt = parseFloat(adjustAmount);
    const newBalance = type === 'add'
      ? Number(walletData.main_balance) + amt
      : Math.max(0, Number(walletData.main_balance) - amt);

    await supabase.from('wallets').update({
      main_balance: newBalance,
      updated_at: new Date().toISOString(),
    }).eq('user_id', selected.id);

    await supabase.from('transactions').insert({
      user_id: selected.id,
      type: 'admin_adjustment',
      amount: amt,
      status: 'completed',
      description: `Admin ${type === 'add' ? 'credited' : 'debited'} $${amt}`,
    });

    await supabase.from('activity_logs').insert({
      user_id: selected.id,
      action: 'wallet_adjusted',
      details: `Admin ${type}ed $${amt} to wallet`,
    });

    toast.success(`Wallet ${type === 'add' ? 'credited' : 'debited'} successfully`);
    setAdjustAmount('');
    viewUser(selected);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage all platform users.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-10 rounded-xl max-w-md" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="rounded-2xl p-6 card-shadow border-0">
        <p className="mb-4">Total users: {users.length}</p>
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Name</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Email</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Referral Code</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Joined</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Status</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50">
                    <td className="py-3 text-sm font-medium text-navy dark:text-white">{u.first_name} {u.last_name}</td>
                    <td className="py-3 text-sm text-muted-foreground">{u.email}</td>
                    <td className="py-3 text-sm text-muted-foreground font-mono">{u.referral_code}</td>
                    <td className="py-3 text-sm text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="py-3">
                      <Badge className={u.account_status === 'active' ? 'bg-green-100 text-green-700' : u.account_status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                        {u.account_status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="rounded-lg" onClick={() => viewUser(u)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className={`rounded-lg ${u.account_status === 'active' ? 'border-amber-200 text-amber-600 hover:bg-amber-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`} onClick={() => toggleStatus(u)}>
                          {u.account_status === 'active' ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                      </div>
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
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-xl">
                <div><p className="text-xs text-muted-foreground">Name</p><p className="text-sm font-medium">{selected.first_name} {selected.last_name}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{selected.email}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium">{selected.phone || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Country</p><p className="text-sm font-medium">{selected.country || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Referral Code</p><p className="text-sm font-mono">{selected.referral_code}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><Badge className={selected.account_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{selected.account_status}</Badge></div>
              </div>

              {walletData && (
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-sm font-semibold text-navy dark:text-white mb-3 flex items-center gap-2">
                    <Wallet className="h-4 w-4" /> Wallet Balances
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div><p className="text-xs text-muted-foreground">Main</p><p className="text-sm font-bold">${Number(walletData.main_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                    <div><p className="text-xs text-muted-foreground">Profit</p><p className="text-sm font-bold">${Number(walletData.profit_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                    <div><p className="text-xs text-muted-foreground">Bonus</p><p className="text-sm font-bold">${Number(walletData.bonus_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                    <div><p className="text-xs text-muted-foreground">Referral</p><p className="text-sm font-bold">${Number(walletData.referral_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="adjustAmount">Adjust Main Balance</Label>
                <div className="flex gap-2 mt-1">
                  <Input id="adjustAmount" type="number" className="rounded-xl" placeholder="Amount" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} />
                  <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl" onClick={() => adjustWallet('add')}>Add</Button>
                  <Button variant="outline" className="rounded-xl border-red-200 text-red-600 hover:bg-red-50" onClick={() => adjustWallet('subtract')}>Subtract</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
