/**
 * @file src/features/blog/ui/reaction-dock/constants.ts
 * @updated 2026-05-09
 * @summary Constants de reaccions disponibles.
 * @scope Cataleg de reaccions renderitzables al dock.
 */

import { ReactionItem } from './types';

export const REACTIONS: ReactionItem[] = [
  { id: 'like', emoji: '❤️', label: 'Love' },
  { id: 'mindblown', emoji: '🤯', label: 'Wow' },
  { id: 'rocket', emoji: '🚀', label: 'Boost' },
  { id: 'party', emoji: '🎉', label: 'Party' },
];
