/**
 * @file src/features/learning/ui/LearningTrackPage.tsx
 * @updated 2026-05-22
 * @summary App-style page for one learning track with module hierarchy path.
 * @scope Presentational composition for a selected track module tree.
 */
import { ArrowLeft, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { LearningAppTopBar } from './LearningAppTopBar';
import { LearningModulePath } from './LearningModulePath';
import type { LearningDashboardData } from '@/services/learning/learning-dashboard-service';
import type { LearningModuleTreeNode } from '@/services/learning/learning-module-tree-service';

type Props = {
  data: LearningDashboardData;
  tree: LearningModuleTreeNode[];
  trackTitle: string;
  trackColor?: string;
  isLocked: boolean;
};

export function LearningTrackPage({ data, tree, trackTitle, trackColor, isLocked }: Props) {
  const t = useTranslations('Learning');

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-white text-[#3c3c3c] dark:bg-slate-950">
      <LearningAppTopBar data={data} />
      <Button asChild variant="ghost" className="mb-4 rounded-xl font-black text-[#1cb0f6]">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('track_page_tracks')}
        </Link>
      </Button>
      {isLocked ? (
        <LockedTrack title={trackTitle} />
      ) : (
        <LearningModulePath tree={tree} trackTitle={trackTitle} trackColor={trackColor} />
      )}
    </div>
  );
}

function LockedTrack({ title }: { title: string }) {
  const t = useTranslations('Learning');

  return (
    <section className="mx-auto mt-10 max-w-md text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#e5e5e5] text-[#777777] shadow-[0_8px_0_#afafaf]">
        <Lock className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-3xl font-black text-[#3c3c3c] dark:text-white">{title}</h1>
      <p className="mt-3 text-base font-bold leading-6 text-[#777777]">
        {t('track_page_blocked_desc')}
      </p>
    </section>
  );
}
