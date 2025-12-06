import { HeroSection } from '@/components/landing/HeroSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
import { ProblemSolutionSection } from '@/components/landing/ProblemSolutionsSection';
import { ServicesGrid } from '@/components/landing/ServicesGrid';
import { ProductTeaser } from '@/components/landing/ProductTeaser';
import { AuditSection } from '@/components/landing/AuditSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { LatestPostsSection } from '@/components/landing/LatestPostsSection';
import { SolutionsShowcase } from '@/components/landing/SolutionsShowcase';
// Importem les dades des del fitxer net
import { TESTIMONIALS } from '@/lib/data';

// Configuració de Vercel (si la necessites)
export const maxDuration = 60; 

export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <TechStackSection />
      <ProblemSolutionSection />
      {/* 👇 NOVA SECCIÓ DE POTENCIAL */}
      <SolutionsShowcase />
      <ServicesGrid />
      <ProductTeaser />
      <AuditSection />
      <LatestPostsSection />
      {/* Passem les dades netes */}
      <TestimonialsSection testimonials={TESTIMONIALS} />
      
      <ContactSection />
    </>
  );
}