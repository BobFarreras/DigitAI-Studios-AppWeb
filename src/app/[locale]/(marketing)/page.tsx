import { HeroSection } from '@/components/landing/HeroSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
import { ServicesGrid } from '@/components/landing/ServicesGrid';
import { ProductTeaser } from '@/components/landing/ProductTeaser';
import { AuditSection } from '@/components/landing/AuditSection'; 
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { LatestPostsSection } from '@/components/landing/LatestPostsSection';
import { SolutionsShowcase } from '@/components/landing/solutions/SolutionsShowcase';
import { TESTIMONIALS } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';

export default async function MarketingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
      
      {/* 4. AUDITORIA (CTA) */}
      <section id="audit">
        <AuditSection currentUser={user} />
      </section>
      
      {/* 5. BLOG / RECURSOS */}
      <section id="blog-feed">
        <LatestPostsSection />
      </section>

      {/* 6. TESTIMONIS */}
      <section id="testimonials">
        <TestimonialsSection testimonials={TESTIMONIALS} />
      </section>

      {/* 7. CONTACTE */}
      <section id="contact">
        <ContactSection />
      </section>
    </>
  );
}