import Link from 'next/link'

const STANDARDS = [
  { code: 'QCXDVN 01:2021', desc: 'Khoảng lùi & Mật độ xây dựng' },
  { code: 'QCVN 06:2022', desc: 'An toàn cháy PCCC' },
  { code: 'TCVN 4474', desc: 'Chiếu sáng tự nhiên' },
]

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-stone-50">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="text-6xl mb-2">⚖️</div>
        <h1 className="text-3xl font-bold text-stone-900">Regulatory AI</h1>
        <p className="text-stone-500 text-lg leading-relaxed">
          Kiểm tra tự động thông số công trình theo tiêu chuẩn xây dựng Việt Nam —
          xuất báo cáo Redline với danh sách vi phạm có mức độ ưu tiên.
        </p>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 text-left space-y-2">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Tiêu chuẩn đối chiếu</p>
          {STANDARDS.map((s) => (
            <div key={s.code} className="flex items-center gap-3">
              <span className="text-xs font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">{s.code}</span>
              <span className="text-sm text-stone-600">{s.desc}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-700 transition-colors"
          >
            Dashboard KTS →
          </Link>
          <Link
            href="/check/new"
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Kiểm tra ngay
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 justify-center pt-2 text-sm text-stone-400">
          <span className="px-3 py-1 bg-stone-100 rounded-full">Module 2 / 4</span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">Regulatory & CAD Redline</span>
          <span className="px-3 py-1 bg-stone-100 rounded-full">Powered by Gemini</span>
        </div>
      </div>
    </main>
  )
}
