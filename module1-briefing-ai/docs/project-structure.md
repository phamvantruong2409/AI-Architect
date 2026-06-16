# Cấu trúc thư mục — Module 1: CRM & Briefing AI

```
/module1-briefing-ai
│
├── /docs                          ← Tài liệu dự án (bạn đang đọc file này)
│   └── project-structure.md
│
├── /public                        ← Static assets (Next.js serve tự động)
│   └── /assets
│       ├── /images                ← Ảnh tĩnh: logo, placeholder, og-image...
│       └── /icons                 ← Icon SVG tùy chỉnh của studio
│
├── /src
│   ├── /app                       ← Next.js App Router (routing = folder name)
│   │   ├── layout.tsx             ← Root layout: font, metadata, body wrapper
│   │   ├── page.tsx               ← Trang chủ (/)
│   │   ├── globals.css            ← CSS toàn cục + Tailwind base
│   │   │
│   │   ├── /brief/[token]
│   │   │   └── page.tsx           ← Quiz khách hàng (client-facing)
│   │   │
│   │   ├── /dashboard
│   │   │   ├── page.tsx           ← Dashboard KTS: danh sách dự án
│   │   │   └── /brief/[projectId]
│   │   │       └── page.tsx       ← Chi tiết brief cho KTS
│   │   │
│   │   └── /api                   ← API Routes (server-only)
│   │       ├── /projects
│   │       │   ├── route.ts       ← GET danh sách / POST tạo project
│   │       │   └── /[token]
│   │       │       └── route.ts   ← GET project theo client_token
│   │       ├── /analyze
│   │       │   └── route.ts       ← POST: nhận quiz → gọi Gemini → lưu brief
│   │       └── /brief/[projectId]
│   │           └── route.ts       ← GET brief / PATCH ghi chú KTS
│   │
│   ├── /components                ← UI components (tái sử dụng)
│   │   ├── /quiz
│   │   │   ├── ImageSelector.tsx  ← Chọn cặp ảnh phong cách (có dwell tracking)
│   │   │   ├── LifestyleForm.tsx  ← Form gia đình, thói quen, ngân sách
│   │   │   └── QuizProgress.tsx   ← Thanh tiến trình quiz
│   │   └── /brief
│   │       └── BriefPreview.tsx   ← Hiển thị Design Brief (dùng ở 2 nơi)
│   │
│   └── /lib                       ← Logic thuần (không phải UI)
│       ├── types.ts               ← TypeScript interfaces toàn project
│       ├── quiz-data.ts           ← 6 cặp ảnh quiz + hàm tính style scores
│       ├── gemini.ts              ← Gọi Gemini API, build prompt phân tích
│       ├── supabase.ts            ← Supabase client (browser + server)
│       └── utils.ts               ← Helpers: formatDate, BUDGET_LABELS, cn()
│
├── /supabase
│   └── schema.sql                 ← Database schema: chạy trong Supabase SQL Editor
│
├── .env.local.example             ← Mẫu biến môi trường (copy → .env.local)
├── CLAUDE.md                      ← Hướng dẫn cho Claude Code AI
├── AGENTS.md                      ← Ghi chú về phiên bản Next.js đặc biệt
└── next.config.ts                 ← Cấu hình Next.js
```

## Luồng dữ liệu chính

```
KTS tạo project (Dashboard)
    → /api/projects POST
    → Supabase: bảng projects (sinh client_token tự động)
    → KTS copy link /brief/[token] → gửi khách

Khách điền quiz (/brief/[token])
    → Chọn 6 cặp ảnh + form lifestyle
    → /api/analyze POST
    → Supabase: upsert quiz_sessions
    → Gemini API: phân tích → JSON brief
    → Supabase: upsert design_briefs
    → Hiển thị BriefPreview cho khách

KTS xem brief (/dashboard/brief/[projectId])
    → /api/brief/[projectId] GET
    → BriefPreview + ô ghi chú KTS
    → /api/brief/[projectId] PATCH → lưu kts_notes
```

## Quy ước đặt tên

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Component | PascalCase | `BriefPreview.tsx` |
| Route handler | `route.ts` | `app/api/projects/route.ts` |
| Page | `page.tsx` | `app/dashboard/page.tsx` |
| Lib/utility | camelCase | `quiz-data.ts`, `utils.ts` |
| DB table | snake_case | `design_briefs`, `quiz_sessions` |
| API response key | snake_case | `project_id`, `client_token` |

## Môi trường cần thiết (.env.local)

```
GEMINI_API_KEY=          # Google AI Studio
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
