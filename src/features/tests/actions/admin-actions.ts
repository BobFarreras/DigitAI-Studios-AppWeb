'use server';

import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { requireAdmin } from '@/lib/auth/admin-guard'; // La teva funció de seguretat
import { revalidatePath } from 'next/cache';

import { redirect } from 'next/navigation';
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