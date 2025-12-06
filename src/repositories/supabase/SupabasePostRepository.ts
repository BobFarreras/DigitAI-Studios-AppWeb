import { createClient, createAdminClient } from '@/lib/supabase/server';
import { IPostRepository } from '@/repositories/interfaces/IPostRepository';
import { BlogPostDTO } from '@/types/models';
import { Database } from '@/types/database.types';

// Tipus directe de la fila SQL
type PostRow = Database['public']['Tables']['posts']['Row'];

export class SupabasePostRepository implements IPostRepository {

  // 🔄 Mapper: La peça clau per traduir DB -> App
  private mapToDTO(row: PostRow): BlogPostDTO {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      date: row.published_at ?? row.created_at,
      description: row.description,
      content: row.content_mdx,
      tags: row.tags ? (row.tags as string[]) : [],
      coverImage: row.cover_image,
      published: row.published ?? false, // Assegurem boolean
      reviewed: row.reviewed ?? false
    };
  }

  async getPostBySlug(slug: string): Promise<BlogPostDTO | null> {
    // 🔥 CORRECCIÓ: Afegit 'await'
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('published', true)
      .single();

    if (error || !data) return null;

    return this.mapToDTO(data);
  }

  async getAllPublishedPosts(): Promise<BlogPostDTO[]> {
    // 🔥 CORRECCIÓ: Afegit 'await'
    const supabase = await createClient();
    
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (!data) return [];

    return data.map(this.mapToDTO);
  }

  // 👇 IMPLEMENTACIÓ NOUS MÈTODES D'ADMINISTRACIÓ

  async getAllPosts(): Promise<BlogPostDTO[]> {
    // 🔥 CORRECCIÓ: Afegit 'await' (tot i que al teu snippet ja hi era, ens assegurem)
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(row => this.mapToDTO(row));
  }

  async updatePost(slug: string, data: Partial<BlogPostDTO>): Promise<void> {
    // NOTA: createAdminClient sol ser síncron (no usa cookies), així que NO porta await
    const supabase = createAdminClient();

    const updateData: Partial<PostRow> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.content !== undefined) updateData.content_mdx = data.content;
    if (data.tags !== undefined) updateData.tags = data.tags;

    if (data.published !== undefined) {
      updateData.published = data.published;
      updateData.status = data.published ? 'published' : 'draft';
      if (data.published) updateData.published_at = new Date().toISOString();
    }

    if (data.reviewed !== undefined) {
      updateData.reviewed = data.reviewed;
    }

    if (data.date !== undefined && data.date) {
      updateData.published_at = data.date;
    }

    const { error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('slug', slug);

    if (error) throw new Error(error.message);
  }

  async deletePost(slug: string): Promise<void> {
    const supabase = createAdminClient(); // Síncron (Admin Client)
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('slug', slug);

    if (error) throw new Error(error.message);
  }

  async getAdminPostBySlug(slug: string): Promise<BlogPostDTO | null> {
    const supabase = createAdminClient(); // Síncron (Admin Client)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return this.mapToDTO(data);
  }
}