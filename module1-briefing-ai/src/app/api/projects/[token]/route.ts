import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// GET /api/projects/[token] - lấy project theo client_token (dùng trong quiz page)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createServiceClient()

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('client_token', token)
    .single()

  if (error || !project) {
    return NextResponse.json({ error: 'Không tìm thấy dự án' }, { status: 404 })
  }

  // Lấy brief nếu đã có
  const { data: brief } = await supabase
    .from('design_briefs')
    .select('*')
    .eq('project_id', project.id)
    .single()

  // Lấy session nếu đã có
  const { data: session } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('project_id', project.id)
    .single()

  return NextResponse.json({ project, brief: brief || null, session: session || null })
}
