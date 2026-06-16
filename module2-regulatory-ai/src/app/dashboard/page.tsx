'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDate, STATUS_CONFIG } from '@/lib/utils'
import type { RegCheck } from '@/lib/types'
import { BUILDING_TYPE_LABELS } from '@/lib/regulations'

export default function DashboardPage() {
  const [checks, setChecks] = useState<RegCheck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/checks')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setChecks(Array.isArray(data) ? data : []))
      .catch(() => setChecks([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚖️</span>
          <div>
            <h1 className="font-bold text-stone-900">Regulatory AI</h1>
            <p className="text-xs text-stone-400">Dashboard Kiểm Tra Pháp Lý</p>
          </div>
        </div>
        <Link
          href="/check/new"
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          + Kiểm tra mới
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Tổng kiểm tra', value: checks.length, color: 'text-stone-800' },
            { label: 'Hoàn thành', value: checks.filter(c => c.status === 'completed').length, color: 'text-green-600' },
            { label: 'Đang xử lý', value: checks.filter(c => c.status === 'analyzing').length, color: 'text-blue-600' },
            { label: 'Chờ phân tích', value: checks.filter(c => c.status === 'pending').length, color: 'text-amber-600' },
          ].map((card) => (
            <div key={card.label} className="bg-white border border-stone-200 rounded-2xl p-4 text-center">
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-stone-500 mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Danh sách */}
        <div>
          <h2 className="font-semibold text-stone-700 mb-4">
            Danh sách kiểm tra ({checks.length})
          </h2>

          {loading ? (
            <div className="text-center py-16 text-stone-400">Đang tải...</div>
          ) : checks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <p className="text-5xl mb-3">📋</p>
              <p className="text-stone-500 mb-4">Chưa có kiểm tra nào.</p>
              <Link
                href="/check/new"
                className="inline-block px-5 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition-colors"
              >
                Tạo kiểm tra đầu tiên
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {checks.map((check) => {
                const status = STATUS_CONFIG[check.status]
                return (
                  <div
                    key={check.id}
                    className="bg-white border border-stone-200 rounded-2xl p-5 flex items-center justify-between hover:border-stone-300 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-stone-800 truncate">{check.project_name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color} shrink-0`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-stone-500 truncate">{check.project_address}</p>
                      <div className="flex gap-3 text-xs text-stone-400">
                        <span>{BUILDING_TYPE_LABELS[check.building_type]}</span>
                        <span>·</span>
                        <span>{check.floors} tầng · {check.land_area} m²</span>
                        <span>·</span>
                        <span>{formatDate(check.created_at)}</span>
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      {check.status === 'completed' && (
                        <Link
                          href={`/dashboard/report/${check.id}`}
                          className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Xem báo cáo
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
