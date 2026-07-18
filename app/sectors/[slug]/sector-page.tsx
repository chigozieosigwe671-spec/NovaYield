'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, TrendingUp, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import type { Sector } from '@/lib/sectors';

export function SectorPage({ sector }: { sector: Sector }) {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[480px] md:h-[560px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={sector.heroImage}
            alt={sector.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/90 via-navy/75 to-navy-dark/90" />
          <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <Link href="/#services" className="inline-flex items-center gap-2 transition-colors hover:text-white font-display max-w-4xl text-md md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-7 drop-shadow-lg">
              <ArrowLeft className="h-4 w-4" />
              All Sectors
            </Link>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 text-red-brand font-semibold text-sm tracking-[0.2em] mb-5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
            >
              <Sparkles className="h-4 w-4 text-white" />
              {sector.tagline}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl md:text-5xl lg:text-3xl font-bold !text-white/90 mb-6 text-balance"
            >
              {sector.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-md md:text-1xl !text-white/70 max-w-2xl leading-relaxed text-pretty"
            >
              {sector.shortDesc}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Image + Long Description */}
      <section className="py-20 md:py-28 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-red-brand font-semibold text-sm tracking-[0.2em] mb-4">OVERVIEW</p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-4xl font-bold text-navy dark:text-white mb-6 text-balance">
                A Closer Look at {sector.title}
              </h2>
              <p className="text-muted-foreground text-md leading-relaxed text-pretty ">
                {sector.longDesc}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden card-shadow-lg">
                <img
                  src={sector.featuredImage}
                  alt={sector.title}
                  className="w-full h-[480px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/40 to-transparent" />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-5 card-shadow-lg hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy dark:text-white">Up to 240%</p>
                    <p className="text-sm text-muted-foreground">Total ROI</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits + Risk Management */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full rounded-3xl p-8 md:p-10 card-shadow border-0 bg-white dark:bg-card">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 mb-5">
                  <CheckCircle2 className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="font-display text-4xl md:text-5xl lg:text-3xl font-bold text-navy dark:text-white mb-6">
                  Key Benefits
                </h3>
                <ul className="space-y-4">
                  {sector.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-brand/10 flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-red-brand" />
                      </div>
                      <span className="text-muted-foreground text-[15px] md:text-base leading-relaxed text-pretty">{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full rounded-3xl p-8 md:p-10 card-shadow border-0 bg-white dark:bg-card">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy mb-5">
                  <ShieldCheck className="h-7 w-7 text-red-brand" />
                </div>
                <h3 className="font-display text-4xl md:text-5xl lg:text-3xl font-bold text-navy dark:text-white mb-6">
                  Risk Management
                </h3>
                <ul className="space-y-4">
                  {sector.riskManagement.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-navy/10 flex-shrink-0 mt-0.5">
                        <ShieldCheck className="h-4 w-4 text-navy" />
                      </div>
                      <span className="text-muted-foreground text-[15px] md:text-base leading-relaxed text-pretty">{r}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expected Returns */}
      <section className="py-20 md:py-28 bg-white dark:bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="rounded-3xl p-10 md:p-14 card-shadow border-0 gradient-navy text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-72 h-72 bg-red-brand rounded-full blur-3xl" />
              </div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-5">
                  <Target className="h-7 w-7 text-red-brand" />
                </div>
                <h3 className="font-display text-4xl md:text-5xl lg:text-3xl font-bold mb-5">
                  Expected Returns
                </h3>
                <p className="text-white/70 text-md leading-relaxed text-pretty max-w-3xl">
                  {sector.expectedReturns}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why Choose This Sector */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-red-brand font-semibold text-sm tracking-[0.2em] mb-4">WHY INVEST HERE</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-3xl font-bold text-navy dark:text-white text-balance">
              Why Investors Choose {sector.title}
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {sector.whyChoose.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full rounded-2xl p-7 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border-0 bg-white dark:bg-card">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-brand/10 flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-red-brand" />
                    </div>
                    <p className="text-navy dark:text-white  text-[15px] md:text-base leading-relaxed text-pretty">{reason}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-white dark:bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[2rem] gradient-navy overflow-hidden p-12 md:p-16 text-center card-shadow-lg"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-72 h-72 bg-red-brand rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="font-display text-4xl md:text-5xl lg:text-3xl font-bold text-white mb-6 text-balance">
                {sector.cta}
              </h2>
              <p className="text-white/85 text-md mb-8 max-w-2xl mx-auto text-pretty text-white/70">
                Join NovaYield today and let our AI-powered platform optimize your {sector.title.toLowerCase()} investments for maximum returns.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-red-brand hover:bg-red-dark text-white px-10 py-6 text-base font-semibold rounded-full shadow-2xl shadow-red-500/30 hover:scale-105 transition-all">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/#plans">
                  <Button size="lg" variant="outline" className="glass text-white border-white/30 hover:bg-white/15 px-10 py-6 text-base font-semibold rounded-full transition-all hover:scale-105">
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
