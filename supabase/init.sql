-- Init SQL for sticker-social Supabase project
-- Run this in Supabase SQL Editor → New Query, then click RUN

-- ============================================
-- TABELA: profiles (perfis dos usuários)
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  bio text default '',
  favorite_team text default 'Brasil',
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- TABELA: stickers (figurinhas)
-- ============================================
create table public.stickers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  athlete_name text not null,
  team text not null,
  position text,
  shirt_number integer,
  image_url text,
  status text not null check (status in ('tenho','quero','repetida')),
  description text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- TABELA: posts (postagens no feed)
-- ============================================
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sticker_id uuid references public.stickers(id) on delete cascade,
  caption text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- TABELA: likes (curtidas)
-- ============================================
create table public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, post_id)
);

-- ============================================
-- TABELA: comments (comentários)
-- ============================================
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- ============================================
-- TABELA: follows (seguidores)
-- ============================================
create table public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(follower_id, following_id)
);

-- ============================================
-- TABELA: messages (chat / direct)
-- ============================================
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- ============================================
-- HABILITAR RLS (Row Level Security)
-- ============================================
alter table public.profiles enable row level security;
alter table public.stickers enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.follows enable row level security;
alter table public.messages enable row level security;

-- ============================================
-- POLÍTICAS DE ACESSO (profiles)
-- ============================================
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- ============================================
-- POLÍTICAS DE ACESSO (stickers)
-- ============================================
create policy "Stickers are viewable by everyone"
  on public.stickers for select using (true);

create policy "Users can insert their own stickers"
  on public.stickers for insert with check (auth.uid() = user_id);

create policy "Users can update their own stickers"
  on public.stickers for update using (auth.uid() = user_id);

create policy "Users can delete their own stickers"
  on public.stickers for delete using (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS DE ACESSO (posts)
-- ============================================
create policy "Posts are viewable by everyone"
  on public.posts for select using (true);

create policy "Users can insert their own posts"
  on public.posts for insert with check (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.posts for delete using (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS DE ACESSO (likes)
-- ============================================
create policy "Likes are viewable by everyone"
  on public.likes for select using (true);

create policy "Users can insert their own likes"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Users can delete their own likes"
  on public.likes for delete using (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS DE ACESSO (comments)
-- ============================================
create policy "Comments are viewable by everyone"
  on public.comments for select using (true);

create policy "Users can insert their own comments"
  on public.comments for insert with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.comments for delete using (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS DE ACESSO (follows)
-- ============================================
create policy "Follows are viewable by everyone"
  on public.follows for select using (true);

create policy "Users can follow others"
  on public.follows for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow others"
  on public.follows for delete using (auth.uid() = follower_id);

-- ============================================
-- POLÍTICAS DE ACESSO (messages)
-- ============================================
create policy "Users can view their own messages"
  on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on public.messages for insert with check (auth.uid() = sender_id);

-- ============================================
-- TRIGGER: criar profile automaticamente
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
