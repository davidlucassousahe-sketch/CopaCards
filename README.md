# 🏆 Stickers da Copa — Rede Social de Colecionadores

> Rede social para colecionadores de figurinhas digitais da Copa do Mundo.
> Construída com **Vite + React + Supabase + ShadCN/UI**.

---

## 🎨 Identidade Visual

| Cor | Hex | Uso |
|-----|-----|-----|
| 🟢 Verde Brasil | `#009739` | Primária |
| 🟡 Amarelo | `#FEDD00` | Destaque |
| 🔵 Azul | `#012169` | Secundária |
| ⚪ Branco | `#FFFFFF` | Fundo claro |
| ⚫ Escuro | `#0F172A` | Fundo escuro |

---

# 📋 GUIA PASSO A PASSO NO VS CODE

> Siga esta ordem EXATA. Cada passo depende do anterior.

---

# 📋 GUIA PASSO A PASSO NO VS CODE

> Siga esta ordem EXATA. Cada passo depende do anterior.

---

## **PASSO 0 — PRÉ-REQUISITOS**

Antes de começar, instale no seu computador:

1. **Node.js 18+** → https://nodejs.org
2. **VS Code** → https://code.visualstudio.com
3. **Git** → https://git-scm.com
4. **Conta no GitHub** → https://github.com
5. **Conta no Supabase** → https://supabase.com (grátis)
6. **Conta na Vercel** → https://vercel.com (grátis, login com GitHub)

No terminal, confirme se está tudo certo:

```bash
node -v    # deve mostrar v18 ou superior
npm -v     # deve mostrar 9 ou superior
git --version
```

---

## **PASSO 1 — CRIAR O PROJETO COM VITE**

Abra o terminal (PowerShell, CMD ou Bash) e rode:

```bash
npm create vite@latest sticker-social -- --template react
cd sticker-social
code .
```

> O VS Code vai abrir a pasta do projeto.

No terminal **dentro da pasta do projeto**, instale as dependências:

```bash
npm install
```

---

## **PASSO 2 — INSTALAR TAILWIND + SHADCN/UI**

Tailwind é necessário para o ShadCN. Instale nessa ordem:

```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

Agora instale o ShadCN/UI:

```bash
npx shadcn-ui@latest init
```

Quando perguntar, responda:

- **Style:** `Default`
- **Base color:** `Slate`
- **CSS file location:** `src/index.css`
- **CSS variables for colors?:** `Yes`
- **tailwind.config.js location:** `tailwind.config.js`
- **components.json:** `yes`
- **TypeScript or JavaScript:** `JavaScript`
- **Write configuration to components.json:** `yes`

Agora instale os componentes do ShadCN que vamos usar:

```bash
npx shadcn-ui@latest add button card input label avatar dropdown-menu dialog badge separator textarea sonner select tabs switch scroll-area
```

---

## **PASSO 3 — DEPENDÊNCIAS EXTRAS DO PROJETO**

```bash
npm install react-router-dom @supabase/supabase-js lucide-react date-fns next-themes
```

---

## **PASSO 4 — CONFIGURAR O SUPABASE**

### 4.1 — Criar o projeto no Supabase

1. Acesse https://supabase.com/dashboard
2. Clique em **"New Project"**
3. Preencha:
   - **Name:** `sticker-social`
   - **Database Password:** (anote essa senha!)
   - **Region:** `South America (São Paulo)`
4. Clique em **"Create new project"** e aguarde ~2 min

### 4.2 — Pegar as chaves

1. No painel do Supabase, vá em **Project Settings → API**
2. Copie:
   - `Project URL` → será o `VITE_SUPABASE_URL`
   - `anon public key` → será o `VITE_SUPABASE_ANON_KEY`

### 4.3 — Criar o arquivo `.env` na raiz do projeto

```bash
# sticker-social/.env
VITE_SUPABASE_URL=https://SEU-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...sua-anon-key-aqui
```

> ⚠️ O `.env` NÃO vai para o GitHub (ele já está no `.gitignore`).

### 4.4 — Criar as tabelas no Supabase

Vá em **SQL Editor → New Query** no painel do Supabase, e rode este SQL inteiro:

```sql
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
```

Clique em **RUN**. Se aparecer `Success`, tudo certo!

### 4.5 — Criar bucket de Storage para avatares e figurinhas

1. Vá em **Storage → New bucket**
2. Nome: `media`
3. Marque **"Public bucket"**
4. Clique em **Create bucket**

Agora adicione estas políticas no bucket `media` (SQL Editor):

```sql
create policy "Public read access"
  on storage.objects for select using (bucket_id = 'media');

