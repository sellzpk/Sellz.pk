-- =============================================================
-- Sellz.pk — Full Database Schema
-- Run this in Supabase SQL Editor
-- =============================================================

-- ─── TABLES ──────────────────────────────────────────────────

create table if not exists users (
  id uuid references auth.users primary key,
  full_name text,
  phone text unique,
  cnic text unique,
  cnic_front_url text,
  cnic_back_url text,
  selfie_url text,
  cnic_verified boolean default false,
  city text,
  whatsapp_number text,
  whatsapp_chat_only boolean default true,
  google_id text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

create table if not exists ads (
  id bigserial primary key,
  seller_id uuid references users(id) on delete cascade,
  title text not null,
  description text,
  price numeric not null,
  category text not null,
  subcategory text,
  condition text,
  city text,
  area text,
  status text default 'pending' check (status in ('pending', 'active', 'rejected', 'sold', 'expired')),
  ownership_proof_url text,
  views integer default 0,
  created_at timestamptz default now(),
  expires_at timestamptz default now() + interval '30 days'
);

create table if not exists ad_photos (
  id bigserial primary key,
  ad_id bigint references ads(id) on delete cascade,
  url text not null,
  order_index integer default 0
);

create table if not exists chats (
  id bigserial primary key,
  ad_id bigint references ads(id) on delete cascade,
  buyer_id uuid references users(id) on delete cascade,
  seller_id uuid references users(id) on delete cascade,
  phone_revealed boolean default false,
  created_at timestamptz default now(),
  unique(ad_id, buyer_id)
);

create table if not exists messages (
  id bigserial primary key,
  chat_id bigint references chats(id) on delete cascade,
  sender_id uuid references users(id) on delete cascade,
  content text not null,
  is_blocked boolean default false,
  block_reason text,
  created_at timestamptz default now()
);

create table if not exists reviews (
  id bigserial primary key,
  reviewer_id uuid references users(id) on delete cascade,
  seller_id uuid references users(id) on delete cascade,
  chat_id bigint references chats(id),
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now(),
  unique(reviewer_id, seller_id, chat_id)
);

create table if not exists reports (
  id bigserial primary key,
  reporter_id uuid references users(id) on delete cascade,
  ad_id bigint references ads(id) on delete cascade,
  reason text not null,
  status text default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz default now()
);

create table if not exists support_tickets (
  id bigserial primary key,
  user_id uuid references users(id) on delete cascade,
  type text,
  message text not null,
  status text default 'open' check (status in ('open', 'in_progress', 'resolved')),
  created_at timestamptz default now()
);

-- ─── INDEXES ─────────────────────────────────────────────────

create index if not exists ads_seller_id_idx on ads(seller_id);
create index if not exists ads_category_idx on ads(category);
create index if not exists ads_status_idx on ads(status);
create index if not exists ads_city_idx on ads(city);
create index if not exists ad_photos_ad_id_idx on ad_photos(ad_id);
create index if not exists messages_chat_id_idx on messages(chat_id);
create index if not exists chats_buyer_idx on chats(buyer_id);
create index if not exists chats_seller_idx on chats(seller_id);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────

alter table users enable row level security;
alter table ads enable row level security;
alter table ad_photos enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;
alter table reports enable row level security;
alter table support_tickets enable row level security;

-- Helper: is current user admin
create or replace function is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from users where id = auth.uid()),
    false
  );
$$ language sql security definer;

-- ─── USERS POLICIES ──────────────────────────────────────────
drop policy if exists "users: public read" on users;
create policy "users: public read" on users for select using (true);

drop policy if exists "users: insert own" on users;
create policy "users: insert own" on users for insert
  with check (id = auth.uid());

drop policy if exists "users: update own" on users;
create policy "users: update own" on users for update
  using (id = auth.uid());

-- ─── ADS POLICIES ────────────────────────────────────────────
drop policy if exists "ads: public read active" on ads;
create policy "ads: public read active" on ads for select
  using (status = 'active' or seller_id = auth.uid() or is_admin());

drop policy if exists "ads: insert authenticated" on ads;
create policy "ads: insert authenticated" on ads for insert
  with check (auth.uid() is not null and seller_id = auth.uid());

drop policy if exists "ads: update own or admin" on ads;
create policy "ads: update own or admin" on ads for update
  using (seller_id = auth.uid() or is_admin());

drop policy if exists "ads: delete own or admin" on ads;
create policy "ads: delete own or admin" on ads for delete
  using (seller_id = auth.uid() or is_admin());

-- ─── AD PHOTOS POLICIES ──────────────────────────────────────
drop policy if exists "ad_photos: public read" on ad_photos;
create policy "ad_photos: public read" on ad_photos for select using (true);

