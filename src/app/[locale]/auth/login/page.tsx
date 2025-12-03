import { LoginForm } from '@/features/auth/ui/LoginForm';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('AuthPages.login');

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background overflow-hidden">
      
      {/* COLUMNA ESQUERRA (Visual / Marketing) */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 bg-[#0f111a] border-r border-white/5">
         {/* Fons animat */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50"></div>
         <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div> 
         
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
               {t('marketing_title')}
            </h2>
            <p className="text-slate-400 text-lg">
               {t('marketing_subtitle')}
            </p>
         </div>

         {/* Footer petit */}
         <div className="relative z-10 text-sm text-slate-600">
            {t('footer')}
         </div>
      </div>

      {/* COLUMNA DRETA (Formulari) */}
      <div className="flex items-center justify-center p-8 relative">
         {/* Botó tornar enrere mòbil */}
         <Link href="/" className="absolute top-8 right-8 text-sm text-muted-foreground hover:text-foreground lg:hidden">
            {t('back_home')}
         </Link>

         <LoginForm />
      </div>
    </div>
  );
}