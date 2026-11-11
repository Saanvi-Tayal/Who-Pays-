-- ==============================================================================
-- WHO PAYS? — SUPABASE POSTGRESQL SCHEMA (THE LEDGER)
-- Conforms to DATA_MODEL.md & AGENT_RULES.md
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Groups table
create table if not exists public.groups (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  emoji text default '🎉',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Players table
create table if not exists public.players (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references public.groups(id) on delete cascade,
  display_name text not null,
  avatar_key text default 'AV-01',
  color_id text default 'red',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Matches table (The Ledger of decisions)
create table if not exists public.matches (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid references public.groups(id) on delete set null,
  game_id text not null,            -- 'time_bomb', 'roulette', 'tap_frenzy', 'reaction_standoff'
  stakes_mode_id text not null,     -- 'who_pays', 'awkward_duty', etc.
  dilemma text,                     -- 'Where to Eat?', 'Who Pays?', etc.
  loser_slot_id text,
  loser_player_name text not null,
  winner_player_names text[] default array[]::text[],
  metrics jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Indexes for lightning fast Ledger queries
create index if not exists idx_matches_group_id on public.matches(group_id);
create index if not exists idx_matches_created_at on public.matches(created_at desc);
create index if not exists idx_players_group_id on public.players(group_id);

-- Row Level Security (RLS) policies
alter table public.groups enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;

-- Public read/insert policies for anonymous local-first play
create policy "Allow anonymous read groups" on public.groups for select using (true);
create policy "Allow anonymous insert groups" on public.groups for insert with check (true);

create policy "Allow anonymous read players" on public.players for select using (true);
create policy "Allow anonymous insert players" on public.players for insert with check (true);
create policy "Allow anonymous update players" on public.players for update using (true);

create policy "Allow anonymous read matches" on public.matches for select using (true);
create policy "Allow anonymous insert matches" on public.matches for insert with check (true);
