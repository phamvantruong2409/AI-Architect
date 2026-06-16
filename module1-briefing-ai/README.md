# Module 1 — CRM & Briefing AI

Hệ thống phân tích tâm lý không gian sống cho Kiến Trúc Sư.  
Khách hàng hoàn thành quiz → AI tạo Design Brief chuẩn hóa → KTS xem trên dashboard.

**Stack:** Next.js 16 · Supabase · Gemini API · Tailwind CSS v4

---

## Chạy nhanh

```bash
# 1. Cài dependencies
npm install

# 2. Tạo file môi trường
cp .env.local.example .env.local
# → điền GEMINI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# 3. Khởi tạo database
# → vào Supabase SQL Editor, chạy supabase/schema.sql

# 4. Chạy dev server
npm run dev
# → http://localhost:3000
```

## Luồng sử dụng

| Người dùng | URL | Mô tả |
|---|---|---|
| KTS | `/dashboard` | Tạo project, lấy link gửi khách |
| Khách hàng | `/brief/[token]` | Hoàn thành quiz 6 bước |
| KTS | `/dashboard/brief/[id]` | Xem Design Brief + ghi chú |

## Tài liệu

- [Cấu trúc thư mục & luồng dữ liệu](docs/project-structure.md)
- [Hướng dẫn cho AI agents](docs/AGENTS.md)
