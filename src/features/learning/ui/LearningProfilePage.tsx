/**
 * @file src/features/learning/ui/LearningProfilePage.tsx
 * @updated 2026-05-19
 * @summary Student profile screen with real learning progress metrics.
 * @scope Presentational profile composition only.
 */
import { ArrowRight, BookOpenCheck, Flame, Medal, Target, Trophy, type LucideIcon } from 'lucide-react';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import type { LearningProfileData } from '@/services/learning/learning-profile-service';

type Props = {
  data: LearningProfileData;
};

export function LearningProfilePage({ data }: Props) {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-5 pb-24 md:pb-8">
      <Hero data={data} />
      <Stats data={data} />
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <TrackProgress data={data} />
        <FocusPanel data={data} />
      </div>
    </section>
  );
}

function Hero({ data }: Props) {
  const progress = Math.round((data.currentLevelXp / data.nextLevelXp) * 100);
  return (
    <div className="rounded-[28px] border border-[#d7ffb8] bg-[#f0ffe5] p-5 dark:border-[#58cc02]/20 dark:bg-[#14230f] md:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-[#58cc02]">Perfil formatiu</p>
          <h1 className="mt-2 text-3xl font-black text-[#3c3c3c] dark:text-white">
            {data.userName}, nivell {data.level}
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-bold text-slate-600 dark:text-slate-300">
            Seguiment real del teu progres, rutes actives i punts forts dins la formacio.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-[0_6px_0_#bbf7d0] dark:bg-slate-950 dark:shadow-[0_6px_0_rgba(88,204,2,0.22)]">
          <p className="text-xs font-black uppercase text-slate-500">Proxim nivell</p>
          <p className="mt-1 text-2xl font-black text-[#3c3c3c] dark:text-white">
            {data.currentLevelXp}/{data.nextLevelXp} XP
          </p>
          <Bar value={progress} className="mt-3" />
        </div>
      </div>
    </div>
  );
}

function Stats({ data }: Props) {
  const stats = [
    { label: 'XP total', value: data.xpTotal, icon: Trophy, color: 'text-amber-500' },
    { label: 'Ratxa', value: `${data.streakDays}d`, icon: Flame, color: 'text-orange-500' },
    { label: 'Llicons', value: `${data.lessonsDone}/${data.lessonsTotal}`, icon: BookOpenCheck, color: 'text-[#58cc02]' },
    { label: 'Precisio', value: `${data.accuracy}%`, icon: Target, color: 'text-[#1cb0f6]' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950">
          <stat.icon className={`h-5 w-5 ${stat.color}`} />
          <p className="mt-3 text-2xl font-black text-[#3c3c3c] dark:text-white">{stat.value}</p>
          <p className="text-xs font-black uppercase text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function TrackProgress({ data }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
      <h2 className="text-xl font-black text-[#3c3c3c] dark:text-white">Progres per ruta</h2>
      <div className="mt-5 space-y-4">
        {data.tracks.map((track) => (
          <Link key={track.id} href={track.href} className="block rounded-xl border border-slate-100 p-4 transition hover:border-[#58cc02] dark:border-white/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-black text-[#3c3c3c] dark:text-white">{track.title}</p>
                <p className="text-xs font-bold uppercase text-slate-500">
                  {track.lessonsDone}/{track.lessonsTotal} llicons · {track.status}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-[#58cc02]" />
            </div>
            <Bar value={track.progress} className="mt-3" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function FocusPanel({ data }: Props) {
  return (
    <aside className="space-y-5">
      <Panel icon={Medal} title="Ruta forta" value={data.strongestTrack?.title ?? 'Encara pendent'} text={`${data.strongestTrack?.progress ?? 0}% completat`} />
      <Panel icon={Target} title="Objectiu diari" value={`${data.dailyGoalProgress}%`} text="Progres del repte d'avui" />
      <Panel icon={BookOpenCheck} title="Rutes actives" value={data.activeTracks.toString()} text={`${data.completedTracks} rutes completades`} />
      <Button asChild className="h-12 w-full rounded-xl bg-[#58cc02] font-black text-white shadow-[0_5px_0_#3f8f01] hover:bg-[#61df00]">
        <Link href={data.reviewLessons > 0 ? '/dashboard/review' : '/dashboard/learn'}>
          {data.reviewLessons > 0 ? `Repassar ${data.reviewLessons}` : 'Continuar aprenent'}
        </Link>
      </Button>
    </aside>
  );
}

function Panel({ icon: Icon, title, value, text }: { icon: LucideIcon; title: string; value: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
      <Icon className="h-5 w-5 text-[#1cb0f6]" />
      <p className="mt-3 text-xs font-black uppercase text-slate-500">{title}</p>
      <p className="mt-1 text-xl font-black text-[#3c3c3c] dark:text-white">{value}</p>
      <p className="mt-1 text-sm font-bold text-slate-500">{text}</p>
    </div>
  );
}

function Bar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-4 overflow-hidden rounded-full bg-[#e5e5e5] ${className}`}>
      <div className="h-full rounded-full bg-[#58cc02]" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}
