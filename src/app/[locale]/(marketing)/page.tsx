import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'; // Aquest el pots copiar del teu codi antic adaptant classes
import { ContactSection } from '@/components/landing/ContactSection';
import { AuditForm } from '@/features/web-audit/ui/AuditForm'; // Reutilitzem component creat
import { SocialSection } from '@/components/landing/SocialSection'; // Copiar component simple

// Dades estàtiques pels testimonis (per ara)
const TESTIMONIALS = [
  { id: 1, name: "Marc Vila", company: "Gestoria Vila", text: "Hem estalviat 20h setmanals gràcies al bot de WhatsApp.", rating: 5 },
  { id: 2, name: "Anna Soler", company: "BioShop", text: "La web carrega instantàniament i el disseny és espectacular.", rating: 5 },
  { id: 3, name: "Jordi P.", company: "Tech Solutions", text: "Professionals i ràpids. L'automatització de factures és màgica.", rating: 5 },
];

export default function MarketingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <HeroSection />
      
      {/* Social Proof Banner */}
      <SocialSection />
      
      <BenefitsSection />

      {/* SECCIÓ ALTA CONVERSIÓ: Auditoria Web */}
      <section className="py-20 bg-muted/30 border-y border-border">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">La teva web està perdent clients?</h2>
            <p className="mb-8 text-muted-foreground">Fes una auditoria gratuïta amb la nostra IA en temps real.</p>
            <div className="max-w-xl mx-auto">
               <AuditForm /> 
            </div>
         </div>
      </section>

      <TestimonialsSection initialTestimonials={TESTIMONIALS} />
      
      <ContactSection />
      
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
         © {new Date().getFullYear()} DigitAI Studios. Tots els drets reservats.
      </footer>
    </main>
  );
}