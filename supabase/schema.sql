-- Vaultify schema
-- Execute no SQL Editor do Supabase. Idempotente (pode ser re-executado).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  salt text not null default '',
  wrapped_key text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.passwords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  site text not null,
  enc_username text not null,
  enc_password text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists passwords_user_id_idx on public.passwords (user_id);

alter table public.profiles enable row level security;
alter table public.passwords enable row level security;

drop policy if exists "profiles: select own" on public.profiles;

create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles: insert own" on public.profiles;

create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "passwords: select own" on public.passwords;

create policy "passwords: select own" on public.passwords
  for select using (auth.uid() = user_id);

drop policy if exists "passwords: insert own" on public.passwords;

create policy "passwords: insert own" on public.passwords
  for insert with check (auth.uid() = user_id);

drop policy if exists "passwords: update own" on public.passwords;

create policy "passwords: update own" on public.passwords
  for update using (auth.uid() = user_id);

drop policy if exists "passwords: delete own" on public.passwords;

create policy "passwords: delete own" on public.passwords
  for delete using (auth.uid() = user_id);

-- Cria o perfil automaticamente ao cadastrar um usuário.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Mantém updated_at atualizado.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists passwords_set_updated_at on public.passwords;

create trigger passwords_set_updated_at
  before update on public.passwords
  for each row execute procedure public.set_updated_at();
