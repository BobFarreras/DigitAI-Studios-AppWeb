/**
 * @file src/features/learning/ui/LearningMapHome.tsx
 * @updated 2026-05-16
 * @summary Main app-style learning map screen.
 * @scope Presentational composition for /dashboard/learn.
 */
import { LearningAppTopBar } from './LearningAppTopBar';
import { LearningTrackMap } from './LearningTrackMap';
import type { LearningDashboardData } from '@/services/learning/learning-dashboard-service';
import { Link } from '@/routing';

type Props = {
  data: LearningDashboardData;
};

export function LearningMapHome({ data }: Props) {
  const activeTrack =
    data.tracks.find((track) => track.status === 'active' || track.status === 'review') ??
    data.tracks[0];

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-white text-[#3c3c3c] dark:bg-slate-950">
      <LearningAppTopBar data={data} />
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {data.tracks.map((track) => (
          <Link
            key={track.id}
            href={track.href}
            className="shrink-0 rounded-xl border-2 border-[#e5e5e5] px-3 py-2 text-xs font-black uppercase text-[#777777] hover:border-[#58cc02]"
          >
            {track.title}
          </Link>
        ))}
      </div>
      {activeTrack ? <LearningTrackMap track={activeTrack} /> : null}
    </div>
  );
}
