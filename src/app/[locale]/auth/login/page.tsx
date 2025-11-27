import { LoginForm } from '@/features/auth/ui/LoginForm';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background overflow-hidden">
      
      {/* COLUMNA ESQUERRA (Visual / Marketing) - Només visible en desktop */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 bg-[#0f111a] border-r border-white/5">
         {/* Fons animat */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50"></div>
         <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div> {/* Si tens un patró, si no treu-ho */}
         
         {/* Logo */}
         <div className="relative z-10">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
               DigitAI <span className="gradient-text">Studios</span>
            </Link>
         </div>

         {/* Testimoni o Text inspirador */}
         <div className="relative z-10 max-w-lg">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold">
               <Sparkles className="w-3 h-3" />
               DIGITAL INTELLIGENCE
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
               Gestiona el teu ecosistema digital des d'un sol lloc.
            </h2>
            <p className="text-slate-400 text-lg">
               Accedeix a les teves auditories, gestiona els teus projectes web i controla les teves automatitzacions.
            </p>
         </div>

         {/* Footer petit */}
         <div className="relative z-10 text-sm text-slate-600">
            © DigitAI Studios. All rights reserved.
         </div>
      </div>

      {/* COLUMNA DRETA (Formulari) */}
      <div className="flex items-center justify-center p-8 relative">
         {/* Botó tornar enrere mòbil */}
         <Link href="/" className="absolute top-8 right-8 text-sm text-muted-foreground hover:text-foreground lg:hidden">
            Tornar a l'inici
         </Link>

         <LoginForm />
      </div>
    </div>
  );
}