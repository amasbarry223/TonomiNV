'use client'

import { useRef, useState, useCallback } from 'react'
import { ImagePlus, Loader2, Star, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  PRODUCT_IMAGE_ACCEPT,
  PRODUCT_IMAGE_MAX_COUNT,
  uploadProductImage,
  validateProductImageFile,
} from '@/lib/admin-image-upload'

type Props = {
  productId: string
  images: string[]
  onChange: (images: string[]) => void
  compact?: boolean
}

export default function ProductImageUploader({
  productId,
  images,
  onChange,
  compact = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const remaining = PRODUCT_IMAGE_MAX_COUNT - images.length

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files)
      if (!list.length) return
      if (images.length >= PRODUCT_IMAGE_MAX_COUNT) {
        toast.error(`Maximum ${PRODUCT_IMAGE_MAX_COUNT} images`)
        return
      }
      const batch = list.slice(0, PRODUCT_IMAGE_MAX_COUNT - images.length)
      setUploading(true)
      const next = [...images]
      try {
        for (const file of batch) {
          const err = validateProductImageFile(file)
          if (err) {
            toast.error(err)
            continue
          }
          next.push(await uploadProductImage(file, productId))
        }
        if (next.length > images.length) {
          onChange(next)
          toast.success(next.length - images.length > 1 ? 'Images ajoutées' : 'Image ajoutée')
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Upload impossible')
      } finally {
        setUploading(false)
        if (inputRef.current) inputRef.current.value = ''
      }
    },
    [images, onChange, productId]
  )

  const removeAt = (index: number) => onChange(images.filter((_, i) => i !== index))

  const setAsMain = (index: number) => {
    if (index === 0) return
    const reordered = [...images]
    const [main] = reordered.splice(index, 1)
    onChange([main, ...reordered])
  }

  if (compact) {
    return (
      <div className="h-full flex flex-col min-h-0">
        <p className="text-[10px] text-slate-500 mb-2 shrink-0">
          1ère photo = vignette catalogue · max {PRODUCT_IMAGE_MAX_COUNT}
        </p>
        <div className="flex-1 min-h-0 flex flex-wrap content-start gap-2">
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative w-[72px] h-[72px] rounded-lg overflow-hidden border border-slate-200 group shrink-0"
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-0.5 left-0.5 p-0.5 rounded bg-[#D4AF6A] text-white">
                  <Star className="w-2.5 h-2.5 fill-current" />
                </span>
              )}
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-0.5 transition-opacity">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => setAsMain(i)}
                    className="p-1 rounded bg-white/90"
                    title="Principale"
                  >
                    <Star className="w-3 h-3 text-slate-800" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="p-1 rounded bg-red-500 text-white"
                  title="Supprimer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          {remaining > 0 && (
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                void processFiles(e.dataTransfer.files)
              }}
              className={cn(
                'w-[72px] h-[72px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-0.5 shrink-0 transition-colors',
                uploading
                  ? 'border-slate-200 bg-slate-50'
                  : 'border-slate-200 hover:border-[#D4AF6A] hover:bg-[#D4AF6A]/5'
              )}
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 text-[#D4AF6A] animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 text-slate-400" />
                  <span className="text-[9px] font-semibold text-slate-500">Ajouter</span>
                </>
              )}
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={PRODUCT_IMAGE_ACCEPT}
          multiple
          className="sr-only"
          disabled={uploading}
          onChange={(e) => e.target.files && void processFiles(e.target.files)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group"
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wide bg-[#D4AF6A] text-white px-1.5 py-0.5 rounded-md">
                  <Star className="w-2.5 h-2.5 fill-current" /> Principale
                </span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i !== 0 && (
                  <button type="button" onClick={() => setAsMain(i)} className="p-2 rounded-lg bg-white/90">
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button type="button" onClick={() => removeAt(i)} className="p-2 rounded-lg bg-red-500/90 text-white">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {remaining > 0 && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            void processFiles(e.dataTransfer.files)
          }}
          onClick={() => !uploading && inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 cursor-pointer',
            uploading ? 'pointer-events-none bg-slate-50' : 'hover:border-[#D4AF6A]/50 hover:bg-[#D4AF6A]/5'
          )}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-[#D4AF6A] animate-spin" />
          ) : (
            <>
              <ImagePlus className="w-8 h-8 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">Glisser ou cliquer</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={PRODUCT_IMAGE_ACCEPT}
            multiple
            className="sr-only"
            disabled={uploading}
            onChange={(e) => e.target.files && void processFiles(e.target.files)}
          />
        </div>
      )}
    </div>
  )
}
