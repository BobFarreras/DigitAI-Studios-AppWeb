/**
 * @file src/features/learning/ui/admin-learning/AdminLearningFlowPreview.tsx
 * @updated 2026-05-19
 * @summary Lesson flow preview with options and correct answers for admins.
 * @scope Presentational admin preview only.
 */
'use client';

import { CheckCircle2, ClipboardList, Timer, Trophy } from 'lucide-react';
import type { AdminLearningLessonRecord, AdminLearningStepUpdate } from '@/services/learning/admin-learning-content-service';
import type { LearningRunnerStep } from '@/services/learning/learning-lesson-service';
import { StepInteraction } from '../lesson-runner/StepInteraction';
import { stringifyEditable } from './admin-learning-config';

type Props = {
  lesson: AdminLearningLessonRecord | null;
  selectedStepId: string;
  onSelectStep: (stepId: string) => void;
};

export function AdminLearningFlowPreview({ lesson, selectedStepId, onSelectStep }: Props) {
  if (!lesson) return <EmptyPreview />;
  return (
    <aside className="rounded-xl border border-border bg-card shadow-sm xl:sticky xl:top-8 xl:self-start">
      <div className="border-b border-border p-5">
        <p className="text-xs font-bold uppercase text-primary">Flux de l'alumne</p>
        <h2 className="mt-2 text-xl font-bold text-foreground">{lesson.title}</h2>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-bold text-muted-foreground">
          <Fact icon={Timer} value={`${lesson.estimatedMinutes} min`} />
          <Fact icon={Trophy} value={`${lesson.xpReward} XP`} />
          <Fact icon={ClipboardList} value={`${lesson.steps.length} steps`} />
        </div>
      </div>
      <div className="max-h-[calc(100vh-280px)] space-y-3 overflow-y-auto p-5">
        {lesson.steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            onClick={() => onSelectStep(step.id)}
            className={`w-full rounded-lg border p-3 text-left ${selectedStepId === step.id ? 'border-primary bg-primary/5' : 'border-border bg-background/40'}`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase text-primary">Step {index + 1} · {step.type}</p>
              <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                {step.publicationStatus}
                <CheckCircle2 className="h-4 w-4 text-[#58cc02]" />
              </span>
            </div>
            <p className="mt-2 text-sm leading-5 text-foreground">{step.prompt}</p>
            <StepAnswers step={step} />
          </button>
        ))}
        {selectedStep(lesson, selectedStepId) ? <StudentPreview step={selectedStep(lesson, selectedStepId)!} /> : null}
      </div>
    </aside>
  );
}

function StudentPreview({ step }: { step: AdminLearningStepUpdate }) {
  const value = step.config.correctAnswer;
  return (
    <div className="rounded-lg border-2 border-primary bg-background p-4">
      <p className="mb-3 text-xs font-bold uppercase text-primary">Com ho veu l'alumne</p>
      <StepInteraction
        step={toRunnerStep(step)}
        value={value}
        disabled
        feedbackStatus="correct"
        onChange={() => undefined}
      />
    </div>
  );
}

function StepAnswers({ step }: { step: AdminLearningStepUpdate }) {
  const options = stringifyEditable(step.config.options);
  const correct = stringifyEditable(step.config.correctAnswer);
  return (
    <div className="mt-3 grid gap-2 text-xs">
      {options ? <pre className="whitespace-pre-wrap rounded-md bg-muted p-2 text-muted-foreground">{options}</pre> : null}
      <div className="rounded-md bg-[#58cc02]/10 p-2 font-bold text-[#3f8f01]">
        Correcta: {correct || 'pendent'}
      </div>
    </div>
  );
}

function Fact({ icon: Icon, value }: { icon: typeof Timer; value: string }) {
  return <div className="rounded-lg bg-muted/50 p-2"><Icon className="mb-1 h-4 w-4 text-primary" />{value}</div>;
}

function EmptyPreview() {
  return <aside className="rounded-xl border border-border bg-card p-5 text-sm font-medium text-muted-foreground shadow-sm">Selecciona una llico.</aside>;
}

function selectedStep(lesson: AdminLearningLessonRecord, id: string) {
  return lesson.steps.find((step) => step.id === id) ?? lesson.steps[0] ?? null;
}

function toRunnerStep(step: AdminLearningStepUpdate): LearningRunnerStep {
  return {
    id: step.id,
    lessonId: '',
    type: step.type,
    prompt: step.prompt,
    explanation: step.explanation,
    config: step.config,
    orderIndex: step.orderIndex,
  };
}
