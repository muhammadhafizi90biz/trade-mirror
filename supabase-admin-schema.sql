create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  is_admin boolean not null default false,
  is_super_admin boolean not null default false
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  asset text,
  ticks integer default 0,
  trade_time timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.market_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.system_notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  audience text not null default 'all' check (audience = 'all'),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.trades enable row level security;
alter table public.market_posts enable row level security;
alter table public.system_notifications enable row level security;

create policy "profiles are readable by owner"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "admins can read profiles"
  on public.profiles
  for select
  using (
    exists (
      select 1
      from public.profiles admin_profile
      where admin_profile.id = auth.uid()
        and admin_profile.is_admin = true
    )
  );
