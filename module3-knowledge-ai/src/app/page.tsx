import Link from 'next/link'
import { BookOpen, MessageSquare, Upload, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-800 px-8 py-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-stone-500 tracking-widest uppercase">CongcuStudio</span>
          <h1 className="text-lg font-semibold text-stone-100">Knowledge Base AI</h1>
        </div>
        <span className="text-xs bg-stone-800 text-stone-400 px-2 py-1 rounded">Module 3</span>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-8 py-20 text-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-stone-800 text-stone-400 text-xs px-3 py-1 rounded-full mb-6">
            <Zap size={12} />
            RAG — Retrieval-Augmented Generation
          </div>
          <h2 className="text-4xl font-bold text-stone-100 mb-4 leading-tight">
            Tra cứu luật xây dựng<br />bằng ngôn ngữ tự nhiên
          </h2>
          <p className="text-stone-400 text-lg mb-10">
            Upload PDF, Word, TXT chứa TCVN, QCVN, PCCC... AI tự lập chỉ mục và trả lời câu hỏi
            của bạn với trích dẫn nguồn chính xác.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/library"
              className="flex items-center gap-2 bg-stone-100 text-stone-900 px-6 py-3 rounded-lg font-medium hover:bg-white transition-colors"
            >
              <Upload size={16} />
              Quản lý tài liệu
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-2 border border-stone-700 text-stone-300 px-6 py-3 rounded-lg font-medium hover:border-stone-500 hover:text-stone-100 transition-colors"
            >
              <MessageSquare size={16} />
              Bắt đầu chat
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-stone-800 px-8 py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          {[
            {
              icon: Upload,
              title: 'Upload linh hoạt',
              desc: 'PDF, Word, TXT. Phân loại theo TCVN / QCVN / PCCC / General.',
            },
            {
              icon: Zap,
              title: 'Lập chỉ mục tự động',
              desc: 'AI chia nhỏ, tạo vector embedding, lưu vào Supabase pgvector.',
            },
            {
              icon: BookOpen,
              title: 'Trích dẫn nguồn',
              desc: 'Mỗi câu trả lời đều kèm đoạn trích và tên tài liệu gốc.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col gap-3">
              <div className="w-9 h-9 bg-stone-800 rounded-lg flex items-center justify-center">
                <Icon size={16} className="text-stone-300" />
              </div>
              <h3 className="font-medium text-stone-200">{title}</h3>
              <p className="text-sm text-stone-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
