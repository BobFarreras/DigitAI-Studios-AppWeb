/**
 * @file src/features/learning/ui/AdminLearningContentPage.tsx
 * @updated 2026-05-19
 * @summary Admin learning content studio composition.
 * @scope Presentational admin UI only; data comes from actions.
 */
import type { AdminLearningContentData } from '@/services/learning/admin-learning-content-service';
import { AdminLearningContentNavigator } from './admin-learning/AdminLearningContentNavigator';
import { AdminLearningContentPreview } from './admin-learning/AdminLearningContentPreview';
import { AdminLearningContentStats } from './admin-learning/AdminLearningContentStats';

type Props = {
  data: AdminLearningContentData;
};

export function AdminLearningContentPage({ data }: Props) {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-primary">Content Studio</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Formacio</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Vista operativa de rutes, moduls, llicons i steps abans d'activar el CRUD.
          </p>
        </div>
        <div className="rounded-full border border-border px-3 py-1 text-xs font-bold text-muted-foreground">
          Read-only · Fase 6.1
        </div>
      </header>

      <AdminLearningContentStats summary={data.summary} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <AdminLearningContentNavigator tracks={data.tracks} />
        <AdminLearningContentPreview lesson={data.previewLesson} />
      </section>
    </div>
  );
}
