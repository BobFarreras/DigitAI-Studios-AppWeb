/**
 * @file src/features/learning/ui/admin-learning/AdminLearningContentPreview.tsx
 * @updated 2026-05-19
 * @summary Lesson preview panel for admin learning content.
 * @scope Presentational read-only lesson preview only.
 */
import { ClipboardList, Timer, Trophy } from 'lucide-react';
import type { AdminLearningContentData } from '@/services/learning/admin-learning-content-service';

type Props = {
  lesson: AdminLearningContentData['previewLesson'];
};

export function AdminLearningContentPreview({ lesson }: Props) {
  if (!lesson) return <EmptyPreview />;
  return (
    <aside className="rounded-xl border border-border bg-card shadow-sm xl:sticky xl:top-8 xl:self-start">
      <div className="border-b border-border p-5">
        <p className="text-xs font-bold uppercase text-primary">Preview de llico</p>
        <h2 className="mt-2 text-xl font-bold text-foreground">{lesson.title}</h2>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-bold text-muted-foreground">
          <Fact icon={Timer} value={`${lesson.estimatedMinutes} min`} />
          <Fact icon={Trophy} value={`${lesson.xpReward} XP`} />
          <Fact icon={ClipboardList} value={`${lesson.steps.length} steps`} />
        </div>
      </div>
      <div className="space-y-3 p-5">
        {lesson.steps.map((step) => (
          <div key={step.id} className="rounded-lg border border-border bg-background/40 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase text-primary">{step.type}</p>
              <p className="text-xs font-bold text-muted-foreground">#{step.orderIndex}</p>
            </div>
            <p className="mt-2 text-sm leading-5 text-foreground">{step.prompt}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

function Fact({ icon: Icon, value }: { icon: typeof Timer; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2">
      <Icon className="mb-1 h-4 w-4 text-primary" />
      {value}
    </div>
  );
}

function EmptyPreview() {
  return (
    <aside className="rounded-xl border border-border bg-card p-5 text-sm font-medium text-muted-foreground shadow-sm">
      Encara no hi ha cap llico amb steps per previsualitzar.
    </aside>
  );
}
