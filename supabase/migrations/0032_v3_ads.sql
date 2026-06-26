-- v3 ads — self-served house ad boxes shown natively inside the lane browser.
--
-- In-grid "Sponsored" cards rendered between lane objects. Managed by you via
-- the dashboard / SQL (insert rows); the public can only read active ads. No
-- insert/update/delete policies — only the service role (SQL editor) writes.

create table if not exists public.v3_ads (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  link_url text not null,
  label text,        -- small tag, e.g. the brand name
  headline text,     -- optional title line on the card
  weight int not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists v3_ads_active_idx on public.v3_ads (active, created_at desc);

alter table public.v3_ads enable row level security;

drop policy if exists v3_ads_read on public.v3_ads;

-- public can read only active ads; writes go through the service role (SQL editor)
create policy v3_ads_read on public.v3_ads
  for select using (active = true);

-- Example house ad (edit/remove freely):
-- insert into public.v3_ads (image_url, link_url, label, headline)
-- values ('https://picsum.photos/seed/morpad/600/800', 'https://example.com', 'MorpBase', 'Your ad here');
