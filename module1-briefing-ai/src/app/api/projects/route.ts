import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// GET /api/projects - lấy danh sách projects (cho KTS dashboard)
export async function GET() {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/projects - KTS tạo project mới
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { client_name, client_email, project_name, architect_id } = body

  if (!client_name || !project_name) {
    return NextResponse.json({ error: 'Thiếu tên khách hàng hoặc tên dự án' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('projects')
    .insert({
      architect_id: architect_id || null,
      client_name,
      client_email: client_email || null,
      project_name,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const clientUrl = `${process.env.NEXT_PUBLIC_APP_URL}/brief/${data.client_token}`
  return NextResponse.json({ project: data, client_url: clientUrl }, { status: 201 })
}
