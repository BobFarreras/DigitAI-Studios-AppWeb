/**
 * @file src/features/learning/ui/LearningPath.tsx
 * @updated 2026-05-16
 * @summary Mobile-first learning module path.
 * @scope Presentational path; no unlock business logic.
 */
import { CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import type { LearningModuleSummary } from '@/services/learning/learning-dashboard-service';

type Props = {
  modules: LearningModuleSummary[];
};

export function LearningPath({ modules }: Props) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950 md:p-6">
      <div className="mb-5">
        <p className="text-sm font-bold uppercase text-emerald-600">Mapa</p>
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">El teu cami</h2>
      </div>
      <div className="space-y-4">
        {modules.map((module, index) => (
          <ModuleNode key={module.slug} module={module} index={index} />
        ))}
      </div>
    </section>
  );
}

function ModuleNode({ module, index }: { module: LearningModuleSummary; index: number }) {
  const isLocked = module.status === 'locked';
  const Icon = isLocked ? Lock : module.progress >= 100 ? CheckCircle2 : PlayCircle;

  return (
    <article className="grid grid-cols-[52px_1fr] gap-3">
      <div className="flex flex-col items-center">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-black text-white shadow-[0_5px_0_rgba(15,23,42,0.16)] ${isLocked ? 'bg-slate-300' : 'bg-emerald-500'}`}>
          <Icon className="h-6 w-6" />
        </div>
        {index < 2 ? <div className="mt-2 h-10 w-1 rounded-full bg-slate-200 dark:bg-white/10" /> : null}
      </div>
      <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-black text-slate-950 dark:text-white">{module.title}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">{module.subtitle}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">
            {module.lessonsDone}/{module.lessonsTotal}
          </span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${module.progress}%` }} />
        </div>
      </div>
    </article>
  );
}
