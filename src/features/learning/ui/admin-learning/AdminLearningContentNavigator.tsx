/**
 * @file src/features/learning/ui/admin-learning/AdminLearningContentNavigator.tsx
 * @updated 2026-05-19
 * @summary Route and module browser for admin learning content.
 * @scope Presentational content tree only.
 */
import { ChevronRight, CircleDot } from 'lucide-react';
import type { AdminLearningTrackRecord } from '@/services/learning/admin-learning-content-service';
import { AdminLearningLessonList } from './AdminLearningLessonList';

type Props = {
  tracks: AdminLearningTrackRecord[];
};

export function AdminLearningContentNavigator({ tracks }: Props) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-bold text-foreground">Estructura del curs</h2>
        <p className="mt-1 text-sm text-muted-foreground">Selecciona visualment el punt que es convertira en editor.</p>
      </div>
      <div className="divide-y divide-border">
        {tracks.map((track) => (
          <article key={track.id} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CircleDot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{track.title}</h3>
                  <p className="text-xs text-muted-foreground">{track.slug}</p>
                </div>
              </div>
              <Status active={track.active} />
            </div>
            <div className="mt-4 grid gap-3">
              {track.modules.map((module) => (
                <div key={module.id} className="rounded-lg border border-border bg-background/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-bold text-foreground">{module.title}</p>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">{module.lessons.length} llicons</p>
                  </div>
                  <AdminLearningLessonList lessons={module.lessons} />
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Status({ active }: { active: boolean }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-bold ${active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
      {active ? 'Actiu' : 'Inactiu'}
    </span>
  );
}
