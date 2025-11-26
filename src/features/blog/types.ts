export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string; // El cos en Markdown
  tags: string[];
};