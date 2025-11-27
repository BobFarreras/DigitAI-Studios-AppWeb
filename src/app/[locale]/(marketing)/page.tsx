import { HeroSection } from '@/components/landing/HeroSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
import { ProblemSolutionSection } from '@/components/landing/ProblemSolutionsSection';
import { ServicesGrid } from '@/components/landing/ServicesGrid';
import { ProductTeaser } from '@/components/landing/ProductTeaser';
import { AuditSection } from '@/components/landing/AuditSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { ContactSection } from '@/components/landing/ContactSection';

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
      <ServicesGrid />
      <ProductTeaser />
      <AuditSection />
      
      {/* Passem les dades netes */}
      <TestimonialsSection testimonials={TESTIMONIALS} />
      
      <ContactSection />
    </>
  );
}