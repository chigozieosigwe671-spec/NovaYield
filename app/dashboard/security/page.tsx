'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Key, Smartphone, Eye, EyeOff, Mail } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { supabase } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SecurityPage() {
  const { user, profile } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => setLogs(data || []));
  }, [user]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.new });
      if (error) throw error;

      await supabase.from('activity_logs').insert({
        user_id: user?.id,
        action: 'password_changed',
        details: 'User changed their password',
      });

      await supabase.from('notifications').insert({
        user_id: user?.id,
        title: 'Password Changed',
        message: 'Your account password was changed successfully. If this was not you, please contact support immediately.',
        type: 'security',
      });

      toast.success('Password changed successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-navy dark:text-white">Security</h1>
        <p className="text-muted-foreground mt-1">Manage your account security settings.</p>
      </div>

      {/* Security Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="rounded-2xl p-6 card-shadow border-0">
          <h3 className="font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" /> Security Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Password</span>
              </div>
              <Badge className="bg-green-100 text-green-700">Set</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Email Verification</span>
              </div>
              <Badge className={profile?.email_verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                {profile?.email_verified ? 'Verified' : 'Pending'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Two-Factor Authentication</span>
              </div>
              <Badge className={profile?.two_factor_enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {profile?.two_factor_enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="rounded-2xl p-6 card-shadow border-0">
          <h3 className="font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
            <Key className="h-5 w-5" /> Change Password
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative mt-1">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="rounded-xl pr-10"
                  placeholder="Enter new password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                className="mt-1 rounded-xl"
                placeholder="Confirm new password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-red-brand hover:bg-red-dark text-white rounded-xl">
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="rounded-2xl p-6 card-shadow border-0">
          <h3 className="font-bold text-navy dark:text-white mb-4">Recent Security Activity</h3>
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No recent activity.</p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-navy text-white text-xs">
                    <Shield className="h-4 w-4 text-red-brand" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy dark:text-white">
                      {log.action.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </p>
                    <p className="text-xs text-muted-foreground">{log.details}</p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
