'use server';
/**
 * @file src/actions/admin/project-page.ts
 * @updated 2026-05-08
 * @summary Carrega el context complet de la pàgina admin de detall de projecte.
 * @scope Orquestracio de repositoris per projecte, campanyes i equip.
 */

import { SupabaseTestRepository } from '@/repositories/supabase/SupabaseTestRepository';
import { SupabaseProjectRepository, ProjectMember } from '@/repositories/supabase/SupabaseProjectRepository';
import { getAdminProjectDetails } from '@/actions/project-details';

export type ProjectCandidate = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
};

type ProjectPageDataResult =
  | {
      success: true;
      project: NonNullable<Awaited<ReturnType<typeof getAdminProjectDetails>>['project']>;
      campaigns: Awaited<ReturnType<SupabaseTestRepository['getCampaignsByProject']>>;
      members: ProjectMember[];
      candidates: ProjectCandidate[];
      cleanRepoName: string;
    }
  | { success: false; error: 'PROJECT_NOT_FOUND' };

function getCleanRepoName(repositoryUrl: string | null, projectName: string) {
  if (repositoryUrl) {
    const parts = repositoryUrl.split('/');
    const fromUrl = parts.filter(Boolean).pop() || '';
    if (fromUrl) return fromUrl;
  }
  return projectName || '';
}

export async function getAdminProjectPageData(projectId: string): Promise<ProjectPageDataResult> {
  const testRepo = new SupabaseTestRepository();
  const projectRepo = new SupabaseProjectRepository();

  const [projectResult, campaigns] = await Promise.all([
    getAdminProjectDetails(projectId),
    testRepo.getCampaignsByProject(projectId),
  ]);

  const project = projectResult.project;
  if (!project) return { success: false, error: 'PROJECT_NOT_FOUND' };

  let members: ProjectMember[] = [];
  let candidates: ProjectCandidate[] = [];
  if (project.organization_id) {
    const [fetchedMembers, fetchedCandidates] = await Promise.all([
      projectRepo.getMembers(projectId),
      projectRepo.getAvailableCandidates(projectId, project.organization_id),
    ]);
    members = fetchedMembers;
    candidates = fetchedCandidates as ProjectCandidate[];
  }

  return {
    success: true,
    project,
    campaigns,
    members,
    candidates,
    cleanRepoName: getCleanRepoName(project.repository_url, project.name),
  };
}
