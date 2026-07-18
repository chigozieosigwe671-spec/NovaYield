import { Navbar } from '@/components/landing/navbar';
import { HeroCarousel } from '@/components/landing/hero-carousel';
import { AboutSection, ServicesSection, WhyChooseSection, ProcessSection, VideoSection, StatsSection, CtaSection } from '@/components/landing/sections';
import { PlansSection, TestimonialsSection, FaqSection } from '@/components/landing/plans-testimonials-faq';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroCarousel />
      <AboutSection />
      <ServicesSection />
      <WhyChooseSection />
      <ProcessSection />
      <VideoSection />
      <StatsSection />
      <PlansSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
