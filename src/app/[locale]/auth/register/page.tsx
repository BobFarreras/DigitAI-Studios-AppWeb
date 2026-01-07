import { RegisterForm } from '@/features/auth/ui/RegisterForm';
import { Link } from '@/routing';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { AuditReadyBanner } from '@/components/auth/AuditReadyBanner'; // 👈 IMPORT NOU
import { Suspense } from 'react'; // Necessari per useSearchParams
type Props = {
   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RegisterPage({ searchParams }: Props) {
   // 1. Obtenim les dades
   const params = await searchParams;
   const emailParam = typeof params.email === 'string' ? params.email : '';

   // 2. Traduccions
   const t = await getTranslations('AuthPages.register');

   return (
      <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background overflow-hidden">

         {/* COLUMNA ESQUERRA */}
         <div className="hidden lg:flex relative flex-col justify-between p-12 bg-[#0f111a] border-r border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50"></div>
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

            {/* Logo */}
            <div className="relative z-10">
               <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white no-underline">
                  DigitAI <span className="gradient-text">Studios</span>
               </Link>
            </div>

            {/* Missatge de valor */}
            <div className="relative z-10 max-w-lg">
               <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold">
                  <Sparkles className="w-3 h-3" />
                  {t('marketing_badge')}
               </div>
               <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                  {t('marketing_title')}
               </h2>
               <div className="space-y-4 mt-8">
                  <div className="flex items-center gap-4 text-slate-400">
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white font-bold">1</div>
                     <p>{t('feature_1')}</p>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white font-bold">2</div>
                     <p>{t('feature_2')}</p>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white font-bold">3</div>
                     <p>{t('feature_3')}</p>
                  </div>
               </div>
            </div>

            {/* Footer petit */}
            <div className="relative z-10 text-sm text-slate-600">
               © {new Date().getFullYear()} DigitAI Studios.
            </div>
         </div>

         {/* COLUMNA DRETA */}
         <div className="flex flex-col items-center justify-center p-8 relative overflow-y-auto">
            <Link href="/" className="absolute top-8 left-8 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 lg:hidden">
               <ArrowLeft className="w-4 h-4" /> {t('back_home')}
            </Link>

            {/* 👇 AQUI POSES EL BANNER EN SUSPENSE */}
            <div className="w-full max-w-md">
               <Suspense fallback={null}>
                  <AuditReadyBanner />
               </Suspense>

               {/* El formulari rep l'email com abans */}
               <RegisterForm prefilledEmail={emailParam} />
            </div>
         </div>
      </div>
   );
}