create table if not exists public.learning_tracks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  icon text,
  color text,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_modules (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.learning_tracks(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  level text not null check (level in ('initiation','basic','intermediate','advanced')),
  order_index int not null default 0,
  active boolean not null default true,
  unique(track_id, slug)
);

create table if not exists public.learning_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.learning_modules(id) on delete cascade,
  slug text not null,
  title text not null,
  objective text,
  estimated_minutes int not null default 5,
  xp_reward int not null default 10,
  order_index int not null default 0,
  active boolean not null default true,
  unique(module_id, slug)
);

create table if not exists public.learning_steps (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.learning_lessons(id) on delete cascade,
  type text not null check (type in (
    'multiple_choice','multi_select','true_false','order_steps',
    'match_pairs','fill_blank','code_choice','scenario'
  )),
  prompt text not null,
  explanation text,
  media jsonb,
  config jsonb not null default '{}',
  order_index int not null default 0
);

create table if not exists public.learning_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.learning_lessons(id) on delete cascade,
  status text not null check (status in ('started','completed','needs_review','abandoned')),
  score int not null default 0,
  correct_count int not null default 0,
  mistake_count int not null default 0,
  time_spent_seconds int not null default 0,
  requires_review boolean not null default false,
  xp_awarded int not null default 0,
  accuracy numeric,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.learning_step_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.learning_attempts(id) on delete cascade,
  step_id uuid not null references public.learning_steps(id) on delete cascade,
  answer jsonb not null,
  is_correct boolean not null,
  hint_used boolean not null default false,
  time_spent_seconds int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.learning_lessons(id) on delete cascade,
  best_score int not null default 0,
  completed boolean not null default false,
  completed_at timestamptz,
  attempts_count int not null default 0,
  needs_review boolean not null default false,
  primary key (user_id, lesson_id)
);

create table if not exists public.learning_xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null,
  source_id uuid,
  xp int not null,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_activity_date date
);

create index if not exists idx_learning_modules_track_order on public.learning_modules(track_id, order_index);
create index if not exists idx_learning_lessons_module_order on public.learning_lessons(module_id, order_index);
create index if not exists idx_learning_steps_lesson_order on public.learning_steps(lesson_id, order_index);
create index if not exists idx_learning_attempts_user_lesson on public.learning_attempts(user_id, lesson_id);
create index if not exists idx_learning_xp_events_user_created on public.learning_xp_events(user_id, created_at desc);

alter table public.learning_tracks enable row level security;
alter table public.learning_modules enable row level security;
alter table public.learning_lessons enable row level security;
alter table public.learning_steps enable row level security;
alter table public.learning_attempts enable row level security;
alter table public.learning_step_answers enable row level security;
alter table public.learning_progress enable row level security;
alter table public.learning_xp_events enable row level security;
alter table public.learning_streaks enable row level security;

create policy "Authenticated users read active tracks" on public.learning_tracks
  for select to authenticated using (active = true);
create policy "Admins manage tracks" on public.learning_tracks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated users read active modules" on public.learning_modules
  for select to authenticated using (active = true);
create policy "Admins manage modules" on public.learning_modules
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated users read active lessons" on public.learning_lessons
  for select to authenticated using (active = true);
create policy "Admins manage lessons" on public.learning_lessons
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated users read lesson steps" on public.learning_steps
  for select to authenticated using (true);
create policy "Admins manage steps" on public.learning_steps
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Users read own attempts" on public.learning_attempts
  for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own attempts" on public.learning_attempts
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own attempts" on public.learning_attempts
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read own answers" on public.learning_step_answers for select to authenticated
  using (exists (select 1 from public.learning_attempts a where a.id = attempt_id and a.user_id = auth.uid()));
create policy "Users insert own answers" on public.learning_step_answers for insert to authenticated
  with check (exists (select 1 from public.learning_attempts a where a.id = attempt_id and a.user_id = auth.uid()));
create policy "Users read own progress" on public.learning_progress
  for select to authenticated using (auth.uid() = user_id);
create policy "Users upsert own progress" on public.learning_progress
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read own xp" on public.learning_xp_events
  for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own xp" on public.learning_xp_events
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Users read own streak" on public.learning_streaks
  for select to authenticated using (auth.uid() = user_id);
