/**
 * @file src/features/learning/ui/admin-learning/AdminLearningStepEditor.tsx
 * @updated 2026-05-19
 * @summary Editable step form with answer and correct-answer controls.
 * @scope Client form state and server action calls only.
 */
'use client';

import { useState, useTransition } from 'react';
import { updateAdminLearningContent } from '@/actions/admin/learning-content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AdminLearningStepUpdate, LearningStepType } from '@/services/learning/admin-learning-content-service';
import { configToForm, formToConfig, type StepConfigForm } from './admin-learning-config';

const STEP_TYPES: LearningStepType[] = ['multiple_choice', 'multi_select', 'true_false', 'order_steps', 'match_pairs', 'fill_blank', 'code_choice', 'terminal_simulation', 'network_diagram', 'code_editor', 'ai_prompt_review', 'security_triage', 'scenario'];

type Props = { step: AdminLearningStepUpdate; onSaved: (step: AdminLearningStepUpdate) => void };

export function AdminLearningStepEditor({ step, onSaved }: Props) {
  const [draft, setDraft] = useState(step);
  const [config, setConfig] = useState<StepConfigForm>(() => configToForm(step.config));
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      try {
        const next = { ...draft, config: formToConfig(config) };
        const response = await updateAdminLearningContent({ kind: 'step', ...next });
        setMessage(response.success ? 'Step guardat.' : 'Config no valida o error de guardat.');
        if (response.success) onSaved(next);
      } catch {
        setMessage('El JSON de config, respostes o resposta correcta no es valid.');
      }
    });
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div><h3 className="font-bold text-foreground">Editor de step</h3><p className="text-xs text-muted-foreground">Pregunta, respostes i resposta correcta.</p></div>
        <Button onClick={save} disabled={pending}>Guardar step</Button>
      </div>
      <div className="grid gap-3">
        <Select value={draft.type} onValueChange={(type) => setDraft({ ...draft, type: type as LearningStepType })}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>{STEP_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
        </Select>
        <Textarea value={draft.prompt} onChange={(e) => setDraft({ ...draft, prompt: e.target.value })} placeholder="Pregunta o enunciat" />
        <Textarea value={draft.explanation ?? ''} onChange={(e) => setDraft({ ...draft, explanation: e.target.value || null })} placeholder="Explicacio, formula o criteri pedagogic" />
        <Input type="number" value={draft.orderIndex} onChange={(e) => setDraft({ ...draft, orderIndex: Number(e.target.value) })} aria-label="Ordre del step" />
        <Textarea value={config.optionsText} onChange={(e) => setConfig({ ...config, optionsText: e.target.value })} placeholder="Respostes/opcions: una per linia o JSON array" />
        <Textarea value={config.correctText} onChange={(e) => setConfig({ ...config, correctText: e.target.value })} placeholder="Resposta correcta: text, linies multiples o JSON" />
        <Textarea className="min-h-40 font-mono text-xs" value={config.jsonText} onChange={(e) => setConfig({ ...config, jsonText: e.target.value })} placeholder="Config JSON completa" />
      </div>
      {message ? <p className="mt-3 text-sm font-bold text-muted-foreground">{message}</p> : null}
    </section>
  );
}
