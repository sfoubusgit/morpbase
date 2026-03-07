-- Add prompt metadata fields for saved prompts

alter table public.saved_prompts
  add column if not exists model text,
  add column if not exists purpose text,
  add column if not exists used_at text;
