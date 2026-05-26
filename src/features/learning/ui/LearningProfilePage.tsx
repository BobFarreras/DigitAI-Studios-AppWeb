/**
 * @file src/features/learning/ui/LearningProfilePage.tsx
 * @updated 2026-05-20
 * @summary Student profile screen with real learning progress metrics.
 * @scope Presentational profile composition only.
 */
'use client';

import { ArrowRight, BookOpenCheck, Flame, Globe, Medal, Target, Trophy, type LucideIcon } from 'lucide-react';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';
import { updateUserLocale } from '@/actions/user-settings';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import type { LearningProfileData } from '@/services/learning/learning-profile-service';

type Props = {
  data: LearningProfileData;
};

export function LearningProfilePage({ data }: Props) {
  const t = useTranslations('Learning');
  const [pending, startTransition] = useTransition();

  function changeLocale(locale: string) {
    startTransition(async () => {
      await updateUserLocale({ locale: locale as 'ca' | 'es' | 'en' | 'it' });
      window.location.href = `/${locale}/dashboard/profile`;
    });
  }

  const progress = Math.round((data.currentLevelXp / data.nextLevelXp) * 100);

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-5 pb-24 md:pb-8">
      <div className="rounded-[28px] border border-[#d7ffb8] bg-[#f0ffe5] p-5 dark:border-[#58cc02]/20 dark:bg-[#14230f] md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-[#58cc02]">{t('perfilFormatiu')}</p>
            <h1 className="mt-2 text-3xl font-black text-[#3c3c3c] dark:text-white">
              {data.userName}, {t('level')} {data.level}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-bold text-slate-600 dark:text-slate-300">
              {t('progresPerRuta')}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-[0_6px_0_#bbf7d0] dark:bg-slate-950 dark:shadow-[0_6px_0_rgba(88,204,2,0.22)]">
            <p className="text-xs font-black uppercase text-slate-500">{t('proximNivel')}</p>
            <p className="mt-1 text-2xl font-black text-[#3c3c3c] dark:text-white">
              {data.currentLevelXp}/{data.nextLevelXp} XP
            </p>
            <div className="mt-3 h-4 overflow-hidden rounded-full bg-[#e5e5e5]">
              <div className="h-full rounded-full bg-[#58cc02]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={Trophy} value={data.xpTotal.toString()} label={t('xpTotal')} color="text-amber-500" />
        <StatCard icon={Flame} value={`${data.streakDays}d`} label={t('streak')} color="text-orange-500" />
        <StatCard icon={BookOpenCheck} value={`${data.lessonsDone}/${data.lessonsTotal}`} label={t('lessons')} color="text-[#58cc02]" />
        <StatCard icon={Target} value={`${data.accuracy}%`} label={t('accuracy')} color="text-[#1cb0f6]" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
          <h2 className="text-xl font-black text-[#3c3c3c] dark:text-white">{t('progresPerRuta')}</h2>
          <div className="mt-5 space-y-4">
            {data.tracks.map((track) => (
              <Link key={track.id} href={track.href} className="block rounded-xl border border-slate-100 p-4 transition hover:border-[#58cc02] dark:border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-[#3c3c3c] dark:text-white">{track.title}</p>
                    <p className="text-xs font-bold uppercase text-slate-500">
                      {track.lessonsDone}/{track.lessonsTotal} {t('lessons')} · {track.status === 'completed' ? t('completed') : track.status === 'active' ? t('active') : t('blocked')}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#58cc02]" />
                </div>
                <div className="mt-3 h-4 overflow-hidden rounded-full bg-[#e5e5e5]">
                  <div className="h-full rounded-full bg-[#58cc02]" style={{ width: `${Math.min(100, track.progress)}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <Panel icon={Medal} title={t('rutaForta')} value={data.strongestTrack?.title ?? t('encaraPendent')} text={`${data.strongestTrack?.progress ?? 0}% ${t('completat')}`} />
          <Panel icon={Target} title={t('objectiuDiari')} value={`${data.dailyGoalProgress}%`} text={t('rutesActives')} />
          <Panel icon={BookOpenCheck} title={t('rutesActives')} value={data.activeTracks.toString()} text={`${data.completedTracks} ${t('completed')}`} />
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-[#1cb0f6]" />
              <span className="text-xs font-black uppercase text-slate-500">{t('profile_language')}</span>
            </div>
            <div className="mt-3 flex gap-2">
              {(['ca', 'es', 'en', 'it'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLocale(lang)}
                  disabled={pending}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    data.locale === lang
                      ? 'bg-[#58cc02] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <Button asChild className="h-12 w-full rounded-xl bg-[#58cc02] font-black text-white shadow-[0_5px_0_#3f8f01] hover:bg-[#61df00]">
            <Link href={data.reviewLessons > 0 ? '/dashboard/review' : '/dashboard/learn'}>
              {data.reviewLessons > 0 ? t('reviewCount', { count: data.reviewLessons }) : t('continueLearning')}
            </Link>
          </Button>
        </aside>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: LucideIcon; value: string; label: string; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950">
      <Icon className={`h-5 w-5 ${color}`} />
      <p className="mt-3 text-2xl font-black text-[#3c3c3c] dark:text-white">{value}</p>
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
    </div>
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