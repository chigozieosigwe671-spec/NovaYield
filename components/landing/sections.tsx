'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  ArrowRight,
  Sprout,
  Building2,
  Fuel,
  Coins,
  Gem,
  Brain,
  BarChart3,
  ShieldCheck,
  Zap,
  Globe,
  Activity,
  Headphones,
  TrendingUp,
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
  { icon: Sprout, title: 'Agriculture', desc: 'AI-driven agricultural investments designed for sustainable food production and long-term growth.', color: 'text-green-600 bg-green-50' },
  { icon: Building2, title: 'Real Estate', desc: 'Premium residential and commercial property investment opportunities.', color: 'text-blue-600 bg-blue-50' },
  { icon: Fuel, title: 'Oil & Gas', desc: 'High-performing energy investments backed by AI market intelligence.', color: 'text-amber-600 bg-amber-50' },
  { icon: Coins, title: 'Gold Mining', desc: 'Invest in precious metals through AI-powered portfolio diversification.', color: 'text-yellow-600 bg-yellow-50' },
  { icon: Gem, title: 'Precious Stone Mining', desc: 'Strategic investments in valuable gemstones and mining projects.', color: 'text-purple-600 bg-purple-50' },
  { icon: Brain, title: 'Artificial Intelligence', desc: 'Innovative AI technologies transforming investment decisions.', color: 'text-red-600 bg-red-50' },
];

const whyChoose = [
  { icon: BarChart3, title: 'AI Market Analysis', desc: 'We analyze millions of data points daily.' },
  { icon: ShieldCheck, title: 'Secure Investments', desc: 'Enterprise-grade security for every transaction.' },
  { icon: Zap, title: 'Automated Earnings', desc: 'AI generates optimized investment strategies.' },
  { icon: Globe, title: 'Global Opportunities', desc: 'Diversified investments across multiple industries.' },
  { icon: Activity, title: 'Real-time Monitoring', desc: 'Track investments anytime.' },
  { icon: Headphones, title: 'Expert Support', desc: '24/7 customer assistance.' },
];

const stats = [
  { value: 500, suffix: 'M+', prefix: '$', label: 'Assets Managed' },
  { value: 12000, suffix: '+', prefix: '', label: 'Investors' },
  { value: 98, suffix: '%', prefix: '', label: 'Success Rate' },
  { value: 25, suffix: '+', prefix: '', label: 'Countries' },
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
    <section id="about" className="py-20 md:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-red-brand font-semibold text-xs tracking-widest mb-3">ABOUT NOVAYIELD</p>
            <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white mb-6 text-balance">
              Sustainable Strategy based on AI
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mb-4 leading-relaxed">
              At NovaYield, we are at the forefront of the investment landscape, leveraging the unparalleled capabilities of artificial intelligence (AI) to drive success. With a focus on agriculture, oil and gas, as well as gold and precious metal mining, we empower investors to unlock transformative opportunities for growth and profitability.
            </p>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Our AI algorithms harness the power of big data, enabling us to analyze market trends, identify emerging sectors, and make data-driven investment decisions that deliver exceptional results.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Card className="border-l-4 border-l-red-brand rounded-xl p-6 card-shadow">
                <ul className="space-y-3">
                  {strategyPoints.map((point, i) => (
                    <motion.li
                      key={point}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <ArrowRight className="h-5 w-5 text-red-brand flex-shrink-0" />
                      <span className="text-navy dark:text-white font-medium">{point}</span>
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
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden card-shadow">
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="AI Investment Analysis"
                className="w-full h-[500px] object-cover"
                loading="lazy"
              />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 glass rounded-2xl p-5 card-shadow hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy dark:text-white">98%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
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
    <section id="services" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-red-brand font-semibold text-xs tracking-widest mb-3">EXCELLENT SERVICES</p>
          <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-balance">
            Sectors of Interest
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector, i) => (
            <motion.div
              key={sector.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group h-full rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 ${sector.color} group-hover:scale-110 transition-transform`}>
                  <sector.icon className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-navy dark:text-white mb-2">{sector.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{sector.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseSection() {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-red-brand font-semibold text-xs tracking-widest mb-3">WHY CHOOSE US</p>
          <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-balance">
            Why Choose NovaYield
          </h2>
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
              <Card className="h-full rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-b from-white to-muted/20 dark:from-card dark:to-card/50">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-navy text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6 text-red-brand" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy dark:text-white mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-xs">{item.desc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 gradient-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-red-brand rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <p className="text-white/70 text-xs md:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl gradient-navy overflow-hidden p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-brand rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 text-balance">
              Ready to Grow Your Wealth with <span className="text-red-brand">AI</span>?
            </h2>
            <p className="text-white/80 text-sm md:text-base mb-8 max-w-2xl mx-auto">
              Join thousands of investors who are already earning daily profits through NovaYield's AI-powered investment platform. Register today and start your journey toward financial freedom.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-red-brand hover:bg-red-dark text-white px-8 py-5 text-sm font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:scale-105 transition-all">
                Register Now
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-8 py-5 text-sm font-semibold rounded-xl hover:scale-105 transition-all">
                Login
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
