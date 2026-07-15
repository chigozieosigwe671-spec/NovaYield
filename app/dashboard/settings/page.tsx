'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Moon, Sun, Bell, Globe } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    deposits: true,
    withdrawals: true,
    investments: true,
    referrals: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await supabase.from('activity_logs').insert({
        user_id: user?.id,
        action: 'settings_updated',
        details: 'User updated notification settings',
      });
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="rounded-2xl p-6 card-shadow border-0">
          <h3 className="font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Appearance
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="rounded-2xl p-6 card-shadow border-0">
          <h3 className="font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notification Preferences
          </h3>
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive email updates about your account' },
              { key: 'deposits', label: 'Deposit Alerts', desc: 'Get notified about deposit status changes' },
              { key: 'withdrawals', label: 'Withdrawal Alerts', desc: 'Get notified about withdrawal status changes' },
              { key: 'investments', label: 'Investment Updates', desc: 'Get notified about investment performance' },
              { key: 'referrals', label: 'Referral Notifications', desc: 'Get notified about referral activity' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <Label>{item.label}</Label>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={notifications[item.key as keyof typeof notifications]}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                />
              </div>
            ))}
          </div>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="mt-6 bg-red-brand hover:bg-red-dark text-white rounded-xl"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
