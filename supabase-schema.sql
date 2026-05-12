-- Quintal 333 - Sistema de Pos-Vendas
-- Schema dedicado para isolamento em Supabase compartilhado
-- Execute via psql no Postgres OU via SQL Editor do Studio.
-- Lembre-se: o PostgREST precisa ter `quintal` em PGRST_DB_SCHEMAS.

create schema if not exists quintal;
grant usage on schema quintal to anon, authenticated, service_role;
grant all on all tables in schema quintal to anon, authenticated, service_role;
grant all on all sequences in schema quintal to anon, authenticated, service_role;
alter default privileges in schema quintal grant all on tables to anon, authenticated, service_role;
alter default privileges in schema quintal grant all on sequences to anon, authenticated, service_role;

-- Clientes
create table if not exists quintal.customers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null unique,
  birthday text,
  accepts_whatsapp boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Avaliacoes
create table if not exists quintal.reviews (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references quintal.customers(id) on delete cascade,
  pizza_rating smallint not null check (pizza_rating between 1 and 5),
  service_rating smallint not null check (service_rating between 1 and 5),
  ambiance_rating smallint not null check (ambiance_rating between 1 and 5),
  comment text,
  visit_type text default 'dine_in' check (visit_type in ('dine_in', 'delivery')),
  created_at timestamptz default now()
);

-- Premios
create table if not exists quintal.prizes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  probability integer not null check (probability between 0 and 100),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Cupons
create table if not exists quintal.coupons (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references quintal.customers(id) on delete cascade,
  review_id uuid references quintal.reviews(id) on delete cascade,
  prize_id uuid references quintal.prizes(id) on delete set null,
  code text not null unique,
  redeemed boolean default false,
  redeemed_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Indices
create index if not exists idx_quintal_reviews_customer on quintal.reviews(customer_id);
create index if not exists idx_quintal_reviews_created on quintal.reviews(created_at desc);
create index if not exists idx_quintal_coupons_customer on quintal.coupons(customer_id);
create index if not exists idx_quintal_coupons_code on quintal.coupons(code);
create index if not exists idx_quintal_customers_phone on quintal.customers(phone);

-- Prêmios iniciais (conforme PRD)
insert into quintal.prizes (name, description, probability) values
  ('10% OFF', '10% de desconto na próxima visita', 30),
  ('Sobremesa Grátis', 'Uma sobremesa por nossa conta na próxima visita', 15),
  ('Entrada Grátis', 'Um petisco grátis na próxima visita', 10),
  ('15% OFF', '15% de desconto na próxima visita', 8),
  ('Bebida Cortesia', 'Uma bebida por nossa conta na próxima visita', 7),
  ('Quase!', 'Não foi dessa vez... Mas use QUINTAL5 para 5% off!', 25),
  ('Pizza Grátis', 'Uma pizza de 4 fatias por nossa conta!', 3),
  ('Aniversariante VIP', 'Desconto especial de aniversário!', 2)
on conflict do nothing;
