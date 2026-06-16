'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import FileUploader from '@/components/library/FileUploader'
import DocumentList from '@/components/library/DocumentList'
import type { Document } from '@/lib/types'

export default function LibraryPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchDocuments() {
    try {
      const res = await fetch('/api/documents')
      const json = await res.json()
      setDocuments(json.documents ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDocuments() }, [])

  function handleUploaded(docId: string) {
    fetchDocuments()
    // Tự động trigger xử lý
    fetch(`/api/process/${docId}`, { method: 'POST' })
      .then(() => fetchDocuments())
  }

  function handleDeleted(id: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }

  function handleProcessed(id: string) {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'ready' as const } : d))
    )
    fetchDocuments()
  }

  const readyCount = documents.filter((d) => d.status === 'ready').length

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1c1917', color: '#e7e5e4', border: '1px solid #44403c' } }} />

      {/* Header */}
      <header className="border-b border-stone-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-stone-500 hover:text-stone-300 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-semibold text-stone-100">Thư viện tài liệu</h1>
            <p className="text-xs text-stone-500">{readyCount} tài liệu sẵn sàng / {documents.length} tổng</p>
          </div>
        </div>
        <Link
          href="/chat"
          className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <MessageSquare size={14} />
          Vào Chat
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Upload */}
        <section>
          <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-4">
            Upload tài liệu mới
          </h2>
          <FileUploader onUploaded={handleUploaded} />
        </section>

        {/* List */}
        <section>
          <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-4">
            Tài liệu đã upload
          </h2>
          {loading ? (
            <div className="text-center py-12 text-stone-600 text-sm">Đang tải...</div>
          ) : (
            <DocumentList
              documents={documents}
              onDeleted={handleDeleted}
              onProcessed={handleProcessed}
            />
          )}
        </section>
      </div>
    </main>
  )
}
