import { notFound } from 'next/navigation';
import { postService } from '@/services/container';
import { MDXContent } from '@/features/blog/ui/MDXContent';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';

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

      {/* 1. HERO SECTION (FOSC PER DEFECTE PERQUÈ RESSALTI EL TEXT I LA NAVBAR TRANSPARENT) */}
      <div className="relative w-full flex items-end justify-center overflow-hidden pt-32 pb-16 lg:pt-48 lg:pb-24 bg-slate-950">

        {/* CAPA 1: La Imatge de fons */}
        <div className="absolute inset-0 bg-slate-900">
          {post.coverImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.coverImage})` }}
            />
          ) : (
            // Fallback si no hi ha imatge: un gradient abstracte xulo
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900" />
          )}

          {/* CAPA 2: L'Overlay fosc (Essencial per llegir el text blanc) */}
          {/* Un degradat que va de negre (baix) a transparent (dalt) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
        </div>
        {/* Contingut del Hero (Text Blanc sempre, perquè el fons és fosc) */}
        <div className="relative z-10 container px-4 text-center max-w-4xl mx-auto">
          <div className="flex justify-center gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {post.tags.map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight drop-shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {post.title}
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-6 text-slate-300 font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <User className="w-4 h-4 text-white" />
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
      <div className="container px-4 -mt-12 relative z-20 max-w-5xl mx-auto">
        {/* Card principal del contingut */}
        <div className="bg-card text-card-foreground rounded-3xl p-8 md:p-16 shadow-2xl ring-1 ring-border/50">

          {/* Intro / Description */}
          <p className="text-2xl md:text-3xl font-serif text-muted-foreground leading-relaxed mb-12 border-b border-border pb-8">
            {post.description}
          </p>

          {/* Cos de l'article */}
          <MDXContent source={post.content || ''} />

          {/* Footer Card dins del post */}
          <div className="mt-16 p-8 rounded-2xl bg-muted/50 border border-border text-center">
            <h3 className="text-2xl font-bold mb-4">T'ha resultat útil?</h3>
            <div className="flex justify-center gap-4">
              <Link href="/blog">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Altres Articles
                </Button>
              </Link>
              <Link href="/">
                <Button>Auditar la meva web</Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}