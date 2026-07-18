'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, Star, Quote } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { InvestmentPlan, Testimonial, Faq } from '@/lib/supabase/types';

export function PlansSection() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);

  useEffect(() => {
    supabase
      .from('investment_plans')
      .select('*')
      .eq('status', 'active')
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) return;
        if (data) setPlans(data as InvestmentPlan[]);
      });
  }, []);

  if (plans.length === 0) return null;

  return (
    <section id="plans" className="py-24 md:py-32 bg-white dark:bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1/3 h-full bg-grid opacity-[0.03]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-red-brand font-semibold text-sm tracking-[0.2em] mb-4">INVESTMENT PLANS</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-white text-balance mb-5">
            Choose Your Investment Plan
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Select a plan that suits your investment goals. All plans include AI-optimized daily returns and full withdrawal flexibility.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => {
            const isVip = plan.name === 'VIP';
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative"
              >
                <Card className={`relative h-full rounded-3xl p-8 card-shadow hover:card-shadow-lg transition-all duration-500 hover:-translate-y-2 border-0 ${
                  isVip ? 'gradient-navy text-white shadow-2xl shadow-navy/30' : 'bg-white dark:bg-card gradient-card'
                }`}>
                  {isVip && (
                    <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-brand text-white px-5 py-1.5 text-xs font-bold rounded-full shadow-lg shadow-red-500/30">
                      Most Popular
                    </Badge>
                  )}
                  <h3 className={`font-display text-2xl font-bold mb-3 ${isVip ? 'text-white' : 'text-navy dark:text-white'}`}>
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className={`font-display text-4xl font-bold ${isVip ? 'text-white' : 'text-navy dark:text-white'}`}>
                      ${plan.min_amount.toLocaleString()}
                    </span>
                    <span className={`text-sm ${isVip ? 'text-white/60' : 'text-muted-foreground'}`}>
                      {' '}/ entry
                    </span>
                  </div>
                  <div className={`space-y-3.5 mb-8 ${isVip ? 'text-white/85' : 'text-muted-foreground'}`}>
                    <div className="flex items-center gap-3">
                      <Check className={`h-5 w-5 ${isVip ? 'text-red-brand' : 'text-red-brand'}`} />
                      <span className="text-[15px]">{plan.daily_roi}% Daily Profit</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-red-brand" />
                      <span className="text-[15px]">{plan.duration_days} Days Duration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-red-brand" />
                      <span className="text-[15px]">{plan.total_roi}% Total ROI</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-red-brand" />
                      <span className="text-[15px]">Max: ${plan.max_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-red-brand" />
                      <span className="text-[15px]">AI-Optimized Returns</span>
                    </div>
                  </div>
                  <Link href="/register" className="block">
                    <Button className={`w-full rounded-full font-semibold py-6 text-base ${
                      isVip
                        ? 'bg-red-brand hover:bg-red-dark text-white'
                        : 'bg-navy hover:bg-navy-light text-white'
                    }`}>
                      Deposit Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'published')
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) return;
        if (data && data.length > 0) setTestimonials(data as Testimonial[]);
      });
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-red-brand font-semibold text-sm tracking-[0.2em] mb-4">TESTIMONIALS</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-white text-balance">
            What Our Investors Say
          </h2>
        </motion.div>

        <div className="relative">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-card rounded-3xl p-10 md:p-14 card-shadow-lg relative"
          >
            <Quote className="absolute top-8 left-8 h-16 w-16 text-red-brand/10" />
            <div className="relative">
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="font-display text-xl md:text-2xl text-navy dark:text-white text-center mb-10 leading-relaxed italic text-pretty">
                "{testimonials[current].content}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[current].avatar_url}
                  alt={testimonials[current].name}
                  className="w-18 h-18 rounded-full object-cover ring-4 ring-red-brand/10"
                  loading="lazy"
                />
                <div className="text-left">
                  <p className="font-bold text-navy dark:text-white text-lg">{testimonials[current].name}</p>
                  <p className="text-muted-foreground">{testimonials[current].role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center gap-2.5 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-10 bg-red-brand' : 'w-2.5 bg-muted-foreground/30'
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const [faqs, setFaqs] = useState<Faq[]>([]);

  useEffect(() => {
    supabase
      .from('faqs')
      .select('*')
      .eq('status', 'published')
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) return;
        if (data && data.length > 0) setFaqs(data as Faq[]);
      });
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-24 md:py-32 bg-white dark:bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-red-brand font-semibold text-sm tracking-[0.2em] mb-4">FAQ</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy dark:text-white text-balance">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="rounded-2xl overflow-hidden card-shadow border-0 bg-white dark:bg-card">
                <AccordionItem value={faq.id} className="border-0">
                  <AccordionTrigger className="px-7 py-6 text-left text-navy dark:text-white font-semibold text-lg hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-7 pb-6 text-muted-foreground text-base leading-relaxed text-pretty">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </Card>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
