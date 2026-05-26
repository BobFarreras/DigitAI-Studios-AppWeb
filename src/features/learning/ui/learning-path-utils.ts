/**
 * @file src/features/learning/ui/learning-path-utils.ts
 * @updated 2026-05-22
 * @summary Shared utilities for the learning path visual components.
 * @scope Pure helper functions; no React or UI dependencies.
 */
import type { LearningModuleTreeNode } from '@/services/learning/learning-module-tree-service';

export function collectBranchNodes(
  branch: LearningModuleTreeNode,
  result: LearningModuleTreeNode[] = []
): LearningModuleTreeNode[] {
  result.push(branch);
  for (const child of branch.children) {
    collectBranchNodes(child, result);
  }
  return result;
}

export function getLevelColor(level: string): string {
  switch (level) {
    case 'initiation':
      return '#58cc02';
    case 'basic':
      return '#1cb0f6';
    case 'intermediate':
      return '#ff9600';
    case 'advanced':
      return '#ea2b2b';
    default:
      return '#afafaf';
  }
}

export function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max((num >> 16) - amount, 0);
  const g = Math.max(((num >> 8) & 0x00ff) - amount, 0);
  const b = Math.max((num & 0x0000ff) - amount, 0);
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}
