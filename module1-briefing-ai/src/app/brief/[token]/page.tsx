'use client'

import { useState, useEffect, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageSelector from '@/components/quiz/ImageSelector'
import QuizProgress from '@/components/quiz/QuizProgress'
import LifestyleForm from '@/components/quiz/LifestyleForm'
import BriefPreview from '@/components/brief/BriefPreview'
import { QUIZ_PAIRS } from '@/lib/quiz-data'
import type { SelectedImage, DesignBrief, Project } from '@/lib/types'

type Phase = 'loading' | 'not_found' | 'already_done' | 'welcome' | 'images' | 'lifestyle' | 'analyzing' | 'done'

export default function ClientQuizPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [phase, setPhase] = useState<Phase>('loading')
  const [project, setProject] = useState<Project | null>(null)
  const [pairIndex, setPairIndex] = useState(0)
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([])
  const [brief, setBrief] = useState<DesignBrief | null>(null)
  const [lifestyleData, setLifestyleData] = useState<object | null>(null)

  useEffect(() => {
    fetch(`/api/projects/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.project) { setPhase('not_found'); return }
        setProject(data.project)
        if (data.brief) {
          setBrief(data.brief)
          setPhase('already_done')
        } else {
          setPhase('welcome')
        }
      })
      .catch(() => setPhase('not_found'))
  }, [token])

  function handleImageSelect(img: SelectedImage) {
    const next = [...selectedImages, img]
    setSelectedImages(next)
    if (pairIndex + 1 < QUIZ_PAIRS.length) {
      setTimeout(() => setPairIndex(pairIndex + 1), 400)
    } else {
      setTimeout(() => setPhase('lifestyle'), 400)
    }
  }

  async function handleLifestyleSubmit(data: object) {
    if (!project) return
    setLifestyleData(data)
    setPhase('analyzing')

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: project.id,
        selected_images: selectedImages,
        ...data,
      }),
    })

    const result = await res.json()
    if (res.ok && result.brief) {
      setBrief(result.brief)
      setPhase('done')
    } else {
      alert('Có lỗi xảy ra khi phân tích. Vui lòng thử lại.')
      setPhase('lifestyle')
    }
  }

  // LOADING
  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center text-stone-400">
          <div className="text-3xl mb-2 animate-pulse">🏛️</div>
          <p>Đang tải...</p>
        </div>
      </div>
    )
  }

  // NOT FOUND
  if (phase === 'not_found') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center text-stone-500 max-w-sm">
          <div className="text-4xl mb-3">🔍</div>
          <h2 className="text-xl font-semibold mb-2">Không tìm thấy dự án</h2>
          <p className="text-sm">Link không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ kiến trúc sư của bạn.</p>
        </div>
      </div>
    )
  }

  // ALREADY DONE
  if (phase === 'already_done' && brief && project) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="bg-green-50 border-b border-green-200 px-6 py-3 text-center text-sm text-green-700">
          ✅ Bạn đã hoàn thành khảo sát. Dưới đây là Design Brief được tạo cho bạn.
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <BriefPreview brief={brief} project={project} />
        </div>
      </div>
    )
  }

  // WELCOME SCREEN
  if (phase === 'welcome' && project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="text-5xl">🏡</div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Xin chào, {project.client_name}!</h1>
            <p className="text-stone-500 mt-2 text-sm">Dự án: <span className="font-medium">{project.project_name}</span></p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5 text-left space-y-3">
            <h2 className="font-semibold text-stone-800">Khảo sát này giúp gì cho bạn?</h2>
            <div className="space-y-2 text-sm text-stone-600">
              {[
                ['🖼️', 'Chọn 6 cặp hình ảnh phong cách (khoảng 3 phút)'],
                ['📝', 'Điền thông tin sinh hoạt gia đình (khoảng 2 phút)'],
                ['✨', 'AI phân tích và tạo Design Brief cho kiến trúc sư'],
              ].map(([icon, text], i) => (
                <div key={i} className="flex items-start gap-2">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-stone-400">
            Không có câu trả lời đúng hay sai — chỉ cần chọn điều bạn thấy thích hơn.
          </p>
          <button
            onClick={() => setPhase('images')}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl text-lg transition-colors shadow-sm"
          >
            Bắt đầu →
          </button>
        </motion.div>
      </div>
    )
  }

  // IMAGE QUIZ
  if (phase === 'images') {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <QuizProgress
            current={pairIndex}
            total={QUIZ_PAIRS.length}
            phase="images"
          />
          <ImageSelector
            pair={QUIZ_PAIRS[pairIndex]}
            pairIndex={pairIndex}
            onSelect={handleImageSelect}
          />
        </div>
      </div>
    )
  }

  // LIFESTYLE FORM
  if (phase === 'lifestyle') {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <QuizProgress current={6} total={6} phase="images" />
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-stone-900">Tuyệt vời! 🎉</h2>
            <p className="text-stone-500 mt-1 text-sm">
              Giờ hãy cho chúng tôi biết thêm về gia đình và sinh hoạt của bạn.
            </p>
          </div>
          <LifestyleForm onSubmit={handleLifestyleSubmit} />
        </div>
      </div>
    )
  }

  // ANALYZING
  if (phase === 'analyzing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4 max-w-sm"
        >
          <div className="text-5xl animate-bounce">🤖</div>
          <h2 className="text-xl font-bold text-stone-900">AI đang phân tích...</h2>
          <p className="text-stone-500 text-sm">
            Chúng tôi đang tổng hợp sở thích của bạn và tạo Design Brief chuẩn hóa. Quá trình này mất khoảng 15–30 giây.
          </p>
          <div className="flex justify-center gap-1.5 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 bg-amber-500 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // DONE
  if (phase === 'done' && brief && project) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-center">
          <p className="text-amber-800 font-medium text-sm">
            ✨ Design Brief của bạn đã hoàn thành! Kiến trúc sư sẽ sử dụng tài liệu này để thiết kế cho bạn.
          </p>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <BriefPreview
            brief={brief}
            project={project}
            budgetRange={(lifestyleData as { budget_range?: string })?.budget_range}
          />
        </div>
      </div>
    )
  }

  return null
}
