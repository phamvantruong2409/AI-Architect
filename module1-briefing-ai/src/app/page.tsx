import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-stone-50">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="text-6xl mb-2">🏛️</div>
        <h1 className="text-3xl font-bold text-stone-900">AI Briefing Studio</h1>
        <p className="text-stone-500 text-lg leading-relaxed">
          Hệ thống phân tích tâm lý không gian sống — chuyển ngôn ngữ cảm xúc của khách hàng
          thành Design Brief chuẩn hóa cho Kiến Trúc Sư.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-700 transition-colors"
          >
            Dashboard KTS →
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 justify-center pt-2 text-sm text-stone-400">
          <span className="px-3 py-1 bg-stone-100 rounded-full">Module 1 / 4</span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full">CRM & Briefing AI</span>
          <span className="px-3 py-1 bg-stone-100 rounded-full">Powered by Gemini</span>
        </div>
      </div>
    </main>
  )
}
