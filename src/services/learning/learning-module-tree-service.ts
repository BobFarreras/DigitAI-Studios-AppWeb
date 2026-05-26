/**
 * @file src/services/learning/learning-module-tree-service.ts
 * @updated 2026-05-22
 * @summary Build hierarchical module trees for visual learning path maps.
 * @scope Pure tree construction from flat module lists; no repository or UI deps.
 */

import type { LearningModuleRecord } from '@/repositories/interfaces/ILearningRepository';
import {
  applySequentialUnlock,
  resolveModuleStatus,
} from './learning-module-tree-utils';

export type LearningModuleTreeNode = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string;
  orderIndex: number;
  status: 'locked' | 'active' | 'completed';
  lessons: Array<{ id: string; slug: string; title: string; estimatedMinutes: number; status: string; href: string }>;
  children: LearningModuleTreeNode[];
  href: string;
  isLeaf: boolean;
  parentModuleId?: string | null;
  completedLessonCount: number;
  totalLessonCount: number;
};

export type BranchUnlockMode = 'free' | 'sequential';

export function buildModuleTree(
  modules: LearningModuleRecord[],
  trackSlug: string,
  completedLessonIds: Set<string> = new Set(),
  completedModuleIds: Set<string> = new Set(),
  activeModuleId?: string
): LearningModuleTreeNode[] {
  const moduleMap = new Map<string, LearningModuleTreeNode>();

  for (const mod of modules) {
    const isLeaf = mod.lessons.length > 0;
    const completedLessons = mod.lessons.filter((l) => completedLessonIds.has(l.id)).length;
    const totalLessons = mod.lessons.length;

    // Mark module as completed if all its lessons are done
    const actualCompleted = completedModuleIds.has(mod.id) || (totalLessons > 0 && completedLessons >= totalLessons);
    const rawStatus = actualCompleted ? 'completed' as const : resolveModuleStatus(mod, activeModuleId, completedModuleIds);

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
        ? `/dashboard/learn/${mod.slug}/${mod.lessons[0]?.slug ?? mod.slug}`
        : `/dashboard/learn/${mod.slug}`,
      isLeaf,
      parentModuleId: mod.parentModuleId,
      completedLessonCount: completedLessons,
      totalLessonCount: totalLessons,
    });
  }

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

  roots.sort((a, b) => a.orderIndex - b.orderIndex);
  for (const node of moduleMap.values()) {
    node.children.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  for (const root of roots) {
    applySequentialUnlock(root, completedModuleIds);
  }

  return roots;
}
