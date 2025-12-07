import { createClient, createAdminClient } from '@/lib/supabase/server';
import { IPostRepository } from '@/repositories/interfaces/IPostRepository';
import { BlogPostDTO } from '@/types/models';
import { Database } from '@/types/database.types';

// Tipus directe de la fila SQL i de l'objecte Update
type PostRow = Database['public']['Tables']['posts']['Row'];
type PostUpdate = Database['public']['Tables']['posts']['Update']; // 👈 NOU TIPUS

// ⚠️ IMPORTANT: Idealment això va a process.env.NEXT_PUBLIC_MAIN_ORG_ID
const MY_ORG_ID = process.env.NEXT_PUBLIC_MAIN_ORG_ID || '2f1e89dd-0b95-4f7b-ab31-14a9916d374f';

export class SupabasePostRepository implements IPostRepository {

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

  // ... (getPostBySlug i getAllPublishedPosts es mantenen iguals) ...

  async getPostBySlug(slug: string): Promise<BlogPostDTO | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .eq('published', true)
      .eq('organization_id', MY_ORG_ID)
      .single();

    if (error || !data) return null;
    return this.mapToDTO(data);
  }

  async getAllPublishedPosts(): Promise<BlogPostDTO[]> {
    const supabase = await createClient();
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .eq('published', true)
      .eq('organization_id', MY_ORG_ID)
      .order('published_at', { ascending: false });

    if (!posts || posts.length === 0) return [];

    const slugs = posts.map(p => p.slug);
    const { data: reactions } = await supabase
      .from('post_reactions')
      .select('post_slug')
      .in('post_slug', slugs);

    const reactionCounts = new Map<string, number>();
    reactions?.forEach(r => {
      reactionCounts.set(r.post_slug, (reactionCounts.get(r.post_slug) || 0) + 1);
    });

    return posts.map(row => ({
      ...this.mapToDTO(row),
      totalReactions: reactionCounts.get(row.slug) || 0
    }));
  }

  // --- ADMIN METHODS ---

  async getAllPosts(): Promise<BlogPostDTO[]> {
    const supabase = createAdminClient();
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

    // ✅ SOLUCIÓ: Utilitzem el tipus 'PostUpdate' en lloc de 'any'
    const updateData: PostUpdate = {}; 

    // Mapeig segur (Typescript verificarà que els camps existeixen a la DB)
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.content !== undefined) updateData.content_mdx = data.content; // Mapeig DTO -> DB
    if (data.coverImage !== undefined) updateData.cover_image = data.coverImage;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.reviewed !== undefined) updateData.reviewed = data.reviewed;

    // Lògica d'estat
    if (data.published !== undefined) {
        updateData.published = data.published;
        updateData.status = data.published ? 'published' : 'draft';
        
        // Si publiquem, actualitzem data. Si despubliquem, potser volem mantenir l'antiga o null.
        // Aquí diem: si passa a published, posem data actual o la que vingui.
        if (data.published) {
            updateData.published_at = data.date || new Date().toISOString();
        }
    } else if (data.date) {
        // Si només canviem la data manualment
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
      .select('*')
      .eq('slug', slug)
      .eq('organization_id', MY_ORG_ID)
      .single();

    if (error || !data) return null;
    return this.mapToDTO(data);
  }

  // ... (Mètodes de reaccions es mantenen igual) ...
  async getPostReactions(slug: string): Promise<Record<string, number>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('post_reactions').select('reaction_type').eq('post_slug', slug);
    if (error) return {};
    const counts: Record<string, number> = {};
    data.forEach((row) => { counts[row.reaction_type] = (counts[row.reaction_type] || 0) + 1; });
    return counts;
  }

  async getUserReactions(slug: string, visitorId: string): Promise<string[]> {
    const supabase = await createClient();
    const { data } = await supabase.from('post_reactions').select('reaction_type').eq('post_slug', slug).eq('visitor_id', visitorId);
    return data?.map(r => r.reaction_type) || [];
  }

  async toggleReaction(slug: string, reaction: string, visitorId: string) {
    const supabase = createAdminClient();
    const { data: post } = await supabase.from('posts').select('slug').eq('slug', slug).eq('organization_id', MY_ORG_ID).single();
    if(!post) throw new Error("Post not found");

    const { data: existing } = await supabase.from('post_reactions').select('id').eq('post_slug', slug).eq('reaction_type', reaction).eq('visitor_id', visitorId).maybeSingle();

    if (existing) {
      await supabase.from('post_reactions').delete().eq('id', existing.id);
      return 'removed';
    } else {
      await supabase.from('post_reactions').insert({ post_slug: slug, reaction_type: reaction, visitor_id: visitorId });
      return 'added';
    }
  }
}