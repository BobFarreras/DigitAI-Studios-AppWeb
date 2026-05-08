'use server';

import { createClient } from '@/lib/supabase/server';
import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { GamificationService } from '@/services/GamificationService';

export async function getTesterDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, authRequired: true as const };
  }

  const repo = new SupabaseTestRepository();
  const gameService = new GamificationService();

  const [assignments, stats] = await Promise.all([
    repo.getMyAssignments(user.id),
    gameService.getUserStats(user.id),
  ]);

  return { success: true, assignments, stats };
}
