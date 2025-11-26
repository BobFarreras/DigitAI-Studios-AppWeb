import { MDXRemote } from 'next-mdx-remote/rsc';
import { Button } from '@/components/ui/button';
import React, { ComponentPropsWithoutRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

// Tipus per als components HTML estàndard
type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type CalloutProps = { children: React.ReactNode };

// Component de Vídeo (YouTube)
const Video = ({ id }: { id: string }) => (
  <div className="my-12 rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 aspect-video bg-slate-900 mx-auto w-full">
    <iframe
      className="w-full h-full"
      src={`https://www.youtube.com/embed/${id}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
);

const components = {
  // ENCAPÇALAMENTS: Usem 'text-foreground' per adaptar-se perfectament (Negre/Blanc)
  h1: (props: HeadingProps) => (
    <h1 {...props} className="text-3xl md:text-5xl font-extrabold mt-12 mb-6 text-foreground tracking-tight leading-tight" />
  ),
  h2: (props: HeadingProps) => (
    <h2 {...props} className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-foreground border-b border-border/50 pb-2" />
  ),
  h3: (props: HeadingProps) => (
    <h3 {...props} className="text-xl md:text-2xl font-bold mt-8 mb-4 text-foreground" />
  ),
  
  // PARÀGRAFS: CORRECCIÓ DE CONTRAST
  // Light: text-slate-900 (Negre intens per llegibilitat)
  // Dark: text-slate-200 (Blanc suau per no cremar els ulls)
  p: (props: ParagraphProps) => (
    <p {...props} className="text-xl leading-8 text-slate-900 dark:text-slate-500 mb-8 font-sans" />
  ),
  
  // ELEMENTS INLINE
  strong: (props: ComponentPropsWithoutRef<'strong'>) => <strong {...props} className="font-bold text-foreground" />,
  a: (props: ComponentPropsWithoutRef<'a'>) => <a {...props} className="text-primary underline underline-offset-4 hover:text-primary/80 font-medium transition-colors" />,

  // LLISTES
  ul: (props: ListProps) => (
    <ul {...props} className="list-disc list-outside ml-6 space-y-3 mb-8 text-xl text-slate-900 dark:text-slate-500" />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => <li {...props} className="pl-2" />,

  // CITES (Blockquote)
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote {...props} className="border-l-4 border-primary pl-6 py-4 my-10 italic text-2xl text-slate-800 dark:text-slate-100 bg-muted/30 rounded-r-lg" />
  ),
  
  // COMPONENTS PERSONALITZATS (Botons i Callouts)
  Button: (props: React.ComponentProps<typeof Button>) => (
    <div className="my-12 flex justify-center">
      <Button size="lg" className="px-8 py-6 text-lg shadow-lg hover:scale-105 transition-transform" {...props} />
    </div>
  ),
  
  Callout: ({ children }: CalloutProps) => (
    <div className="flex gap-4 bg-primary/5 border border-primary/20 text-foreground p-6 my-10 rounded-xl shadow-sm">
      <div className="shrink-0 mt-1">
        <CheckCircle2 className="h-6 w-6 text-primary" />
      </div>
      <div className="text-lg leading-relaxed text-slate-900 dark:text-slate-100">
        {children}
      </div>
    </div>
  ),

  Video,
};

export function MDXContent({ source }: { source: string }) {
  if (!source) return null;

  return (
    // Sense 'prose' per tenir control total dels colors
    <article className="max-w-none w-full">
      <MDXRemote source={source} components={components} />
    </article>
  );
}