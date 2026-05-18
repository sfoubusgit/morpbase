-- Voting + winner tracking for challenges.
--
-- Adds challenge_entry_votes (one row per voter per entry, with the
-- challenge_id denormalized so we can scope queries per challenge) and
-- a winner_entry_id pointer on challenges. Realtime publication is
-- extended to challenge_entries and challenge_entry_votes so the panel
-- can update vote counts and the entries list live.

-- ── challenge_entry_votes ─────────────────────────────────────────────────────

create table if not exists public.challenge_entry_votes (
  id           uuid        primary key default gen_random_uuid(),
  entry_id     uuid        not null references public.challenge_entries(id) on delete cascade,
  challenge_id uuid        not null references public.challenges(id) on delete cascade,
  voter_auth_uid text      not null,
  created_at   timestamptz not null default now(),
  unique (entry_id, voter_auth_uid)
);

create index if not exists idx_challenge_entry_votes_entry
  on public.challenge_entry_votes(entry_id);
create index if not exists idx_challenge_entry_votes_challenge
  on public.challenge_entry_votes(challenge_id);

alter table public.challenge_entry_votes enable row level security;

drop policy if exists challenge_entry_votes_read   on public.challenge_entry_votes;
drop policy if exists challenge_entry_votes_insert on public.challenge_entry_votes;
drop policy if exists challenge_entry_votes_delete on public.challenge_entry_votes;

create policy challenge_entry_votes_read on public.challenge_entry_votes
  for select using (true);

create policy challenge_entry_votes_insert on public.challenge_entry_votes
  for insert with check (voter_auth_uid = auth.uid()::text);

create policy challenge_entry_votes_delete on public.challenge_entry_votes
  for delete using (voter_auth_uid = auth.uid()::text);


-- ── challenges.winner_entry_id ────────────────────────────────────────────────

alter table public.challenges
  add column if not exists winner_entry_id uuid
    references public.challenge_entries(id) on delete set null;


-- ── realtime publication ─────────────────────────────────────────────────────

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'challenge_entries'
  ) then
    alter publication supabase_realtime add table public.challenge_entries;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'challenge_entry_votes'
  ) then
    alter publication supabase_realtime add table public.challenge_entry_votes;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'challenges'
  ) then
    alter publication supabase_realtime add table public.challenges;
  end if;
end $$;
