import { BlogPostDTO } from '@/types/models';

export interface IPostRepository {
  getAllPosts(): Promise<BlogPostDTO[]>;
  updatePost(slug: string, data: Partial<BlogPostDTO>): Promise<void>;
  deletePost(slug: string): Promise<void>;
  getAdminPostBySlug(slug: string): Promise<BlogPostDTO | null>;
  getPaginatedPosts(page: number, pageSize: number): Promise<{ posts: BlogPostDTO[]; total: number }>;
}
