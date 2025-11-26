import { BlogPostDTO } from '@/types/models';

export interface IPostRepository {
  getPostBySlug(slug: string): Promise<BlogPostDTO | null>;
  getAllPublishedPosts(): Promise<BlogPostDTO[]>;
}