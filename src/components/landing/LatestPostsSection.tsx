import { postService } from '@/services/container';
import { Link } from '@/routing';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { DiaryStack } from './diary/DiaryStack';

export async function LatestPostsSection() {
  // Agafem més posts (5) perquè l'efecte de passar pàgina duri més
  const posts = await postService.getLatestPosts();
  const latestPosts = posts.slice(0, 5); 
  const t = await getTranslations('LatestPosts');

  if (latestPosts.length === 0) return null;

  return (
    // FONS NEUTRE ADAPTABLE (bg-background)
    <section className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
      
      {/* DECORACIÓ DE FONS */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full pointer-events-none opacity-40" />
      
      {/* Grid Pattern subtil */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[size:40px_40px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* COLUMNA ESQUERRA: TEXT I CONTEXT */}
          <div className="text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
               <Sparkles className="w-3 h-3" />
               Diari de Bitàcola
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-foreground leading-tight tracking-tight">
              Pensaments <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                Digitals.
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Explora els nostres aprenentatges, tutorials tècnics i reflexions sobre el futur de la tecnologia. Llisca les targetes per descobrir-ne més.
            </p>

            <div className="flex items-center gap-4 pt-4">
               <div className="flex -space-x-4 rtl:space-x-reverse">
                  {[...Array(4)].map((_, i) => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground overflow-hidden relative">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=transparent`} alt="avatar" />
                     </div>
                  ))}
               </div>
               <div className="text-sm text-muted-foreground">
                  Llegit per <span className="font-bold text-foreground">2k+ developers</span>
               </div>
            </div>

            <div className="pt-8">
               <Link href="/blog" className="group inline-flex items-center gap-2 text-foreground font-bold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5">
                  Veure Índex Complet <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
               </Link>
            </div>
          </div>

          {/* COLUMNA DRETA: EL DIARI INTERACTIU */}
          <div className="relative">
             {/* Element decoratiu darrere la pila */}
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
             
             <DiaryStack posts={latestPosts} />
          </div>

        </div>

      </div>
    </section>
  );
}