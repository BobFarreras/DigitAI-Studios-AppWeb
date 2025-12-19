import { Link } from '@/routing';
import { postService } from '@/services/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations, getLocale } from 'next-intl/server';
import { Calendar, Tag, ImageIcon, Cpu } from 'lucide-react';
import Image from 'next/image';
// 👇 1. IMPORT IMPORTANT
import { PaginationControls } from '@/components/ui/pagination-controls';

export const revalidate = 3600;

// 👇 2. DEFINICIÓ DE PROPS (Next.js 16)
interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const t = await getTranslations('BlogIndex');
  const locale = await getLocale();

  // 👇 3. GESTIÓ DE PÀGINA
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;

  // 👇 4. CRIDA AL SERVEI PAGINAT
  const { posts, metadata } = await postService.getPublicBlogPosts(currentPage);

  return (
    <div className="container mx-auto py-18 px-6 md:px-10 lg:px-14">
      {/* CAPÇALERA (Igual) */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      {/* GRID DE POSTS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group h-full">
             {/* ... (TOT EL CONTINGUT DE LA CARD ES MANTÉ EXACTAMENT IGUAL) ... */}
             <Card className="h-full flex flex-col overflow-hidden border border-border bg-card dark:bg-[#0f111a] hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-1">
                {/* ... Codi de la Card ... */}
                <div className="relative h-56 w-full bg-muted dark:bg-slate-800 overflow-hidden">
                    {(post.totalReactions || 0) > 0 && (
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-cyan-400 text-xs font-bold font-mono border border-cyan-500/30">
                        <Cpu className="w-3.5 h-3.5" />
                        <span className="h-3 w-px bg-cyan-500/30 mx-0.5"></span>
                        {post.totalReactions}
                      </div>
                    )}
                    {post.coverImage ? (
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50"><ImageIcon className="w-10 h-10 mb-2 opacity-50" /><span className="text-xs tracking-widest">{t('fallback_image')}</span></div>
                    )}
                </div>
                <CardHeader className="pb-2 pt-6">
                    <div className="flex justify-between items-center mb-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider"><Tag className="w-3 h-3" />{post.tags[0] ?? 'TECH'}</div>
                        {post.date && <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium"><Calendar className="w-3 h-3" />{new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(post.date))}</div>}
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6">{post.description}</p>
                    <div className="text-sm font-bold text-primary flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-all group-hover:gap-3">Llegir article <span className="text-lg leading-none">&rarr;</span></div>
                </CardContent>
             </Card>
          </Link>
        ))}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="col-span-full py-24 text-center bg-muted/20 rounded-3xl border border-dashed border-border flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Tag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">{t('no_posts')}</h3>
            <p className="text-muted-foreground text-sm">No s'han trobat publicacions disponibles.</p>
          </div>
        )}
      </div>

      {/* 👇 5. CONTROLS DE PAGINACIÓ (Nou) */}
      {metadata && metadata.totalPages > 1 && (
        <div className="mt-16 max-w-md mx-auto">
          <PaginationControls metadata={metadata} />
        </div>
      )}
    </div>
  );
}