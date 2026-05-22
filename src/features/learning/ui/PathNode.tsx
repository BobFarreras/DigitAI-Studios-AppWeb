/**
 * @file src/features/learning/ui/PathNode.tsx
 * @updated 2026-05-22
 * @summary Individual learning path node with status-based styling.
 * @scope Presentational; renders one clickable node in the learning path.
 */
'use client';

import { motion } from 'framer-motion';
import { Check, Lock, Star } from 'lucide-react';
import { Link } from '@/routing';
import type { LearningModuleTreeNode } from '@/services/learning/learning-module-tree-service';
import { getLevelColor } from './learning-path-utils';

type Props = {
  node: LearningModuleTreeNode;
  index: number;
  color: string;
};

export function PathNode({ node, index, color }: Props) {
  const isLocked = node.status === 'locked';
  const isCompleted = node.status === 'completed';
  const isLeaf = node.isLeaf;

  const nodeSize = isLeaf ? 'h-14 w-14' : 'h-12 w-12';
  const nodeColors = isLocked
    ? 'bg-[#e5e5e5] text-[#afafaf]'
    : isCompleted
      ? 'text-white'
      : 'text-white';

  const bgStyle = isLocked ? {} : { backgroundColor: isCompleted ? '#58cc02' : color };
  const Icon = isCompleted ? Check : isLocked ? Lock : Star;

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
      className="relative z-10 flex flex-col items-center"
    >
      <div
        className={`flex ${nodeSize} items-center justify-center rounded-full border-4 border-white shadow-[0_4px_0_#afafaf] ${nodeColors}`}
        style={bgStyle}
      >
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-2 max-w-32 text-center text-xs font-black leading-4 text-[#3c3c3c]">
        {node.title}
      </p>
      {node.level !== 'basic' ? (
        <span
          className="mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: getLevelColor(node.level) }}
        >
          {node.level}
        </span>
      ) : null}
    </motion.div>
  );

  if (isLocked || !isLeaf) return content;

  return (
    <Link href={node.href} className="focus:outline-none focus:ring-2 focus:ring-[#58cc02]">
      {content}
    </Link>
  );
}
