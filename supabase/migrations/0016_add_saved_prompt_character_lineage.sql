alter table public.saved_prompts
  add column if not exists character_id text,
  add column if not exists character_name_snapshot text;
