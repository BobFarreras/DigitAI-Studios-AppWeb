import { notFound } from 'next/navigation';
import { postService } from '@/services/container';
import { MDXContent } from '@/features/blog/ui/MDXContent';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Share2, User } from 'lucide-react';
import { Card } from '@/components/ui/card';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600; 

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await postService.getPost(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* 1. HERO SECTION IMMERSIU */}
      <div className="relative h-[50vh] min-h-[400px] w-full flex items-end justify-center overflow-hidden">
        {/* Imatge de Fons amb overlay */}
        <div className="absolute inset-0 bg-slate-900">
           {post.coverImage && (
             <div 
               className="absolute inset-0 bg-cover bg-center opacity-50" 
               style={{backgroundImage: `url(${post.coverImage})`}} 
             />
           )}
           <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        </div>
        
        {/* Contingut del Hero */}
        <div className="relative z-10 container px-4 pb-12 text-center max-w-4xl mx-auto">
          <div className="flex justify-center gap-2 mb-6">
            {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg">
                    {tag}
                </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground text-balance mb-6 drop-shadow-md">
            {post.title}
          </h1>
          
          {/* Metadades Autor/Data */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-muted-foreground text-sm font-medium">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-500" />
                </div>
                <span>Equip DigitAI</span>
             </div>
             <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date ? new Date(post.date).toLocaleDateString() : 'Recent'}</span>
             </div>
             <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min lectura</span>
             </div>
          </div>
        </div>
      </div>

      {/* 2. LAYOUT DE CONTINGUT (Grid) */}
      <div className="container px-4 mt-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Sidebar Esquerra (Share & Back) - Sticky */}
            <div className="hidden lg:block lg:col-span-2">
                <div className="sticky top-24 flex flex-col gap-4 items-center">
                    <Link href="/blog">
                        <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-slate-100" title="Tornar">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="h-8 border-l border-border" />
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12" title="Compartir">
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Contingut Principal */}
            <main className="lg:col-span-8">
               <div className="bg-card rounded-2xl p-6 md:p-10 shadow-sm border border-border">
                  <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-10 border-b pb-8">
                    {post.description}
                  </p>
                  
                  {/* El motor MDX */}
                  <MDXContent source={post.content || ''} />
               </div>

               {/* Footer del Post (CTA) */}
               <Card className="mt-12 bg-primary text-primary-foreground border-none p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Vols automatitzar el teu negoci?</h3>
                  <p className="mb-6 text-primary-foreground/90">
                    Aplica el que has après en aquest article amb la nostra auditoria gratuïta.
                  </p>
                  <Link href="/">
                     <Button size="lg" variant="secondary" className="font-bold">
                        Auditar la meva Web
                     </Button>
                  </Link>
               </Card>
            </main>

            {/* Sidebar Dreta (Toc buit o Related) */}
            <div className="hidden lg:block lg:col-span-2">
               {/* Espai per a futurs "Articles relacionats" */}
            </div>

        </div>
      </div>
    </div>
  );
}