/**
 * @file src/repositories/supabase/learning-mappers-types.ts
 * @updated 2026-05-20
 * @summary Type definitions for Supabase learning row mappers.
 * @scope Pure type definitions for learning repositories.
 */
import type { Tables } from '@/types/database.types';

type TrackRow = Tables<'learning_tracks'> & {
  title_ca?: string;
  title_es?: string;
  title_en?: string;
  title_it?: string;
  description_ca?: string;
  description_es?: string;
  description_en?: string;
  description_it?: string;
};

type ModuleRow = Tables<'learning_modules'> & {
  title_ca?: string;
  title_es?: string;
  title_en?: string;
  title_it?: string;
  description_ca?: string;
  description_es?: string;
  description_en?: string;
  description_it?: string;
};

type LessonRow = Tables<'learning_lessons'> & {
  title_ca?: string;
  title_es?: string;
  title_en?: string;
  title_it?: string;
  objective_ca?: string;
  objective_es?: string;
  objective_en?: string;
  objective_it?: string;
};

type ProgressRow = Tables<'learning_progress'>;

type StepRow = Tables<'learning_steps'> & {
  prompt_ca?: string;
  prompt_es?: string;
  prompt_en?: string;
  prompt_it?: string;
  explanation_ca?: string;
  explanation_es?: string;
  explanation_en?: string;
  explanation_it?: string;
};

type AttemptRow = Tables<'learning_attempts'>;

type XpRow = Pick<Tables<'learning_xp_events'>, 'id' | 'xp' | 'source_type' | 'created_at'>;

export type {
  TrackRow,
  ModuleRow,
  LessonRow,
  ProgressRow,
  StepRow,
  AttemptRow,
  XpRow,
};