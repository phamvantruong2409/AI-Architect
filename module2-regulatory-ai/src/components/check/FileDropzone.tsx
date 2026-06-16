'use client'

import { useCallback, useState } from 'react'

interface Props {
  value: File | null
  onChange: (file: File | null) => void
}

export default function FileDropzone({ value, onChange }: Props) {
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) {
        onChange(null)
        setPreview(null)
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP).')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File ảnh phải nhỏ hơn 5MB.')
        return
      }
      onChange(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    },
    [onChange]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0] ?? null
      handleFile(file)
    },
    [handleFile]
  )

  if (value && preview) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-stone-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="Mặt bằng" className="w-full max-h-80 object-contain bg-stone-100" />
        <div className="absolute top-3 right-3">
          <button
            onClick={() => handleFile(null)}
            className="bg-white border border-stone-200 hover:bg-red-50 text-stone-600 hover:text-red-600 rounded-full px-3 py-1 text-xs font-medium shadow-sm transition-colors"
          >
            Xóa ảnh
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm border border-stone-200 text-stone-600 rounded-full px-3 py-1 text-xs font-medium">
            {value.name} ({(value.size / 1024).toFixed(0)} KB)
          </span>
        </div>
      </div>
    )
  }

  return (
    <label
      className={`flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
        dragging
          ? 'border-red-400 bg-red-50'
          : 'border-stone-200 bg-stone-50 hover:border-stone-400 hover:bg-white'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <span className="text-4xl">🗺️</span>
      <div className="text-center">
        <p className="font-medium text-stone-700">Kéo thả ảnh mặt bằng vào đây</p>
        <p className="text-sm text-stone-400 mt-1">hoặc click để chọn file · JPG, PNG, WEBP · Tối đa 5MB</p>
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </label>
  )
}
