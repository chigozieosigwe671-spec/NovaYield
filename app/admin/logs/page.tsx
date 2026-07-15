'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('activity_logs')
      .select('*, user:profiles!activity_logs_user_id_fkey(email, first_name, last_name)')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => setLogs(data || []));
  }, []);

  const filtered = logs.filter(l =>
    !search ||
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.details?.toLowerCase().includes(search.toLowerCase()) ||
    l.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const actionColors: Record<string, string> = {
    user_registered: 'bg-green-100 text-green-700',
    user_login: 'bg-blue-100 text-blue-700',
    password_changed: 'bg-amber-100 text-amber-700',
    deposit_submitted: 'bg-teal-100 text-teal-700',
    deposit_approved: 'bg-green-100 text-green-700',
    deposit_rejected: 'bg-red-100 text-red-700',
    withdrawal_submitted: 'bg-orange-100 text-orange-700',
    withdrawal_approved: 'bg-green-100 text-green-700',
    withdrawal_rejected: 'bg-red-100 text-red-700',
    investment_purchased: 'bg-purple-100 text-purple-700',
    user_suspended: 'bg-red-100 text-red-700',
    user_reactivated: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Activity Logs</h1>
        <p className="text-muted-foreground mt-1">Monitor all platform activity and security events.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-10 rounded-xl max-w-md" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="rounded-2xl p-6 card-shadow border-0">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No activity logs found.</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-navy text-white text-xs flex-shrink-0">
                  <span className="text-red-brand font-bold">•</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={actionColors[log.action] || 'bg-gray-100 text-gray-700'}>
                      {log.action.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{log.user?.email || 'System'}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                  {log.ip_address && <p className="text-xs text-muted-foreground mt-1">IP: {log.ip_address}</p>}
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                  {new Date(log.created_at).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
