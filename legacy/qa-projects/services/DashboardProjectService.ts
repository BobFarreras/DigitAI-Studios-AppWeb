import { DashboardProjectRepository } from '@/repositories/supabase/DashboardProjectRepository';
import { GamificationService } from '@/services/GamificationService';
import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';

export class DashboardProjectService {
  constructor(private readonly projectRepo: DashboardProjectRepository) {}

  async getProjectsForDashboard(userId: string) {
    const memberProjectIds = await this.projectRepo.getMemberProjectIds(userId);
    return this.projectRepo.getProjectsForUser(userId, memberProjectIds);
  }

  async getProjectDetailContext(userId: string, projectId: string) {
    const [project, stats, missions] = await Promise.all([
      this.projectRepo.getProjectDetail(projectId),
      new GamificationService().getUserStats(userId),
      new SupabaseTestRepository().getActiveMissionsForUser(userId, projectId),
    ]);

    return { project, stats, missions };
  }
}
