# Module 3 — Knowledge Base AI

Hệ thống RAG (Retrieval-Augmented Generation): upload tài liệu PDF/Word/TXT → AI tự động lập chỉ mục → KTS chat hỏi về luật, tiêu chuẩn, quy chuẩn. Powered by Gemini + Supabase pgvector + Next.js.

## Cấu trúc thư mục

```
/module3-knowledge-ai
├── /supabase
│   └── schema.sql                ← Chạy trong Supabase SQL Editor (bật pgvector)
│
├── /src
│   ├── /app
│   │   ├── page.tsx              ← Landing page
│   │   ├── layout.tsx
│   │   ├── /library              ← Quản lý tài liệu (upload/xóa)
│   │   │   └── page.tsx
│   │   ├── /chat                 ← Chatbot interface
│   │   │   └── page.tsx
│   │   └── /api
│   │       ├── /documents        ← GET list, POST upload+extract
│   │       ├── /documents/[id]   ← DELETE document
│   │       ├── /process/[id]     ← POST chunk+embed document
│   │       └── /chat             ← POST RAG chat
│   │
│   ├── /components
│   │   ├── /library              ← FileUploader, DocumentList
│   │   └── /chat                 ← ChatInterface
│   │
│   └── /lib
│       ├── types.ts
│       ├── supabase.ts
│       ├── gemini.ts             ← embed + generate
│       ├── chunker.ts            ← chia văn bản thành chunks
│       └── extractors.ts         ← đọc PDF/DOCX/TXT
│
└── .env.local.example
```

## Stack

- **Next.js 16** (App Router + Turbopack)
- **Supabase** — PostgreSQL + pgvector (vector similarity search)
- **Gemini text-embedding-004** — tạo vector 768 chiều từ text
- **Gemini 1.5 Flash** — trả lời câu hỏi dựa trên context
- **pdf-parse** — đọc PDF server-side
- **mammoth** — đọc DOCX server-side
- **Tailwind CSS v4**

## Lệnh thường dùng

```bash
npm run dev      # Dev server http://localhost:3002
npm run build    # Build production
```

## Setup Supabase

1. Vào Supabase project → SQL Editor
2. Chạy toàn bộ nội dung `supabase/schema.sql`
3. Tạo bucket storage tên `documents` (public: false)
