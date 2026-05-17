-- @file supabase/migrations/202605171200_seed_advanced_learning_interactions.sql
-- @updated 2026-05-17
-- @summary Seeds Fase 4.2 interaction types for the learning runner.
-- @scope Content seed only; no schema changes.

insert into public.learning_steps (lesson_id, type, prompt, explanation, config, order_index)
select lessons.id, seed.step_type, seed.prompt, seed.explanation, seed.config::jsonb, seed.step_order
from public.learning_lessons lessons
join public.learning_modules modules on modules.id = lessons.module_id
join public.learning_tracks tracks on tracks.id = modules.track_id
join (values
  (
    'ciberseguretat',
    'phishing-basic',
    'multi_select',
    'Quins senyals indiquen possible phishing?',
    'Els missatges de phishing solen combinar urgencia, dominis sospitosos i peticions de credencials.',
    '{"options":["Domini sospitos","Pressa per actuar","Demanar credencials","Salutacio personalitzada"],"correctAnswer":["Domini sospitos","Pressa per actuar","Demanar credencials"]}',
    3
  ),
  (
    'programacio',
    'variables-i-tipus',
    'fill_blank',
    'Completa: una variable guarda un ____ reutilitzable.',
    'Una variable dona nom a un valor per poder llegir-lo o modificar-lo mes endavant.',
    '{"placeholder":"paraula clau","correctAnswer":"valor"}',
    3
  ),
  (
    'programacio',
    'variables-i-tipus',
    'code_choice',
    'Quin snippet valida dades abans de guardar?',
    'Validar l''entrada abans de persistir evita estats invalids i errors posteriors.',
    '{"options":[{"label":"Snippet segur","code":"const parsed = schema.parse(input);\nawait save(parsed);"},{"label":"Snippet feble","code":"await save(input);"}],"correctAnswer":"Snippet segur"}',
    4
  )
) as seed(track_slug, lesson_slug, step_type, prompt, explanation, config, step_order)
  on seed.track_slug = tracks.slug and seed.lesson_slug = lessons.slug
where not exists (
  select 1
  from public.learning_steps existing
  where existing.lesson_id = lessons.id
    and existing.type = seed.step_type
    and existing.prompt = seed.prompt
);
