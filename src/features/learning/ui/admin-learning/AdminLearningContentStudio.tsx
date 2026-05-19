/**
 * @file src/features/learning/ui/admin-learning/AdminLearningContentStudio.tsx
 * @updated 2026-05-19
 * @summary Interactive admin content studio selection shell.
 * @scope Client-side selection and optimistic local content updates only.
 */
'use client';

import { useMemo, useState } from 'react';
import type { AdminLearningContentData } from '@/services/learning/admin-learning-content-service';
import { AdminLearningContentNavigator } from './AdminLearningContentNavigator';
import { AdminLearningEntityEditor } from './AdminLearningEntityEditor';
import { AdminLearningFlowPreview } from './AdminLearningFlowPreview';
import { AdminLearningStepEditor } from './AdminLearningStepEditor';

type Selection = { trackId: string; moduleId: string; lessonId: string; stepId: string };
type Props = { data: AdminLearningContentData };

export function AdminLearningContentStudio({ data }: Props) {
  const [tracks, setTracks] = useState(data.tracks);
  const [selection, setSelection] = useState(() => firstSelection(data.tracks));
  const selected = useMemo(() => resolveSelection(tracks, selection), [tracks, selection]);

  return (
    <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_420px]">
      <AdminLearningContentNavigator
        tracks={tracks}
        selection={selection}
        onSelect={setSelection}
      />
      <div className="space-y-4">
        <AdminLearningEntityEditor
          key={`${selected.track?.id}-${selected.module?.id}-${selected.lesson?.id}`}
          selected={selected}
          onSaved={(next) => setTracks(replaceEntity(tracks, next))}
        />
        {selected.step ? (
          <AdminLearningStepEditor
            key={selected.step.id}
            step={selected.step}
            onSaved={(step) => setTracks(replaceEntity(tracks, { kind: 'step', data: step }))}
          />
        ) : null}
      </div>
      <AdminLearningFlowPreview
        lesson={selected.lesson}
        selectedStepId={selection.stepId}
        onSelectStep={(stepId) => setSelection((current) => ({ ...current, stepId }))}
      />
    </section>
  );
}

function firstSelection(tracks: Props['data']['tracks']): Selection {
  const track = tracks[0];
  const learningModule = track?.modules[0];
  const lesson = learningModule?.lessons[0];
  const step = lesson?.steps[0];
  return { trackId: track?.id ?? '', moduleId: learningModule?.id ?? '', lessonId: lesson?.id ?? '', stepId: step?.id ?? '' };
}

function resolveSelection(tracks: Props['data']['tracks'], selection: Selection) {
  const track = tracks.find((item) => item.id === selection.trackId) ?? tracks[0] ?? null;
  const learningModule = track?.modules.find((item) => item.id === selection.moduleId) ?? track?.modules[0] ?? null;
  const lesson = learningModule?.lessons.find((item) => item.id === selection.lessonId) ?? learningModule?.lessons[0] ?? null;
  const step = lesson?.steps.find((item) => item.id === selection.stepId) ?? lesson?.steps[0] ?? null;
  return { track, module: learningModule, lesson, step };
}

type EntityUpdate =
  | { kind: 'track'; data: NonNullable<ReturnType<typeof resolveSelection>['track']> }
  | { kind: 'module'; data: NonNullable<ReturnType<typeof resolveSelection>['module']> }
  | { kind: 'lesson'; data: NonNullable<ReturnType<typeof resolveSelection>['lesson']> }
  | { kind: 'step'; data: NonNullable<ReturnType<typeof resolveSelection>['step']> };

function replaceEntity(tracks: Props['data']['tracks'], update: EntityUpdate) {
  return tracks.map((track) => ({
    ...track,
    ...(update.kind === 'track' && track.id === update.data.id ? update.data : {}),
    modules: track.modules.map((module) => ({
      ...module,
      ...(update.kind === 'module' && module.id === update.data.id ? update.data : {}),
      lessons: module.lessons.map((lesson) => ({
        ...lesson,
        ...(update.kind === 'lesson' && lesson.id === update.data.id ? update.data : {}),
        steps: lesson.steps.map((step) => update.kind === 'step' && step.id === update.data.id ? update.data : step),
      })),
    })),
  }));
}
