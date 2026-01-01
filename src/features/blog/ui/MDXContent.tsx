import { MDXRemote } from 'next-mdx-remote/rsc';
import { Button } from '@/components/ui/button';
import React, { ComponentPropsWithoutRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import { Link } from '@/routing'; // ✅ 1. IMPORTEM EL LINK

// Tipus
type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type CalloutProps = { children: React.ReactNode };
type TableProps = ComponentPropsWithoutRef<'table'>;
type ThProps = ComponentPropsWithoutRef<'th'>;
type TdProps = ComponentPropsWithoutRef<'td'>;

// Component de Vídeo
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
  h1: (props: HeadingProps) => (
    <h1 {...props} className="text-3xl md:text-5xl font-extrabold mt-12 mb-6 text-foreground tracking-tight leading-tight" />
  ),
  h2: (props: HeadingProps) => (
    <h2 {...props} className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-foreground border-b border-border/50 pb-2" />
  ),
  h3: (props: HeadingProps) => (
    <h3 {...props} className="text-xl md:text-2xl font-bold mt-8 mb-4 text-foreground" />
  ),
  p: (props: ParagraphProps) => (
    <p {...props} className="text-xl leading-8 text-slate-900 dark:text-slate-400 mb-8 font-sans" />
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => <strong {...props} className="font-bold text-foreground" />,
  a: (props: ComponentPropsWithoutRef<'a'>) => <a {...props} className="text-primary underline underline-offset-4 hover:text-primary/80 font-medium transition-colors" />,
  ul: (props: ListProps) => (
    <ul {...props} className="list-disc list-outside ml-6 space-y-3 mb-8 text-xl text-slate-900 dark:text-slate-500" />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => <li {...props} className="pl-2" />,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote {...props} className="border-l-4 border-primary pl-6 py-4 my-10 italic text-2xl text-slate-800 dark:text-slate-100 bg-muted/30 rounded-r-lg" />
  ),
  table: (props: TableProps) => (
    <div className="my-12 w-full overflow-x-auto rounded-xl border border-border shadow-sm">
      <table {...props} className="w-full text-left text-sm" />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<'thead'>) => (
    <thead {...props} className="bg-muted/50 text-foreground border-b border-border" />
  ),
  tbody: (props: ComponentPropsWithoutRef<'tbody'>) => (
    <tbody {...props} className="divide-y divide-border bg-card" />
  ),
  tr: (props: ComponentPropsWithoutRef<'tr'>) => (
    <tr {...props} className="transition-colors hover:bg-muted/20" />
  ),
  th: (props: ThProps) => (
    <th {...props} className="px-6 py-4 font-bold text-foreground uppercase tracking-wider text-xs align-middle" />
  ),
  td: (props: TdProps) => (
    <td {...props} className="px-6 py-4 text-slate-600 dark:text-slate-300 align-middle leading-relaxed" />
  ),

  // ✅ 2. FIX DEL BUTTON (ARA NAVEGA)
  Button: ({ href, ...props }: React.ComponentProps<typeof Button> & { href?: string }) => {
    // Si té href, l'embolcallem amb Link
    if (href) {
      return (
        <div className="my-8 flex justify-center w-full">
          <Link href={href}>
            <Button size="lg" className="px-8 py-6 text-lg shadow-lg hover:scale-105 transition-transform w-full sm:w-auto" {...props} />
          </Link>
        </div>
      );
    }
    // Si no té href, es comporta com un botó normal
    return (
      <div className="my-8 flex justify-center w-full">
        <Button size="lg" className="px-8 py-6 text-lg shadow-lg hover:scale-105 transition-transform w-full sm:w-auto" {...props} />
      </div>
    );
  },

  // ✅ 3. FIX DEL CALLOUT (RESPONSIU MÒBIL)
  Callout: ({ children }: CalloutProps) => (
    // Canviat 'flex' per 'flex flex-col md:flex-row' per adaptar-se al mòbil
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 bg-primary/5 border border-primary/20 text-foreground p-6 md:p-8 my-10 rounded-xl shadow-sm items-start">
      <div className="shrink-0 mt-1 hidden md:block">
        <CheckCircle2 className="h-8 w-8 text-primary" />
      </div>
      {/* Icona més petita per a mòbil inline amb el títol si calgués, o a dalt */}
      <div className="md:hidden flex items-center gap-2 mb-2">
         <CheckCircle2 className="h-6 w-6 text-primary" />
         <span className="font-bold text-primary">Nota</span>
      </div>
      
      <div className="text-lg leading-relaxed text-slate-900 dark:text-slate-100 w-full [&>div]:my-0">
        {children}
      </div>
    </div>
  ),

  Video,
};

export function MDXContent({ source }: { source: string }) {
  if (!source) return null;

  return (
    <article className="max-w-none w-full">
      <MDXRemote 
        source={source} 
        components={components} 
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </article>
  );
}