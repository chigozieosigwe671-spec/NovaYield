'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Trash2, Megaphone } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', type: 'info' });
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    setAnnouncements(data || []);
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('announcements').insert({
        title: formData.title,
        message: formData.message,
        type: formData.type,
        is_active: true,
        dismissible: true,
      });
      if (error) throw error;

      // Notify all users
      const { data: users } = await supabase.from('profiles').select('id');
      if (users && users.length > 0) {
        await supabase.from('notifications').insert(
          users.map((u: any) => ({
            user_id: u.id,
            title: formData.title,
            message: formData.message,
            type: 'info',
          }))
        );
      }

      toast.success('Announcement broadcast to all users!');
      setOpen(false);
      setFormData({ title: '', message: '', type: 'info' });
      fetchAnnouncements();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (ann: any) => {
    await supabase.from('announcements').update({ is_active: !ann.is_active }).eq('id', ann.id);
    fetchAnnouncements();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    await supabase.from('announcements').delete().eq('id', id);
    toast.success('Announcement deleted');
    fetchAnnouncements();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Announcements</h1>
          <p className="text-muted-foreground mt-1">Broadcast messages to all users.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-brand hover:bg-red-dark text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" /> New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl max-w-lg">
            <DialogHeader><DialogTitle>Create Announcement</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label htmlFor="title">Title</Label><Input id="title" className="mt-1 rounded-xl" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
              <div><Label htmlFor="message">Message</Label><Textarea id="message" className="mt-1 rounded-xl" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} required /></div>
              <div>
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-red-brand hover:bg-red-dark text-white rounded-xl">
                {loading ? 'Creating...' : 'Broadcast Announcement'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {announcements.length === 0 ? (
          <Card className="rounded-2xl p-12 card-shadow border-0 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No announcements yet.</p>
          </Card>
        ) : (
          announcements.map((ann, i) => (
            <motion.div key={ann.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="rounded-2xl p-5 card-shadow border-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-navy dark:text-white">{ann.title}</h3>
                      <Badge className={
                        ann.type === 'success' ? 'bg-green-100 text-green-700' :
                        ann.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                        ann.type === 'promotion' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }>{ann.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{ann.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(ann.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Switch checked={ann.is_active} onCheckedChange={() => toggleActive(ann)} />
                    <span className="text-xs text-muted-foreground">{ann.is_active ? 'Active' : 'Hidden'}</span>
                    <Button size="sm" variant="outline" className="rounded-lg border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleDelete(ann.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