create policy "Users upsert own streak" on public.learning_streaks
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.learning_tracks (slug, title, description, icon, color, order_index, active)
values (
  'iniciacio-digital',
  'Iniciacio Digital',
  'Conceptes essencials per treballar amb comptes, fitxers, navegadors i seguretat basica.',
  'sparkles',
  'emerald',
  1,
  true
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon,
  color = excluded.color,
  order_index = excluded.order_index,
  active = excluded.active;

insert into public.learning_modules (track_id, slug, title, description, level, order_index, active)
select id, seed.slug, seed.title, seed.description, 'initiation', seed.order_index, true
from public.learning_tracks
cross join (values
  ('fonaments-digitals', 'Fonaments digitals', 'Primeres rutines per moure''t amb criteri en un entorn digital.', 1),
  ('seguretat-basica', 'Seguretat basica', 'Contrasenyes, 2FA, enllacos i decisions segures.', 2)
) as seed(slug, title, description, order_index)
where learning_tracks.slug = 'iniciacio-digital'
on conflict (track_id, slug) do update set
  title = excluded.title,
  description = excluded.description,
  level = excluded.level,
  order_index = excluded.order_index,
  active = excluded.active;

insert into public.learning_lessons (module_id, slug, title, objective, estimated_minutes, xp_reward, order_index, active)
select id, lesson_slug, lesson_title, objective, minutes, xp, lesson_order, true
from public.learning_modules
cross join (values
  ('que-es-un-sistema-operatiu', 'Que es un sistema operatiu', 'Identificar el paper del sistema operatiu en un dispositiu.', 5, 10, 1),
  ('fitxers-i-navegadors', 'Fitxers i navegadors', 'Entendre rutes, extensions i navegacio basica.', 6, 12, 2)
) as seed(lesson_slug, lesson_title, objective, minutes, xp, lesson_order)
where slug = 'fonaments-digitals'
on conflict (module_id, slug) do update set
  title = excluded.title,
  objective = excluded.objective,
  estimated_minutes = excluded.estimated_minutes,
  xp_reward = excluded.xp_reward,
  order_index = excluded.order_index,
  active = excluded.active;

insert into public.learning_steps (lesson_id, type, prompt, explanation, config, order_index)
select lessons.id, step_type, prompt, explanation, config::jsonb, step_order
from public.learning_lessons lessons
join public.learning_modules modules on modules.id = lessons.module_id
cross join (values
  (
    'multiple_choice',
    'Quina funcio principal te un sistema operatiu?',
    'Coordina hardware, aplicacions, fitxers i permisos perque el dispositiu sigui usable.',
    '{"options":["Coordinar recursos del dispositiu","Nomes obrir webs","Substituir el navegador"]}',
    1
  ),
  (
    'true_false',
    'Un navegador i un sistema operatiu son exactament el mateix.',
    'El navegador es una aplicacio; el sistema operatiu es la base que executa aplicacions.',
    '{"options":["Cert","Fals"]}',
    2
  )
) as seed(step_type, prompt, explanation, config, step_order)
where modules.slug = 'fonaments-digitals'
  and lessons.slug = 'que-es-un-sistema-operatiu'
on conflict do nothing;

insert into public.learning_steps (lesson_id, type, prompt, explanation, config, order_index)
select lessons.id, step_type, prompt, explanation, config::jsonb, step_order
from public.learning_lessons lessons
join public.learning_modules modules on modules.id = lessons.module_id
cross join (values
  (
    'multiple_choice',
    'Quina practica millora mes la seguretat d''un compte?',
    'Una contrasenya unica i un segon factor redueixen molt el risc de reutilitzacio o robatori.',
    '{"options":["Reutilitzar la mateixa contrasenya","Contrasenya unica amb 2FA","Compartir el codi per email"]}',
    1
  ),
  (
    'scenario',
    'Reps un enllac urgent que demana iniciar sessio. Quin primer control fas?',
    'Validar domini, context i canal abans d''introduir credencials evita phishing basic.',
    '{"options":["Comprovar domini i origen","Clicar rapid","Enviar la contrasenya"]}',
    2
  )
) as seed(step_type, prompt, explanation, config, step_order)
where modules.slug = 'seguretat-basica'
  and lessons.slug = 'contrasenyes-i-2fa'
on conflict do nothing;

insert into public.learning_lessons (module_id, slug, title, objective, estimated_minutes, xp_reward, order_index, active)
select id, lesson_slug, lesson_title, objective, minutes, xp, lesson_order, true
from public.learning_modules
cross join (values
  ('contrasenyes-i-2fa', 'Contrasenyes i 2FA', 'Crear credencials robustes i entendre el segon factor.', 6, 15, 1),
  ('enllacos-i-phishing', 'Enllacos i phishing', 'Detectar senyals de risc abans de clicar.', 7, 15, 2)
) as seed(lesson_slug, lesson_title, objective, minutes, xp, lesson_order)
where slug = 'seguretat-basica'
on conflict (module_id, slug) do update set
  title = excluded.title,
  objective = excluded.objective,
  estimated_minutes = excluded.estimated_minutes,
  xp_reward = excluded.xp_reward,
  order_index = excluded.order_index,
  active = excluded.active;
