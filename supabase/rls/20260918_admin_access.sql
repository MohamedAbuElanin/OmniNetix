-- OmniNetix staff access baseline. Review and run in Supabase SQL Editor once.
-- It assumes public.profiles(id uuid primary key references auth.users, role public.user_role).
-- This file contains no credentials and does not grant browser clients service-role access.

create or replace function public.has_omninetix_role(allowed_roles public.user_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = any (allowed_roles)
      and status = 'active'
  );
$$;

revoke all on function public.has_omninetix_role(public.user_role[]) from public;
grant execute on function public.has_omninetix_role(public.user_role[]) to authenticated;

alter table public.profiles enable row level security;
drop policy if exists "profiles_read_own_record" on public.profiles;
create policy "profiles_read_own_record" on public.profiles
  for select to authenticated using (id = auth.uid());

-- Apply least-privilege read policies. Leave public catalog read policies separate.
-- No policy grants suppliers, supplier offers, or audit data to anonymous users.
do $$
begin
  if to_regclass('public.requests') is not null then
    alter table public.requests enable row level security;
    drop policy if exists staff_read_private_data on public.requests;
    create policy staff_read_requests on public.requests for select to authenticated
      using (public.has_omninetix_role(array['super_admin','admin','manager','sales','procurement']::public.user_role[]));
  end if;
  if to_regclass('public.request_items') is not null then
    alter table public.request_items enable row level security;
    drop policy if exists staff_read_private_data on public.request_items;
    create policy staff_read_request_items on public.request_items for select to authenticated
      using (public.has_omninetix_role(array['super_admin','admin','manager','sales','procurement']::public.user_role[]));
  end if;
  if to_regclass('public.customers') is not null then
    alter table public.customers enable row level security;
    drop policy if exists staff_read_private_data on public.customers;
    create policy staff_read_customers on public.customers for select to authenticated
      using (public.has_omninetix_role(array['super_admin','admin','manager','sales']::public.user_role[]));
  end if;
  if to_regclass('public.suppliers') is not null then
    alter table public.suppliers enable row level security;
    drop policy if exists staff_read_private_data on public.suppliers;
    create policy procurement_read_suppliers on public.suppliers for select to authenticated
      using (public.has_omninetix_role(array['super_admin','admin','manager','procurement']::public.user_role[]));
  end if;
  if to_regclass('public.supplier_offers') is not null then
    alter table public.supplier_offers enable row level security;
    drop policy if exists staff_read_private_data on public.supplier_offers;
    create policy procurement_read_supplier_offers on public.supplier_offers for select to authenticated
      using (public.has_omninetix_role(array['super_admin','admin','manager','procurement']::public.user_role[]));
  end if;
  if to_regclass('public.quotations') is not null then
    alter table public.quotations enable row level security;
    drop policy if exists staff_read_private_data on public.quotations;
    create policy staff_read_quotations on public.quotations for select to authenticated
      using (public.has_omninetix_role(array['super_admin','admin','manager','sales']::public.user_role[]));
  end if;
  if to_regclass('public.quotation_items') is not null then
    alter table public.quotation_items enable row level security;
    drop policy if exists staff_read_private_data on public.quotation_items;
    create policy staff_read_quotation_items on public.quotation_items for select to authenticated
      using (public.has_omninetix_role(array['super_admin','admin','manager','sales']::public.user_role[]));
  end if;
  if to_regclass('public.activity_logs') is not null then
    alter table public.activity_logs enable row level security;
    drop policy if exists staff_read_private_data on public.activity_logs;
    create policy management_read_activity_logs on public.activity_logs for select to authenticated
      using (public.has_omninetix_role(array['super_admin','admin','manager']::public.user_role[]));
  end if;
end $$;

-- Add separate INSERT/UPDATE/ARCHIVE policies per role after confirming each workflow.
-- Do not add broad write policies and do not expose supplier pricing to anon.
