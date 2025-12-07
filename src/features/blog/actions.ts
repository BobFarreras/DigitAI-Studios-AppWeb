'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { postRepository } from '@/services/container';
export async function togglePostStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient();
  
  // 1. Verificar sessió (per seguretat)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autoritzat");

  // 2. Actualitzar estat
  // Si estava true -> false. Si estava false -> true.
  // També actualitzem 'status' (l'enum) per coherència.
  const newStatus = !currentStatus;
  const newStatusEnum = newStatus ? 'published' : 'published';

  const { error } = await supabase
    .from('posts')
    .update({ 
        published: newStatus,
        status: newStatusEnum,
        published_at: newStatus ? new Date().toISOString() : null // Guardem data si publiquem
    })
    .eq('id', id);

  if (error) {
    console.error("Error toggling post:", error);
    return { success: false, message: error.message };
  }

  // 3. Refrescar la pàgina perquè el botó canviï de color sol
  revalidatePath('/admin/blog');
  revalidatePath(`/admin/blog/[slug]`, 'page'); // Refresca totes les subrutes dinàmiques si cal
  
  return { success: true };
}

export async function toggleReactionAction(slug: string, reaction: string, visitorId: string) {
  try {
    if (!visitorId) return { success: false, message: "No visitor ID" };

    const result = await postRepository.toggleReaction(slug, reaction, visitorId);
    
    // Revalidem la pàgina del blog perquè es recalculin els totals al servidor si cal
    revalidatePath(`/blog/${slug}`);
    
    return { success: true, action: result };
  } catch (error) {
    console.error("Error reaction:", error);
    return { success: false };
  }
}