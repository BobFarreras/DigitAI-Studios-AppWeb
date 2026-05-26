-- @file supabase/migrations/20260519051910_add_learning_publication_status.sql
-- @updated 2026-05-19
-- @summary Adds editorial draft/published status to learning content.
-- @scope Schema migration for learning content publication workflow.

alter table public.learning_tracks
  add column if not exists publication_status text not null default 'published';

alter table public.learning_modules
  add column if not exists publication_status text not null default 'published';

alter table public.learning_lessons
  add column if not exists publication_status text not null default 'published';

alter table public.learning_steps
  add column if not exists publication_status text not null default 'published';

alter table public.learning_tracks
  drop constraint if exists learning_tracks_publication_status_check,
  add constraint learning_tracks_publication_status_check
    check (publication_status in ('draft', 'published'));

alter table public.learning_modules
  drop constraint if exists learning_modules_publication_status_check,
  add constraint learning_modules_publication_status_check
    check (publication_status in ('draft', 'published'));

alter table public.learning_lessons
  drop constraint if exists learning_lessons_publication_status_check,
  add constraint learning_lessons_publication_status_check
    check (publication_status in ('draft', 'published'));

alter table public.learning_steps
  drop constraint if exists learning_steps_publication_status_check,
  add constraint learning_steps_publication_status_check
    check (publication_status in ('draft', 'published'));

create index if not exists idx_learning_tracks_publication
  on public.learning_tracks(publication_status, active, order_index);

create index if not exists idx_learning_modules_publication
  on public.learning_modules(publication_status, active, order_index);

create index if not exists idx_learning_lessons_publication
  on public.learning_lessons(publication_status, active, order_index);

create index if not exists idx_learning_steps_publication
  on public.learning_steps(publication_status, order_index);
