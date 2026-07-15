'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Headphones,
  Megaphone,
  Settings,
  History,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';

const adminNav = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Deposits', href: '/admin/deposits', icon: ArrowDownToLine },
  { label: 'Withdrawals', href: '/admin/withdrawals', icon: ArrowUpFromLine },
  { label: 'Plans', href: '/admin/plans', icon: TrendingUp },
  { label: 'Support', href: '/admin/support', icon: Headphones },
  { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Activity Logs', href: '/admin/logs', icon: History },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && user && profile && !profile.is_admin) router.push('/dashboard');
  }, [loading, user, profile, router]);

  if (loading || !user || (profile && !profile.is_admin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="animate-pulse">
          <Shield className="h-12 w-12 text-red-brand mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-navy-dark text-white fixed inset-y-0 left-0 z-40">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-brand">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold block">NovaYield</span>
              <span className="text-xs text-white/50">Admin Panel</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {adminNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-red-brand text-white shadow-lg shadow-red-500/20' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button onClick={() => signOut()} variant="ghost" className="w-full text-white/70 hover:bg-white/10 hover:text-white justify-start">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 w-64 bg-navy-dark text-white z-50 lg:hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <span className="text-lg font-bold">NovaYield Admin</span>
                <button onClick={() => setSidebarOpen(false)}><X className="h-5 w-5 text-white/70" /></button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {adminNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      pathname === item.href ? 'bg-red-brand text-white' : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64">
        <header className="lg:hidden sticky top-0 z-30 glass border-b border-border px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-navy dark:text-white" />
          </button>
          <span className="font-bold text-navy dark:text-white">Admin Panel</span>
          <Shield className="h-6 w-6 text-red-brand" />
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
