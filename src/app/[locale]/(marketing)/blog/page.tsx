import { Link } from '@/routing';
import { postService } from '@/services/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations, getLocale } from 'next-intl/server'; // 👈 Imports clau

// ISR: Refresca el llistat cada hora
export const revalidate = 3600;

export default async function BlogIndexPage() {
  const t = await getTranslations('BlogIndex'); // Namespace
  const locale = await getLocale(); // Idioma actual ('ca', 'es', 'en')

  // 1. Obtenim els posts
  // Nota: En el futur, passarem 'locale' al servei: getLatestPosts(locale)
  const posts = await postService.getLatestPosts();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{t('title')}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block transition-transform hover:scale-[1.02]">
            <Card className="h-full flex flex-col overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              
              {/* Imatge de Cover */}
              <div 
                className="h-48 w-full bg-slate-100 flex items-center justify-center text-slate-300 bg-cover bg-center"
                style={post.coverImage ? { backgroundImage: `url(${post.coverImage})` } : undefined}
              >
                {!post.coverImage && <span>{t('fallback_image')}</span>}
              </div>

              <CardHeader>
                <div className="text-xs font-bold text-indigo-600 mb-2 tracking-wide uppercase">
                  {post.tags[0] ?? 'TECH'}
                </div>
                <CardTitle className="text-xl leading-snug font-bold text-slate-900 line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-muted-foreground text-xs line-clamp-3 mb-4">
                  {post.description}
                </p>
                
                <div className="text-xs text-slate-400 font-medium pt-4 border-t border-slate-100 mt-auto">
                  {post.date 
                    ? new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(post.date))
                    : t('published_recently')
                  }
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-lg border border-dashed">
            <p className="text-slate-500">{t('no_posts')}</p>
          </div>
        )}
      </div>
    </div>
  );
}