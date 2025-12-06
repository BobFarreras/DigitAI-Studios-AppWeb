import { createClient } from '@/lib/supabase/client';
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
    const supabase = createClient();

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('published', true) // 👈 Seguretat extra: si endevinen l'URL d'un esborrany, no es veurà
      .single();

    if (error || !data) return null;

    // Fem servir el mapper
    return this.mapToDTO(data);
  }

  async getAllPublishedPosts(): Promise<BlogPostDTO[]> {
    const supabase = createClient();
    const { data } = await supabase
      .from('posts')
      .select('*') // Seleccionem tot per simplificar el tipatge, o especifica columnes
      .eq('status', 'published')
      .eq('published', true) // 👈 Seguretat extra: si endevinen l'URL d'un esborrany, no es veurà
      .order('published_at', { ascending: false });

    if (!data) return [];

    // Mapegem cada fila
    return data.map(this.mapToDTO);
  }


  // Mètodes existents (getPostBySlug, getAllPublishedPosts)...

  // 👇 IMPLEMENTACIÓ NOUS MÈTODES
  async getAllPosts(): Promise<BlogPostDTO[]> {
    // Usem createAdminClient per saltar-nos restriccions si cal, 
    // tot i que un admin loguejat ja hauria de poder veure-ho per RLS.
    // Per seguretat i simplicitat en admin panels, el client normal amb RLS d'admin és millor.
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(row => this.mapToDTO(row));
  }

  async updatePost(slug: string, data: Partial<BlogPostDTO>): Promise<void> {
    const supabase = await createClient();

    // Mapegem DTO -> DB Columns
    const updateData: Partial<PostRow> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;

    // ✅ AQUÍ ESTAVA EL PROBLEMA: Assegurem que content va a content_mdx
    if (data.content !== undefined) updateData.content_mdx = data.content;

    if (data.tags !== undefined) updateData.tags = data.tags;

    // Gestió d'estats
    if (data.published !== undefined) {
      updateData.published = data.published;
      updateData.status = data.published ? 'published' : 'draft';
      if (data.published) updateData.published_at = new Date().toISOString();
    }

    // 👈 Guardem el camp REVIEWED
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
    const supabase = await createClient();
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('slug', slug);

    if (error) throw new Error(error.message);
  }
  // 👇 1. Mètode per veure un post específic (encara que sigui draft)
  async getAdminPostBySlug(slug: string): Promise<BlogPostDTO | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return this.mapToDTO(data);
  }



}