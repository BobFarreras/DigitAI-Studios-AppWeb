'use server';

import { postService } from '@/services/container';
import { requireAdmin } from '@/lib/auth/admin-guard';
import { revalidatePath } from 'next/cache';
import { redirect } from '@/routing';
import { getLocale } from 'next-intl/server';

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
  await requireAdmin();
  const locale = await getLocale();

  const slug = formData.get('slug') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const date = formData.get('date') as string;
  
  try {
    await postService.updatePost(slug, {
      title,
      description,
      date: date ? new Date(date).toISOString() : undefined,
    });
    
    revalidatePath('/admin/blog');
    redirect({ href: '/admin/blog', locale });
    // El redirect llença un error intern de Next.js, així que aquesta línia tècnicament no s'executa si redirigeix,
    // però TS la necessita pel tipatge.
    return { success: true, message: 'Post guardat.' };
  } catch (e) {
    // Si l'error és un redirect, l'hem de deixar passar
    if ((e as Error).message === 'NEXT_REDIRECT') {
        throw e;
    }
    console.error(e);
    return { success: false, message: 'Error guardant els canvis.' };
  }
}