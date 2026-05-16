import { IPostRepository } from '@/repositories/interfaces/IPostRepository';
import { BlogPostDTO } from '@/types/models';

export class PostService {
  constructor(private postRepo: IPostRepository) {}

  async getAllPostsForAdmin(): Promise<BlogPostDTO[]> {
    return this.postRepo.getAllPosts();
  }

  async updatePost(slug: string, data: Partial<BlogPostDTO>): Promise<void> {
    return this.postRepo.updatePost(slug, data);
  }

  async deletePost(slug: string): Promise<void> {
    return this.postRepo.deletePost(slug);
  }

  async getAdminPost(slug: string): Promise<BlogPostDTO | null> {
    return this.postRepo.getAdminPostBySlug(slug);
  }
}
