/**
 * @file src/features/learning/ui/admin-learning/AdminLearningEntityEditor.tsx
 * @updated 2026-05-19
 * @summary Editable track, module and lesson forms for content studio.
 * @scope Client form state and server action calls only.
 */
'use client';

import { useState, useTransition } from 'react';
import { updateAdminLearningContent } from '@/actions/admin/learning-content';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type {
  AdminLearningLessonRecord,
  AdminLearningModuleRecord,
  AdminLearningTrackRecord,
} from '@/services/learning/admin-learning-content-service';

type Selected = {
  track: AdminLearningTrackRecord | null;
  module: AdminLearningModuleRecord | null;
  lesson: AdminLearningLessonRecord | null;
};
type Props = { selected: Selected; onSaved: (update: Update) => void };
type Update = { kind: 'track'; data: AdminLearningTrackRecord } | { kind: 'module'; data: AdminLearningModuleRecord } | { kind: 'lesson'; data: AdminLearningLessonRecord };

export function AdminLearningEntityEditor({ selected, onSaved }: Props) {
  const [track, setTrack] = useState(selected.track);
  const [module, setModule] = useState(selected.module);
  const [lesson, setLesson] = useState(selected.lesson);
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  function save(kind: Update['kind']) {
    const data = kind === 'track' ? track : kind === 'module' ? module : lesson;
    if (!data) return;
    startTransition(async () => {
      const response = await updateAdminLearningContent({ kind, ...data });
      setMessage(response.success ? 'Guardat.' : 'No s\'ha pogut guardar.');
      if (response.success) onSaved({ kind, data } as Update);
    });
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-3">
        {track ? <Block title="Ruta" onSave={() => save('track')} pending={pending}><TextFields value={track} onChange={setTrack} /></Block> : null}
        {module ? <Block title="Modul" onSave={() => save('module')} pending={pending}><ModuleFields value={module} onChange={setModule} /></Block> : null}
        {lesson ? <Block title="Llico" onSave={() => save('lesson')} pending={pending}><LessonFields value={lesson} onChange={setLesson} /></Block> : null}
      </div>
      {message ? <p className="mt-3 text-sm font-bold text-muted-foreground">{message}</p> : null}
    </section>
  );
}

function Block({ title, children, onSave, pending }: { title: string; children: React.ReactNode; onSave: () => void; pending: boolean }) {
  return <div className="space-y-3"><h3 className="font-bold text-foreground">{title}</h3>{children}<Button onClick={onSave} disabled={pending} size="sm">Guardar {title}</Button></div>;
}

function TextFields<T extends { title: string; slug: string; description: string | null; active: boolean; publicationStatus: 'draft' | 'published'; orderIndex: number }>(
  { value, onChange }: { value: T; onChange: (next: T) => void }
) {
  return <><Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="Titol" /><Input value={value.slug} onChange={(e) => onChange({ ...value, slug: e.target.value })} placeholder="slug" /><Textarea value={value.description ?? ''} onChange={(e) => onChange({ ...value, description: e.target.value || null })} placeholder="Descripcio" /><NumberInput value={value.orderIndex} onChange={(orderIndex) => onChange({ ...value, orderIndex })} /><Publication value={value.publicationStatus} onChange={(publicationStatus) => onChange({ ...value, publicationStatus })} /><Active value={value.active} onChange={(active) => onChange({ ...value, active })} /></>;
}

function ModuleFields(props: { value: AdminLearningModuleRecord; onChange: (next: AdminLearningModuleRecord) => void }) {
  const { value, onChange } = props;
  return <><TextFields value={value} onChange={onChange} /><Input value={value.level} onChange={(e) => onChange({ ...value, level: e.target.value })} placeholder="level" /></>;
}

function LessonFields({ value, onChange }: { value: AdminLearningLessonRecord; onChange: (next: AdminLearningLessonRecord) => void }) {
  return <><Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} /><Input value={value.slug} onChange={(e) => onChange({ ...value, slug: e.target.value })} /><Textarea value={value.objective ?? ''} onChange={(e) => onChange({ ...value, objective: e.target.value || null })} placeholder="Objectiu" /><NumberInput value={value.estimatedMinutes} label="Minuts" onChange={(estimatedMinutes) => onChange({ ...value, estimatedMinutes })} /><NumberInput value={value.xpReward} label="XP" onChange={(xpReward) => onChange({ ...value, xpReward })} /><NumberInput value={value.orderIndex} onChange={(orderIndex) => onChange({ ...value, orderIndex })} /><Publication value={value.publicationStatus} onChange={(publicationStatus) => onChange({ ...value, publicationStatus })} /><Active value={value.active} onChange={(active) => onChange({ ...value, active })} /></>;
}

function NumberInput({ value, onChange, label = 'Ordre' }: { value: number; onChange: (value: number) => void; label?: string }) {
  return <Input type="number" value={value} aria-label={label} onChange={(e) => onChange(Number(e.target.value))} />;
}

function Active({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex items-center gap-2 text-sm font-bold"><Checkbox checked={value} onCheckedChange={(checked) => onChange(checked === true)} /> Actiu</label>;
}

function Publication({ value, onChange }: { value: 'draft' | 'published'; onChange: (value: 'draft' | 'published') => void }) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as 'draft' | 'published')}>
      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
      <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent>
    </Select>
  );
}
