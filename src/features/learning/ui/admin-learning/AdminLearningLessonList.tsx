/**
 * @file src/features/learning/ui/admin-learning/AdminLearningLessonList.tsx
 * @updated 2026-05-19
 * @summary Lesson rows for the admin learning content tree.
 * @scope Presentational lesson inventory only.
 */
'use client';

import { FileText, ListChecks } from 'lucide-react';
import type { AdminLearningLessonRecord } from '@/services/learning/admin-learning-content-service';

type Props = {
  lessons: AdminLearningLessonRecord[];
  selection: { lessonId: string; stepId: string };
  onSelect: (lesson: AdminLearningLessonRecord, stepId: string) => void;
};

export function AdminLearningLessonList({ lessons, selection, onSelect }: Props) {
  return (
    <div className="mt-3 grid gap-2">
      {lessons.map((lesson) => (
        <button
          key={lesson.id}
          type="button"
          onClick={() => onSelect(lesson, lesson.steps[0]?.id ?? '')}
          className={`grid gap-3 rounded-lg p-3 text-left sm:grid-cols-[1fr_auto] sm:items-center ${selection.lessonId === lesson.id ? 'bg-primary/10 ring-1 ring-primary' : 'bg-card'}`}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-primary" />
              <p className="truncate text-sm font-semibold text-foreground">{lesson.title}</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {lesson.slug} · {lesson.estimatedMinutes} min · {lesson.xpReward} XP
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <ListChecks className="h-4 w-4" />
            {lesson.steps.length} steps
            <span className="rounded-full bg-muted px-2 py-1">{lesson.publicationStatus}</span>
            <span className={`rounded-full px-2 py-1 ${lesson.active ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
              {lesson.active ? 'Activa' : 'Inactiva'}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
