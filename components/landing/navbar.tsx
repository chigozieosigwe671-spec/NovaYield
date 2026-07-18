'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Logo } from './logo';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Sectors', href: '/#services' },
  { label: 'Process', href: '/#process' },
  { label: 'Plans', href: '/#plans' },
  { label: 'FAQ', href: '/#faq' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-[0_8px_30px_-12px_rgba(15,30,61,0.12)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Logo scrolled={scrolled} />

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-[15px] font-medium rounded-full transition-all hover:bg-muted/60 ${
                scrolled ? 'text-navy dark:text-white hover:text-red-brand' : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2.5 rounded-full transition-all ${
                scrolled ? 'text-navy dark:text-white hover:bg-muted' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}
          <Link href="/login">
            <Button variant="ghost" className={`text-[15px] font-semibold ${scrolled ? '' : 'text-white hover:bg-white/10'}`}>
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-red-brand hover:bg-red-dark text-white text-[15px] font-semibold rounded-full px-6 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all hover:scale-105">
              Get Started
            </Button>
          </Link>
        </div>

        <button
          className="lg:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className={`h-6 w-6 ${scrolled ? 'text-navy dark:text-white' : 'text-white'}`} />
          ) : (
            <Menu className={`h-6 w-6 ${scrolled ? 'text-navy dark:text-white' : 'text-white'}`} />
          )}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-border mt-3 overflow-hidden"
          >
            <div className="px-4 py-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-navy dark:text-white font-medium text-base py-3 px-4 rounded-xl hover:bg-muted/60 hover:text-red-brand transition-colors"
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              ))}
              <div className="flex gap-3 pt-4">
                <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button variant="outline" className="w-full rounded-full">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button className="w-full bg-red-brand hover:bg-red-dark text-white rounded-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
