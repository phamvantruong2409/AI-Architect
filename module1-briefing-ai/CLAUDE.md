@docs/AGENTS.md

# Module 1 — CRM & Briefing AI

Hệ thống phân tích tâm lý không gian sống: chuyển ngôn ngữ cảm xúc của khách hàng thành Design Brief chuẩn hóa cho Kiến Trúc Sư. Powered by Gemini + Supabase + Next.js.

## Cấu trúc thư mục

```
/module1-briefing-ai
├── /docs                          ← Tài liệu dự án
│   └── project-structure.md      ← Sơ đồ đầy đủ + luồng dữ liệu + quy ước
│
├── /public/assets
│   ├── /images                   ← Ảnh tĩnh (logo, og-image...)
│   └── /icons                    ← Icon SVG của studio
│
├── /src
│   ├── /app                      ← Next.js App Router
│   │   ├── page.tsx              ← Trang chủ
│   │   ├── layout.tsx            ← Root layout
│   │   ├── /brief/[token]        ← Quiz khách hàng (client-facing)
│   │   ├── /dashboard            ← Dashboard KTS
│   │   │   └── /brief/[projectId]← Chi tiết brief
│   │   └── /api                  ← API Routes (server-only)
│   │       ├── /projects         ← CRUD projects
│   │       ├── /analyze          ← Trigger Gemini analysis
│   │       └── /brief/[projectId]← Lấy + cập nhật brief
│   │
│   ├── /components
│   │   ├── /quiz                 ← ImageSelector, LifestyleForm, QuizProgress
│   │   └── /brief                ← BriefPreview
│   │
│   └── /lib
│       ├── types.ts              ← TypeScript interfaces
│       ├── quiz-data.ts          ← Dữ liệu 6 cặp ảnh + tính style scores
│       ├── gemini.ts             ← Gọi Gemini API
│       ├── supabase.ts           ← Supabase clients
│       └── utils.ts              ← Helpers chung
│
├── /supabase
│   └── schema.sql                ← Chạy trong Supabase SQL Editor
│
└── .env.local.example            ← Mẫu biến môi trường
```

**Tài liệu chi tiết** → xem [docs/project-structure.md](docs/project-structure.md)

## Stack

- **Next.js 16** (App Router + Turbopack) — xem AGENTS.md về breaking changes
- **Supabase** — PostgreSQL + RLS, service role key dùng trong API routes
- **Gemini 1.5 Flash** — phân tích quiz → JSON brief
- **Tailwind CSS v4** — utility-first, config trong postcss.config.mjs
- **Framer Motion** — animation quiz và brief preview

## Lệnh thường dùng

```bash
npm run dev      # Dev server http://localhost:3000
npm run build    # Build production
npm run lint     # ESLint check
```
