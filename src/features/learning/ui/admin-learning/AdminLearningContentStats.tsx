/**
 * @file src/features/learning/ui/admin-learning/AdminLearningContentStats.tsx
 * @updated 2026-05-19
 * @summary Metric cards for the admin learning content studio.
 * @scope Presentational summary metrics only.
 */
import { BookOpenCheck, Eye, Layers3, ListChecks } from 'lucide-react';
import type { AdminLearningContentSummary } from '@/services/learning/admin-learning-content-service';

type Props = {
  summary: AdminLearningContentSummary;
};

export function AdminLearningContentStats({ summary }: Props) {
  return (
    <section className="grid gap-3 md:grid-cols-4">
      <Metric label="Rutes" value={summary.tracks} icon={Layers3} detail={`${summary.modules} moduls`} />
      <Metric label="Llicons" value={summary.lessons} icon={BookOpenCheck} detail={`${summary.activeLessons} actives`} />
      <Metric label="Steps" value={summary.steps} icon={ListChecks} detail={`${summary.averageStepsPerLesson} per llico`} />
      <Metric label="Pendents" value={summary.inactiveLessons} icon={Eye} detail="inactives o draft" />
    </section>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
  detail,
}: {
  label: string;
  value: number;
  icon: typeof Layers3;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <Icon className="h-5 w-5 text-primary" />
        <span className="text-xs font-bold text-muted-foreground">{detail}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
    </div>
  );
}
