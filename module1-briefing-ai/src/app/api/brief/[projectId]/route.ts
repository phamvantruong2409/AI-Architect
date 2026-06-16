import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// GET /api/brief/[projectId] - lấy brief đầy đủ cho KTS dashboard
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const supabase = createServiceClient()

  const { data: brief, error } = await supabase
    .from('design_briefs')
    .select('*')
    .eq('project_id', projectId)
    .single()

  if (error || !brief) {
    return NextResponse.json({ error: 'Brief chưa được tạo' }, { status: 404 })
  }

  const { data: session } = await supabase
    .from('quiz_sessions')
    .select('budget_range, family_size, family_members, lifestyle_habits')
    .eq('project_id', projectId)
    .single()

  return NextResponse.json({ brief, session: session || null })
}

// PATCH /api/brief/[projectId] - KTS cập nhật ghi chú
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const { kts_notes } = await req.json()
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('design_briefs')
    .update({ kts_notes })
    .eq('project_id', projectId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
