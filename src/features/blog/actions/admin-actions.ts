/**
 * @file src/features/blog/actions/admin-actions.ts
 * @updated 2026-05-08
 * @summary Feature module: src/features/blog/actions/admin-actions.ts
 * @scope UI o logica de feature encapsulada dins del domini corresponent.
 */
'use server';

import { postService } from '@/services/container';
import { requireAdmin } from '@/lib/auth/admin-guard';
import { revalidatePath } from 'next/cache';


// 👇 1. Definim el tipus de retorn
export type ActionState = {
  success: boolean;
  message: string;
};

export async function togglePostStatusAction(slug: string, currentStatus: boolean): Promise<ActionState> {
  await requireAdmin(); // 🛡️ Seguretat
  
  try {
    await postService.updatePost(slug, {
      published: !currentStatus
    });
    revalidatePath('/admin/blog');
    return { success: true, message: 'Estat actualitzat correctament.' };
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Error actualitzant l\'estat.' };
  }
}

export async function deletePostAction(slug: string): Promise<ActionState> {
  await requireAdmin();
  
  try {
    await postService.deletePost(slug);
    revalidatePath('/admin/blog');
    return { success: true, message: 'Post eliminat.' };
  } catch (e) {
    console.error(e);
    return { success: false, message: 'Error eliminant el post.' };
  }
}

// 👇 2. Tipem el prevState correctament en lloc de 'any'
export async function updatePostDetailsAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  // 1. Logs inicials
  console.log("🚀 [Server Action] updatePostDetailsAction INICIAT");
  
  try {
    await requireAdmin();
    console.log("✅ [Server Action] Admin verificat");

    // 2. Extracció de dades
    const slug = formData.get('slug') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const content = formData.get('content') as string;
    const reviewed = formData.get('reviewed') === 'on';

    // 3. Log de dades rebudes (Important per debug)
    console.log("📦 [Server Action] Dades rebudes:", {
        slug,
        title,
        descriptionLength: description?.length,
        contentLength: content?.length, // Veurem si arriba text o està buit
        contentPreview: content?.substring(0, 20) + '...',
        reviewed,
        date
    });

    if (!slug) {
        console.error("❌ [Server Action] Error: Falta l'slug");
        return { success: false, message: "Error: No s'ha trobat l'identificador del post." };
    }

    // 4. Crida al servei
    console.log("🔄 [Server Action] Cridant a postService.updatePost...");
    await postService.updatePost(slug, {
      title,
      description,
      content, 
      reviewed,
      date: date ? new Date(date).toISOString() : undefined,
    });
    console.log("✅ [Server Action] postService.updatePost FINALITZAT sense errors");

    // 5. Revalidació
    revalidatePath('/admin/blog');
    revalidatePath(`/admin/blog/${slug}`);
    revalidatePath(`/admin/blog/${slug}/edit`); // Important revalidar la pròpia pàgina
    
    // ❌ HEM TRET EL REDIRECT PERQUÈ ET QUEDIS AQUÍ
    
    return { success: true, message: 'Canvis guardats correctament.' };

  } catch (e) {
    console.error("💥 [Server Action] EXCEPCIÓ CAPTURADA:", e);
    // Si l'error fos un redirect, el deixem passar, però com l'hem tret, això serà un error real.
    if ((e as Error).message === 'NEXT_REDIRECT') throw e;
    
    return { success: false, message: `Error guardant: ${(e as Error).message}` };
  }
}
