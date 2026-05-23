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
import { ProgressPizza } from './ProgressPizza';

const RECENTLY_COMPLETED_KEY = 'recently_completed_node';

type Props = {
  node: LearningModuleTreeNode;
  index: number;
  color: string;
};

export function PathNode({ node, index, color }: Props) {
  const isLocked = node.status === 'locked';
  const isCompleted = node.status === 'completed';
  const isActive = node.status === 'active';
  const isLeaf = node.isLeaf;
  const hasProgress = node.totalLessonCount > 0 && isLeaf;

  // Check if this node was just completed (for animation)
  const recentlyCompleted = typeof window !== 'undefined'
    ? sessionStorage.getItem(RECENTLY_COMPLETED_KEY) === node.slug
    : false;

  const nodeSize = isLeaf ? 'h-16 w-16' : 'h-14 w-14';
  const nodeColors = isLocked
    ? 'bg-[#e5e5e5] text-[#afafaf]'
    : 'text-white';

  const bgStyle = isLocked ? {} : { backgroundColor: isCompleted ? '#58cc02' : color };
  const Icon = isCompleted ? Check : isLocked ? Lock : Star;

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={recentlyCompleted ? { scale: [1, 1.25] } : { opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
      className="relative z-10 flex flex-col items-center"
    >
      <div className="relative flex items-center justify-center" style={{ width: 84, height: 84 }}>
        {/* Progress donut — full size of container */}
        {hasProgress && isActive && (
          <div className="absolute inset-0">
            <ProgressPizza
              total={node.totalLessonCount}
              completed={node.completedLessonCount}
              size={84}
            />
          </div>
        )}

        {/* Node circle centered on top */}
        <div
          className={`relative z-10 flex ${nodeSize} items-center justify-center rounded-full border-4 border-white shadow-[0_4px_0_#afafaf] ${nodeColors}`}
          style={bgStyle}
        >
          <Icon className="h-6 w-6" />
        </div>
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
      {hasProgress && isActive ? (
        <span className="mt-0.5 text-[10px] font-bold text-[#58cc02]">
          {node.completedLessonCount}/{node.totalLessonCount}
        </span>
      ) : null}
    </motion.div>
  );

  if (isLocked || !isLeaf) return content;

  return (
    <Link 
      href={node.href} 
      className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#58cc02]"
    >
      <div className="transition-transform duration-200 group-hover:scale-110">
        {content}
      </div>
    </Link>
  );
}
