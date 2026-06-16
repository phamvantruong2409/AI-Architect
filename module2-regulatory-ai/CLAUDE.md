@docs/AGENTS.md

# Module 2 — Regulatory & CAD Redline AI

Hệ thống kiểm tra pháp lý xây dựng: tự động đối chiếu thông số công trình với tiêu chuẩn TCVN/QCVN/PCCC, xuất báo cáo Redline với danh sách vi phạm có mức độ ưu tiên. Powered by Gemini Vision + Supabase + Next.js.

## Cấu trúc thư mục

```
/module2-regulatory-ai
├── /docs                          ← Tài liệu dự án
│   └── project-structure.md      ← Sơ đồ đầy đủ + luồng dữ liệu + quy ước
│
├── /src
│   ├── /app                      ← Next.js App Router
│   │   ├── page.tsx              ← Trang chủ
│   │   ├── layout.tsx            ← Root layout
│   │   ├── /check/new            ← Form kiểm tra mới (multi-step)
│   │   ├── /dashboard            ← Dashboard KTS
│   │   │   └── /report/[reportId]← Chi tiết báo cáo Redline
│   │   └── /api                  ← API Routes (server-only)
│   │       ├── /checks           ← CRUD check requests
│   │       ├── /analyze          ← Trigger Gemini analysis
│   │       └── /reports/[reportId]← Lấy + cập nhật report
│   │
│   ├── /components
│   │   ├── /check                ← ParamForm, FileDropzone
│   │   └── /report               ← RedlineReport, ViolationCard
│   │
│   └── /lib
│       ├── types.ts              ← TypeScript interfaces
│       ├── regulations.ts        ← Dữ liệu tiêu chuẩn TCVN/QCVN
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
- **Gemini 1.5 Flash** — phân tích thông số + vision analysis ảnh mặt bằng
- **Tailwind CSS v4** — utility-first, config trong postcss.config.mjs
- **Framer Motion** — animation form và report

## Lệnh thường dùng

```bash
npm run dev      # Dev server http://localhost:3001
npm run build    # Build production
npm run lint     # ESLint check
```
