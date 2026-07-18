'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { Logo } from './logo';

const footerLinks = {
  Company: [
    { label: 'About Us', href: '/#about' },
    { label: 'Sectors', href: '/#services' },
    { label: 'Our Process', href: '/#process' },
    { label: 'Investment Plans', href: '/#plans' },
  ],
  Sectors: [
    { label: 'Agriculture', href: '/sectors/agriculture' },
    { label: 'Real Estate', href: '/sectors/real-estate' },
    { label: 'Oil & Gas', href: '/sectors/oil-gas' },
    { label: 'Gold Mining', href: '/sectors/gold-mining' },
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
    <footer className="bg-navy-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-brand/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-5">
              <Logo scrolled={false} size="lg" />
            </div>
            <p className="text-white/60 text-base leading-relaxed max-w-sm mb-6 text-pretty">
              Harnessing the power of artificial intelligence for sustainable and profitable investments across agriculture, oil & gas, real estate, and gold mining.
            </p>
            <div className="flex gap-3">
              {socialIcons.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 hover:bg-red-brand transition-all hover:scale-110"
                  aria-label="Social link"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-white mb-5 text-lg">{title}</h3>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/60 text-[15px] hover:text-red-brand transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-bold text-white mb-5 text-lg">Contact</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3 text-white/60 text-[15px]">
                <Mail className="h-5 w-5 text-red-brand flex-shrink-0 mt-0.5" />
                support@novayield.com
              </li>
              <li className="flex items-start gap-3 text-white/60 text-[15px]">
                <Phone className="h-5 w-5 text-red-brand flex-shrink-0 mt-0.5" />
                +1 (800) 555-0199
              </li>
              <li className="flex items-start gap-3 text-white/60 text-[15px]">
                <MapPin className="h-5 w-5 text-red-brand flex-shrink-0 mt-0.5" />
                Global Operations
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} NovaYield. All rights reserved.
          </p>
          <p className="text-white/50 text-sm flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Investment Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
