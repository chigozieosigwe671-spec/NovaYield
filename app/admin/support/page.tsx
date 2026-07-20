'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Search, Send, Eye } from 'lucide-react';
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

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    console.log(data, error);

    setTickets(data || []);
  };

  useEffect(() => { fetchTickets(); }, []);

  const viewTicket = async (ticket: any) => {
    setSelected(ticket);
    const { data } = await supabase.from('support_replies').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true });
    setReplies(data || []);
  };

  const sendReply = async () => {
    if (!selected || !replyText) return;
    setLoading(true);
    try {
      await supabase.from('support_replies').insert({
        ticket_id: selected.id,
        user_id: selected.user_id,
        message: replyText,
        is_admin: true,
      });

      await supabase.from('support_tickets').update({
        status: 'pending',
        updated_at: new Date().toISOString(),
      }).eq('id', selected.id);

      await supabase.from('notifications').insert({
        user_id: selected.user_id,
        title: 'Support Reply',
        message: `Admin replied to your ticket: "${selected.subject}"`,
        type: 'support',
      });

      toast.success('Reply sent!');
      setReplyText('');
      viewTicket(selected);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  const closeTicket = async (ticket: any) => {
    await supabase.from('support_tickets').update({ status: 'closed', updated_at: new Date().toISOString() }).eq('id', ticket.id);
    toast.success('Ticket closed');
    fetchTickets();
    setSelected(null);
  };

  const filtered = tickets.filter(t =>
    !search || t.user?.email?.toLowerCase().includes(search.toLowerCase()) || t.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Support Tickets</h1>
        <p className="text-muted-foreground mt-1">Manage customer support requests.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-10 rounded-xl max-w-md" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="rounded-2xl p-6 card-shadow border-0">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No tickets found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">User</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Subject</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Priority</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Date</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Status</th>
                  <th className="text-left text-sm font-medium text-muted-foreground pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/50">
                    <td className="py-3 text-sm text-navy dark:text-white">{t.user_id}</td>
                    <td className="py-3 text-sm font-medium text-navy dark:text-white">{t.subject}</td>
                    <td className="py-3">
                      <Badge className={t.priority === 'urgent' ? 'bg-red-100 text-red-700' : t.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}>
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</td>
                    <td className="py-3">
                      <Badge className={t.status === 'open' ? 'bg-green-100 text-green-700' : t.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button size="sm" variant="outline" className="rounded-lg" onClick={() => viewTicket(t)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{selected?.subject}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">{selected.user_id} • {new Date(selected.created_at).toLocaleString()}</p>
                <p className="text-sm text-navy dark:text-white">{selected.message}</p>
              </div>

              {replies.map((r) => (
                <div key={r.id} className={`p-4 rounded-xl ${r.is_admin ? 'bg-blue-50 ml-8' : 'bg-muted/30 mr-8'}`}>
                  <p className="text-xs text-muted-foreground mb-1">{r.is_admin ? 'Admin' : 'User'} • {new Date(r.created_at).toLocaleString()}</p>
                  <p className="text-sm text-navy dark:text-white">{r.message}</p>
                </div>
              ))}

              <div>
                <Label htmlFor="reply">Reply</Label>
                <Textarea id="reply" className="mt-1 rounded-xl" placeholder="Type your reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3} />
              </div>

              <div className="flex gap-3">
                <Button onClick={sendReply} disabled={loading || !replyText} className="flex-1 bg-red-brand hover:bg-red-dark text-white rounded-xl">
                  <Send className="h-4 w-4 mr-2" /> {loading ? 'Sending...' : 'Send Reply'}
                </Button>
                {selected.status !== 'closed' && (
                  <Button variant="outline" className="rounded-xl" onClick={() => closeTicket(selected)}>Close Ticket</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
