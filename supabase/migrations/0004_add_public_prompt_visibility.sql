-- Public prompt visibility toggle + public read policy

alter table public.public_profiles
  add column if not exists show_public_prompts boolean not null default false;

create policy saved_prompts_public_read on public.saved_prompts
  for select using (
    deleted_at is null
    and exists (
      select 1
      from public.public_profiles p
      where p.user_id = saved_prompts.user_id
        and p.show_public_prompts = true
    )
  );
