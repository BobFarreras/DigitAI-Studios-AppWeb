import { HeroSection } from '@/components/landing/HeroSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
import { ProblemSolutionSection } from '@/components/landing/ProblemSolutionsSection';
import { ServicesGrid } from '@/components/landing/ServicesGrid';
import { ProductTeaser } from '@/components/landing/ProductTeaser';
import { AuditSection } from '@/components/landing/AuditSection'; // Component Client
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { LatestPostsSection } from '@/components/landing/LatestPostsSection';
import { SolutionsShowcase } from '@/components/landing/solutions/SolutionsShowcase';
import { TESTIMONIALS } from '@/lib/data';

// Importem Supabase per comprovar sessió
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60; 

export default async function MarketingPage() {
  // 1. Obtenim sessió al servidor
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <HeroSection />
      <TechStackSection />
      <ProblemSolutionSection />
      <SolutionsShowcase />
      <ServicesGrid />
      <ProductTeaser />
      
      {/* 2. Passem l'usuari com a prop al component */}
      <AuditSection currentUser={user} />
      
      <LatestPostsSection />
      <TestimonialsSection testimonials={TESTIMONIALS} />
      <ContactSection />
    </>
  );
}