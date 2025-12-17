import { createClient, createAdminClient } from '@/lib/supabase/server';
import { IPostRepository } from '@/repositories/interfaces/IPostRepository';
import { BlogPostDTO } from '@/types/models';
import { Database } from '@/types/database.types';

// 1. Tipus base
type PostRow = Database['public']['Tables']['posts']['Row'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];

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

  // --- LECTURA PÚBLICA (WEB) ---
  // (Aquesta part no canvia, la deixo resumida)
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
    // Cast manual per satisfer el mapToDTO encara que no porti socials
    return this.mapToDTO({ ...data, social_posts: [] } as unknown as PostRowWithRelations);
  }

  async getAllPublishedPosts(): Promise<BlogPostDTO[]> {
    const supabase = await createClient();
    // ... (El teu codi existent de getAllPublishedPosts està bé)
    // Simplement recorda que aquí no estem fent join amb socials, així que al map:
    // return this.mapToDTO({ ...row, social_posts: [] } as unknown as PostRowWithRelations);
    // (O simplement ignora el camp si és opcional al DTO)

    // Per simplicitat, aquí tens el bloc sencer si vols assegurar:
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
      ...this.mapToDTO({ ...row, social_posts: [] } as unknown as PostRowWithRelations),
      totalReactions: reactionCounts.get(row.slug) || 0
    }));
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

  // ... (Reaccions igual)
  async getPostReactions(slug: string): Promise<Record<string, number>> {
    const supabase = await createClient();
    const { data } = await supabase.from('post_reactions').select('reaction_type').eq('post_slug', slug);
    const counts: Record<string, number> = {};
    data?.forEach(r => counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1);
    return counts;
  }

  async toggleReaction(slug: string, reaction: string, visitorId: string) {
    const supabase = createAdminClient();
    const { data: post } = await supabase.from('posts').select('id').eq('slug', slug).eq('organization_id', MY_ORG_ID).single();
    if (!post) throw new Error("Post not found");

    const { data: existing } = await supabase.from('post_reactions').select('id').eq('post_slug', slug).eq('reaction_type', reaction).eq('visitor_id', visitorId).maybeSingle();

    if (existing) {
      await supabase.from('post_reactions').delete().eq('id', existing.id);
      return 'removed';
    } else {
      await supabase.from('post_reactions').insert({ post_slug: slug, reaction_type: reaction, visitor_id: visitorId });
      return 'added';
    }
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