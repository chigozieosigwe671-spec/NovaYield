'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Zap,
  Globe,
  Activity,
  Headphones,
  TrendingUp,
  CheckCircle2,
  UserPlus,
  Wallet,
  Target,
  Cpu,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const strategyPoints = [
  'Market Analysis',
  'Research & Development',
  'Market-based Decision Making',
  'New Strategies Delivered',
  'Future-proof Strategies',
  'Automated Earnings',
];

const sectors = [
  {
    icon: 'sprout',
    title: 'Agriculture',
    desc: 'AI-driven agricultural investments designed for sustainable food production and long-term growth.',
    image: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/sectors/agriculture',
    tag: 'Sustainable',
  },
  {
    icon: 'building',
    title: 'Real Estate',
    desc: 'Premium residential and commercial property investment opportunities across global markets.',
    image: 'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/sectors/real-estate',
    tag: 'Passive Income',
  },
  {
    icon: 'fuel',
    title: 'Oil & Gas',
    desc: 'High-performing energy investments backed by AI market intelligence and global infrastructure.',
    image: 'https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/sectors/oil-gas',
    tag: 'High Yield',
  },
  {
    icon: 'coins',
    title: 'Gold Mining',
    desc: 'Invest in precious metals through AI-powered portfolio diversification and mining operations.',
    image: 'https://i.pinimg.com/1200x/05/5e/e3/055ee3c88a22b481b23e0d4c48fe3683.jpg',
    href: '/sectors/gold-mining',
    tag: 'Inflation Hedge',
  },
  {
    icon: 'gem',
    title: 'Precious Stones',
    desc: 'Strategic investments in valuable gemstones and rare mining projects worldwide.',
    image: 'https://i.pinimg.com/1200x/10/52/69/105269a13728dc51c0acfed7d8619b8e.jpg',
    href: '/sectors/precious-stones',
    tag: 'Rare Assets',
  },
  {
    icon: 'brain',
    title: 'Artificial Intelligence',
    desc: 'Innovative AI technologies transforming investment decisions and portfolio management.',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    href: '/sectors/artificial-intelligence',
    tag: 'Future Tech',
  },
];

const whyChoose = [
  { icon: BarChart3, title: 'AI Market Analysis', desc: 'We analyze millions of data points daily to identify the highest-potential investment opportunities across every sector we serve.' },
  { icon: ShieldCheck, title: 'Secure Investments', desc: 'Enterprise-grade encryption and multi-layer security protocols protect every transaction and investor account around the clock.' },
  { icon: Zap, title: 'Automated Earnings', desc: 'AI generates and executes optimized investment strategies automatically — profits accrue daily without manual intervention.' },
  { icon: Globe, title: 'Global Opportunities', desc: 'Diversified investments spanning agriculture, energy, real estate, and precious metals across 25+ countries worldwide.' },
  { icon: Activity, title: 'Real-time Monitoring', desc: 'Track every investment, profit, and transaction in real time through our transparent, always-updated dashboard.' },
  { icon: Headphones, title: 'Expert Support', desc: 'Dedicated 24/7 customer assistance from investment professionals who understand your goals and portfolio.' },
];

const stats = [
  { value: 500, suffix: 'M+', prefix: '$', label: 'Assets Managed' },
  { value: 12000, suffix: '+', prefix: '', label: 'Active Investors' },
  { value: 98, suffix: '%', prefix: '', label: 'Success Rate' },
  { value: 25, suffix: '+', prefix: '', label: 'Countries Served' },
];

const processSteps = [
  { icon: UserPlus, title: 'Create Account', desc: 'Register in minutes with a secure, streamlined signup process designed to get you invested faster.' },
  { icon: ShieldCheck, title: 'Verify Identity', desc: 'Complete our quick KYC verification to unlock full platform access and secure your account.' },
  { icon: Wallet, title: 'Deposit Funds', desc: 'Fund your account using USDT, Bitcoin, Ethereum, or bank transfer — all within a secure wallet.' },
  { icon: Target, title: 'Choose Investment Plan', desc: 'Select from AI-optimized plans tailored to your goals, risk appetite, and investment horizon.' },
  { icon: Cpu, title: 'AI Portfolio Management', desc: 'Our AI engine continuously rebalances and optimizes your portfolio for maximum returns.' },
  { icon: TrendingUp, title: 'Earn Daily Profits', desc: 'Watch your profits accrue daily — transparent, trackable, and credited automatically to your balance.' },
  { icon: ArrowUpRight, title: 'Withdraw Earnings', desc: 'Cash out your profits anytime through your preferred payment method with fast, reliable processing.' },
];

