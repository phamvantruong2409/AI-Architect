import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import ChatInterface from '@/components/chat/ChatInterface'

export default function ChatPage() {
  return (
    <main className="h-screen bg-stone-950 text-stone-100 flex flex-col">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1c1917', color: '#e7e5e4', border: '1px solid #44403c' } }} />

      {/* Header */}
      <header className="border-b border-stone-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-stone-500 hover:text-stone-300 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-semibold text-stone-100">Chat với tài liệu</h1>
            <p className="text-xs text-stone-500">RAG — trả lời có trích dẫn nguồn</p>
          </div>
        </div>
        <Link
          href="/library"
          className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <BookOpen size={14} />
          Thư viện
        </Link>
      </header>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  )
}
