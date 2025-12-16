import { postService } from '@/services/container';
import { Link } from '@/routing';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { DiaryStack } from './diary/DiaryStack';
import { Reveal } from '@/components/animations/Reveal'; // ✅ IMPORTEM EL NOSTRE COMPONENT

export async function LatestPostsSection() {
  const posts = await postService.getLatestPosts();
  const latestPosts = posts.slice(0, 5); 
  const t = await getTranslations('LatestPosts');

  if (latestPosts.length === 0) return null;

  return (
    <section id="LatestPostsSection" className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
      
      {/* Fons estàtics optimitzats */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[100px] rounded-full pointer-events-none opacity-50 will-change-transform" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full pointer-events-none opacity-40 will-change-transform" />
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[size:40px_40px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-10 lg:px-14 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* COLUMNA ESQUERRA: Textos amb animació en cascada */}
          <div className="text-left space-y-6">
            
            <Reveal delay={0} direction="left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
                 <Sparkles className="w-3 h-3" />
                 {t('badge')}
              </div>
            </Reveal>
            
            <Reveal delay={0.1} direction="left">
              <h2 className="text-4xl md:text-6xl font-black text-foreground leading-tight tracking-tight">
                {t('title_prefix')} <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">
                  {t('title_highlight')}
                </span>
              </h2>
            </Reveal>
            
            <Reveal delay={0.2} direction="left">
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                {t('description')}
              </p>
            </Reveal>

            <Reveal delay={0.3} direction="left">
              <div className="flex items-center gap-4 pt-2">
                 <div className="flex -space-x-4 rtl:space-x-reverse">
                   {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden relative shadow-sm">
                         {/* Afegim loading="lazy" per millorar perfomance inicial */}
                         <img 
                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=transparent`} 
                            alt="avatar" 
                            loading="lazy"
                            className="w-full h-full object-cover"
                         />
                      </div>
                   ))}
                 </div>
                 <div className="text-sm text-muted-foreground">
                   {t.rich('read_by', {
                     strong: (chunks) => <span className="font-bold text-foreground">{chunks}</span>
                   })}
                 </div>
              </div>
            </Reveal>

            <Reveal delay={0.4} direction="left">
               <div className="pt-4">
                  <Link href="/blog" className="group inline-flex items-center gap-2 text-foreground font-bold hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-0.5">
                    {t('cta')} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
               </div>
            </Reveal>
          </div>

          {/* COLUMNA DRETA: Stack de Posts */}
          {/* Animem el contenidor sencer per no interferir amb les animacions internes del DiaryStack */}
          <Reveal delay={0.2} direction="right" width="100%" className="h-full min-h-[400px]">
             <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
                <DiaryStack posts={latestPosts} />
             </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}