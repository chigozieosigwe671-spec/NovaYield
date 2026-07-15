'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Users,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Shield,
  Headphones,
  LineChart as Logo,
} from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import { SupportWidget } from '@/components/dashboard/support-widget';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
  { label: 'Deposit', href: '/dashboard/deposit', icon: ArrowDownToLine },
  { label: 'Withdraw', href: '/dashboard/withdraw', icon: ArrowUpFromLine },
  { label: 'Investments', href: '/dashboard/investments', icon: TrendingUp },
  { label: 'Plans', href: '/dashboard/plans', icon: TrendingUp },
  { label: 'Transactions', href: '/dashboard/transactions', icon: History },
  { label: 'Referrals', href: '/dashboard/referrals', icon: Users },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Security', href: '/dashboard/security', icon: Shield },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
        .then(({ count }) => setUnreadCount(count || 0));
    }
  }, [user, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-navy animate-pulse" />
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const firstName = profile?.first_name || 'User';
  const initials = `${profile?.first_name?.[0] || 'U'}${profile?.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-muted/20 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-navy-dark text-white fixed inset-y-0 left-0 z-40">
        <div className="p-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10">
              <Logo className="h-6 w-6 text-red-brand" />
            </div>
            <span className="text-xl font-bold">
              Nova<span className="text-red-brand">Yield</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-red-brand text-white shadow-lg shadow-red-500/20'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.label === 'Notifications' && unreadCount > 0 && (
                  <Badge className="bg-red-brand text-white text-xs px-1.5">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-brand text-white font-semibold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{firstName}</p>
              <p className="text-xs text-white/50 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            onClick={() => signOut()}
            variant="ghost"
            className="w-full text-white/70 hover:bg-white/10 hover:text-white justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
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
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 w-64 bg-navy-dark text-white z-50 lg:hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10">
                    <Logo className="h-6 w-6 text-red-brand" />
                  </div>
                  <span className="text-xl font-bold">
                    Nova<span className="text-red-brand">Yield</span>
                  </span>
                </Link>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5 text-white/70" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        active ? 'bg-red-brand text-white' : 'text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                      {item.label === 'Notifications' && unreadCount > 0 && (
                        <Badge className="bg-red-brand text-white text-xs px-1.5 ml-auto">
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-white/10">
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  className="w-full text-white/70 hover:bg-white/10 hover:text-white justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 glass border-b border-border px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-navy dark:text-white" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-red-brand" />
            <span className="font-bold text-navy dark:text-white">
              Nova<span className="text-red-brand">Yield</span>
            </span>
          </Link>
          <Link href="/dashboard/notifications">
            <div className="relative">
              <Bell className="h-6 w-6 text-navy dark:text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-brand text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </Link>
        </header>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>

      <SupportWidget />
    </div>
  );
}
