import { notFound } from 'next/navigation';
import { postService } from '@/services/container';
import { MDXContent } from '@/features/blog/ui/MDXContent';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await postService.getPost(slug);

  if (!post) {
    return { title: 'Article no trobat' };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description || '',
      type: 'article',
      publishedTime: post.date || undefined,
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || '',
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await postService.getPost(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* 1. HERO SECTION (FOSC PER DEFECTE) */}
      <div className="relative w-full flex items-end justify-center overflow-hidden min-h-[60vh] lg:min-h-[70vh] bg-slate-950">

        {/* CAPA 1: La Imatge de fons (Fixed per efecte parallax suau) */}
        <div className="absolute inset-0 bg-slate-900">
          {post.coverImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50"
              style={{ backgroundImage: `url(${post.coverImage})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-blue-900 via-indigo-900 to-slate-900 opacity-80" />
          )}

          {/* CAPA 2: L'Overlay fosc (Essencial per llegir el text blanc) */}
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Contingut del Hero */}
        <div className="relative z-10 container px-4 text-center max-w-4xl mx-auto pb-24 pt-32">


          {/* Títol Gran */}
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight drop-shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-muted-foreground font-medium text-sm md:text-base animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-foreground/10 text-foreground backdrop-blur-md border border-primary/30 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
                <User className="w-4 h-4" />
              </div>
              <span>DigitAI Team</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-70" />
              <span>{post.date ? new Date(post.date).toLocaleDateString() : 'Avui'}</span>
            </div>
          </div>


        </div>
      </div>

      {/* 2. CONTINGUT (FONS ADAPTABLE) */}
      <div className="container px-4 -mt-12 relative z-20 max-w-4xl mx-auto">
        {/* Card principal del contingut */}
        <div className="bg-card text-card-foreground rounded-3xl p-6 md:p-12 lg:p-16 shadow-2xl ring-1 ring-border/50">

          {/* Intro / Description */}
          <p className="text-xl md:text-2xl lg:text-3xl font-serif text-muted-foreground leading-relaxed mb-8 md:mb-12 border-b border-border pb-8">
            {post.description}
          </p>

          {/* Cos de l'article (MDX) */}
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl prose-img:shadow-lg">
            <MDXContent source={post.content || ''} />
          </div>

          {/* Footer Card dins del post */}
          <div className="mt-16 p-6 md:p-10 rounded-2xl bg-muted/30 border border-border text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4">T'ha resultat útil?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm md:text-base">Comparteix aquest article o descobreix com podem ajudar-te a aplicar aquestes estratègies.</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/blog">
                <Button variant="outline" className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Altres Articles
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full sm:w-auto gradient-bg text-white border-0 shadow-lg hover:opacity-90">
                  Auditar la meva web
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}