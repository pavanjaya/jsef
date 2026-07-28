-- ═══════════════════════════════════════════════════════════════════
-- JSEC Membership: table, RLS policies, admin guard, storage bucket.
-- Paste this into your Supabase project's SQL editor and run it once.
-- ═══════════════════════════════════════════════════════════════════

create table if not exists members (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member','admin')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  member_id text unique,                    -- e.g. "JSEC-2026-00042", assigned on approval

  full_name text not null,
  fathers_or_husbands_name text not null,
  dob date,
  gotra text,
  phone text not null,
  email text not null,
  occupation text,
  native_village text,

  aadhaar_number text not null,

  address_line text not null,
  city text not null,
  state text not null,
  country text not null default 'India',
  pin_code text,

  photo_path text,                          -- path inside the member-photos storage bucket

  applied_at timestamptz not null default now(),
  approved_at timestamptz
);

create index if not exists members_status_idx on members(status);

alter table members enable row level security;

-- ─── is_admin() helper ───
-- security definer so it can read `members` to check the caller's role
-- without recursing back through RLS on `members` itself.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1 from members where id = auth.uid() and role = 'admin'
  );
$$;

-- ─── Policies ───

create policy "self read" on members
  for select using (auth.uid() = id);

create policy "self insert" on members
  for insert with check (auth.uid() = id);

create policy "self update" on members
  for update using (auth.uid() = id);

create policy "admin read all" on members
  for select using (is_admin());

create policy "admin update all" on members
  for update using (is_admin());

-- ─── Guard: only admins may change role / status / member_id / approved_at ───
-- Without this, "self update" above would let an applicant flip their own
-- status to 'approved' by calling the update API directly.
create or replace function members_guard_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    if new.role is distinct from old.role
      or new.status is distinct from old.status
      or new.member_id is distinct from old.member_id
      or new.approved_at is distinct from old.approved_at
    then
      raise exception 'Only admins may change role, status, member_id, or approved_at';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists members_guard_privileged_columns on members;
create trigger members_guard_privileged_columns
  before update on members
  for each row
  execute function members_guard_privileged_columns();

-- ─── Storage: private bucket for member photos ───
-- Path convention: {user_id}/{filename} — ownership is checked from the path.

insert into storage.buckets (id, name, public)
values ('member-photos', 'member-photos', false)
on conflict (id) do nothing;

create policy "member photos: owner insert"
  on storage.objects for insert
  with check (
    bucket_id = 'member-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "member photos: owner read"
  on storage.objects for select
  using (
    bucket_id = 'member-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "member photos: admin read all"
  on storage.objects for select
  using (
    bucket_id = 'member-photos'
    and is_admin()
  );

-- ─── Atomic member ID generation ───
-- A sequence + wrapper function so two simultaneous approvals can never
-- collide on the same member_id.
create sequence if not exists member_id_seq start 1;

create or replace function next_member_id()
returns text
language sql
security definer
set search_path = public
as $$
  select 'JSEC-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('member_id_seq')::text, 5, '0');
$$;

-- ═══════════════════════════════════════════════════════════════════
-- Phase 2: Blood Donor Directory, Job Board, Event RSVP
-- ═══════════════════════════════════════════════════════════════════

-- ─── is_approved_member() helper ───
-- Same shape as is_admin() — security definer so it can read `members`
-- without recursing through RLS on `members` itself.
create or replace function is_approved_member()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1 from members where id = auth.uid() and status = 'approved'
  );
$$;

-- ─── Blood Donor Directory ───

create table if not exists blood_donors (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null unique references members(id) on delete cascade,
  blood_group text not null check (blood_group in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  city text not null,
  available boolean not null default true,
  created_at timestamptz not null default now()
);

alter table blood_donors enable row level security;

create policy "donor: owner manage" on blood_donors
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

create policy "donor: approved members read all" on blood_donors
  for select using (is_approved_member());

-- ─── Job Board ───

create table if not exists job_posts (
  id uuid primary key default gen_random_uuid(),
  posted_by uuid not null references members(id) on delete cascade,
  title text not null,
  company text,
  location text,
  description text not null,
  contact_email text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create index if not exists job_posts_status_idx on job_posts(status);

alter table job_posts enable row level security;

create policy "job: owner manage" on job_posts
  for all using (auth.uid() = posted_by) with check (auth.uid() = posted_by);

create policy "job: public read approved" on job_posts
  for select using (status = 'approved');

create policy "job: admin read all" on job_posts
  for select using (is_admin());

create policy "job: admin update all" on job_posts
  for update using (is_admin());

-- ─── Event RSVP ───
-- event_slug is a stable hardcoded id per event in app/events/page.tsx —
-- events themselves aren't database-backed yet, just RSVPs against them.

create table if not exists event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_slug text not null,
  member_id uuid not null references members(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_slug, member_id)
);

alter table event_rsvps enable row level security;

create policy "rsvp: owner manage" on event_rsvps
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

create policy "rsvp: approved members read all" on event_rsvps
  for select using (is_approved_member());

-- ─── First admin ───
-- After you sign up through the site once, run this (with your own email)
-- to make yourself the first admin. Every admin after that can be managed
-- from the /admin dashboard itself.
--
-- update members set role = 'admin' where email = 'you@example.com';