function AnimatedCounter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white dark:bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-grid opacity-[0.03] mask-fade-b" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-red-brand font-semibold text-sm tracking-[0.2em] mb-4">ABOUT NOVAYIELD</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-white mb-7 text-balance">
              Sustainable Strategy Based on AI
            </h2>
            <p className="text-muted-foreground text-lg mb-5 leading-relaxed text-pretty">
              At NovaYield, we are at the forefront of the investment landscape, leveraging the unparalleled capabilities of artificial intelligence to drive success. With a focus on agriculture, oil and gas, as well as gold and precious metal mining, we empower investors to unlock transformative opportunities for growth and profitability.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
              Our AI algorithms harness the power of big data, enabling us to analyze market trends, identify emerging sectors, and make data-driven investment decisions that deliver exceptional results.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10"
            >
              <Card className="rounded-2xl p-8 card-shadow border-0 gradient-card">
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                  {strategyPoints.map((point, i) => (
                    <motion.li
                      key={point}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-brand/10 flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-red-brand" />
                      </div>
                      <span className="text-navy dark:text-white font-medium text-[15px]">{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
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
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="AI Investment Analysis"
                className="w-full h-[560px] object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/40 via-transparent to-transparent" />
            </div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-6 card-shadow-lg hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100">
                  <TrendingUp className="h-7 w-7 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-navy dark:text-white">98%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -top-6 -right-6 glass-card rounded-2xl p-5 card-shadow-lg hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-100">
                  <Sparkles className="h-6 w-6 text-red-brand" />
                </div>
                <div>
                  <p className="text-lg font-bold text-navy dark:text-white">AI Powered</p>
                  <p className="text-xs text-muted-foreground">Smart Investing</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-red-brand font-semibold text-sm tracking-[0.2em] mb-4">EXCELLENT SERVICES</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-white text-balance mb-5">
            Sectors of Interest
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Explore our diversified portfolio of AI-optimized investment sectors, each carefully selected to deliver sustainable returns and long-term growth.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectors.map((sector, i) => (
            <motion.div
              key={sector.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={sector.href} className="group block h-full">
                <Card className="relative h-full rounded-3xl overflow-hidden card-shadow hover:card-shadow-lg transition-all duration-500 hover:-translate-y-2 border-0 bg-white dark:bg-card">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={sector.image}
                      alt={sector.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-navy-dark/20 to-transparent" />
                    <Badge className="absolute top-4 right-4 bg-white/90 text-navy backdrop-blur-md text-xs font-semibold px-3 py-1.5">
                      {sector.tag}
                    </Badge>
                    <h3 className="absolute bottom-4 left-5 text-2xl font-bold text-white">
                      {sector.title}
                    </h3>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground text-[15px] leading-relaxed mb-5 text-pretty">
                      {sector.desc}
                    </p>
                    <span className="inline-flex items-center gap-2 text-red-brand font-semibold text-[15px] group-hover:gap-3 transition-all">
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseSection() {
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-red-brand font-semibold text-sm tracking-[0.2em] mb-4">WHY CHOOSE US</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-white text-balance mb-5">
            Why Choose NovaYield
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            We combine cutting-edge AI technology with decades of investment expertise to deliver a platform that puts your financial success first.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChoose.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="group h-full rounded-3xl p-8 card-shadow hover:card-shadow-hover transition-all duration-500 hover:-translate-y-1.5 border-0 gradient-card relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-brand/5 rounded-full blur-2xl group-hover:bg-red-brand/10 transition-colors" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy text-white mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <item.icon className="h-7 w-7 text-red-brand" />
                  </div>
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-[15px] leading-relaxed text-pretty">{item.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section id="process" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-red-brand font-semibold text-sm tracking-[0.2em] mb-4">OUR WORK PROCESS</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-white text-balance mb-5">
            Your Path to Financial Freedom
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            A simple, transparent seven-step journey from account creation to withdrawing your earnings — powered by AI at every stage.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative"
              >
                <Card className="group h-full rounded-3xl p-7 card-shadow hover:card-shadow-hover transition-all duration-500 hover:-translate-y-2 border-0 bg-white dark:bg-card text-center relative overflow-hidden">
                  <div className="absolute top-4 right-5 text-5xl font-bold text-muted/30 select-none">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-navy to-navy-light text-white mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <step.icon className="h-8 w-8 text-red-brand" />
                  </div>
                  <h3 className="text-lg font-bold text-navy dark:text-white mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function VideoSection() {
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      <div className="max-w-3xl mx-auto px-4 sm:px-4 lg:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-red-brand font-semibold text-sm tracking-[0.2em] mb-4">WATCH & LEARN</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-white text-balance mb-5">
            Build Your Financial Future With Smart Investments
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto text-pretty">
            Discover how NovaYield combines artificial intelligence with time-tested investment strategies to help you build long-term wealth, achieve financial freedom, and create passive income streams that last.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden card-shadow-lg group"
        >
          <div className="relative aspect-video">
          <iframe
            className="w-full h-full rounded-3xl"
            src="https://www.youtube.com/embed/blnbxbftme0"
            title="Investment Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          
        
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-sm md:text-base font-medium opacity-90">
                Long-term investing · AI-powered portfolios · Passive income · Financial freedom
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 gradient-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-red-brand rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-red-brand font-semibold text-sm tracking-[0.2em] mb-4">BY THE NUMBERS</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white text-balance">
            Trusted by Investors Worldwide
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-5xl md:text-6xl font-bold text-white mb-3">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <p className="text-white/70 text-base md:text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] gradient-navy overflow-hidden p-12 md:p-20 text-center card-shadow-lg"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-brand rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0 bg-grid opacity-[0.04]" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 text-balance">
              Ready to Grow Your Wealth with <span className="text-red-brand">AI</span>?
            </h2>
            <p className="text-white text-lg md:text-xl mb-10 max-w-2xl mx-auto text-pretty">
              Join thousands of investors who are already earning daily profits through NovaYield's AI-powered investment platform. Register today and start your journey toward financial freedom.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-red-brand hover:bg-red-dark text-white px-10 py-6 text-base font-semibold rounded-full shadow-2xl shadow-red-500/30 hover:scale-105 transition-all">
                  Register Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="glass text-white border-white/30 hover:bg-white/15 px-10 py-6 text-base font-semibold rounded-full transition-all hover:scale-105">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
