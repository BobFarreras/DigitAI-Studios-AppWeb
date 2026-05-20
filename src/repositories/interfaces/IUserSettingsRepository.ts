/**
 * @file src/repositories/interfaces/IUserSettingsRepository.ts
 * @updated 2026-05-20
 * @summary Repository contract for user settings including locale.
 * @scope User preferences and settings retrieval only.
 */
export interface IUserSettingsRepository {
  getLocale(userId: string): Promise<string>;
}

export type UserSettings = {
  locale: string;
};