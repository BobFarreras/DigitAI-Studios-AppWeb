-- @file supabase/migrations/202605171230_seed_expert_learning_interactions.sql
-- @updated 2026-05-17
-- @summary Enables and seeds expert learning interaction types.
-- @scope Learning step type constraint plus content seed.

alter table public.learning_steps
  drop constraint if exists learning_steps_type_check;

alter table public.learning_steps
  add constraint learning_steps_type_check check (type in (
    'multiple_choice','multi_select','true_false','order_steps',
    'match_pairs','fill_blank','code_choice','scenario',
    'terminal_simulation','network_diagram','code_editor',
    'ai_prompt_review','security_triage'
  ));

insert into public.learning_steps (lesson_id, type, prompt, explanation, config, order_index)
select lessons.id, seed.step_type, seed.prompt, seed.explanation, seed.config::jsonb, seed.step_order
from public.learning_lessons lessons
join public.learning_modules modules on modules.id = lessons.module_id
join public.learning_tracks tracks on tracks.id = modules.track_id
join (values
  (
    'sistemes-informatics',
    'que-es-una-ip',
    'terminal_simulation',
    'Quina comanda comprova la ruta cap a digitai.studio?',
    'traceroute mostra els salts de xarxa fins al desti i ajuda a entendre encaminament basic.',
    '{"promptLabel":"network lab","correctAnswer":"traceroute digitai.studio"}',
    3
  ),
  (
    'sistemes-informatics',
    'que-es-una-ip',
    'network_diagram',
    'Quin node resol un domini abans de connectar?',
    'DNS tradueix noms de domini a adreces IP abans que el navegador connecti.',
    '{"options":[{"label":"Router","description":"Encamina paquets entre xarxes"},{"label":"DNS","description":"Resol noms de domini"},{"label":"Firewall","description":"Filtra connexions segons regles"}],"correctAnswer":"DNS"}',
    4
  ),
  (
    'programacio',
    'variables-i-tipus',
    'code_editor',
    'Escriu una validacio Zod minima abans de guardar input.',
    'Validar abans de persistir evita que dades externes trenquin el domini.',
    '{"language":"ts","correctAnswer":"const safe = schema.parse(input);"}',
    5
  ),
  (
    'ia-aplicada',
    'prompt-clar',
    'ai_prompt_review',
    'Que falta en un prompt massa generic?',
    'Un prompt professional defineix objectiu, context i format de sortida verificable.',
    '{"options":["Objectiu concret","Context necessari","Format de sortida","Mes emojis"],"correctAnswer":["Objectiu concret","Context necessari","Format de sortida"]}',
    3
  ),
  (
    'ciberseguretat',
    'phishing-basic',
    'security_triage',
    'Un formulari fals roba credencials corporatives amb 2FA fatigue. Quin risc assignes?',
    'Robatori de credencials corporatives amb bypass social de 2FA pot comprometre comptes interns.',
    '{"options":["Baixa","Mitjana","Alta","Critica"],"correctAnswer":"Alta"}',
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
