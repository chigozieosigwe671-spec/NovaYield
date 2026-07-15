'use client';

import Link from 'next/link';
import { TrendingUp, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';

const footerLinks = {
  Company: [
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Investment Plans', href: '/#plans' },
    { label: 'Contact', href: '/#contact' },
  ],
  Legal: [
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'FAQ', href: '/#faq' },
  ],
  Account: [
    { label: 'Login', href: '/login' },
    { label: 'Register', href: '/register' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
};

const socialIcons = [
  { icon: Facebook, href: '#' },
  { icon: Twitter, href: '#' },
  { icon: Linkedin, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Youtube, href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10">
                <TrendingUp className="h-6 w-6 text-red-brand" />
              </div>
              <span className="text-xl font-bold">
                Nova<span className="text-red-brand">Yield</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-6">
              Harnessing the power of artificial intelligence for sustainable and profitable investments across agriculture, oil & gas, real estate, and gold mining.
            </p>
            <div className="flex gap-3">
              {socialIcons.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-red-brand transition-colors"
                  aria-label="Social link"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/60 text-sm hover:text-red-brand transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="h-4 w-4 text-red-brand" />
                support@novayield.com
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="h-4 w-4 text-red-brand" />
                +1 (800) 555-0199
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="h-4 w-4 text-red-brand" />
                Global Operations
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} NovaYield. All rights reserved.
          </p>
          <p className="text-white/50 text-sm">
            AI-Powered Investment Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
