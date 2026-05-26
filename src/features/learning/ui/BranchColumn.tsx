/**
 * @file src/features/learning/ui/BranchColumn.tsx
 * @updated 2026-05-22
 * @summary Vertical branch column for the learning module metro map.
 * @scope Presentational; renders one vertical learning path branch.
 */
'use client';

import { motion } from 'framer-motion';
import type { LearningModuleTreeNode } from '@/services/learning/learning-module-tree-service';
import { PathNode } from './PathNode';
import { collectBranchNodes, darken } from './learning-path-utils';

type Props = {
  branch: LearningModuleTreeNode;
  branchIndex: number;
  color: string;
};

export function BranchColumn({ branch, branchIndex, color }: Props) {
  const nodes = collectBranchNodes(branch);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: branchIndex * 0.15 }}
        className="mb-6 w-full rounded-xl p-4 text-center text-white shadow-[0_6px_0_#3f8f01] min-h-[100px] flex flex-col items-center justify-center"
        style={{ backgroundColor: color, boxShadow: `0 6px 0 ${darken(color, 30)}` }}
      >
        <h2 className="text-lg font-black">{branch.title}</h2>
        {branch.description ? (
          <p className="mt-1 text-xs font-bold opacity-90">{branch.description}</p>
        ) : null}
      </motion.div>

      <div className="relative flex w-full flex-col items-center gap-4">
        <div
          className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2"
          style={{ backgroundColor: `${color}40` }}
        />

        {nodes.map((node, nodeIndex) => (
          <PathNode key={node.id} node={node} index={nodeIndex} color={color} />
        ))}
      </div>
    </div>
  );
}
