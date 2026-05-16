insert into public.learning_steps (lesson_id, type, prompt, explanation, config, order_index)
select lessons.id, 'order_steps', 'Ordena les capes basiques dun dispositiu.',
  'El hardware es la base fisica, el sistema operatiu coordina recursos i les aplicacions executen tasques concretes.',
  jsonb_build_object(
    'options', jsonb_build_array('Hardware','Sistema operatiu','Aplicacions'),
    'correctAnswer', jsonb_build_array('Hardware','Sistema operatiu','Aplicacions')
  ), 3
from public.learning_lessons lessons
join public.learning_modules modules on modules.id = lessons.module_id
where modules.slug = 'fonaments-digitals' and lessons.slug = 'que-es-un-sistema-operatiu'
on conflict do nothing;

insert into public.learning_steps (lesson_id, type, prompt, explanation, config, order_index)
select lessons.id, 'match_pairs', 'Relaciona cada element amb la seva funcio.',
  'Cada capa te una responsabilitat diferent dins el dispositiu.',
  jsonb_build_object(
    'options', jsonb_build_array(
      jsonb_build_object('left','Hardware','right',jsonb_build_array('Peces fisiques','Navegar webs','Guardar contrasenyes')),
      jsonb_build_object('left','Sistema operatiu','right',jsonb_build_array('Coordinar recursos','Cable de xarxa','Pagina web'))
    ),
    'correctAnswer', jsonb_build_object('Hardware','Peces fisiques','Sistema operatiu','Coordinar recursos')
  ), 4
from public.learning_lessons lessons
join public.learning_modules modules on modules.id = lessons.module_id
where modules.slug = 'fonaments-digitals' and lessons.slug = 'que-es-un-sistema-operatiu'
on conflict do nothing;
