/**
 * @file src/services/learning/learning-module-tree-service.ts
 * @updated 2026-05-22
 * @summary Build hierarchical module trees for visual learning path maps.
 * @scope Pure tree construction from flat module lists; no repository or UI deps.
 */

import type {
  LearningLessonNode,
  LearningModuleRecord,
} from '@/repositories/interfaces/ILearningRepository';

export type LearningModuleTreeNode = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string;
  orderIndex: number;
  status: 'locked' | 'active' | 'completed';
  lessons: LearningLessonNode[];
  children: LearningModuleTreeNode[];
  href: string;
  isLeaf: boolean;
};

export type BranchUnlockMode = 'free' | 'sequential';

export function buildModuleTree(
  modules: LearningModuleRecord[],
  trackSlug: string,
  completedModuleIds: Set<string> = new Set(),
  activeModuleId?: string
): LearningModuleTreeNode[] {
  const moduleMap = new Map<string, LearningModuleTreeNode>();

  // First pass: create nodes with raw status
  for (const mod of modules) {
    const isLeaf = mod.lessons.length > 0;
    const rawStatus = resolveModuleStatus(mod, activeModuleId, completedModuleIds);
    moduleMap.set(mod.id, {
      id: mod.id,
      slug: mod.slug,
      title: mod.title,
      description: mod.description,
      level: mod.level,
      orderIndex: mod.orderIndex,
      status: rawStatus,
      lessons: mod.lessons,
      children: [],
      href: isLeaf
        ? `/dashboard/learn/${trackSlug}/${mod.lessons[0]?.slug ?? mod.slug}`
        : `/dashboard/learn/${trackSlug}/${mod.slug}`,
      isLeaf,
    });
  }

  // Second pass: link children to parents
  const roots: LearningModuleTreeNode[] = [];
  for (const mod of modules) {
    const node = moduleMap.get(mod.id);
    if (!node) continue;

    if (mod.parentModuleId) {
      const parent = moduleMap.get(mod.parentModuleId);
      if (parent) {
        parent.children.push(node);
        parent.isLeaf = false;
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  // Sort roots and children by orderIndex
  roots.sort((a, b) => a.orderIndex - b.orderIndex);
  for (const node of moduleMap.values()) {
    node.children.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  // Third pass: enforce sequential unlock within each branch
  // Roots (main branches) are always active
  for (const root of roots) {
    applySequentialUnlock(root, completedModuleIds);
  }

  return roots;
}

function applySequentialUnlock(
  node: LearningModuleTreeNode,
  completedModuleIds: Set<string>
) {
  // Branches (roots) are always accessible
  if (node.parentModuleId === null) {
    if (node.status === 'locked') node.status = 'active';
  }

  // Within a branch, children unlock sequentially
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
    // Recursively apply to sub-children
    applySequentialUnlock(child, completedModuleIds);
  }
}

function resolveModuleStatus(
  mod: LearningModuleRecord,
  activeModuleId?: string,
  completedModuleIds?: Set<string>
): LearningModuleTreeNode['status'] {
  if (activeModuleId === mod.id) return 'active';
  if (completedModuleIds?.has(mod.id)) return 'completed';
  // In dev/testing, default everything to active (no lock)
  // In production, this returns 'locked' and applySequentialUnlock handles it
  return process.env.NODE_ENV === 'production' ? 'locked' : 'active';
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
