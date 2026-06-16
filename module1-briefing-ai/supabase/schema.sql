-- Module 1: CRM & Briefing AI Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Bảng KTS (Architects)
create table if not exists architects (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  studio_name text,
  created_at timestamptz default now()
);

-- Bảng Projects (do KTS tạo, mỗi project = 1 khách hàng)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  architect_id uuid references architects(id) on delete cascade,
  client_name text not null,
  client_email text,
  project_name text not null,
  client_token text unique not null default encode(gen_random_bytes(16), 'hex'),
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bảng Quiz Sessions (lưu câu trả lời của khách hàng)
create table if not exists quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade unique,
  -- Phần 1: Image Quiz
  selected_images jsonb default '[]',   -- [{id, url, tags, dwell_time_ms}]
  style_scores jsonb default '{}',      -- {bac_au: 0.7, dong_duong: 0.3, ...}
  -- Phần 2: Lifestyle Form
  family_size int,
  family_members jsonb default '[]',    -- [{role: 'adult'|'child'|'elder', age_range: '...'}]
  lifestyle_habits jsonb default '{}',  -- {cooking: true, wfh: false, pets: true, ...}
  budget_range text,                    -- 'under_500m', '500m_1b', '1b_2b', 'over_2b'
  free_text_notes text,                 -- câu trả lời tự do
  -- Metadata
  started_at timestamptz default now(),
  completed_at timestamptz,
  ip_address text
);

-- Bảng Design Briefs (kết quả AI phân tích)
create table if not exists design_briefs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade unique,
  -- Kết quả phân tích
  dominant_style text,                  -- 'Bắc Âu Hiện Đại', 'Đông Dương', etc.
  style_breakdown jsonb default '{}',   -- {bac_au: 70, hien_dai: 20, toi_gian: 10}
  color_palette jsonb default '[]',     -- ['#F5F0E8', '#2C3E50', ...]
  material_preferences jsonb default '[]', -- ['gỗ tự nhiên', 'đá marble', ...]
  lighting_preference text,             -- 'tự nhiên tối đa', 'ấm áp buổi tối'
  -- Ràng buộc thiết kế (bóc tách từ LLM)
  design_constraints jsonb default '[]', -- [{type: 'accessibility', note: 'Có người lớn tuổi → không bậc thềm'}]
  space_requirements jsonb default '[]', -- [{room: 'phòng ngủ', note: 'cần phòng ngủ tầng trệt'}]
  -- Summary
  ai_summary text,                      -- đoạn tóm tắt AI viết cho KTS
  kts_notes text,                       -- ghi chú thêm của KTS
  -- Metadata
  generated_at timestamptz default now(),
  gemini_model text default 'gemini-1.5-flash'
);

-- RLS Policies (bảo mật theo row)
alter table architects enable row level security;
alter table projects enable row level security;
alter table quiz_sessions enable row level security;
alter table design_briefs enable row level security;

-- Cho phép insert công khai cho quiz sessions (khách hàng không cần auth)
create policy "Public can insert quiz sessions" on quiz_sessions
  for insert with check (true);

create policy "Public can update own quiz session" on quiz_sessions
  for update using (true);

create policy "Public can read quiz by project" on quiz_sessions
  for select using (true);

-- Projects: public có thể đọc qua token
create policy "Public can read project by token" on projects
  for select using (true);

-- Design briefs: public có thể đọc
create policy "Public can read design briefs" on design_briefs
  for select using (true);

-- Index tối ưu query
create index if not exists idx_projects_token on projects(client_token);
create index if not exists idx_quiz_sessions_project on quiz_sessions(project_id);
create index if not exists idx_design_briefs_project on design_briefs(project_id);
