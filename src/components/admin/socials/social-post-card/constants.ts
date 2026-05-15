/**
 * @file src/components/admin/socials/social-post-card/constants.ts
 * @updated 2026-05-09
 * @summary Estils i temes visuals per plataforma social.
 * @scope Mapatge de tema i estats de UI per la targeta.
 */

export const PLATFORM_THEMES: Record<string, { border: string; bg: string; icon: string; text: string }> = {
  linkedin: { border: 'border-blue-700/20', bg: 'bg-blue-50/30 dark:bg-blue-900/10', text: 'text-blue-700 dark:text-blue-400', icon: '👔' },
  facebook: { border: 'border-blue-600/20', bg: 'bg-indigo-50/30 dark:bg-indigo-900/10', text: 'text-indigo-700 dark:text-indigo-400', icon: '📘' },
  instagram: { border: 'border-pink-500/20', bg: 'bg-pink-50/30 dark:bg-pink-900/10', text: 'text-pink-700 dark:text-pink-400', icon: '📸' },
};

export const STATUS_CONFIG: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-zinc-800 dark:text-zinc-400',
  approved: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
  published: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400',
  failed: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400',
};
