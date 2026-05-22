/**
 * @file src/features/learning/ui/LearningModulePath.tsx
 * @updated 2026-05-22
 * @summary Metro-map style visual path with 3 parallel branches for learning modules.
 * @scope Presentational; renders parallel vertical paths for each branch.
 */
'use client';

import type { LearningModuleTreeNode } from '@/services/learning/learning-module-tree-service';
import { BranchColumn } from './BranchColumn';

const BRANCH_COLORS = ['#1cb0f6', '#58cc02', '#ff9600'];

type Props = {
  tree: LearningModuleTreeNode[];
  trackTitle: string;
  trackColor?: string;
};

export function LearningModulePath({ tree, trackTitle }: Props) {
  return (
    <section className="mx-auto min-h-screen max-w-5xl bg-white pb-24 text-[#3c3c3c]">
      <div className="sticky top-[58px] z-10 mx-4 rounded-xl bg-[#1f1f1f] p-4 text-white shadow-lg md:top-0 md:mx-0">
        <p className="text-xs font-black uppercase tracking-wider text-[#afafaf]">
          Track de formació
        </p>
        <h1 className="mt-1 text-2xl font-black">{trackTitle}</h1>
        <p className="mt-1 text-sm text-[#afafaf]">
          Tria una branca per començar. Pots explorar-les en qualsevol ordre.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-8">
        {tree.map((branch, branchIndex) => (
          <BranchColumn
            key={branch.id}
            branch={branch}
            branchIndex={branchIndex}
            color={BRANCH_COLORS[branchIndex % BRANCH_COLORS.length]}
          />
        ))}
      </div>
    </section>
  );
}
