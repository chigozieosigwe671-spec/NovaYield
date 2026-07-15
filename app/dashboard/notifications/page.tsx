'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, [user]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    fetchNotifications();
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
    fetchNotifications();
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    fetchNotifications();
  };

  const typeColors: Record<string, string> = {
    deposit: 'bg-green-100 text-green-700',
    withdrawal: 'bg-blue-100 text-blue-700',
    investment: 'bg-purple-100 text-purple-700',
    referral: 'bg-pink-100 text-pink-700',
    support: 'bg-amber-100 text-amber-700',
    security: 'bg-red-100 text-red-700',
    info: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with your account activity.</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <Button onClick={markAllRead} variant="outline" className="rounded-xl">
            <Check className="mr-2 h-4 w-4" /> Mark All Read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : notifications.length === 0 ? (
        <Card className="rounded-2xl p-12 card-shadow border-0 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No notifications yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className={`rounded-2xl p-4 card-shadow border-0 ${!n.is_read ? 'border-l-4 border-l-red-brand' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-navy text-white flex-shrink-0">
                    <Bell className="h-5 w-5 text-red-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-navy dark:text-white text-sm">{n.title}</h3>
                      {!n.is_read && <Badge className="bg-red-brand text-white text-xs">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1">
                    {!n.is_read && (
                      <button onClick={() => markAsRead(n.id)} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Mark as read">
                        <Check className="h-4 w-4 text-green-600" />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
