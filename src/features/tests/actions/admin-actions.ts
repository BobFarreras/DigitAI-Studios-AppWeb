'use server';

import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { requireAdmin } from '@/lib/auth/admin-guard'; // La teva funció de seguretat
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { postService } from '@/services/container'; // Soluciona "No se encuentra postService"
  
const repo = new SupabaseTestRepository();
// 1. Definim el tipus d'estat (State)
export type ActionState = {
  success: boolean;
  message: string;
};
export async function addTesterAction(campaignId: string, userId: string) {
  await requireAdmin(); // 🛡️ Seguretat crítica

  const { error } = await repo.assignTester(campaignId, userId);

  if (error) {
    // Codi d'error de Postgres per duplicats (si ja estava assignat)
    if (error.code === '23505') return { success: false, message: 'Aquest usuari ja està assignat.' };
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/tests/[id]', 'page');
  return { success: true, message: 'Tester assignat correctament.' };
}

export async function removeTesterAction(campaignId: string, userId: string) {
  await requireAdmin();

  const { error } = await repo.removeTester(campaignId, userId);
  if (error) return { success: false, message: error.message };

  revalidatePath('/admin/tests/[id]', 'page');
  return { success: true, message: 'Tester eliminat.' };
}


// 2. Apliquem el tipus a 'prevState' i al retorn
export async function createCampaignAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {

  await requireAdmin();

  const projectId = formData.get('projectId') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const instructions = formData.get('instructions') as string;

  if (!projectId || !title) {
    return { success: false, message: 'Falten camps obligatoris' };
  }

  try {
    const { data, error } = await repo.createCampaign({
      projectId, title, description, instructions
    });

    if (error) {
      return { success: false, message: error.message };
    }

    // Si tot va bé, redirigim (això interromp l'execució, és normal)
    redirect(`/admin/tests/${data.id}`);

  } catch (error) {
    // Si l'error és la redirecció de Next.js, la deixem passar
    if ((error as Error).message === 'NEXT_REDIRECT') {
      throw error;
    }
    return { success: false, message: 'Error creant la campanya' };
  }
}

export async function updatePostDetailsAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const slug = formData.get('slug') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const date = formData.get('date') as string;

  // ✅ RECUPEREM EL CONTINGUT (Això faltava o fallava)
  const content = formData.get('content') as string;

  // ✅ RECUPEREM EL CHECKBOX (Si està marcat envia 'on', si no null)
  const reviewed = formData.get('reviewed') === 'on';

  try {
    await postService.updatePost(slug, {
      title,
      description,
      content, // 👈 Passem el contingut
      reviewed, // 👈 Passem l'estat revisat
      date: date ? new Date(date).toISOString() : undefined,
    });

    revalidatePath('/admin/blog');

    // Opcional: Si vols que es quedi a la pàgina d'edició per seguir escrivint,
    // comenta la línia del redirect o fes un revalidatePath de la pàgina actual.
    // redirect({ href: '/admin/blog', locale }); 

    return { success: true, message: 'Canvis guardats correctament.' };
  } catch (e) {
    if ((e as Error).message === 'NEXT_REDIRECT') throw e;
    console.error(e);
    return { success: false, message: 'Error guardant els canvis.' };
  }
}
// ... imports existents

export async function updateCampaignAction(
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = formData.get('id') as string;
  if (!id) return { success: false, message: "Falta l'ID de la campanya" };

  // ✅ CORRECCIÓ: Definim el tipus exacte en lloc de 'any'
  // Això diu: "updates és un objecte on les claus són strings opcionals"
  const updates: {
    title?: string;
    description?: string;
    status?: string;
    instructions?: string;
  } = {};
  
  // Ara TypeScript està content perquè sap què esperar
  if (formData.has('title')) updates.title = formData.get('title') as string;
  if (formData.has('description')) updates.description = formData.get('description') as string;
  if (formData.has('status')) updates.status = formData.get('status') as string;
  if (formData.has('instructions')) updates.instructions = formData.get('instructions') as string;

  const { error } = await repo.updateCampaign(id, updates);

  if (error) return { success: false, message: error.message };

  revalidatePath(`/admin/tests/${id}`);
  return { success: true, message: 'Guardat correctament!' };
}