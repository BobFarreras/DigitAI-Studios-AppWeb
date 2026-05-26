/**
 * @file src/services/user-settings-service.ts
 * @updated 2026-05-20
 * @summary Service for user preferences including locale.
 * @scope User settings orchestration only; repository is injected.
 */
import type { IUserSettingsRepository } from '@/repositories/interfaces/IUserSettingsRepository';

export class UserSettingsService {
  constructor(private repository: IUserSettingsRepository) {}

  async getUserLocale(userId: string): Promise<string> {
    return this.repository.getLocale(userId);
  }
}