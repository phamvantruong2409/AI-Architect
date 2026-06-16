# Cấu trúc thư mục — Module 2: Regulatory & CAD Redline AI

```
/module2-regulatory-ai
│
├── /docs                           ← Tài liệu dự án
│   ├── project-structure.md        ← File này
│   └── AGENTS.md                   ← Cảnh báo về Next.js version
│
├── /public/assets
│   └── /images                     ← Ảnh tĩnh
│
├── /src
│   ├── /app                        ← Next.js App Router
│   │   ├── layout.tsx              ← Root layout
│   │   ├── page.tsx                ← Trang chủ (/)
│   │   ├── globals.css             ← CSS toàn cục + Tailwind
│   │   │
│   │   ├── /check/new
│   │   │   └── page.tsx            ← Form kiểm tra mới (multi-step)
│   │   │
│   │   ├── /dashboard
│   │   │   ├── page.tsx            ← Dashboard KTS: danh sách kiểm tra
│   │   │   └── /report/[reportId]
│   │   │       └── page.tsx        ← Chi tiết báo cáo Redline
│   │   │
│   │   └── /api                    ← API Routes (server-only)
│   │       ├── /checks
│   │       │   └── route.ts        ← GET danh sách / POST tạo check mới
│   │       ├── /analyze
│   │       │   └── route.ts        ← POST: params + image → Gemini → report
│   │       └── /reports/[reportId]
│   │           └── route.ts        ← GET report / PATCH ghi chú KTS
│   │
│   ├── /components
│   │   ├── /check
│   │   │   ├── ParamForm.tsx       ← Form nhập thông số lô đất + công trình
│   │   │   └── FileDropzone.tsx    ← Upload ảnh mặt bằng (optional)
│   │   └── /report
│   │       ├── RedlineReport.tsx   ← Toàn bộ báo cáo vi phạm
│   │       └── ViolationCard.tsx   ← 1 card vi phạm đơn lẻ
│   │
│   └── /lib
│       ├── types.ts                ← TypeScript interfaces toàn project
│       ├── regulations.ts          ← Dữ liệu tiêu chuẩn TCVN/QCVN/PCCC
│       ├── gemini.ts               ← Gọi Gemini API, build prompt phân tích
│       ├── supabase.ts             ← Supabase clients (browser + server)
│       └── utils.ts                ← Helpers: formatDate, cn(), severity colors
│
├── /supabase
│   └── schema.sql                  ← Database schema: chạy trong Supabase SQL Editor
│
├── .env.local.example              ← Mẫu biến môi trường
├── CLAUDE.md                       ← Hướng dẫn cho Claude Code AI
└── next.config.ts                  ← Cấu hình Next.js
```

## Luồng dữ liệu chính

```
KTS tạo kiểm tra mới (/check/new)
    → Multi-step form: thông tin dự án → thông số lô đất → thông số công trình → upload ảnh
    → /api/analyze POST
    → Supabase: upsert reg_checks
    → Gemini API: phân tích thông số + (optional) vision analysis ảnh mặt bằng
    → Trả về danh sách violations + overall_score
    → Supabase: insert reg_reports
    → Redirect → /dashboard/report/[reportId]

KTS xem báo cáo (/dashboard/report/[reportId])
    → /api/reports/[reportId] GET
    → RedlineReport: summary card + ViolationCards phân nhóm
    → PATCH để lưu kts_notes
```

## Các hạng mục kiểm tra

| Hạng mục | Tiêu chuẩn | Biến kiểm tra |
|---|---|---|
| Khoảng lùi mặt tiền | QCXDVN 01:2021 | `setback_front` vs số tầng |
| Khoảng lùi hông/sau | QCXDVN 01:2021 | `setback_side`, `setback_rear` |
| Mật độ xây dựng | QCXD theo loại | `building_area / land_area` |
| Hệ số sử dụng đất (FAR) | QCXD | `total_floor_area / land_area` |
| Chiều cao tối đa | Quy hoạch địa phương | `total_height` vs tầng số |
| Lối thoát nạn PCCC | QCVN 06:2022 | `corridor_width` |
| Thông gió & Chiếu sáng | TCVN 4474 | `window_ratio` |

## Quy ước đặt tên

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Component | PascalCase | `ViolationCard.tsx` |
| Route handler | `route.ts` | `app/api/checks/route.ts` |
| Page | `page.tsx` | `app/dashboard/page.tsx` |
| Lib/utility | camelCase | `regulations.ts`, `utils.ts` |
| DB table | snake_case | `reg_checks`, `reg_reports` |
| API response key | snake_case | `check_id`, `overall_score` |

## Môi trường cần thiết (.env.local)

```
GEMINI_API_KEY=          # Google AI Studio
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3001
```
