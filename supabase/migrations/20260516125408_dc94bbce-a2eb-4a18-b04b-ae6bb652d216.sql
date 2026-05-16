
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles for select to authenticated
  using (auth.uid() = user_id);
create policy "admins manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Auto-grant admin to specific email on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email = 'felixnyandiko@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Portfolio
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tags text[] not null default '{}',
  image_url text,
  link_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.portfolio_items enable row level security;
create policy "public read portfolio" on public.portfolio_items for select using (true);
create policy "admin write portfolio" on public.portfolio_items for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default 'Sparkles',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.services enable row level security;
create policy "public read services" on public.services for select using (true);
create policy "admin write services" on public.services for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Site content (key/value)
create table public.site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
create policy "public read content" on public.site_content for select using (true);
create policy "admin write content" on public.site_content for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- updated_at triggers
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger trg_portfolio_updated before update on public.portfolio_items for each row execute function public.touch_updated_at();
create trigger trg_services_updated before update on public.services for each row execute function public.touch_updated_at();
create trigger trg_content_updated before update on public.site_content for each row execute function public.touch_updated_at();

-- Seed initial content
insert into public.site_content (key, value) values
  ('home_intro', 'I am a'),
  ('home_roles', 'Web Developer,Designer,Freelancer'),
  ('home_name', 'Felix Nyandiko'),
  ('about_bio', 'I am a passionate developer building modern, responsive web experiences with a focus on clean design and great user experience.'),
  ('about_headline', 'About Me'),
  ('contact_email', 'felixnyandiko@gmail.com'),
  ('contact_phone_primary', '254704759080'),
  ('contact_phone_secondary', '254737519365'),
  ('contact_whatsapp', '254704759080')
on conflict (key) do nothing;

insert into public.portfolio_items (title, description, tags, sort_order) values
  ('Silent Echo', 'Personal portfolio with typewriter hero and animated nav.', array['React','Tailwind'], 1),
  ('Kenyan E-Commerce', 'Mpesa-enabled shop with admin dashboard.', array['Next.js','Postgres'], 2),
  ('Analytics Dashboard', 'Realtime charts for SaaS metrics.', array['React','Recharts'], 3),
  ('Portfolio Template', 'Reusable portfolio starter.', array['Vite','TS'], 4),
  ('Learning Hub', 'Online courses platform.', array['React','Supabase'], 5),
  ('Brand Identity', 'Logo + brand system for local startup.', array['Design'], 6);

insert into public.services (title, description, icon, sort_order) values
  ('Frontend Development', 'Modern, accessible React interfaces.', 'Code', 1),
  ('Backend Development', 'APIs, databases and auth that scale.', 'Server', 2),
  ('UI/UX Design', 'Clean, user-focused product design.', 'Palette', 3),
  ('Mobile-First Design', 'Responsive layouts that feel native on mobile.', 'Smartphone', 4),
  ('Database Design', 'Postgres schemas and security policies.', 'Database', 5),
  ('SEO Optimization', 'Faster, more discoverable websites.', 'Search', 6);
