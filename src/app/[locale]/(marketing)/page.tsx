/**
 * @file src/app/[locale]/(marketing)/page.tsx
 * @updated 2026-05-08
 * @summary Route module: src/app/[locale]/(marketing)/page.tsx
 * @scope Composicio de pagina/layout i wiring amb actions; sense logica de dades complexa.
 */
import { HeroSection } from '@/components/landing/HeroSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
import { ServicesGrid } from '@/components/landing/ServicesGrid';
import { ProductTeaser } from '@/components/landing/ProductTeaser';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { SolutionsShowcase } from '@/components/landing/solutions/SolutionsShowcase';
import { TESTIMONIALS } from '@/lib/data';

export default async function MarketingPage() {
  return (
    <>
      {/* 1. HERO (Ja té id="inici" internament, però assegurem) */}
      <section id="hero">
        <HeroSection />
      </section>

      <TechStackSection />

      {/* 2. SOLUCIONS */}
      <section id="solutions">
        <SolutionsShowcase />
      </section>

      {/* 3. SERVEIS */}
      <section id="services">
        <ServicesGrid />
      </section>

      <ProductTeaser />

      {/* 4. TESTIMONIS */}
      <section id="testimonials">
        <TestimonialsSection testimonials={TESTIMONIALS} />
      </section>

      {/* 5. CONTACTE */}
      <section id="contact">
        <ContactSection />
      </section>
    </>
  );
}

