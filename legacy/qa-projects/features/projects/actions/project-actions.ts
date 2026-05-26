/**
 * @file src/features/projects/actions/project-actions.ts
 * @updated 2026-05-08
 * @summary Feature module: src/features/projects/actions/project-actions.ts
 * @scope UI o logica de feature encapsulada dins del domini corresponent.
 */
'use server';

import { SupabaseProjectRepository } from '@/repositories/supabase/SupabaseProjectRepository';
import { requireAdmin } from '@/lib/auth/admin-guard';
import { revalidatePath } from 'next/cache';

const repo = new SupabaseProjectRepository();

export async function addProjectMemberAction(projectId: string, userId: string) {
    await requireAdmin();
    const { error } = await repo.addMember(projectId, userId);
    
    if (error) {
        // Codi 23505 és "Unique violation" (ja existeix)
        if (error.code === '23505') return { success: false, message: 'Usuari ja vinculat.' };
        return { success: false, message: error.message };
    }

    revalidatePath(`/admin/projects/${projectId}`);
    return { success: true, message: 'Membre afegit al projecte.' };
}

export async function removeProjectMemberAction(projectId: string, userId: string) {
    await requireAdmin();
    const { error } = await repo.removeMember(projectId, userId);
    
    if (error) return { success: false, message: error.message };

    revalidatePath(`/admin/projects/${projectId}`);
    return { success: true, message: 'Membre eliminat del projecte.' };
}
