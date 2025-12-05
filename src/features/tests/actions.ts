'use server';

import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const repo = new SupabaseTestRepository();

export async function submitTestFeedback(taskId: string, status: 'pass' | 'fail' | 'blocked', comment: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { success: false, message: 'No autenticat' };

  const { error } = await repo.saveResult(user.id, taskId, status, comment);

  if (error) return { success: false, message: error.message };
  
  // Refresquem el dashboard per veure el canvi d'estat
  revalidatePath('/dashboard/projects/[id]', 'page'); 
  return { success: true };
}