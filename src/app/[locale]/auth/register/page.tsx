import { RegisterForm } from '@/features/auth/ui/RegisterForm';
import { Link } from '@/routing'; // Assegura't que sigui del routing configurat
import { Sparkles, ArrowLeft } from 'lucide-react';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  // 1. Obtenim les dades
  const params = await searchParams;
  const emailParam = typeof params.email === 'string' ? params.email : '';

  // 2. (Opcional) Si necessites traduccions extra aquí, usa getTranslations
  // const t = await getTranslations('Auth');

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background overflow-hidden">
      
      {/* COLUMNA ESQUERRA (Visual / Marketing) - Només visible en desktop */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 bg-[#0f111a] border-r border-white/5">
         {/* Fons animat */}
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
               UNEIX-TE A LA REVOLUCIÓ
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
               Comença a construir el futur del teu negoci avui mateix.
            </h2>
            <div className="space-y-4 mt-8">
                <div className="flex items-center gap-4 text-slate-400">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white font-bold">1</div>
                    <p>Auditories web gratuïtes i il·limitades.</p>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white font-bold">2</div>
                    <p>Accés al panell de control de projectes.</p>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white font-bold">3</div>
                    <p>Suport prioritari per a digitalització.</p>
                </div>
            </div>
         </div>

         {/* Footer petit */}
         <div className="relative z-10 text-sm text-slate-600">
            © {new Date().getFullYear()} DigitAI Studios.
         </div>
      </div>

      {/* COLUMNA DRETA (Formulari) */}
      <div className="flex items-center justify-center p-8 relative">
         {/* Botó tornar enrere mòbil */}
         <Link href="/" className="absolute top-8 left-8 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 lg:hidden">
            <ArrowLeft className="w-4 h-4" /> Inici
         </Link>

         {/* Injectem el formulari amb l'email si ve de l'auditoria */}
         <RegisterForm prefilledEmail={emailParam} />
      </div>
    </div>
  );
}