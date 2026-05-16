update public.learning_steps
set config = jsonb_build_object(
  'options', jsonb_build_array('Coordinar recursos del dispositiu','Nomes obrir webs','Substituir el navegador'),
  'correctAnswer', 'Coordinar recursos del dispositiu'
)
where prompt = 'Quina funcio principal te un sistema operatiu?';

update public.learning_steps
set config = jsonb_build_object('options', jsonb_build_array('Cert','Fals'), 'correctAnswer', 'Fals')
where prompt = 'Un navegador i un sistema operatiu son exactament el mateix.';

update public.learning_steps
set config = jsonb_build_object(
  'options', jsonb_build_array('Reutilitzar la mateixa contrasenya','Contrasenya unica amb 2FA','Compartir el codi per email'),
  'correctAnswer', 'Contrasenya unica amb 2FA'
)
where prompt = 'Quina practica millora mes la seguretat d''un compte?';

update public.learning_steps
set config = jsonb_build_object(
  'options', jsonb_build_array('Comprovar domini i origen','Clicar rapid','Enviar la contrasenya'),
  'correctAnswer', 'Comprovar domini i origen'
)
where prompt = 'Reps un enllac urgent que demana iniciar sessio. Quin primer control fas?';

insert into public.learning_steps (lesson_id, type, prompt, explanation, config, order_index)
select lessons.id, 'order_steps', 'Ordena els passos per entrar de forma segura a un compte.',
  'Primer valida el domini, despres introdueix credencials i finalment confirma el segon factor.',
  jsonb_build_object(
    'options', jsonb_build_array('Validar domini','Introduir credencials','Confirmar 2FA'),
    'correctAnswer', jsonb_build_array('Validar domini','Introduir credencials','Confirmar 2FA')
  ), 3
from public.learning_lessons lessons
join public.learning_modules modules on modules.id = lessons.module_id
where modules.slug = 'seguretat-basica' and lessons.slug = 'contrasenyes-i-2fa'
on conflict do nothing;

insert into public.learning_steps (lesson_id, type, prompt, explanation, config, order_index)
select lessons.id, 'match_pairs', 'Relaciona cada concepte amb la seva funcio.',
  '2FA afegeix una prova extra; una contrasenya unica limita limpacte si un servei cau.',
  jsonb_build_object(
    'options', jsonb_build_array(
      jsonb_build_object('left','2FA','right',jsonb_build_array('Segon factor','Mateixa clau','Domini sospitos')),
      jsonb_build_object('left','Contrasenya unica','right',jsonb_build_array('Mateixa clau','Clau no reutilitzada','Codi temporal'))
    ),
    'correctAnswer', jsonb_build_object('2FA','Segon factor','Contrasenya unica','Clau no reutilitzada')
  ), 4
from public.learning_lessons lessons
join public.learning_modules modules on modules.id = lessons.module_id
where modules.slug = 'seguretat-basica' and lessons.slug = 'contrasenyes-i-2fa'
on conflict do nothing;
