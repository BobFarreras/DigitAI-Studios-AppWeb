/**
 * @file src/services/learning/learning-module-tree-utils.ts
 * @updated 2026-05-22
 * @summary Tree traversal and status resolution utilities for module trees.
 * @scope Pure helper functions for learning module trees.
 */
import type { LearningModuleRecord } from '@/repositories/interfaces/ILearningRepository';
import type { LearningModuleTreeNode } from './learning-module-tree-service';

export function applySequentialUnlock(
  node: LearningModuleTreeNode,
  completedModuleIds: Set<string>
) {
  if (node.parentModuleId === null && node.status === 'locked') {
    node.status = 'active';
  }

  let previousCompleted = true;
  for (const child of node.children) {
    if (child.status === 'completed') {
      previousCompleted = true;
    } else if (previousCompleted) {
      if (child.status === 'locked') child.status = 'active';
      previousCompleted = false;
    } else {
      child.status = 'locked';
    }
    applySequentialUnlock(child, completedModuleIds);
  }
}

export function resolveModuleStatus(
  mod: LearningModuleRecord,
  activeModuleId?: string,
  completedModuleIds?: Set<string>
): LearningModuleTreeNode['status'] {
  if (activeModuleId === mod.id) return 'active';
  if (completedModuleIds?.has(mod.id)) return 'completed';
  return 'locked';
}

export function flattenModuleTree(
  tree: LearningModuleTreeNode[],
  result: LearningModuleTreeNode[] = []
): LearningModuleTreeNode[] {
  for (const node of tree) {
    result.push(node);
    flattenModuleTree(node.children, result);
  }
  return result;
}

export function findModuleInTree(
  tree: LearningModuleTreeNode[],
  slug: string
): LearningModuleTreeNode | null {
  for (const node of tree) {
    if (node.slug === slug) return node;
    const found = findModuleInTree(node.children, slug);
    if (found) return found;
  }
  return null;
}
