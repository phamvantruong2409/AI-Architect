import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { analyzeClientBrief } from '@/lib/gemini'
import { calculateStyleScores } from '@/lib/quiz-data'
import type { QuizSession } from '@/lib/types'

// POST /api/analyze - nhận quiz data, gọi Gemini, lưu brief
export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    project_id,
    selected_images,
    family_size,
    family_members,
    lifestyle_habits,
    budget_range,
    free_text_notes,
  } = body

  if (!project_id) {
    return NextResponse.json({ error: 'Thiếu project_id' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Lấy thông tin project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', project_id)
    .single()

  if (projectError || !project) {
    return NextResponse.json({ error: 'Không tìm thấy dự án' }, { status: 404 })
  }

  const style_scores = calculateStyleScores(selected_images || [])

  // Tạo hoặc cập nhật quiz session
  const sessionData = {
    project_id,
    selected_images: selected_images || [],
    style_scores,
    family_size: family_size || 1,
    family_members: family_members || [],
    lifestyle_habits: lifestyle_habits || {},
    budget_range: budget_range || '500m_1b',
    free_text_notes: free_text_notes || '',
    completed_at: new Date().toISOString(),
  }

  const { data: existingSession } = await supabase
    .from('quiz_sessions')
    .select('id')
    .eq('project_id', project_id)
    .single()

  if (existingSession) {
    await supabase.from('quiz_sessions').update(sessionData).eq('id', existingSession.id)
  } else {
    await supabase.from('quiz_sessions').insert(sessionData)
  }

  // Gọi Gemini để phân tích
  const session: QuizSession = {
    id: existingSession?.id || '',
    ...sessionData,
    started_at: new Date().toISOString(),
  }

  const briefData = await analyzeClientBrief(session, project.project_name)

  // Lưu hoặc cập nhật design brief
  const { data: existingBrief } = await supabase
    .from('design_briefs')
    .select('id')
    .eq('project_id', project_id)
    .single()

  let brief
  if (existingBrief) {
    const { data } = await supabase
      .from('design_briefs')
      .update({ ...briefData, generated_at: new Date().toISOString() })
      .eq('id', existingBrief.id)
      .select()
      .single()
    brief = data
  } else {
    const { data } = await supabase
      .from('design_briefs')
      .insert({ project_id, ...briefData })
      .select()
      .single()
    brief = data
  }

  // Cập nhật trạng thái project
  await supabase
    .from('projects')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', project_id)

  return NextResponse.json({ brief, project })
}
