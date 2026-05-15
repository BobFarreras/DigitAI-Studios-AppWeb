/**
 * @file src/features/blog/ui/reaction-dock/types.ts
 * @updated 2026-05-09
 * @summary Tipus compartits del Reaction Dock.
 * @scope Contractes per reaccions i props de components.
 */

export type ReactionItem = {
  id: string;
  emoji: string;
  label: string;
};

export interface ReactionButtonProps {
  reaction: ReactionItem;
  count: number;
  isActive: boolean;
  onReact: (id: string) => void;
}
