'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
};

const slides: Slide[] = [
  {
    badge: 'AI-POWERED INVESTMENTS',
    title: (
      <>
        Harnessing the Power of Artificial Intelligence for{' '}
        <span className="text-red-brand">Sustainable and Profitable</span>{' '}
        Investments
      </>
    ),
    paragraph:
      'At NovaYield, we utilize cutting-edge AI technology to identify and engage in high-potential ventures in agriculture, oil and gas, as well as gold and precious metal mining.',
    primaryBtn: 'Get Started',
    primaryHref: '/register',
    secondaryBtn: 'Login',
    secondaryHref: '/login',
    image:
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    badge: 'WELCOME TO NOVAYIELD',
    title: (
      <>
        Unlock the Wealth of <span className="text-red-brand">Tomorrow</span>
      </>
    ),
    paragraph:
      'At NovaYield, we harness the power of AI to unlock the untapped potential of agriculture, real estate, oil and gas, and gold and precious stone mining.',
    primaryBtn: 'Get Started',
    primaryHref: '/register',
    secondaryBtn: 'Login',
    secondaryHref: '/login',
    image:
      'https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg?auto=compress&cs=tinysrgb&w=1920',
  },
  {
    badge: 'SMART INVESTING',
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
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      className="relative h-[600px] md:h-[680px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          <div className="absolute inset-0 gradient-hero opacity-90" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl"
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-red-brand font-semibold text-sm md:text-base tracking-widest mb-4"
            >
              {slides[current].badge}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 text-balance"
            >
              {slides[current].title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm md:text-base text-white/80 mb-8 max-w-2xl leading-relaxed"
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
                  className="bg-red-brand hover:bg-red-dark text-white px-7 py-5 text-sm font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all hover:scale-105"
                >
                  {slides[current].primaryBtn}
                </Button>
              </Link>
              <Link href={slides[current].secondaryHref}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-7 py-5 text-sm font-semibold rounded-xl transition-all hover:scale-105"
                >
                  {slides[current].secondaryBtn}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={prev}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-8 bg-red-brand' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
