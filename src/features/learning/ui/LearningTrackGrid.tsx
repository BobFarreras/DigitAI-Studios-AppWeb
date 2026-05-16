/**
 * @file src/features/learning/ui/LearningTrackGrid.tsx
 * @updated 2026-05-16
 * @summary Dashboard grid of learning tracks with unlock state.
 * @scope Presentational track navigation; no progression business rules.
 */
import { Bot, BrainCircuit, Code2, Cpu, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from '@/routing';
import type { LearningTrackSummary } from '@/services/learning/learning-dashboard-service';

type Props = {
  tracks: LearningTrackSummary[];
};

const icons = {
  sparkles: Sparkles,
  cpu: Cpu,
  code: Code2,
  bot: Bot,
  workflow: BrainCircuit,
  shield: ShieldCheck,
  book: Sparkles,
};

export function LearningTrackGrid({ tracks }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-black uppercase text-[#58cc02]">Rutes formatives</p>
        <h2 className="text-2xl font-black text-[#3c3c3c] dark:text-white">Tria el teu cami</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </section>
  );
}

function TrackCard({ track }: { track: LearningTrackSummary }) {
  const Icon = icons[track.icon as keyof typeof icons] ?? Sparkles;
  const isLocked = track.status === 'locked';
  const content = (
    <article className="h-full rounded-xl border-2 border-[#e5e5e5] bg-white p-5 transition hover:-translate-y-1 dark:border-white/10 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#d7ffb8] text-[#58cc02]">
          {isLocked ? <Lock className="h-7 w-7" /> : <Icon className="h-7 w-7" />}
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-500 dark:bg-white/10">
          {track.lessonsDone}/{track.lessonsTotal}
        </span>
      </div>
      <h3 className="mt-4 text-xl font-black text-[#3c3c3c] dark:text-white">{track.title}</h3>
      <p className="mt-2 min-h-10 text-sm font-bold leading-5 text-[#777777]">{track.description}</p>
      <div className="mt-5 h-4 overflow-hidden rounded-full bg-[#e5e5e5]">
        <div className="h-full rounded-full bg-[#58cc02]" style={{ width: `${track.progress}%` }} />
      </div>
    </article>
  );

  if (isLocked) return <div className="opacity-60">{content}</div>;

  return (
    <Link href={track.href} className="block focus:outline-none focus:ring-2 focus:ring-[#58cc02]">
      {content}
    </Link>
  );
}
