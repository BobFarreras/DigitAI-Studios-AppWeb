import { HeroSection } from '@/components/landing/HeroSection';
import { TechStackSection } from '@/components/landing/TechStackSection'; // 🆕 Autoritat
import { ProblemSolutionSection } from '@/components/landing/ProblemSolutionsSection'; // 🆕 Agitació (Substitueix Beneficis)
import { ServicesGrid } from '@/components/landing/ServicesGrid'; // 🆕 Claredat de serveis
import { ProductTeaser } from '@/components/landing/ProductTeaser'; // 🆕 Teaser SalutFlow/RibotFlow
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { AuditForm } from '@/features/web-audit/ui/AuditForm';

// Dades estàtiques (Mantenim)
const TESTIMONIALS = [
  { id: 1, name: "Marc Vila", company: "Gestoria Vila", text: "Hem estalviat 20h setmanals gràcies al bot de WhatsApp.", rating: 5 },
  { id: 2, name: "Anna Soler", company: "BioShop", text: "La web carrega instantàniament. Res a veure amb el Wordpress que teníem.", rating: 5 },
  { id: 3, name: "Jordi P.", company: "Tech Solutions", text: "Han etès la nostra idea d'App a la primera. Execució impecable.", rating: 5 },
];

export default function MarketingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
   

      <HeroSection />

      {/* 1. AUTORITAT: Ensenyem tecnologia puntera per diferenciar-nos de la "vella escola" */}
      <TechStackSection />

      {/* 2. AGITACIÓ: Per què canviar de proveïdor? */}
      <ProblemSolutionSection />

      {/* 3. SOLUCIÓ: Els teus serveis ben definits */}
      <ServicesGrid />

      {/* 4. DEMOSTRACIÓ: "We eat our own dog food". Ensenyem els teus productes propis */}
      <ProductTeaser />

      {/* 5. GANXO (LEAD MAGNET): Auditoria */}
      <section className="py-24 relative overflow-hidden">
        {/* Fons amb gradient subtil per destacar aquesta secció */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">
            La teva web actual és un <span className="gradient-text">cost</span> o una <span className="gradient-text">inversió</span>?
          </h2>
          <p className="mb-10 text-slate-400 max-w-2xl mx-auto text-lg">
            La majoria de webs antigues perden el 40% del trànsit per lentitud. 
            Fes una auditoria amb la nostra IA i descobreix la veritat en segons.
          </p>
          <div className="max-w-xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
            <AuditForm />
          </div>
        </div>
      </section>

      <TestimonialsSection initialTestimonials={TESTIMONIALS} />

      <ContactSection />
      
      <footer className="py-12 border-t border-white/10 text-center text-sm text-slate-500 bg-background">
        <div className="mb-4">
            {/* Aquí pots posar els icones socials petits si vols */}
        </div>
        <p>© {new Date().getFullYear()} DigitAI Studios. Engineered for Growth.</p>
      </footer>
    </main>
  );
}