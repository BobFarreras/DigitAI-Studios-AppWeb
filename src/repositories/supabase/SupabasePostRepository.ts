import { createClient, createAdminClient } from '@/lib/supabase/server';
import { IPostRepository } from '@/repositories/interfaces/IPostRepository';
import { BlogPostDTO } from '@/types/models';
import { Database } from '@/types/database.types';

// 1. Tipus estrictes de la base de dades
type PostRow = Database['public']['Tables']['posts']['Row'];
type PostUpdate = Database['public']['Tables']['posts']['Update']; // 👈 Adéu 'any'

// ⚠️ CONSTANT D'ORGANITZACIÓ (Posa-ho al .env en producció)
const MY_ORG_ID = process.env.NEXT_PUBLIC_MAIN_ORG_ID || '2f1e89dd-0b95-4f7b-ab31-14a9916d374f';

export class SupabasePostRepository implements IPostRepository {

  // 🔄 Mapper: DB -> App
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
      published: row.published ?? false,
      reviewed: row.reviewed ?? false
    };
  }

  // --- LECTURA PÚBLICA (WEB) ---

  async getPostBySlug(slug: string): Promise<BlogPostDTO | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')      // Només publicats
      .eq('published', true)          // Doble check
      .eq('organization_id', MY_ORG_ID) // 🔒 SEGURETAT: Només la teva org
      .single();

    if (error || !data) return null;
    return this.mapToDTO(data);
  }

  async getAllPublishedPosts(): Promise<BlogPostDTO[]> {
    const supabase = await createClient();

    // 1. Posts de la teva ORG i publicats
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .eq('published', true)
      .eq('organization_id', MY_ORG_ID) // 🔒 SEGURETAT
      .order('published_at', { ascending: false });

    if (!posts || posts.length === 0) return [];

    // 2. Reaccions (Bulk query eficient)
    const slugs = posts.map(p => p.slug);
    const { data: reactions } = await supabase
      .from('post_reactions')
      .select('post_slug')
      .in('post_slug', slugs);

    // 3. Recompte en memòria
    const reactionCounts = new Map<string, number>();
    reactions?.forEach(r => {
      reactionCounts.set(r.post_slug, (reactionCounts.get(r.post_slug) || 0) + 1);
    });

    // 4. Injectar dades al DTO
    return posts.map(row => ({
      ...this.mapToDTO(row),
      totalReactions: reactionCounts.get(row.slug) || 0
    }));
  }

  // --- GESTIÓ ADMIN (DASHBOARD) ---

  async getAllPosts(): Promise<BlogPostDTO[]> {
    const supabase = createAdminClient(); 
    // Fins i tot a l'admin filtrem per ORG per no barrejar dades si fos multi-tenant
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('organization_id', MY_ORG_ID) 
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(row => this.mapToDTO(row));
  }

  async updatePost(slug: string, data: Partial<BlogPostDTO>): Promise<void> {
    const supabase = createAdminClient();

    // ✅ ÚS DEL TIPUS 'PostUpdate' (Typescript estricte)
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
      // Si publiquem, actualitzem la data si no n'hi ha una de manual
      if (data.published) {
         updateData.published_at = data.date || new Date().toISOString();
      }
    } else if (data.date) {
      updateData.published_at = data.date;
    }

    const { error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('slug', slug)
      .eq('organization_id', MY_ORG_ID); // 🔒

    if (error) throw new Error(error.message);
  }

  async deletePost(slug: string): Promise<void> {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('slug', slug)
      .eq('organization_id', MY_ORG_ID); // 🔒

    if (error) throw new Error(error.message);
  }

  async getAdminPostBySlug(slug: string): Promise<BlogPostDTO | null> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('organization_id', MY_ORG_ID) // 🔒
      .single();

    if (error || !data) return null;
    return this.mapToDTO(data);
  }

  // --- REACCIONS ---

  async getPostReactions(slug: string): Promise<Record<string, number>> {
    const supabase = await createClient();
    const { data } = await supabase.from('post_reactions').select('reaction_type').eq('post_slug', slug);
    
    const counts: Record<string, number> = {};
    data?.forEach(r => counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1);
    return counts;
  }

  async toggleReaction(slug: string, reaction: string, visitorId: string) {
    const supabase = createAdminClient();
    
    // Validem que el post existeix a la nostra ORG
    const { data: post } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', slug)
        .eq('organization_id', MY_ORG_ID)
        .single();
        
    if(!post) throw new Error("Post not found in organization");

    const { data: existing } = await supabase
        .from('post_reactions')
        .select('id')
        .eq('post_slug', slug)
        .eq('reaction_type', reaction)
        .eq('visitor_id', visitorId)
        .maybeSingle();

    if (existing) {
      await supabase.from('post_reactions').delete().eq('id', existing.id);
      return 'removed';
    } else {
      await supabase.from('post_reactions').insert({ 
          post_slug: slug, 
          reaction_type: reaction, 
          visitor_id: visitorId 
      });
      return 'added';
    }
  }
  
  // (Mètode auxiliar no utilitzat actualment però necessari per la interfície si hi fos)
  async getUserReactions(slug: string, visitorId: string): Promise<string[]> {
     const supabase = await createClient();
     const { data } = await supabase.from('post_reactions').select('reaction_type').eq('post_slug', slug).eq('visitor_id', visitorId);
     return data?.map(r => r.reaction_type) || [];
  }
}