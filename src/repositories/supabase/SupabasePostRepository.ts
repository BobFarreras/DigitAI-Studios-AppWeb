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
      slug: row.slug,
      title: row.title,
      // Preferim published_at, si no created_at
      date: row.published_at ?? row.created_at, 
      description: row.description,
      content: row.content_mdx, // Aquí fem el canvi de nom
      tags: row.tags ? (row.tags as string[]) : [], // Assegurem que és array
      coverImage: row.cover_image,
      published: row.status === 'published',
      
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
}