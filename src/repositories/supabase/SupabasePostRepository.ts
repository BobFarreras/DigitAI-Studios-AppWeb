import { createAdminClient } from '@/lib/supabase/server';
import { IPostRepository } from '@/repositories/interfaces/IPostRepository';
import { BlogPostDTO } from '@/types/models';
import { Database } from '@/types/database.types';

// 1. Tipus base
type PostRow = Database['public']['Tables']['posts']['Row'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
type SocialPostRow = Database['public']['Tables']['social_posts']['Row'];

// 2. ✅ DEFINICIÓ ESTRICTA DEL JOIN AMB EL NOM CORRECTE DE LA COLUMNA
type PostRowWithRelations = PostRow & {
  social_posts: {
    id: string;
    platform: string;
    status: string;
    scheduled_at: string | null; // 👈 CORREGIT: Ha de coincidir amb SQL
  }[];
};

const MY_ORG_ID = process.env.NEXT_PUBLIC_MAIN_ORG_ID!;
if (!MY_ORG_ID) throw new Error("Manca NEXT_PUBLIC_MAIN_ORG_ID");

export class SupabasePostRepository implements IPostRepository {

  // 🔄 Mapper: DB -> App
  private mapToDTO(row: PostRowWithRelations): BlogPostDTO {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      date: row.published_at ?? row.created_at,
      description: row.description,
      content: row.content_mdx,
      tags: row.tags ? (row.tags as string[]) : [],
      coverImage: row.cover_image,
      published: row.published ?? false,
      reviewed: row.reviewed ?? false,

      // 👇 Mapeig del Array
      social_posts: Array.isArray(row.social_posts)
        ? row.social_posts.map(sp => ({
          id: sp.id,
          platform: sp.platform,
          status: sp.status,
          // 🔄 Mapeig de noms: DB (snake_case) -> DTO (camelCase)
          scheduledFor: sp.scheduled_at || null
        }))
        : []
    };
  }

  // --- GESTIÓ ADMIN (DASHBOARD) ---

  async getAllPosts(): Promise<BlogPostDTO[]> {
    const supabase = createAdminClient();

    // A getAllPosts()
    const { data, error } = await supabase
      .from('posts')
      .select(`
    id, slug, title, published, reviewed, published_at, created_at, cover_image,
    description, organization_id, 
    social_posts ( id, platform, status, scheduled_at )
  `) // 👈 NO DEMANEM 'content_mdx' NI 'tags' si són pesats
      .eq('organization_id', MY_ORG_ID)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    // 🛠️ TRUC: Casting a 'unknown' i després al nostre tipus manual
    // Això calla els errors de tipatge de Supabase quan fem Joins complexos
    return (data as unknown as PostRowWithRelations[]).map(row => this.mapToDTO(row));
  }

  async createPost(data: Partial<BlogPostDTO>): Promise<string> {
    const supabase = createAdminClient();
    const generatedSlug = data.slug || data.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') || 'untitled';

    const insertData: PostInsert = {
      organization_id: MY_ORG_ID,
      title: data.title || 'Nou Article',
      slug: generatedSlug,
      content_mdx: data.content || '',
      published: false,
      status: 'draft',
    };

    const { data: newPost, error } = await supabase
      .from('posts')
      .insert(insertData)
      .select('slug')
      .single();

    if (error) throw new Error(error.message);
    return newPost.slug;
  }

  async updatePost(slug: string, data: Partial<BlogPostDTO>): Promise<void> {
    const supabase = createAdminClient();
    const updateData: PostUpdate = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.content !== undefined) updateData.content_mdx = data.content;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.coverImage !== undefined) updateData.cover_image = data.coverImage;
    if (data.reviewed !== undefined) updateData.reviewed = data.reviewed;

    if (data.published !== undefined) {
      updateData.published = data.published;
      updateData.status = data.published ? 'published' : 'draft';
      if (data.published) updateData.published_at = data.date || new Date().toISOString();
    } else if (data.date) {
      updateData.published_at = data.date;
    }

    const { error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('slug', slug)
      .eq('organization_id', MY_ORG_ID);

    if (error) throw new Error(error.message);
  }

  async deletePost(slug: string): Promise<void> {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('slug', slug)
      .eq('organization_id', MY_ORG_ID);

    if (error) throw new Error(error.message);
  }

  async getAdminPostBySlug(slug: string): Promise<BlogPostDTO | null> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        social_posts (
          id,
          platform,
          status,
          content,
          scheduled_at 
        )
      `) // 👆 CORREGIT: 'scheduled_at' aquí també
      .eq('slug', slug)
      .eq('organization_id', MY_ORG_ID)
      .single();

    if (error || !data) return null;

    // 🛠️ TRUC: Casting
    return this.mapToDTO(data as unknown as PostRowWithRelations);
  }

  async getSocialPostsByPostId(postId: string): Promise<SocialPostRow[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('post_id', postId);

    if (error || !data) return [];
    return data;
  }

  // ✅ NOU MÈTODE PAGINAT
  async getPaginatedPosts(page: number, pageSize: number): Promise<{ posts: BlogPostDTO[]; total: number }> {
    const supabase = createAdminClient();

    // Càlcul del rang (ex: Pàgina 1 -> 0 a 19)
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, count, error } = await supabase
      .from('posts')
      .select(`
        id, slug, title, published, reviewed, published_at, created_at, cover_image, description, organization_id,
        social_posts ( id, platform, status, scheduled_at )
      `, { count: 'exact' }) // 👈 Demanem el total de files
      .eq('organization_id', MY_ORG_ID)
      .order('created_at', { ascending: false })
      .range(start, end); // 👈 Tallem les dades

    if (error) throw new Error(error.message);

    // Mapegem les dades (utilitzant el teu helper existent)
    const posts = (data as unknown as PostRowWithRelations[]).map(row => this.mapToDTO(row));

    return {
      posts,
      total: count || 0
    };

  }
}
