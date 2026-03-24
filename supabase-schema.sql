-- Quintal 333 - Sistema de Pos-Vendas
-- Execute este SQL no Supabase SQL Editor

-- Clientes
create table if not exists customers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null unique,
  birthday text,
  accepts_whatsapp boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Avaliacoes
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references customers(id) on delete cascade,
  pizza_rating smallint not null check (pizza_rating between 1 and 5),
  service_rating smallint not null check (service_rating between 1 and 5),
  ambiance_rating smallint not null check (ambiance_rating between 1 and 5),
  comment text,
  visit_type text default 'dine_in' check (visit_type in ('dine_in', 'delivery')),
  created_at timestamptz default now()
);

-- Premios
create table if not exists prizes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  probability integer not null check (probability between 0 and 100),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Cupons
create table if not exists coupons (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references customers(id) on delete cascade,
  review_id uuid references reviews(id) on delete cascade,
  prize_id uuid references prizes(id) on delete set null,
  code text not null unique,
  redeemed boolean default false,
  redeemed_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Indices
create index if not exists idx_reviews_customer on reviews(customer_id);
create index if not exists idx_reviews_created on reviews(created_at desc);
create index if not exists idx_coupons_customer on coupons(customer_id);
create index if not exists idx_coupons_code on coupons(code);
create index if not exists idx_customers_phone on customers(phone);

-- Premios iniciais (conforme PRD)
insert into prizes (name, description, probability) values
  ('10% OFF', '10% de desconto na proxima visita', 30),
  ('Sobremesa Gratis', 'Uma sobremesa por nossa conta na proxima visita', 15),
  ('Entrada Gratis', 'Um petisco gratis na proxima visita', 10),
  ('15% OFF', '15% de desconto na proxima visita', 8),
  ('Bebida Cortesia', 'Uma bebida por nossa conta na proxima visita', 7),
  ('Quase!', 'Nao foi dessa vez... Mas use QUINTAL5 para 5% off!', 25),
  ('Pizza Gratis', 'Uma pizza de 4 fatias por nossa conta!', 3),
  ('Aniversariante VIP', 'Desconto especial de aniversario!', 2);

-- RLS (Row Level Security)
alter table customers enable row level security;
alter table reviews enable row level security;
alter table prizes enable row level security;
alter table coupons enable row level security;

-- Politicas publicas de leitura para prizes (todos podem ver premios)
create policy "Prizes are viewable by everyone" on prizes for select using (true);

-- Politicas de insercao para o fluxo do cliente (via anon key)
create policy "Anyone can create customers" on customers for insert with check (true);
create policy "Anyone can read own customer by phone" on customers for select using (true);
create policy "Anyone can update own customer" on customers for update using (true);
create policy "Anyone can create reviews" on reviews for insert with check (true);
create policy "Anyone can create coupons" on coupons for insert with check (true);
create policy "Anyone can read coupons" on coupons for select using (true);
create policy "Anyone can read reviews" on reviews for select using (true);
