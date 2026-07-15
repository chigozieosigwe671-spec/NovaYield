'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check, Star } from 'lucide-react';
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
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PlansSection() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);

  useEffect(() => {
    supabase
      .from('investment_plans')
      .select('*')
      .eq('status', 'active')
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) setPlans(data as InvestmentPlan[]);
        else
          setPlans([
            { id: '1', name: 'Starter', description: 'Perfect for beginners.', min_amount: 100, max_amount: 999, daily_roi: 2, duration_days: 30, total_roi: 60, status: 'active', sort_order: 1 } as InvestmentPlan,
            { id: '2', name: 'Silver', description: 'Enhanced returns.', min_amount: 500, max_amount: 4999, daily_roi: 3.5, duration_days: 30, total_roi: 105, status: 'active', sort_order: 2 } as InvestmentPlan,
            { id: '3', name: 'Gold', description: 'Premium tier.', min_amount: 1000, max_amount: 9999, daily_roi: 5, duration_days: 30, total_roi: 150, status: 'active', sort_order: 3 } as InvestmentPlan,
            { id: '4', name: 'VIP', description: 'Exclusive VIP.', min_amount: 10000, max_amount: 100000, daily_roi: 8, duration_days: 30, total_roi: 240, status: 'active', sort_order: 4 } as InvestmentPlan,
          ]);
      });
  }, []);

  return (
    <section id="plans" className="py-20 md:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-red-brand font-semibold text-xs tracking-widest mb-3">INVESTMENT PLANS</p>
          <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-balance">
            Choose Your Investment Plan
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-sm">
            Select a plan that suits your investment goals. All plans include AI-optimized daily returns.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => {
            const isVip = plan.name === 'VIP';
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`relative h-full rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border-0 ${
                  isVip ? 'gradient-navy text-white' : ''
                }`}>
                  {isVip && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-brand text-white px-4">
                      Most Popular
                    </Badge>
                  )}
                  <h3 className={`text-base font-bold mb-2 ${isVip ? 'text-white' : 'text-navy dark:text-white'}`}>
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className={`text-3xl font-bold ${isVip ? 'text-white' : 'text-navy dark:text-white'}`}>
                      ${plan.min_amount.toLocaleString()}
                    </span>
                    <span className={`text-xs ${isVip ? 'text-white/60' : 'text-muted-foreground'}`}>
                      {' '}/ entry
                    </span>
                  </div>
                  <div className={`space-y-3 mb-6 ${isVip ? 'text-white/80' : 'text-muted-foreground'}`}>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-red-brand" />
                      <span className="text-sm">{plan.daily_roi}% Daily Profit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-red-brand" />
                      <span className="text-sm">{plan.duration_days} Days Duration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-red-brand" />
                      <span className="text-sm">{plan.total_roi}% Total ROI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-red-brand" />
                      <span className="text-sm">Max: ${plan.max_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-red-brand" />
                      <span className="text-sm">AI-Optimized Returns</span>
                    </div>
                  </div>
                  <Link href="/register" className="block">
                    <Button className={`w-full rounded-xl font-semibold ${
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
      .then(({ data }) => {
        if (data && data.length > 0) setTestimonials(data as Testimonial[]);
        else
          setTestimonials([
            { id: '1', name: 'James Carter', role: 'Entrepreneur', content: 'NovaYield transformed my approach to investing.', avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 5 } as Testimonial,
            { id: '2', name: 'Sophia Martinez', role: 'Financial Analyst', content: 'The platform is intuitive and the daily profits are real.', avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 5 } as Testimonial,
            { id: '3', name: 'Michael Chen', role: 'Investor', content: 'Every investment is tracked, every profit is visible.', avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 5 } as Testimonial,
          ]);
      });
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-red-brand font-semibold text-xs tracking-widest mb-3">TESTIMONIALS</p>
          <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-balance">
            What Our Investors Say
          </h2>
        </motion.div>

        <div className="relative">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-card rounded-2xl p-8 md:p-12 card-shadow"
          >
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-base md:text-lg text-navy dark:text-white text-center mb-8 leading-relaxed italic">
              "{testimonials[current].content}"
            </p>
            <div className="flex items-center justify-center gap-4">
              <img
                src={testimonials[current].avatar_url}
                alt={testimonials[current].name}
                className="w-16 h-16 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="font-bold text-navy dark:text-white">{testimonials[current].name}</p>
                <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? 'w-8 bg-red-brand' : 'w-2 bg-muted-foreground/30'
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
      .then(({ data }) => {
        if (data && data.length > 0) setFaqs(data as Faq[]);
        else
          setFaqs([
            { id: '1', question: 'How do I invest?', answer: 'Create an account, deposit funds, and choose a plan.', category: 'general', sort_order: 1, status: 'published' } as Faq,
            { id: '2', question: 'How do withdrawals work?', answer: 'Navigate to Withdraw, select a method, and submit.', category: 'general', sort_order: 2, status: 'published' } as Faq,
            { id: '3', question: 'Is my investment secure?', answer: 'Yes, we use enterprise-grade encryption.', category: 'general', sort_order: 3, status: 'published' } as Faq,
            { id: '4', question: 'How long does it take to receive profits?', answer: 'Profits are credited daily to your balance.', category: 'general', sort_order: 4, status: 'published' } as Faq,
            { id: '5', question: 'Can I withdraw anytime?', answer: 'Yes, withdrawals are processed within 1-24 hours.', category: 'general', sort_order: 5, status: 'published' } as Faq,
          ]);
      });
  }, []);

  return (
    <section id="faq" className="py-20 md:py-28 bg-white dark:bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-red-brand font-semibold text-xs tracking-widest mb-3">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white text-balance">
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
              <Card className="rounded-2xl overflow-hidden card-shadow border-0">
                <AccordionItem value={faq.id} className="border-0">
                  <AccordionTrigger className="px-6 py-5 text-left text-navy dark:text-white font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-muted-foreground leading-relaxed">
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
