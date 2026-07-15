'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
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
import type { InvestmentPlan } from '@/lib/supabase/types';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [editing, setEditing] = useState<InvestmentPlan | null>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', min_amount: '', max_amount: '', daily_roi: '', duration_days: '30', total_roi: '', status: 'active',
  });
  const [loading, setLoading] = useState(false);

  const fetchPlans = async () => {
    const { data } = await supabase.from('investment_plans').select('*').order('sort_order');
    setPlans((data as InvestmentPlan[]) || []);
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        min_amount: parseFloat(formData.min_amount),
        max_amount: parseFloat(formData.max_amount),
        daily_roi: parseFloat(formData.daily_roi),
        duration_days: parseInt(formData.duration_days),
        total_roi: parseFloat(formData.total_roi),
        status: formData.status,
      };

      if (editing) {
        const { error } = await supabase.from('investment_plans').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id);
        if (error) throw error;
        toast.success('Plan updated!');
      } else {
        const { error } = await supabase.from('investment_plans').insert(payload);
        if (error) throw error;
        toast.success('Plan created!');
      }

      setOpen(false);
      setEditing(null);
      setFormData({ name: '', description: '', min_amount: '', max_amount: '', daily_roi: '', duration_days: '30', total_roi: '', status: 'active' });
      fetchPlans();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save plan');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: InvestmentPlan) => {
    setEditing(plan);
    setFormData({
      name: plan.name, description: plan.description, min_amount: plan.min_amount.toString(),
      max_amount: plan.max_amount.toString(), daily_roi: plan.daily_roi.toString(),
      duration_days: plan.duration_days.toString(), total_roi: plan.total_roi.toString(), status: plan.status,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this plan?')) return;
    await supabase.from('investment_plans').delete().eq('id', id);
    toast.success('Plan deleted');
    fetchPlans();
  };

  const toggleStatus = async (plan: InvestmentPlan) => {
    await supabase.from('investment_plans').update({ status: plan.status === 'active' ? 'inactive' : 'active' }).eq('id', plan.id);
    fetchPlans();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Investment Plans</h1>
          <p className="text-muted-foreground mt-1">Create and manage investment plans.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setEditing(null); setFormData({ name: '', description: '', min_amount: '', max_amount: '', daily_roi: '', duration_days: '30', total_roi: '', status: 'active' }); } }}>
          <DialogTrigger asChild>
            <Button className="bg-red-brand hover:bg-red-dark text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" /> New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl max-w-lg">
            <DialogHeader><DialogTitle>{editing ? 'Edit Plan' : 'Create Plan'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label htmlFor="name">Plan Name</Label><Input id="name" className="mt-1 rounded-xl" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div><Label htmlFor="desc">Description</Label><Textarea id="desc" className="mt-1 rounded-xl" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label htmlFor="min">Min Amount ($)</Label><Input id="min" type="number" className="mt-1 rounded-xl" value={formData.min_amount} onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })} required /></div>
                <div><Label htmlFor="max">Max Amount ($)</Label><Input id="max" type="number" className="mt-1 rounded-xl" value={formData.max_amount} onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })} required /></div>
                <div><Label htmlFor="roi">Daily ROI (%)</Label><Input id="roi" type="number" step="0.01" className="mt-1 rounded-xl" value={formData.daily_roi} onChange={(e) => setFormData({ ...formData, daily_roi: e.target.value })} required /></div>
                <div><Label htmlFor="dur">Duration (days)</Label><Input id="dur" type="number" className="mt-1 rounded-xl" value={formData.duration_days} onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })} required /></div>
                <div><Label htmlFor="totalRoi">Total ROI (%)</Label><Input id="totalRoi" type="number" step="0.01" className="mt-1 rounded-xl" value={formData.total_roi} onChange={(e) => setFormData({ ...formData, total_roi: e.target.value })} required /></div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-red-brand hover:bg-red-dark text-white rounded-xl">
                {loading ? 'Saving...' : editing ? 'Update Plan' : 'Create Plan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan, i) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-2xl p-5 card-shadow border-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-navy dark:text-white">{plan.name}</h3>
                <Badge className={plan.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {plan.status}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground mb-4">
                <p>Min: ${plan.min_amount} • Max: ${plan.max_amount}</p>
                <p>Daily ROI: {plan.daily_roi}%</p>
                <p>Duration: {plan.duration_days} days</p>
                <p>Total ROI: {plan.total_roi}%</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Switch checked={plan.status === 'active'} onCheckedChange={() => toggleStatus(plan)} />
                  <span className="text-xs text-muted-foreground">{plan.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => handleEdit(plan)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-lg border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleDelete(plan.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        {plans.length === 0 && (
          <Card className="rounded-2xl p-12 card-shadow border-0 text-center col-span-full">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No plans yet. Create your first plan.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
