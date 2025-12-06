// fitxer: src/features/tests/actions/task-actions.ts

'use server';

import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { requireAdmin } from '@/lib/auth/admin-guard';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const repo = new SupabaseTestRepository();

// 1. Definim el tipus per a l'estat de l'acció
export type TaskActionState = {
  success: boolean;
  message: string;
};

// Validació Zod
const TaskSchema = z.object({
  campaignId: z.string().uuid(),
  title: z.string().min(3, "El títol és massa curt"),
  description: z.string().optional(),
});

// 2. Tipem 'prevState' correctament
export async function addTaskAction(prevState: TaskActionState, formData: FormData): Promise<TaskActionState> {
  await requireAdmin();

  const rawData = {
    campaignId: formData.get('campaignId'),
    title: formData.get('title'),
    description: formData.get('description'),
  };

  const validated = TaskSchema.safeParse(rawData);

  if (!validated.success) {
    // 3. CORRECCIÓ ZOD: Usem .issues[0] per assegurar el tipatge correcte
    return { success: false, message: validated.error.issues[0].message };
  }

  const { error } = await repo.createTask({
      campaignId: validated.data.campaignId as string,
      title: validated.data.title as string,
      description: validated.data.description as string,
      orderIndex: 999 
  });

  if (error) return { success: false, message: error.message };

  revalidatePath(`/admin/tests/${rawData.campaignId}`);
  return { success: true, message: 'Tasca afegida correctament' };
}

export async function deleteTaskAction(taskId: string, campaignId: string): Promise<TaskActionState> {
    await requireAdmin();
    const { error } = await repo.deleteTask(taskId);
    if(error) return { success: false, message: error.message };
    
    revalidatePath(`/admin/tests/${campaignId}`);
    return { success: true, message: 'Tasca eliminada' };
}