create policy "Users can upload their own media"
  on storage.objects for insert with check (
    bucket_id = 'media' and auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## **PASSO 5 — CONFIGURAR O TEMA (CLARO/ESCURO)**

Edite o arquivo `tailwind.config.js` para usar as cores da identidade visual brasileira e suportar dark mode.

(O arquivo já vem pronto neste projeto, veja abaixo.)

---

## **PASSO 6 — CRIAR OS ARQUIVOS DO PROJETO**

A estrutura de pastas está assim:

```
sticker-social/
├── public/
├── src/
│   ├── components/
│   │   └── ui/          ← componentes ShadCN
│   ├── contexts/        ← AuthContext, ThemeContext
│   ├── hooks/           ← useToast, useTheme
│   ├── lib/             ← supabase.js, utils.js
│   ├── pages/           ← Login, Register, Feed, Profile, etc.
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                 ← suas chaves Supabase
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

> Os arquivos `src/lib/supabase.js`, `src/contexts/AuthContext.jsx`, `src/App.jsx`, todas as páginas, etc. já estão escritos neste projeto. Basta substituir/criar conforme os arquivos deste repositório.

---

## **PASSO 7 — RODAR LOCALMENTE**

```bash
npm run dev
```

Abra http://localhost:5173

**Fluxo de teste:**

1. Clique em **"Criar conta"**
2. Preencha username, nome completo, e-mail e senha
3. Você será logado automaticamente
4. Vá em **"Nova Figurinha"** e cadastre uma figurinha
5. Vá em **"Feed"** para ver as postagens
6. Teste curtir, comentar, seguir e abrir chat

---

## **PASSO 8 — SUBIR PARA O GITHUB**

No terminal do VS Code:

```bash
git init
git add .
git commit -m "feat: rede social de figurinhas da copa - v1"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/sticker-social.git
git push -u origin main
```

> Se pedir login, use seu usuário do GitHub e um **Personal Access Token** (não a senha).
> Para gerar o token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token.

---

## **PASSO 9 — DEPLOY NA VERCEL**

1. Acesse https://vercel.com e faça login com GitHub
2. Clique em **"Add New → Project"**
3. Selecione o repositório `sticker-social`
4. Em **"Environment Variables"**, adicione:
   - `VITE_SUPABASE_URL` = sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` = sua anon key
5. Clique em **"Deploy"**
6. Em ~1 minuto você terá a URL pública 🎉

Pronto! Sua rede social está no ar.

---

# 🧠 RESUMO DA ARQUITETURA

| Camada | Tecnologia |
|--------|------------|
| Build / Dev | Vite |
| UI | React + ShadCN/UI + Tailwind |
| Roteamento | React Router DOM |
| Autenticação | Supabase Auth |
| Banco de Dados | Supabase PostgreSQL |
| Storage | Supabase Storage |
| Estado global | React Context API |
| Hospedagem | Vercel |
| Versionamento | Git + GitHub |

---

# ✅ CHECKLIST DE ENTREGA

- [x] Login / Cadastro / Recuperação de senha
- [x] Feed com postagens de figurinhas
- [x] Curtir / Descurtir
- [x] Comentários
- [x] Perfil editável (avatar, nome, bio, seleção favorita)
- [x] Seguir / deixar de seguir
- [x] Chat / mensagens diretas
- [x] CRUD completo de figurinhas (tenho / quero / repetida)
- [x] Modo claro e escuro
- [x] Identidade visual brasileira
- [x] Responsivo (mobile + desktop)
- [x] Deploy na Vercel
- [x] Código no GitHub
