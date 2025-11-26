import { IPostRepository } from '@/repositories/interfaces/IPostRepository';
import { BlogPostDTO } from '@/types/models';

// ✅ Només exportem la classe
export class PostService {
  constructor(private postRepo: IPostRepository) {}

  async getPost(slug: string): Promise<BlogPostDTO | null> {
    return this.postRepo.getPostBySlug(slug);
  }

  async getLatestPosts(): Promise<BlogPostDTO[]> {
    return this.postRepo.getAllPublishedPosts();
  }
}