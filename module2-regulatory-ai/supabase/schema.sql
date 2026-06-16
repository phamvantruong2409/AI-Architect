-- Module 2: Regulatory & CAD Redline AI Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Bảng kiểm tra (mỗi row = 1 lần kiểm tra của KTS)
create table if not exists reg_checks (
  id uuid primary key default gen_random_uuid(),
  -- Thông tin dự án
  project_name text not null,
  project_address text not null,
  building_type text not null check (building_type in (
    'nha_o_rieng_le', 'nha_lien_ke', 'biet_thu',
    'chung_cu', 'van_phong', 'thuong_mai', 'cong_nghiep'
  )),
  zoning_type text not null check (zoning_type in (
    'dan_cu_hien_huu', 'dan_cu_moi', 'thuong_mai_dv',
    'cong_nghiep', 'hanh_chinh'
  )),
  -- Thông số lô đất
  land_area numeric not null,           -- m²
  land_width numeric not null,          -- m
  land_depth numeric not null,          -- m
  -- Thông số công trình dự kiến
  floors integer not null,
  total_height numeric not null,        -- m
  building_area numeric not null,       -- Diện tích xây dựng / footprint (m²)
  total_floor_area numeric not null,    -- Tổng diện tích sàn (m²)
  -- Khoảng lùi
  setback_front numeric default 0,      -- m
  setback_rear numeric default 0,       -- m
  setback_left numeric default 0,       -- m
  setback_right numeric default 0,      -- m
  -- PCCC & Thông gió
  corridor_width numeric default 0,     -- m
  window_ratio numeric default 0,       -- %
  -- Ghi chú thêm
  extra_notes text default '',
  -- Trạng thái phân tích
  status text default 'pending' check (status in ('pending', 'analyzing', 'completed', 'error')),
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bảng báo cáo Redline (kết quả AI phân tích)
create table if not exists reg_reports (
  id uuid primary key default gen_random_uuid(),
  check_id uuid references reg_checks(id) on delete cascade unique,
  -- Kết quả tổng thể
  overall_score integer check (overall_score >= 0 and overall_score <= 100),
  compliance_summary text,              -- Tóm tắt ngắn cho KTS
  -- Chi tiết vi phạm
  violations jsonb default '[]',        -- [{category, severity, title, description, standard_ref, ...}]
  passed_checks jsonb default '[]',     -- Danh sách hạng mục đạt
  -- Ghi chú
  kts_notes text,                       -- Ghi chú của KTS
  -- Metadata
  generated_at timestamptz default now(),
  gemini_model text default 'gemini-1.5-flash'
);

-- RLS Policies
alter table reg_checks enable row level security;
alter table reg_reports enable row level security;

-- Cho phép đọc/ghi công khai (điều chỉnh khi có auth)
create policy "Allow all on reg_checks" on reg_checks
  for all using (true) with check (true);

create policy "Allow all on reg_reports" on reg_reports
  for all using (true) with check (true);

-- Index
create index if not exists idx_reg_checks_created on reg_checks(created_at desc);
create index if not exists idx_reg_reports_check on reg_reports(check_id);

-- Trigger tự cập nhật updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger reg_checks_updated_at
  before update on reg_checks
  for each row execute function update_updated_at();