drop policy if exists "ad_photos: insert own ad" on ad_photos;
create policy "ad_photos: insert own ad" on ad_photos for insert
  with check (
    exists (select 1 from ads where ads.id = ad_id and ads.seller_id = auth.uid())
  );

drop policy if exists "ad_photos: delete own ad" on ad_photos;
create policy "ad_photos: delete own ad" on ad_photos for delete
  using (
    exists (select 1 from ads where ads.id = ad_id and ads.seller_id = auth.uid())
  );

-- ─── CHATS POLICIES ──────────────────────────────────────────
drop policy if exists "chats: participants read" on chats;
create policy "chats: participants read" on chats for select
  using (buyer_id = auth.uid() or seller_id = auth.uid() or is_admin());

drop policy if exists "chats: buyer create" on chats;
create policy "chats: buyer create" on chats for insert
  with check (buyer_id = auth.uid());

drop policy if exists "chats: admin update" on chats;
create policy "chats: admin update" on chats for update
  using (buyer_id = auth.uid() or seller_id = auth.uid() or is_admin());

-- ─── MESSAGES POLICIES ───────────────────────────────────────
drop policy if exists "messages: participants read" on messages;
create policy "messages: participants read" on messages for select
  using (
    exists (
      select 1 from chats
      where chats.id = chat_id
      and (chats.buyer_id = auth.uid() or chats.seller_id = auth.uid())
    ) or is_admin()
  );

drop policy if exists "messages: participants insert" on messages;
create policy "messages: participants insert" on messages for insert
  with check (
    sender_id = auth.uid() and
    exists (
      select 1 from chats
      where chats.id = chat_id
      and (chats.buyer_id = auth.uid() or chats.seller_id = auth.uid())
    )
  );

-- ─── REVIEWS POLICIES ────────────────────────────────────────
drop policy if exists "reviews: public read" on reviews;
create policy "reviews: public read" on reviews for select using (true);

drop policy if exists "reviews: buyer insert" on reviews;
create policy "reviews: buyer insert" on reviews for insert
  with check (reviewer_id = auth.uid());

-- ─── REPORTS POLICIES ────────────────────────────────────────
drop policy if exists "reports: admin read" on reports;
create policy "reports: admin read" on reports for select
  using (reporter_id = auth.uid() or is_admin());

drop policy if exists "reports: authenticated insert" on reports;
create policy "reports: authenticated insert" on reports for insert
  with check (auth.uid() is not null and reporter_id = auth.uid());

drop policy if exists "reports: admin update" on reports;
create policy "reports: admin update" on reports for update
  using (is_admin());

-- ─── SUPPORT TICKETS POLICIES ────────────────────────────────
drop policy if exists "tickets: own read" on support_tickets;
create policy "tickets: own read" on support_tickets for select
  using (user_id = auth.uid() or is_admin());

drop policy if exists "tickets: authenticated insert" on support_tickets;
create policy "tickets: authenticated insert" on support_tickets for insert
  with check (user_id = auth.uid());

drop policy if exists "tickets: admin update" on support_tickets;
create policy "tickets: admin update" on support_tickets for update
  using (is_admin());

-- ─── REALTIME ────────────────────────────────────────────────
-- Run in Supabase Dashboard → Database → Replication, or:
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table chats;

-- ─── STORAGE BUCKETS ─────────────────────────────────────────
-- Run these after creating buckets in Supabase Dashboard → Storage
-- OR create via Dashboard with these names:
--   "ad-photos"         → Public
--   "cnic-documents"    → Private
--   "ownership-docs"    → Private

insert into storage.buckets (id, name, public)
values ('ad-photos', 'ad-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('cnic-documents', 'cnic-documents', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('ownership-docs', 'ownership-docs', false)
on conflict (id) do nothing;

-- Storage RLS
create policy "ad-photos: public read"
on storage.objects for select
using (bucket_id = 'ad-photos');

create policy "ad-photos: auth upload"
on storage.objects for insert
with check (bucket_id = 'ad-photos' and auth.uid() is not null);

create policy "cnic-documents: own read"
on storage.objects for select
using (bucket_id = 'cnic-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "cnic-documents: own upload"
on storage.objects for insert
with check (bucket_id = 'cnic-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "ownership-docs: own read"
on storage.objects for select
using (bucket_id = 'ownership-docs' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "ownership-docs: own upload"
on storage.objects for insert
with check (bucket_id = 'ownership-docs' and auth.uid()::text = (storage.foldername(name))[1]);

-- ─── TRIGGER: auto-create user profile on signup ─────────────
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, created_at)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
