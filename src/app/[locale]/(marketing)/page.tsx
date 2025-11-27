import { HeroSection } from '@/components/landing/HeroSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
import { ProblemSolutionSection } from '@/components/landing/ProblemSolutionsSection';
import { ServicesGrid } from '@/components/landing/ServicesGrid';
import { ProductTeaser } from '@/components/landing/ProductTeaser';
import { AuditSection } from '@/components/landing/AuditSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server'; // 👈 Importem el client de servidor
// Importem les dades des del fitxer net
import { TESTIMONIALS } from '@/lib/data';

export default async function MarketingPage() {

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <main className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navbar user={user} />
      <HeroSection />
      <TechStackSection />
      <ProblemSolutionSection />
      <ServicesGrid />
      <ProductTeaser />
      <AuditSection />
      
      {/* Passem les dades netes */}
      <TestimonialsSection testimonials={TESTIMONIALS} />
      
      <ContactSection />
      <Footer />
    </main>
  );
}