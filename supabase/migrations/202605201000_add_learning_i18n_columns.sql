-- @file supabase/migrations/202605201000_add_learning_i18n_columns.sql
-- @updated 2026-05-20
-- @summary Add i18n columns for multilingual learning content
-- @scope Schema changes for learning platform localization

-- 1. Add columns to learning_tracks
ALTER TABLE learning_tracks 
  ADD COLUMN title_ca TEXT NOT NULL DEFAULT '',
  ADD COLUMN title_es TEXT,
  ADD COLUMN title_en TEXT,
  ADD COLUMN title_it TEXT,
  ADD COLUMN description_ca TEXT,
  ADD COLUMN description_es TEXT,
  ADD COLUMN description_en TEXT,
  ADD COLUMN description_it TEXT;

-- 2. Add columns to learning_modules  
ALTER TABLE learning_modules
  ADD COLUMN title_ca TEXT NOT NULL DEFAULT '',
  ADD COLUMN title_es TEXT,
  ADD COLUMN title_en TEXT,
  ADD COLUMN title_it TEXT,
  ADD COLUMN description_ca TEXT,
  ADD COLUMN description_es TEXT,
  ADD COLUMN description_en TEXT,
  ADD COLUMN description_it TEXT;

-- 3. Add columns to learning_lessons
ALTER TABLE learning_lessons
  ADD COLUMN title_ca TEXT NOT NULL DEFAULT '',
  ADD COLUMN title_es TEXT,
  ADD COLUMN title_en TEXT,
  ADD COLUMN title_it TEXT,
  ADD COLUMN objective_ca TEXT,
  ADD COLUMN objective_es TEXT,
  ADD COLUMN objective_en TEXT,
  ADD COLUMN objective_it TEXT;

-- 4. Add columns to learning_steps
ALTER TABLE learning_steps
  ADD COLUMN prompt_ca TEXT NOT NULL DEFAULT '',
  ADD COLUMN prompt_es TEXT,
  ADD COLUMN prompt_en TEXT,
  ADD COLUMN prompt_it TEXT,
  ADD COLUMN explanation_ca TEXT,
  ADD COLUMN explanation_es TEXT,
  ADD COLUMN explanation_en TEXT,
  ADD COLUMN explanation_it TEXT;

-- 5. Migrate existing content to _ca columns
UPDATE learning_tracks SET 
  title_ca = title, 
  description_ca = description 
  WHERE title_ca IS NULL OR title_ca = '';

UPDATE learning_modules SET 
  title_ca = title, 
  description_ca = description 
  WHERE title_ca IS NULL OR title_ca = '';

UPDATE learning_lessons SET 
  title_ca = title, 
  objective_ca = objective 
  WHERE title_ca IS NULL OR title_ca = '';

UPDATE learning_steps SET 
  prompt_ca = prompt, 
  explanation_ca = explanation 
  WHERE prompt_ca IS NULL OR prompt_ca = '';

-- 6. Create views with locale selection
-- View for tracks
CREATE OR REPLACE VIEW v_learning_tracks AS
SELECT 
  id, slug, icon, color, order_index, active, publication_status, created_at,
  COALESCE(title_ca, '') AS title,
  COALESCE(title_es, title_ca, '') AS title_es,
  COALESCE(title_en, title_ca, '') AS title_en,
  COALESCE(title_it, title_ca, '') AS title_it,
  COALESCE(description_ca, '') AS description,
  COALESCE(description_es, description_ca, '') AS description_es,
  COALESCE(description_en, description_ca, '') AS description_en,
  COALESCE(description_it, description_ca, '') AS description_it
FROM learning_tracks;

-- View for modules
CREATE OR REPLACE VIEW v_learning_modules AS
SELECT 
  id, track_id, slug, level, order_index, active, publication_status,
  COALESCE(title_ca, '') AS title,
  COALESCE(title_es, title_ca, '') AS title_es,
  COALESCE(title_en, title_ca, '') AS title_en,
  COALESCE(title_it, title_ca, '') AS title_it,
  COALESCE(description_ca, '') AS description,
  COALESCE(description_es, description_ca, '') AS description_es,
  COALESCE(description_en, description_ca, '') AS description_en,
  COALESCE(description_it, description_ca, '') AS description_it
FROM learning_modules;

-- View for lessons
CREATE OR REPLACE VIEW v_learning_lessons AS
SELECT 
  id, module_id, slug, estimated_minutes, xp_reward, order_index, active, publication_status,
  COALESCE(title_ca, '') AS title,
  COALESCE(title_es, title_ca, '') AS title_es,
  COALESCE(title_en, title_ca, '') AS title_en,
  COALESCE(title_it, title_ca, '') AS title_it,
  COALESCE(objective_ca, '') AS objective,
  COALESCE(objective_es, objective_ca, '') AS objective_es,
  COALESCE(objective_en, objective_ca, '') AS objective_en,
  COALESCE(objective_it, objective_ca, '') AS objective_it
FROM learning_lessons;

-- View for steps
CREATE OR REPLACE VIEW v_learning_steps AS
SELECT 
  id, lesson_id, type, media, config, order_index, publication_status,
  COALESCE(prompt_ca, '') AS prompt,
  COALESCE(prompt_es, prompt_ca, '') AS prompt_es,
  COALESCE(prompt_en, prompt_ca, '') AS prompt_en,
  COALESCE(prompt_it, prompt_ca, '') AS prompt_it,
  COALESCE(explanation_ca, '') AS explanation,
  COALESCE(explanation_es, explanation_ca, '') AS explanation_es,
  COALESCE(explanation_en, explanation_ca, '') AS explanation_en,
  COALESCE(explanation_it, explanation_ca, '') AS explanation_it
FROM learning_steps;