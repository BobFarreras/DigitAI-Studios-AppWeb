insert into public.learning_steps (lesson_id, type, prompt, explanation, config, order_index)
select l.id, 'multiple_choice', 'Quin objectiu principal te aquesta llico?',
  coalesce(l.objective, 'Reforçar el concepte principal de la llico.'),
  jsonb_build_object(
    'options', jsonb_build_array(coalesce(l.objective, l.title), 'Saltar la practica', 'Memoritzar sense entendre'),
    'correctAnswer', coalesce(l.objective, l.title)
  ), 1
from public.learning_lessons l
where not exists (select 1 from public.learning_steps s where s.lesson_id = l.id);

insert into public.learning_steps (lesson_id, type, prompt, explanation, config, order_index)
select l.id, 'true_false', 'Aquesta practica serveix per aplicar el concepte en un cas real.',
  'Les lliçons DigitAI prioritzen aplicar conceptes, no memoritzar definicions sense context.',
  jsonb_build_object(
    'options', jsonb_build_array('Cert','Fals'),
    'correctAnswer', 'Cert'
  ), 2
from public.learning_lessons l
where (select count(*) from public.learning_steps s where s.lesson_id = l.id) = 1;
