'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ParamForm from '@/components/check/ParamForm'
import FileDropzone from '@/components/check/FileDropzone'
import type { CheckFormData, BuildingType, ZoningType } from '@/lib/types'

const STEPS = [
  { id: 1, label: 'Dự án', desc: 'Thông tin cơ bản' },
  { id: 2, label: 'Lô đất', desc: 'Kích thước & quy hoạch' },
  { id: 3, label: 'Công trình', desc: 'Thông số thiết kế' },
  { id: 4, label: 'Mặt bằng', desc: 'Upload ảnh (tùy chọn)' },
]

const DEFAULT_FORM: CheckFormData = {
  project_name: '',
  project_address: '',
  building_type: 'nha_o_rieng_le',
  zoning_type: 'dan_cu_hien_huu',
  land_area: 0,
  land_width: 0,
  land_depth: 0,
  floors: 1,
  total_height: 0,
  building_area: 0,
  total_floor_area: 0,
  setback_front: 0,
  setback_rear: 0,
  setback_left: 0,
  setback_right: 0,
  corridor_width: 0,
  window_ratio: 0,
  extra_notes: '',
  floorplan_image: null,
}

export default function NewCheckPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<CheckFormData>(DEFAULT_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function updateField<K extends keyof CheckFormData>(key: K, value: CheckFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function canNext(): boolean {
    if (step === 1) return form.project_name.trim() !== '' && form.project_address.trim() !== ''
    if (step === 2) return form.land_area > 0 && form.land_width > 0 && form.land_depth > 0
    if (step === 3) return form.floors > 0 && form.building_area > 0 && form.total_floor_area > 0
    return true
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')

    try {
      // Convert image to base64 nếu có
      let imageBase64: string | undefined = undefined
      if (form.floorplan_image) {
        const buffer = await form.floorplan_image.arrayBuffer()
        const bytes = new Uint8Array(buffer)
        let binary = ''
        for (const b of bytes) binary += String.fromCharCode(b)
        imageBase64 = btoa(binary)
      }

      const body = {
        ...form,
        floorplan_image: undefined,
        floorplan_image_base64: imageBase64,
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        let message = 'Có lỗi xảy ra. Vui lòng kiểm tra cấu hình GEMINI_API_KEY và SUPABASE trong .env.local.'
        try {
          const err = await res.json()
          if (err?.error) message = err.error
        } catch { /* body rỗng — giữ message mặc định */ }
        throw new Error(message)
      }

      const data = await res.json()
      router.push(`/dashboard/report/${data.check_id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Có lỗi xảy ra, thử lại.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="text-stone-400 hover:text-stone-600 transition-colors text-sm">
            ← Dashboard
          </Link>
          <span className="text-stone-300">/</span>
          <span className="font-semibold text-stone-800">Kiểm tra pháp lý mới</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Stepper */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step === s.id
                      ? 'bg-red-500 text-white'
                      : step > s.id
                      ? 'bg-green-500 text-white'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {step > s.id ? '✓' : s.id}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-xs font-semibold ${step === s.id ? 'text-red-600' : 'text-stone-500'}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-stone-400">{s.desc}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px flex-1 mx-3 ${step > s.id ? 'bg-green-400' : 'bg-stone-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form content */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
          {step === 1 && <StepProject form={form} update={updateField} />}
          {step === 2 && <StepLand form={form} update={updateField} />}
          {step === 3 && <StepBuilding form={form} update={updateField} />}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-stone-800 mb-1">Upload mặt bằng</h2>
                <p className="text-sm text-stone-500">
                  Tùy chọn — Gemini Vision sẽ phân tích thêm nếu có ảnh.
                </p>
              </div>
              <FileDropzone
                value={form.floorplan_image ?? null}
                onChange={(file) => updateField('floorplan_image', file)}
              />
              <div>
                <label className="text-sm font-medium text-stone-600 block mb-1">Ghi chú thêm</label>
                <textarea
                  value={form.extra_notes}
                  onChange={(e) => updateField('extra_notes', e.target.value)}
                  rows={3}
                  placeholder="Đặc điểm đặc biệt của lô đất, yêu cầu riêng..."
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 font-medium rounded-xl text-sm transition-colors"
          >
            ← Trước
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-stone-300 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Tiếp theo →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-stone-300 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  Đang phân tích...
                </>
              ) : (
                '🔍 Phân tích ngay'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ===== Step Components =====

function StepProject({
  form,
  update,
}: {
  form: CheckFormData
  update: <K extends keyof CheckFormData>(k: K, v: CheckFormData[K]) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-1">Thông tin dự án</h2>
        <p className="text-sm text-stone-500">Đặt tên dự án để dễ theo dõi.</p>
      </div>
      <ParamForm form={form} update={update} section="project" />
    </div>
  )
}

function StepLand({
  form,
  update,
}: {
  form: CheckFormData
  update: <K extends keyof CheckFormData>(k: K, v: CheckFormData[K]) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-1">Thông số lô đất</h2>
        <p className="text-sm text-stone-500">Kích thước và loại quy hoạch của lô đất.</p>
      </div>
      <ParamForm form={form} update={update} section="land" />
    </div>
  )
}

function StepBuilding({
  form,
  update,
}: {
  form: CheckFormData
  update: <K extends keyof CheckFormData>(k: K, v: CheckFormData[K]) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-1">Thông số công trình dự kiến</h2>
        <p className="text-sm text-stone-500">Nhập các thông số thiết kế để kiểm tra.</p>
      </div>
      <ParamForm form={form} update={update} section="building" />
    </div>
  )
}
