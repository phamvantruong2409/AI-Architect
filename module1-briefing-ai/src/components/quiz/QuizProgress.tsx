'use client'

interface QuizProgressProps {
  current: number
  total: number
  phase: 'images' | 'lifestyle'
}

export default function QuizProgress({ current, total, phase }: QuizProgressProps) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-2 text-sm text-stone-500">
        <span>
          {phase === 'images' ? '🖼️ Chọn phong cách' : '📝 Thông tin sinh hoạt'}
        </span>
        <span className="font-medium text-stone-700">{current}/{total}</span>
      </div>
      <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {phase === 'images' && (
        <div className="flex gap-2 mt-3">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < current ? 'bg-amber-500' : 'bg-stone-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
