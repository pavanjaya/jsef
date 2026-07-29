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

-- ═══════════════════════════════════════════════════════════════════
-- Phase 3: Members List + Matrimony
-- ═══════════════════════════════════════════════════════════════════

-- ─── Members List ───

alter table members add column if not exists directory_visible boolean not null default true;

-- Exposes only non-sensitive columns — never phone/email/aadhaar/address,
-- since RLS is row-level, not column-level, and a direct "select" policy
-- would let any approved member query those columns straight from the
-- client regardless of what the UI shows.
create or replace function list_directory_members()
returns table (member_id text, full_name text, city text, gotra text)
language sql
security definer
set search_path = public
stable
as $$
  select m.member_id, m.full_name, m.city, m.gotra
  from members m
  where m.status = 'approved' and m.directory_visible = true
  order by m.full_name;
$$;

revoke all on function list_directory_members() from public;
grant execute on function list_directory_members() to authenticated;

-- ─── Matrimony ───

create table if not exists matrimony_profiles (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null unique references members(id) on delete cascade,
  photo_path text,
  age int,
  height text,
  education text,
  profession text,
  gotra text,
  city text,
  about text,
  status text not null default 'draft' check (status in ('draft','pending','approved')),
  created_at timestamptz not null default now()
);

alter table matrimony_profiles enable row level security;

create policy "matrimony profile: owner manage" on matrimony_profiles
  for all using (auth.uid() = member_id) with check (auth.uid() = member_id);

create policy "matrimony profile: admin read all" on matrimony_profiles
  for select using (is_admin());

create policy "matrimony profile: admin update all" on matrimony_profiles
  for update using (is_admin());

-- Browsable listing never returns member_id, so the client can't join a
-- profile back to a real identity — only the accept-request flow does that,
-- server-side, via the protected /api/matrimony/contact route.
create or replace function browse_matrimony_profiles()
returns table (
  id uuid, age int, height text, education text, profession text,
  gotra text, city text, about text, photo_path text
)
language sql
security definer
set search_path = public
stable
as $$
  select p.id, p.age, p.height, p.education, p.profession, p.gotra, p.city, p.about, p.photo_path
  from matrimony_profiles p
  where p.status = 'approved'
  order by p.created_at desc;
$$;

revoke all on function browse_matrimony_profiles() from public;
grant execute on function browse_matrimony_profiles() to authenticated;

create table if not exists matrimony_requests (
  id uuid primary key default gen_random_uuid(),
  from_member_id uuid not null references members(id) on delete cascade,
  to_profile_id uuid not null references matrimony_profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz not null default now(),
  unique (from_member_id, to_profile_id)
);

alter table matrimony_requests enable row level security;

create policy "matrimony request: sender insert" on matrimony_requests
  for insert with check (auth.uid() = from_member_id);

create policy "matrimony request: sender or profile owner read" on matrimony_requests
  for select using (
    auth.uid() = from_member_id
    or exists (
      select 1 from matrimony_profiles p
      where p.id = to_profile_id and p.member_id = auth.uid()
    )
  );

create policy "matrimony request: profile owner respond" on matrimony_requests
  for update using (
    exists (
      select 1 from matrimony_profiles p
      where p.id = to_profile_id and p.member_id = auth.uid()
    )
  );

-- Lets a profile owner see the (still-anonymized) profile of whoever sent
-- them a request, so they have something to decide Accept/Decline on. Only
-- callable for requests actually targeting the caller's own profile.
create or replace function get_requester_profile(p_request_id uuid)
returns table (
  age int, height text, education text, profession text,
  gotra text, city text, about text, photo_path text
)
language sql
security definer
set search_path = public
stable
as $$
  select mp.age, mp.height, mp.education, mp.profession, mp.gotra, mp.city, mp.about, mp.photo_path
  from matrimony_requests r
  join matrimony_profiles mp on mp.member_id = r.from_member_id
  join matrimony_profiles owned on owned.id = r.to_profile_id
  where r.id = p_request_id and owned.member_id = auth.uid();
$$;

revoke all on function get_requester_profile(uuid) from public;
grant execute on function get_requester_profile(uuid) to authenticated;

-- Reveals real contact details for an accepted request, to either party of
-- that request. Neither `members` nor `matrimony_profiles` grants a direct
-- cross-member select policy (see the privacy note above), so this security
-- definer function is the *only* path that can join a request back to real
-- names/phone/email — and only after checking status='accepted' and that the
-- caller is actually a party to the request.
create or replace function get_matrimony_contact(p_request_id uuid)
returns table (full_name text, phone text, email text)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_from_member uuid;
  v_to_owner uuid;
  v_status text;
  v_other uuid;
begin
  select r.from_member_id, r.status, p.member_id
    into v_from_member, v_status, v_to_owner
  from matrimony_requests r
  join matrimony_profiles p on p.id = r.to_profile_id
  where r.id = p_request_id;

  if v_status is distinct from 'accepted' then
    return;
  end if;

  if auth.uid() = v_from_member then
    v_other := v_to_owner;
  elsif auth.uid() = v_to_owner then
    v_other := v_from_member;
  else
    return;
  end if;

  return query select m.full_name, m.phone, m.email from members m where m.id = v_other;
end;
$$;

revoke all on function get_matrimony_contact(uuid) from public;
grant execute on function get_matrimony_contact(uuid) to authenticated;

-- ─── Storage: private bucket for matrimony photos ───

insert into storage.buckets (id, name, public)
values ('matrimony-photos', 'matrimony-photos', false)
on conflict (id) do nothing;

create policy "matrimony photos: owner insert"
  on storage.objects for insert
  with check (
    bucket_id = 'matrimony-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "matrimony photos: owner read"
  on storage.objects for select
  using (
    bucket_id = 'matrimony-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "matrimony photos: admin read all"
  on storage.objects for select
  using (
    bucket_id = 'matrimony-photos'
    and is_admin()
  );

create policy "matrimony photos: approved profile read"
  on storage.objects for select
  using (
    bucket_id = 'matrimony-photos'
    and exists (
      select 1 from matrimony_profiles p
      where p.photo_path = storage.objects.name and p.status = 'approved'
    )
  );

-- ─── First admin ───
-- After you sign up through the site once, run this (with your own email)
-- to make yourself the first admin. Every admin after that can be managed
-- from the /admin dashboard itself.
--
-- update members set role = 'admin' where email = 'you@example.com';
