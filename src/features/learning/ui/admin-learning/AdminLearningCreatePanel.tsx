/**
 * @file src/features/learning/ui/admin-learning/AdminLearningCreatePanel.tsx
 * @updated 2026-05-19
 * @summary Create controls for learning tracks, modules, lessons and steps.
 * @scope Client-side creation action calls only.
 */
'use client';

import { useState, useTransition } from 'react';
import { createAdminLearningContent } from '@/actions/admin/learning-content';
import { Button } from '@/components/ui/button';
import type { AdminLearningContentData } from '@/services/learning/admin-learning-content-service';

type Props = { selected: { track: Track; module: Module; lesson: Lesson } };
type Track = AdminLearningContentData['tracks'][number] | null;
type Module = NonNullable<Track>['modules'][number] | null;
type Lesson = NonNullable<Module>['lessons'][number] | null;

export function AdminLearningCreatePanel({ selected }: Props) {
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  function create(kind: 'track' | 'module' | 'lesson' | 'step') {
    const input = buildInput(kind, selected);
    if (!input) return setMessage('Selecciona el contenidor pare abans de crear.');
    startTransition(async () => {
      const response = await createAdminLearningContent(input);
      setMessage(response.success ? 'Creat. Recarrega la vista per editar-lo.' : 'No s\'ha pogut crear.');
      if (response.success) window.location.reload();
    });
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h3 className="font-bold text-foreground">Crear contingut</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        <Button variant="outline" disabled={pending} onClick={() => create('track')}>Ruta</Button>
        <Button variant="outline" disabled={pending} onClick={() => create('module')}>Modul</Button>
        <Button variant="outline" disabled={pending} onClick={() => create('lesson')}>Llico</Button>
        <Button variant="outline" disabled={pending} onClick={() => create('step')}>Step</Button>
      </div>
      {message ? <p className="mt-3 text-sm font-bold text-muted-foreground">{message}</p> : null}
    </section>
  );
}

function buildInput(kind: 'track' | 'module' | 'lesson' | 'step', selected: Props['selected']) {
  const suffix = Date.now().toString().slice(-5);
  if (kind === 'track') return { kind, ...base(`nova-ruta-${suffix}`), description: null, icon: null, color: null };
  if (kind === 'module' && selected.track) return { kind, ...base(`nou-modul-${suffix}`), trackId: selected.track.id, description: null, level: 'basic' };
  if (kind === 'lesson' && selected.module) return { kind, ...base(`nova-llico-${suffix}`), moduleId: selected.module.id, objective: null, estimatedMinutes: 5, xpReward: 10 };
  if (kind === 'step' && selected.lesson) return {
    kind, lessonId: selected.lesson.id, type: 'multiple_choice',
    prompt: 'Nova pregunta', explanation: null, orderIndex: selected.lesson.steps.length + 1,
    config: { options: ['Opcio A', 'Opcio B'], correctAnswer: 'Opcio A' },
  };
  return null;
}

function base(slug: string) {
  return { slug, title: slug.replaceAll('-', ' '), active: false, orderIndex: 99 };
}
