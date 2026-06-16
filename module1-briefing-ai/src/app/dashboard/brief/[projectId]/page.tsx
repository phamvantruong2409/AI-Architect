'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import BriefPreview from '@/components/brief/BriefPreview'
import type { DesignBrief, Project } from '@/lib/types'

export default function BriefDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params)
  const [brief, setBrief] = useState<DesignBrief | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [session, setSession] = useState<{ budget_range?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [ktsNotes, setKtsNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/brief/${projectId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.brief) setBrief(data.brief)
        if (data.session) {
          setSession(data.session)
          setKtsNotes(data.brief?.kts_notes || '')
        }
      })
      .finally(() => setLoading(false))

    fetch(`/api/projects`)
      .then((r) => r.json())
      .then((projects) => {
        const p = projects.find((p: Project) => p.id === projectId)
        if (p) setProject(p)
      })
  }, [projectId])

  async function saveNotes() {
    setSaving(true)
    await fetch(`/api/brief/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kts_notes: ktsNotes }),
    })
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-400">Đang tải...</p>
      </div>
    )
  }

  if (!brief || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-stone-500">Brief chưa được tạo</p>
          <Link href="/dashboard" className="text-amber-600 text-sm mt-2 block">← Quay về dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/dashboard" className="text-stone-500 hover:text-stone-800 flex items-center gap-2 text-sm">
          ← Dashboard
        </Link>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl text-sm transition-colors"
        >
          🖨️ In / Xuất PDF
        </button>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <BriefPreview brief={brief} project={project} budgetRange={session?.budget_range} />

        {/* Ghi chú của KTS */}
        <div className="mt-6 bg-white border border-stone-200 rounded-2xl p-5">
          <h2 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
            <span>✏️</span> Ghi chú của KTS
          </h2>
          <textarea
            value={ktsNotes}
            onChange={(e) => setKtsNotes(e.target.value)}
            placeholder="Ghi chú thêm sau buổi gặp khách hàng..."
            rows={4}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none text-sm"
          />
          <button
            onClick={saveNotes}
            disabled={saving}
            className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-white font-medium rounded-xl text-sm transition-colors"
          >
            {saving ? 'Đang lưu...' : 'Lưu ghi chú'}
          </button>
        </div>
      </div>
    </div>
  )
}
