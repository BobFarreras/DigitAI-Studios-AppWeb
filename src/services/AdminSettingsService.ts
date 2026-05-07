import { AdminSettingsRepository } from '@/repositories/supabase/AdminSettingsRepository';

export class AdminSettingsService {
  constructor(private readonly repository: AdminSettingsRepository) {}

  async getSocialConnectionsForUser(userId: string) {
    const organizationId = await this.repository.getOrganizationIdByUserId(userId);
    if (!organizationId) return [];
    return this.repository.getSocialConnectionsByOrganization(organizationId);
  }
}
