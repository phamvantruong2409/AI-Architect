-- ============================================================
-- Module 3: Knowledge Base AI — Supabase Schema
-- Chạy toàn bộ file này trong Supabase SQL Editor
-- ============================================================

-- 1. Bật pgvector extension
create extension if not exists vector;

-- 2. Bảng tài liệu
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  file_type text not null,                        -- 'pdf' | 'docx' | 'txt'
  category text not null default 'general',       -- 'TCVN' | 'QCVN' | 'PCCC' | 'general'
  content text not null,                          -- toàn bộ text đã extract
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'ready', 'error')),
  chunk_count int not null default 0,
  error_message text,
  created_at timestamptz not null default now()
);

-- 3. Bảng chunks + embeddings
create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  content text not null,
  embedding vector(768),
  chunk_index int not null,
  created_at timestamptz not null default now()
);

-- 4. Index để tìm kiếm nhanh (tạo sau khi có dữ liệu)
create index if not exists document_chunks_embedding_idx
  on document_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- 5. Hàm tìm kiếm ngữ nghĩa
create or replace function match_chunks(
  query_embedding vector(768),
  match_threshold float default 0.4,
  match_count int default 6,
  filter_category text default null
)
returns table (
  id uuid,
  document_id uuid,
  document_name text,
  category text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    dc.id,
    dc.document_id,
    d.name as document_name,
    d.category,
    dc.content,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks dc
  join documents d on d.id = dc.document_id
  where
    d.status = 'ready'
    and (filter_category is null or d.category = filter_category)
    and 1 - (dc.embedding <=> query_embedding) > match_threshold
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;
