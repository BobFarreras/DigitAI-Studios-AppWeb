/**
 * @file src/features/blog/types.ts
 * @updated 2026-05-08
 * @summary Feature module: src/features/blog/types.ts
 * @scope UI o logica de feature encapsulada dins del domini corresponent.
 */
export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string; // El cos en Markdown
  tags: string[];
};
