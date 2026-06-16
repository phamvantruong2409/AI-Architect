'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import type { RegReport, RegCheck } from '@/lib/types'
import RedlineReport from '@/components/report/RedlineReport'
import { formatDate, scoreColor, scoreBg } from '@/lib/utils'
import { BUILDING_TYPE_LABELS } from '@/lib/regulations'

export default function ReportPage() {
  const { reportId } = useParams<{ reportId: string }>()
  const [report, setReport] = useState<RegReport | null>(null)
  const [check, setCheck] = useState<RegCheck | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/reports/${reportId}`)
      .then((r) => r.json())
      .then((data) => {
        setReport(data.report)
        setCheck(data.check)
        setNotes(data.report?.kts_notes ?? '')
      })
      .finally(() => setLoading(false))
  }, [reportId])

  async function saveNotes() {
    if (!report) return
    setSaving(true)
    await fetch(`/api/reports/${reportId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kts_notes: notes }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-spin">⚖️</div>
          <p className="text-stone-500">Đang tải báo cáo...</p>
        </div>
      </div>
    )
  }

  if (!report || !check) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-3">❌</p>
          <p className="text-stone-600">Không tìm thấy báo cáo.</p>
          <Link href="/dashboard" className="text-red-500 hover:underline text-sm mt-2 inline-block">
            ← Về Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const errorCount = report.violations.filter(v => v.severity === 'error').length
  const warningCount = report.violations.filter(v => v.severity === 'warning').length
  const infoCount = report.violations.filter(v => v.severity === 'info').length

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-stone-400 hover:text-stone-600 transition-colors">
              ← Dashboard
            </Link>
            <span className="text-stone-300">/</span>
            <span className="font-semibold text-stone-800 truncate max-w-xs">{check.project_name}</span>
          </div>
          <span className="text-xs text-stone-400">{formatDate(report.generated_at)}</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Score card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Điểm tuân thủ */}
            <div className={`${scoreBg(report.overall_score)} rounded-2xl p-6 text-center min-w-[120px]`}>
              <p className={`text-5xl font-black ${scoreColor(report.overall_score)}`}>
                {report.overall_score}
              </p>
              <p className="text-xs font-semibold text-stone-500 mt-1 uppercase tracking-wide">Điểm tuân thủ</p>
            </div>

            {/* Thông tin */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-xl font-bold text-stone-900">{check.project_name}</h1>
                <p className="text-sm text-stone-500">{check.project_address}</p>
                <p className="text-xs text-stone-400 mt-1">
                  {BUILDING_TYPE_LABELS[check.building_type]} · {check.floors} tầng · {check.land_area} m² lô đất
                </p>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">{report.compliance_summary}</p>

              {/* Badge counts */}
              <div className="flex gap-2 flex-wrap">
                {errorCount > 0 && (
                  <span className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                    {errorCount} vi phạm nghiêm trọng
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                    {warningCount} cảnh báo
                  </span>
                )}
                {infoCount > 0 && (
                  <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {infoCount} lưu ý
                  </span>
                )}
                {report.passed_checks.length > 0 && (
                  <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    {report.passed_checks.length} hạng mục đạt
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Passed checks */}
        {report.passed_checks.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="font-semibold text-green-800 mb-3">✅ Hạng mục đạt tiêu chuẩn</p>
            <div className="flex flex-wrap gap-2">
              {report.passed_checks.map((item, i) => (
                <span key={i} className="text-sm bg-white border border-green-200 text-green-700 px-3 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Violations */}
        <RedlineReport violations={report.violations} />

        {/* Ghi chú KTS */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold text-stone-800">Ghi chú của KTS</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Thêm ghi chú, quyết định điều chỉnh, hoặc trao đổi với nhóm..."
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          />
          <button
            onClick={saveNotes}
            disabled={saving}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-300 text-white font-medium rounded-xl text-sm transition-colors"
          >
            {saving ? 'Đang lưu...' : saved ? '✓ Đã lưu' : 'Lưu ghi chú'}
          </button>
        </div>
      </div>
    </div>
  )
}
