/**
 * @file src/features/learning/ui/LearningTrackMap.tsx
 * @updated 2026-05-20
 * @summary Duolingo-inspired lesson map for one learning track.
 * @scope Presentational path with locked/active/completed lesson nodes.
 */
'use client';

import { motion } from 'framer-motion';
import { Check, Gift, Lock, Play, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/routing';
import type { LearningTrackSummary } from '@/services/learning/learning-dashboard-service';

type Props = {
  track: LearningTrackSummary;
};

export function LearningTrackMap({ track }: Props) {
  const t = useTranslations('Learning');

  return (
    <section className="mx-auto flex max-w-md flex-col items-center pb-24">
      <div className="sticky top-[58px] z-10 w-full rounded-xl bg-[#58cc02] p-4 text-white shadow-[0_6px_0_#3f8f01] md:top-0">
        <p className="text-xs font-black uppercase">{t('track_map_prefix')}{track.lessonsDone + 1}</p>
        <h1 className="text-2xl font-black">{track.title}</h1>
      </div>

      <div className="mt-8 flex w-full flex-col items-center gap-6">
        {track.lessons.map((lesson, index) => (
          <Node key={lesson.id} lesson={lesson} index={index} />
        ))}
        {track.reward ? <RewardNode reward={track.reward} /> : null}
      </div>
    </section>
  );
}

function Node({ lesson, index }: { lesson: LearningTrackSummary['lessons'][number]; index: number }) {
  const side = index % 2 === 0 ? '-translate-x-10' : 'translate-x-10';
  const locked = lesson.status === 'locked';
  const Icon = lesson.status === 'completed' ? Check : lesson.status === 'review' ? RotateCcw : locked ? Lock : Play;
  const node = (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 18 }}
      className={`flex flex-col items-center ${side}`}
    >
      <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 border-white text-white shadow-[0_8px_0_#3f8f01] ${locked ? 'bg-[#afafaf] shadow-[0_8px_0_#777777]' : 'bg-[#58cc02]'}`}>
        <Icon className="h-9 w-9" />
      </div>
      <p className="mt-3 max-w-36 text-center text-sm font-black leading-4 text-[#777777]">{lesson.title}</p>
    </motion.div>
  );

  if (locked) return node;

  return (
    <Link href={lesson.href} className="focus:outline-none focus:ring-2 focus:ring-[#58cc02]">
      {node}
    </Link>
  );
}

function RewardNode({ reward }: { reward: NonNullable<LearningTrackSummary['reward']> }) {
  const unlocked = reward.status === 'unlocked';
  return (
    <motion.div className="flex flex-col items-center">
      <motion.div
        initial={{ rotate: -4, scale: 0.94 }}
        animate={unlocked ? { rotate: [0, -4, 4, 0], scale: [1, 1.04, 1] } : { rotate: 0, scale: 1 }}
        transition={{ duration: 2.8, repeat: unlocked ? Infinity : 0, repeatDelay: 2 }}
        className={`flex h-20 w-20 items-center justify-center rounded-2xl text-amber-900 shadow-[0_8px_0_#d39a00] ${unlocked ? 'bg-[#ffc700]' : 'bg-[#e5e5e5] text-[#777777] shadow-[0_8px_0_#afafaf]'}`}
      >
        <Gift className="h-10 w-10" />
      </motion.div>
      <p className="mt-3 max-w-40 text-center text-sm font-black leading-4 text-[#777777]">{reward.label}</p>
      <p className="mt-1 max-w-44 text-center text-xs font-bold leading-4 text-[#afafaf]">{reward.detail}</p>
    </motion.div>
  );
}
