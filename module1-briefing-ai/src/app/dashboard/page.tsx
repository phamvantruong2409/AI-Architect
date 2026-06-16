'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { Project } from '@/lib/types'

const STATUS_MAP = {
  pending: { label: 'Chờ khách', color: 'bg-yellow-100 text-yellow-700' },
  in_progress: { label: 'Đang làm', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700' },
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ client_name: '', client_email: '', project_name: '' })
  const [creating, setCreating] = useState(false)
  const [newLink, setNewLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  async function createProject(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setProjects([data.project, ...projects])
      setNewLink(data.client_url)
      setForm({ client_name: '', client_email: '', project_name: '' })
      setShowForm(false)
    }
    setCreating(false)
  }

  function copyLink() {
    if (!newLink) return
    navigator.clipboard.writeText(newLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏛️</span>
          <div>
            <h1 className="font-bold text-stone-900">AI Briefing Studio</h1>
            <p className="text-xs text-stone-400">Dashboard Kiến Trúc Sư</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          + Tạo dự án mới
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Link mới tạo */}
        {newLink && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="font-semibold text-green-800 mb-2">✅ Dự án đã tạo! Gửi link này cho khách hàng:</p>
            <div className="flex gap-2 items-center">
              <code className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700 break-all">
                {newLink}
              </code>
              <button
                onClick={copyLink}
                className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                {copied ? '✓ Đã copy' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Form tạo project */}
        {showForm && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6">
            <h2 className="font-semibold text-stone-800 mb-4">Tạo dự án mới</h2>
            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-stone-600 block mb-1">Tên khách hàng *</label>
                <input
                  required
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  placeholder="Ông/Bà Nguyễn Văn A"
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-600 block mb-1">Email khách hàng</label>
                <input
                  type="email"
                  value={form.client_email}
                  onChange={(e) => setForm({ ...form, client_email: e.target.value })}
                  placeholder="khach@email.com"
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-600 block mb-1">Tên dự án *</label>
                <input
                  required
                  value={form.project_name}
                  onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                  placeholder="Biệt thự 3 tầng Q.2 – Ông Minh"
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  {creating ? 'Đang tạo...' : 'Tạo & Lấy link'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl text-sm transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Danh sách projects */}
        <div>
          <h2 className="font-semibold text-stone-700 mb-4">
            Danh sách dự án ({projects.length})
          </h2>
          {loading ? (
            <div className="text-center py-16 text-stone-400">Đang tải...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 text-stone-400 bg-white rounded-2xl border border-stone-200">
              <p className="text-4xl mb-3">📋</p>
              <p>Chưa có dự án nào. Tạo dự án đầu tiên!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => {
                const status = STATUS_MAP[project.status] || STATUS_MAP.pending
                return (
                  <div
                    key={project.id}
                    className="bg-white border border-stone-200 rounded-2xl p-5 flex items-center justify-between hover:border-stone-300 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-stone-800">{project.project_name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-stone-500">
                        Khách: {project.client_name}
                        {project.client_email && ` · ${project.client_email}`}
                      </p>
                      <p className="text-xs text-stone-400">{formatDate(project.created_at)}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {project.status === 'completed' && (
                        <Link
                          href={`/dashboard/brief/${project.id}`}
                          className="px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors whitespace-nowrap"
                        >
                          Xem Brief
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/brief/${project.client_token}`
                          navigator.clipboard.writeText(url)
                        }}
                        className="px-3 py-1.5 bg-stone-100 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-200 transition-colors"
                      >
                        Copy link
                      </button>
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
