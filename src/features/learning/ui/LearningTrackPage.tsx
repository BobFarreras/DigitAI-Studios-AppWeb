/**
 * @file src/features/learning/ui/LearningTrackPage.tsx
 * @updated 2026-05-16
 * @summary App-style page for one learning track.
 * @scope Presentational composition for a selected track path.
 */
import { ArrowLeft, Lock } from 'lucide-react';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { LearningAppTopBar } from './LearningAppTopBar';
import { LearningTrackMap } from './LearningTrackMap';
import type {
  LearningDashboardData,
  LearningTrackSummary,
} from '@/services/learning/learning-dashboard-service';

type Props = {
  data: LearningDashboardData;
  track: LearningTrackSummary;
};

export function LearningTrackPage({ data, track }: Props) {
  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-white text-[#3c3c3c] dark:bg-slate-950">
      <LearningAppTopBar data={data} />
      <Button asChild variant="ghost" className="mb-4 rounded-xl font-black text-[#1cb0f6]">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Rutes
        </Link>
      </Button>
      {track.status === 'locked' ? <LockedTrack track={track} /> : <LearningTrackMap track={track} />}
    </div>
  );
}

function LockedTrack({ track }: { track: LearningTrackSummary }) {
  return (
    <section className="mx-auto mt-10 max-w-md text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#e5e5e5] text-[#777777] shadow-[0_8px_0_#afafaf]">
        <Lock className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-3xl font-black text-[#3c3c3c] dark:text-white">{track.title}</h1>
      <p className="mt-3 text-base font-bold leading-6 text-[#777777]">
        Completa la ruta anterior per desbloquejar aquest cami.
      </p>
    </section>
  );
}
