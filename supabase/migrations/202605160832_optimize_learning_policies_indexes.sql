create index if not exists idx_learning_attempts_lesson_id on public.learning_attempts(lesson_id);
create index if not exists idx_learning_progress_lesson_id on public.learning_progress(lesson_id);
create index if not exists idx_learning_step_answers_attempt_id on public.learning_step_answers(attempt_id);
create index if not exists idx_learning_step_answers_step_id on public.learning_step_answers(step_id);

drop policy if exists "Admins manage tracks" on public.learning_tracks;
drop policy if exists "Admins manage modules" on public.learning_modules;
drop policy if exists "Admins manage lessons" on public.learning_lessons;
drop policy if exists "Admins manage steps" on public.learning_steps;

create policy "Admins insert tracks" on public.learning_tracks
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admins update tracks" on public.learning_tracks
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins delete tracks" on public.learning_tracks
  for delete to authenticated using ((select public.is_admin()));

create policy "Admins insert modules" on public.learning_modules
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admins update modules" on public.learning_modules
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins delete modules" on public.learning_modules
  for delete to authenticated using ((select public.is_admin()));

create policy "Admins insert lessons" on public.learning_lessons
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admins update lessons" on public.learning_lessons
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins delete lessons" on public.learning_lessons
  for delete to authenticated using ((select public.is_admin()));

create policy "Admins insert steps" on public.learning_steps
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admins update steps" on public.learning_steps
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins delete steps" on public.learning_steps
  for delete to authenticated using ((select public.is_admin()));

drop policy if exists "Users read own attempts" on public.learning_attempts;
drop policy if exists "Users insert own attempts" on public.learning_attempts;
drop policy if exists "Users update own attempts" on public.learning_attempts;
drop policy if exists "Users read own answers" on public.learning_step_answers;
drop policy if exists "Users insert own answers" on public.learning_step_answers;
drop policy if exists "Users read own progress" on public.learning_progress;
drop policy if exists "Users upsert own progress" on public.learning_progress;
drop policy if exists "Users read own xp" on public.learning_xp_events;
drop policy if exists "Users insert own xp" on public.learning_xp_events;
drop policy if exists "Users read own streak" on public.learning_streaks;
drop policy if exists "Users upsert own streak" on public.learning_streaks;

create policy "Users read own attempts" on public.learning_attempts
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own attempts" on public.learning_attempts
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own attempts" on public.learning_attempts
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Users read own answers" on public.learning_step_answers for select to authenticated
  using (exists (select 1 from public.learning_attempts a where a.id = attempt_id and a.user_id = (select auth.uid())));
create policy "Users insert own answers" on public.learning_step_answers for insert to authenticated
  with check (exists (select 1 from public.learning_attempts a where a.id = attempt_id and a.user_id = (select auth.uid())));

create policy "Users read own progress" on public.learning_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own progress" on public.learning_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own progress" on public.learning_progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Users read own xp" on public.learning_xp_events
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own xp" on public.learning_xp_events
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Users read own streak" on public.learning_streaks
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users insert own streak" on public.learning_streaks
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users update own streak" on public.learning_streaks
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
