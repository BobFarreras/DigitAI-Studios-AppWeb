insert into public.learning_tracks (slug, title, description, icon, color, order_index, active)
values
  ('sistemes-informatics', 'Sistemes Informatics', 'Hardware, xarxes, DNS, ports i terminal inicial.', 'cpu', 'sky', 2, true),
  ('programacio', 'Programacio', 'Variables, funcions, JSON, APIs i Git basic.', 'code', 'grape', 3, true),
  ('ia-aplicada', 'IA Aplicada', 'Prompts, verificacio, limits i automatitzacio amb IA.', 'bot', 'pink', 4, true),
  ('automatitzacions', 'Automatitzacions', 'Triggers, webhooks, CRM, errors comuns i logs.', 'workflow', 'amber', 5, true),
  ('ciberseguretat', 'Ciberseguretat', 'Amenaces comunes, phishing, HTTP, OWASP i permisos.', 'shield', 'emerald', 6, true)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon,
  color = excluded.color,
  order_index = excluded.order_index,
  active = excluded.active;

insert into public.learning_modules (track_id, slug, title, description, level, order_index, active)
select track.id, seed.module_slug, seed.module_title, seed.module_description, seed.level, 1, true
from public.learning_tracks track
join (values
  ('sistemes-informatics', 'xarxes-inicials', 'Xarxes inicials', 'IP, DNS, router, ports i terminal inicial.', 'basic'),
  ('programacio', 'fonaments-programacio', 'Fonaments de programacio', 'Variables, condicionals, funcions i dades.', 'basic'),
  ('ia-aplicada', 'prompts-i-verificacio', 'Prompts i verificacio', 'Prompts clars, limits i comprovacio de respostes.', 'basic'),
  ('automatitzacions', 'fluxos-i-webhooks', 'Fluxos i webhooks', 'Triggers, actions, webhooks i lectura de logs.', 'basic'),
  ('ciberseguretat', 'seguretat-web-basica', 'Seguretat web basica', 'Phishing, HTTPS, hashing i OWASP inicial.', 'basic')
) as seed(track_slug, module_slug, module_title, module_description, level)
  on seed.track_slug = track.slug
on conflict (track_id, slug) do update set
  title = excluded.title,
  description = excluded.description,
  level = excluded.level,
  order_index = excluded.order_index,
  active = excluded.active;

insert into public.learning_lessons (module_id, slug, title, objective, estimated_minutes, xp_reward, order_index, active)
select module.id, seed.lesson_slug, seed.lesson_title, seed.objective, 6, 12, 1, true
from public.learning_modules module
join public.learning_tracks track on track.id = module.track_id
join (values
  ('sistemes-informatics', 'que-es-una-ip', 'Que es una IP', 'Entendre com sidentifica un dispositiu dins una xarxa.'),
  ('programacio', 'variables-i-tipus', 'Variables i tipus', 'Guardar dades i reconeixer tipus basics.'),
  ('ia-aplicada', 'prompt-clar', 'Prompt clar', 'Escriure una instruccio concreta i verificable.'),
  ('automatitzacions', 'trigger-i-action', 'Trigger i action', 'Distingir que inicia un flux i que executa.'),
  ('ciberseguretat', 'phishing-basic', 'Phishing basic', 'Detectar senyals de risc en missatges i enllacos.')
) as seed(track_slug, lesson_slug, lesson_title, objective)
  on seed.track_slug = track.slug
where module.order_index = 1
on conflict (module_id, slug) do update set
  title = excluded.title,
  objective = excluded.objective,
  estimated_minutes = excluded.estimated_minutes,
  xp_reward = excluded.xp_reward,
  order_index = excluded.order_index,
  active = excluded.active;
