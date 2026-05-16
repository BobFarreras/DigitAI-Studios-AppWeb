/**
 * @file src/app/[locale]/dashboard/learn/[moduleSlug]/[lessonSlug]/page.tsx
 * @updated 2026-05-16
 * @summary Placeholder route for the upcoming lesson runner.
 * @scope Page composition only; lesson execution arrives in the runner phase.
 */
import { ArrowLeft, Construction, PlayCircle } from 'lucide-react';
import { Link } from '@/routing';
import { Button } from '@/components/ui/button';

type Props = {
  params: Promise<{
    moduleSlug: string;
    lessonSlug: string;
  }>;
};

function formatSlug(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function LessonPage({ params }: Props) {
  const { moduleSlug, lessonSlug } = await params;

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-24 md:pb-8">
      <Button asChild variant="ghost" className="w-fit rounded-xl font-bold">
        <Link href={`/dashboard/learn/${moduleSlug}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tornar al mapa
        </Link>
      </Button>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-950 md:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          <PlayCircle className="h-8 w-8" />
        </div>

        <p className="mt-6 text-sm font-black uppercase text-emerald-600">
          {formatSlug(moduleSlug)}
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
          {formatSlug(lessonSlug)}
        </h1>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
          <div className="flex items-start gap-3">
            <Construction className="mt-1 h-5 w-5 text-amber-500" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              El runner interactiu es connectara en la fase 4. Aquesta ruta ja queda preparada per
              rebre preguntes, feedback immediat, XP i progres persistent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
