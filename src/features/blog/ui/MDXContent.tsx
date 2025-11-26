import { MDXRemote } from 'next-mdx-remote/rsc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React, { ComponentPropsWithoutRef } from 'react';

// Tipus per als components HTML estàndard (h1, p, ul...)
type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;

// Tipus per al component Callout (accepta fills)
type CalloutProps = {
  children: React.ReactNode;
};
// ✨ NOU COMPONENT: YOUTUBE EMBED RESPONSIU
const Video = ({ id }: { id: string }) => (
  <div className="my-8 rounded-xl overflow-hidden shadow-lg aspect-video bg-slate-900">
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
  // Ara TypeScript sap que 'props' té className, id, style, children...
  h1: (props: HeadingProps) => (
    <h1 {...props} className="text-4xl font-bold mt-8 mb-4 text-primary" />
  ),
  p: (props: ParagraphProps) => (
    <p {...props} className="text-lg leading-relaxed text-slate-700 mb-6" />
  ),
  ul: (props: ListProps) => (
    <ul {...props} className="list-disc list-inside space-y-2 mb-6" />
  ),
  
  // Per a components de UI, usem ComponentProps del propi component
  Button: (props: React.ComponentProps<typeof Button>) => (
    <div className="my-8">
      <Button {...props} />
    </div>
  ),
  
  Callout: ({ children }: CalloutProps) => (
    <Card className="bg-blue-50 border-blue-200 p-6 my-8 italic text-blue-900">
      {children}
    </Card>
  ),
  Video, // 👈 Registrem el vídeo
};

export function MDXContent({ source }: { source: string }) {
  // Protecció contra nulls si la DB està buida
  if (!source) return null;

  return (
    <article className="prose prose-lg prose-slate max-w-none dark:prose-invert">
      <MDXRemote source={source} components={components} />
    </article>
  );
}