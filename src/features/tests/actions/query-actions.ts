/**
 * @file src/features/tests/actions/query-actions.ts
 * @updated 2026-05-10
 * @summary Queries de lectura per vistes de tests (admin i dashboard).
 * @scope Lectura de dades via repositori per evitar accés DB directe a la UI.
 */
'use server';

import { requireAdmin } from '@/lib/auth/admin-guard';
import { getSessionUser } from '@/actions/session-user';
import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';

export type AdminCampaignView = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  projects: { name: string } | null;
  stats: {
    total_tasks: number;
    total_results: number;
  };
};

const repo = new SupabaseTestRepository();

export async function getAdminCampaignsView() {
  await requireAdmin();
  return (await repo.getAllCampaignsForAdmin()) as unknown as AdminCampaignView[];
}

export async function getAdminCampaignDetailView(campaignId: string) {
  await requireAdmin();
  const ctx = await repo.getCampaignWithContext(campaignId, 'admin');
  if (!ctx.campaign) return null;

  const organizationId = await repo.getProjectOrganizationId(ctx.campaign.projectId);
  if (!organizationId) return { integrityError: true } as const;

  const [assigned, available, analyticsData] = await Promise.all([
    repo.getAssignedTesters(campaignId),
    repo.getProjectMembersForTest(campaignId, ctx.campaign.projectId, organizationId),
    repo.getCampaignResults(campaignId),
  ]);

  return {
    ctx,
    assigned,
    available,
    analyticsData,
  };
}

export async function getUserCampaignRunnerView(campaignId: string) {
  const session = await getSessionUser();
  const user = session.user;
  if (!user) return null;

  const ctx = await repo.getCampaignWithContext(campaignId, user.id);
  if (!ctx.campaign) return null;

  return {
    userId: user.id,
    ctx,
  };
}
