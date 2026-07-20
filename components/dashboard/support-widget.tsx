'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase/client';

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
    // Save ticket in Supabase
      const { error } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user.id,
          subject,
          message,
          status: "open",
          priority: "normal",
        });

        if (error) throw error;

            // Send email through Supabase Edge Function
            const { error: emailError } = await supabase.functions.invoke("send-email", {
          body: {
          type: "support_ticket",
          to: "novayieldhelp@gmail.com",
          data: {
            subject,
            message,
            name:
              `${user.user_metadata?.first_name ?? ""} ${user.user_metadata?.last_name ?? ""}`.trim() ||
              "NovaYield User",
            email: user.email,
          },
        },
      });

      if (emailError) {
        console.error(emailError);
      }

      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'support_ticket_submitted',
        details: `Subject: ${subject}`,
      });

      toast.success('Support ticket submitted! We will get back to you soon.');
      setSubject('');
      setMessage('');
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-red-brand hover:bg-red-dark text-white px-5 py-4 rounded-full shadow-lg shadow-red-500/30 hover:scale-105 transition-all"
        aria-label="Open support"
      >
        <Headphones className="h-6 w-6" />
        <span className="font-semibold hidden md:inline">Need Help?</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-50 bg-white dark:bg-card rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-brand text-white">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy dark:text-white">Customer Support</h3>
                    <p className="text-xs text-muted-foreground">24/7 Support Center</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4 p-3 bg-muted/50 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  Email us at{' '}
                  <a href="mailto:novayieldhelp@gmail.com" className="text-red-brand font-semibold">
                    novayieldhelp@gmail.com
                  </a>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    className="mt-1 rounded-xl"
                    placeholder="Brief description of your issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    className="mt-1 rounded-xl"
                    placeholder="Describe your issue in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-brand hover:bg-red-dark text-white rounded-xl"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  {!loading && <Send className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
