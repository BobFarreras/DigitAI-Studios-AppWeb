/**
 * @file src/features/learning/ui/admin-learning/AdminLearningContentNavigator.tsx
 * @updated 2026-05-19
 * @summary Route and module browser for admin learning content.
 * @scope Presentational content tree only.
 */
'use client';

import { ChevronRight, CircleDot } from 'lucide-react';
import type { AdminLearningTrackRecord } from '@/services/learning/admin-learning-content-service';
import { AdminLearningLessonList } from './AdminLearningLessonList';

type Props = {
  tracks: AdminLearningTrackRecord[];
  selection: { trackId: string; moduleId: string; lessonId: string; stepId: string };
  onSelect: (selection: Props['selection']) => void;
};

export function AdminLearningContentNavigator({ tracks, selection, onSelect }: Props) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm xl:sticky xl:top-8 xl:self-start">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-bold text-foreground">Contenidor</h2>
        <p className="mt-1 text-sm text-muted-foreground">Tria ruta, modul, llico i step.</p>
      </div>
      <div className="max-h-[calc(100vh-240px)] divide-y divide-border overflow-y-auto">
        {tracks.map((track) => (
          <article key={track.id} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onSelect(firstSelection(track))}
                className="flex items-center gap-3 text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CircleDot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{track.title}</h3>
                  <p className="text-xs text-muted-foreground">{track.slug}</p>
                </div>
              </button>
              <Status active={track.active} />
            </div>
            <div className="mt-4 grid gap-3">
              {track.modules.map((module) => (
                <div key={module.id} className={`rounded-lg border p-3 ${selection.moduleId === module.id ? 'border-primary bg-primary/5' : 'border-border bg-background/40'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <button type="button" onClick={() => onSelect(firstSelection(track, module))} className="flex items-center gap-2 text-left">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-bold text-foreground">{module.title}</p>
                    </button>
                    <p className="text-xs font-bold text-muted-foreground">{module.lessons.length} llicons</p>
                  </div>
                  <AdminLearningLessonList
                    lessons={module.lessons}
                    selection={selection}
                    onSelect={(lesson, stepId) => onSelect({ trackId: track.id, moduleId: module.id, lessonId: lesson.id, stepId })}
                  />
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function firstSelection(track: AdminLearningTrackRecord, module = track.modules[0]): Props['selection'] {
  const lesson = module?.lessons[0];
  const step = lesson?.steps[0];
  return { trackId: track.id, moduleId: module?.id ?? '', lessonId: lesson?.id ?? '', stepId: step?.id ?? '' };
}

function Status({ active }: { active: boolean }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-bold ${active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
      {active ? 'Actiu' : 'Inactiu'}
    </span>
  );
}
