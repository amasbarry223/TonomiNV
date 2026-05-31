'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, ShoppingBag } from 'lucide-react'

interface ImageLightboxProps {
  images: string[]
  initialIndex?: number
  productName?: string
  onClose: () => void
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  productName = '',
  onClose,
}: ImageLightboxProps) {
  const [idx, setIdx] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [dragStart, setDragStart] = useState<number | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const prev = useCallback(() => {
    setZoom(1)
    setIdx((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  const next = useCallback(() => {
    setZoom(1)
    setIdx((i) => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(3, z + 0.5))
      if (e.key === '-') setZoom((z) => Math.max(1, z - 0.5))
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onClose, prev, next])

  if (!mounted) return null

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 shrink-0">
        <div>
          {productName && (
            <p className="font-[family-name:var(--font-playfair)] text-white/90 text-sm font-medium">
              {productName}
            </p>
          )}
          <p className="font-[family-name:var(--font-dm-sans)] text-white/40 text-xs mt-0.5">
            {idx + 1} / {images.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
            disabled={zoom <= 1}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Dézoomer"
          >
            <ZoomOut size={16} />
          </button>
          <span className="font-[family-name:var(--font-dm-sans)] text-white/50 text-xs min-w-[36px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.5))}
            disabled={zoom >= 3}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Zoomer"
          >
            <ZoomIn size={16} />
          </button>
          <div className="w-px h-5 bg-white/20 mx-1" />
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden select-none"
        onTouchStart={(e) => setDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (dragStart === null) return
          const diff = e.changedTouches[0].clientX - dragStart
          if (Math.abs(diff) > 50) diff < 0 ? next() : prev()
          setDragStart(null)
        }}
      >
        {/* Prev button */}
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-3 sm:left-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all border border-white/10"
            aria-label="Image précédente"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-full h-full px-16 sm:px-20"
            style={{ cursor: zoom > 1 ? 'move' : 'zoom-in' }}
            onClick={() => zoom === 1 ? setZoom(2) : setZoom(1)}
          >
            <div
              className="relative max-w-full max-h-full"
              style={{
                transform: `scale(${zoom})`,
                transition: 'transform 0.3s ease',
                transformOrigin: 'center center',
              }}
            >
              {/* Placeholder background (since images may not be loaded) */}
              <div className="w-[min(80vw,500px)] h-[min(70vh,600px)] bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                <ShoppingBag className="w-20 h-20 text-[#D4AF6A]/20" />
                {/* Try to show real image */}
                <img
                  ref={imgRef}
                  src={images[idx]}
                  alt={`${productName} - ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-300"
                  onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                  draggable={false}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute right-3 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all border border-white/10"
            aria-label="Image suivante"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="shrink-0 flex justify-center gap-2 px-4 pb-4 pt-3 overflow-x-auto">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { setZoom(1); setIdx(i) }}
              className={`flex-shrink-0 w-14 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === idx
                  ? 'border-[#D4AF6A] scale-105 shadow-[0_0_12px_rgba(212,175,106,0.4)]'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="w-full h-full bg-stone-800 flex items-center justify-center relative">
                <ShoppingBag className="w-5 h-5 text-white/20" />
                <img
                  src={images[i]}
                  alt={`Miniature ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity"
                  onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Keyboard hint */}
      <p className="text-center font-[family-name:var(--font-dm-sans)] text-white/20 text-[10px] pb-3 hidden sm:block">
        ← → Navigation · Clic pour zoomer · Échap pour fermer
      </p>
    </motion.div>
  )

  return createPortal(
    <AnimatePresence>{content}</AnimatePresence>,
    document.body
  )
}
