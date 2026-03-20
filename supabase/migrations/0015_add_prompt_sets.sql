create table if not exists public.prompt_sets (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create unique index if not exists idx_prompt_sets_user_name
  on public.prompt_sets (user_id, lower(name))
  where deleted_at is null;

create index if not exists idx_prompt_sets_user
  on public.prompt_sets(user_id);

drop trigger if exists set_prompt_sets_updated_at on public.prompt_sets;

create trigger set_prompt_sets_updated_at
before update on public.prompt_sets
for each row execute function public.set_updated_at();

alter table public.saved_prompts
  add column if not exists prompt_set_id text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'saved_prompts_prompt_set_id_fkey'
  ) then
    alter table public.saved_prompts
      add constraint saved_prompts_prompt_set_id_fkey
      foreign key (prompt_set_id)
      references public.prompt_sets(id)
      on delete set null;
  end if;
end $$;

create index if not exists idx_saved_prompts_prompt_set
  on public.saved_prompts(prompt_set_id);

alter table public.prompt_sets enable row level security;

drop policy if exists prompt_sets_owner on public.prompt_sets;

create policy prompt_sets_owner on public.prompt_sets
  for all using (
    exists (
      select 1
      from public.users u
      where u.id = user_id and u.auth_user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1
      from public.users u
      where u.id = user_id and u.auth_user_id = auth.uid()
    )
  );
