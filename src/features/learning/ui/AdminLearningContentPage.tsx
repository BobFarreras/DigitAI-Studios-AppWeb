/**
 * @file src/features/learning/ui/AdminLearningContentPage.tsx
 * @updated 2026-05-19
 * @summary Admin learning content inventory and lesson preview.
 * @scope Presentational admin UI only; data comes from actions.
 */
import { BookOpenCheck, Eye, Layers3, ListChecks } from 'lucide-react';
import type { AdminLearningContentData } from '@/services/learning/admin-learning-content-service';

type Props = {
  data: AdminLearningContentData;
};

export function AdminLearningContentPage({ data }: Props) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Formacio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inventari de rutes, llicons i steps abans d'activar l'editor.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-4">
        <Metric label="Rutes" value={data.summary.tracks} icon={Layers3} />
        <Metric label="Moduls" value={data.summary.modules} icon={BookOpenCheck} />
        <Metric label="Llicons" value={data.summary.lessons} icon={Eye} />
        <Metric label="Steps" value={data.summary.steps} icon={ListChecks} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-border bg-card shadow-sm">
          {data.tracks.map((track) => (
            <div key={track.id} className="border-b border-border p-4 last:border-b-0">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold text-foreground">{track.title}</h2>
                <Status active={track.active} />
              </div>
              <div className="mt-3 space-y-3">
                {track.modules.map((module) => (
                  <div key={module.id} className="rounded-lg bg-muted/40 p-3">
                    <p className="text-sm font-semibold text-foreground">{module.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {module.lessons.length} llicons · {module.lessons.reduce((total, lesson) => total + lesson.steps.length, 0)} steps
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Preview lesson={data.previewLesson} />
      </section>
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Layers3 }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
    </div>
  );
}

function Status({ active }: { active: boolean }) {
  return <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{active ? 'Actiu' : 'Inactiu'}</span>;
}

function Preview({ lesson }: { lesson: AdminLearningContentData['previewLesson'] }) {
  if (!lesson) return <aside className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">Cap llico amb steps.</aside>;
  return (
    <aside className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-bold uppercase text-muted-foreground">Preview</p>
      <h2 className="mt-2 text-xl font-bold text-foreground">{lesson.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{lesson.estimatedMinutes} min · {lesson.xpReward} XP</p>
      <div className="mt-4 space-y-2">
        {lesson.steps.map((step) => (
          <div key={step.id} className="rounded-lg bg-muted/40 p-3">
            <p className="text-xs font-bold uppercase text-primary">{step.type}</p>
            <p className="mt-1 text-sm text-foreground">{step.prompt}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
