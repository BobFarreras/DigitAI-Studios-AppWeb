import { BlogPostDTO } from '@/types/models';

export interface IPostRepository {
  getPostBySlug(slug: string): Promise<BlogPostDTO | null>;
  getAllPublishedPosts(): Promise<BlogPostDTO[]>;
  
  // 👇 NOUS MÈTODES D'ADMINISTRACIÓ
  getAllPosts(): Promise<BlogPostDTO[]>; // Inclou esborranys i arxivats
  updatePost(slug: string, data: Partial<BlogPostDTO>): Promise<void>;
  deletePost(slug: string): Promise<void>;
  getAdminPostBySlug(slug: string): Promise<BlogPostDTO | null>;
  getPublishedPostsPaginated(page: number, pageSize: number): Promise<{ posts: BlogPostDTO[]; total: number }>;

}