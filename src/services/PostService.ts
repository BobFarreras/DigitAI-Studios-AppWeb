import { IPostRepository } from '@/repositories/interfaces/IPostRepository';
import { BlogPostDTO } from '@/types/models';
import { cache } from 'react'; // 👈 IMPORT IMPORTANT

export class PostService {
  constructor(private postRepo: IPostRepository) {
    // Envoltem el mètode original amb la cache de React
    this.getPost = cache(this.getPost.bind(this)); 
  }

  async getPost(slug: string): Promise<BlogPostDTO | null> {
    return this.postRepo.getPostBySlug(slug);
  }

  async getLatestPosts(): Promise<BlogPostDTO[]> {
    return this.postRepo.getAllPublishedPosts();
  }
}