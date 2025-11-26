import { Link } from '@/routing';
// 👇 Importem el servei des del container
import { postService } from '@/services/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ISR: Refresca el llistat cada hora per si hi ha posts nous
export const revalidate = 3600;

export default async function BlogIndexPage() {
  // Opcional: Si vols traduir els títols "Blog & Recursos" pots fer servir 't'
  // const t = await getTranslations('BlogIndex'); 

  // 1. Obtenim TOTS els posts publicats
  const posts = await postService.getLatestPosts();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Blog & Recursos</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Aprèn a optimitzar la teva presència digital amb les nostres guies.
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
                {!post.coverImage && <span>Sense Imatge</span>}
              </div>

              <CardHeader>
                <div className="text-xs font-bold text-indigo-600 mb-2 tracking-wide uppercase">
                  {post.tags[0] ?? 'TECH'}
                </div>
                <CardTitle className="text-xl leading-snug font-bold text-slate-900">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-muted-foreground text-sx line-clamp-3 mb-4">
                  {post.description}
                </p>
                
                <div className="text-xs text-slate-400 font-medium pt-4 border-t border-slate-100 mt-auto">
                  {post.date ? new Date(post.date).toLocaleDateString() : 'Recentment'}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-lg border border-dashed">
            <p className="text-slate-500">Encara no hi ha articles publicats.</p>
          </div>
        )}
      </div>
    </div>
  );
}