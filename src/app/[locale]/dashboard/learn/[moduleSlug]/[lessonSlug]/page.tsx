/**
 * @file src/app/[locale]/dashboard/learn/[moduleSlug]/[lessonSlug]/page.tsx
 * @updated 2026-05-16
 * @summary Interactive lesson runner route.
 * @scope Page composition only; data comes from server actions.
 */
import { notFound, redirect } from 'next/navigation';
import { getLearningLessonRunner } from '@/actions/learning-lesson';
import { LearningLessonRunner } from '@/features/learning/ui/LearningLessonRunner';

type Props = {
  params: Promise<{
    moduleSlug: string;
    lessonSlug: string;
  }>;
};

export default async function LessonPage({ params }: Props) {
  const { moduleSlug, lessonSlug } = await params;
  const result = await getLearningLessonRunner(moduleSlug, lessonSlug);

  if (!result.success && result.authRequired) {
    redirect('/');
  }

  if (!result.success) {
    notFound();
  }

  return <LearningLessonRunner data={result.data} />;
}
