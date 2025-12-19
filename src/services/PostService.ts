import { IPostRepository } from '@/repositories/interfaces/IPostRepository';
import { BlogPostDTO } from '@/types/models';
import { cache } from 'react'; // 👈 IMPORT IMPORTANT

export class PostService {
  private PAGE_SIZE = 9; // 👈 9 posts (Grid 3x3 perfecte)
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

  // 👇 Mètodes Admin
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
    // Sense cache, volem dades fresques a l'admin
    return this.postRepo.getAdminPostBySlug(slug);
  }

  // 👇 NOU MÈTODE QUE UTILITZARÀ LA PÀGINA
  async getPublicBlogPosts(page: number = 1) {
    const currentPage = page < 1 ? 1 : page;

    // Cridem al repositori nou
    const { posts, total } = await this.postRepo.getPublishedPostsPaginated(currentPage, this.PAGE_SIZE);

    return {
      posts,
      metadata: {
        total,
        page: currentPage,
        pageSize: this.PAGE_SIZE,
        totalPages: Math.ceil(total / this.PAGE_SIZE)
      }
    };
  }
  
}