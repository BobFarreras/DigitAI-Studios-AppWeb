'use server';

import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { requireAdmin } from '@/lib/auth/admin-guard'; // La teva funció de seguretat
import { revalidatePath } from 'next/cache';

const repo = new SupabaseTestRepository();

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