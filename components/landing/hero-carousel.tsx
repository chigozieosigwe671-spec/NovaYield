'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Slide = {
  badge: string;
  title: React.ReactNode;
  paragraph: string;
  primaryBtn: string;
  primaryHref: string;
  secondaryBtn: string;
  secondaryHref: string;
  image: string;
  accent: string;
};

const slides: Slide[] = [
  {
    badge: 'AI-POWERED INVESTMENTS',
    title: (
      <>
        Harnessing the Power of AI for{' '}
        <span className="text-red-brand">Sustainable and Profitable</span>{' '}
        Investments
      </>
    ),
    paragraph:
      'NovaYield utilizes cutting-edge AI technology to identify and engage in high-potential ventures in agriculture, oil and gas, as well as gold and precious metal mining — building wealth that lasts generations.',
    primaryBtn: 'Get Started',
    primaryHref: '/register',
    secondaryBtn: 'Login',
    secondaryHref: '/login',
    image:
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1920',
    accent: 'from-blue-900/80 via-navy/70 to-navy-dark/90',
  },
  {
    badge: 'AGRICULTURE INVESTMENT',
    title: (
      <>
        Cultivating <span className="text-red-brand">Sustainable Growth</span>{' '}
        Through Smart Agriculture
      </>
    ),
    paragraph:
      'Invest in the future of food with AI-optimized agricultural projects — from precision farming to sustainable agribusiness ventures that deliver consistent, harvest-backed returns.',
    primaryBtn: 'Explore Agriculture',
    primaryHref: '/sectors/agriculture',
    secondaryBtn: 'Create Account',
    secondaryHref: '/register',
    image:
      'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=1920',
    accent: 'from-emerald-900/70 via-navy/70 to-navy-dark/90',
  },
  {
    badge: 'GOLD & PRECIOUS METALS',
    title: (
      <>
        Unlock the Wealth of <span className="text-red-brand">Tomorrow</span>{' '}
        Through Precious Metals
      </>
    ),
    paragraph:
      'Diversify your portfolio with AI-driven gold and precious metal mining investments — a time-tested hedge against inflation and a foundation for long-term financial security.',
    primaryBtn: 'Explore Gold Mining',
    primaryHref: '/sectors/gold-mining',
    secondaryBtn: 'Create Account',
    secondaryHref: '/register',
    image:
      'https://images.pexels.com/photos/4704414/pexels-photo-4704414.jpeg?auto=compress&cs=tinysrgb&w=1920',
    accent: 'from-amber-900/70 via-navy/70 to-navy-dark/90',
  },
  {
    badge: 'OIL & GAS ENERGY',
    title: (
      <>
        Powering Portfolios with <span className="text-red-brand">Energy</span>{' '}
        Investments
      </>
    ),
    paragraph:
      'Capitalize on high-performing energy sector opportunities backed by AI market intelligence — from upstream exploration to refined energy infrastructure projects worldwide.',
    primaryBtn: 'Explore Oil & Gas',
    primaryHref: '/sectors/oil-gas',
    secondaryBtn: 'Create Account',
    secondaryHref: '/register',
    image:
      'https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=1920',
    accent: 'from-orange-900/70 via-navy/70 to-navy-dark/90',
  },
  {
    badge: 'REAL ESTATE',
    title: (
      <>
        Build Lasting Wealth with{' '}
        <span className="text-red-brand">Premium Real Estate</span>
      </>
    ),
    paragraph:
      'Access exclusive residential and commercial property investment opportunities curated by AI — generating passive income and capital appreciation across global markets.',
    primaryBtn: 'Explore Real Estate',
    primaryHref: '/sectors/real-estate',
    secondaryBtn: 'Create Account',
    secondaryHref: '/register',
    image:
      'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1920',
    accent: 'from-slate-900/70 via-navy/70 to-navy-dark/90',
  },
  {
    badge: 'FINANCIAL FREEDOM',
    title: (
      <>
        Invest Smarter with{' '}
        <span className="text-red-brand">Artificial Intelligence</span>
      </>
    ),
    paragraph:
      'Our intelligent investment platform continuously analyzes global markets, helping investors discover profitable opportunities while minimizing risk through advanced AI technology.',
    primaryBtn: 'Explore Plans',
    primaryHref: '/#plans',
    secondaryBtn: 'Create Account',
    secondaryHref: '/register',
    image:
      'https://images.pexels.com/photos/7567430/pexels-photo-7567430.jpeg?auto=compress&cs=tinysrgb&w=1920',
    accent: 'from-indigo-900/70 via-navy/70 to-navy-dark/90',
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const goTo = (i: number) => setCurrent(i);

  return (
    <section
      className="relative h-[640px] md:h-[720px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background images with crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${slides[current].accent}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 via-navy-dark/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-3xl"
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 text-red-brand font-semibold text-sm md:text-base tracking-[0.2em] mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-brand opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-brand" />
              </span>
              {slides[current].badge}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display max-w-4xl text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-7 drop-shadow-lg"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl !text-white/90 mb-10 max-w-2xl leading-relaxed text-pretty drop-shadow-md"
            >
              {slides[current].paragraph}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link href={slides[current].primaryHref}>
                <Button
                  size="lg"
                  className="bg-red-brand hover:bg-red-dark text-white px-8 py-6 text-base font-semibold rounded-full shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transition-all hover:scale-105 group"
                >
                  {slides[current].primaryBtn}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={slides[current].secondaryHref}>
                <Button
                  size="lg"
                  variant="outline"
                  className="glass text-white border-white/30 hover:bg-white/15 px-8 py-6 text-base font-semibold rounded-full transition-all hover:scale-105 group"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {slides[current].secondaryBtn}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Trust bar */}
      <div className="absolute bottom-20 left-0 right-0 z-10 hidden md:block">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span>Live AI Trading Engine</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div>Trusted by 12,000+ investors</div>
            <div className="h-4 w-px bg-white/20" />
            <div>$500M+ Assets Managed</div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-10 bg-red-brand' : 'w-2.5 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
