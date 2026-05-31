'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useNavStore } from '@/stores/nav-store'
import { useAdminStore } from '@/stores/admin-store'
import { getProductImagePaths } from '@/data/product-image-map'
import { ProductImage } from '@/components/ui/product-image'

const SLIDE_INTERVAL_MS = 6000

const slideVariants = {
  enter: { opacity: 0, scale: 1.06 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
}

const textVariants = {
  enter: { opacity: 0, y: 28 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
}

export default function HeroSection() {
  const { goCatalog, goPromotions } = useNavStore()
  const adminSlides = useAdminStore((s) => s.heroSlides)
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const slides = useMemo(
    () =>
      adminSlides
        .filter((s) => s.active)
        .map((s) => ({
          id: s.id,
          image: getProductImagePaths(s.imageKey, s.imageCategory, 1)[0],
          badge: s.badge,
          title: s.title,
          highlight: s.highlight,
          description: s.description,
          primary: { label: s.ctaPrimary, onClick: () => goCatalog() },
          secondary: s.ctaSecondary ? { label: s.ctaSecondary, onClick: () => goPromotions() } : undefined,
        })),
    [adminSlides, goCatalog, goPromotions]
  )

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + slides.length) % slides.length)
    },
    [slides.length]
  )

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, SLIDE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [paused, next])

  const slide = slides[activeIndex]

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Bannière principale"
    >
      {/* Slides background */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slide.id}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <ProductImage
            src={slide.image}
            alt=""
            fill
            priority={activeIndex === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pb-28 pt-24 sm:px-6 sm:pb-32 sm:pt-28 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <div className="mb-5 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              <span className="font-[family-name:var(--font-dm-sans)] text-xs font-semibold uppercase tracking-[0.35em] text-gold sm:text-sm">
                {slide.badge}
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              {slide.title}{' '}
              <span className="text-gold-gradient">{slide.highlight}</span>
            </h1>

            <p className="mt-5 max-w-lg font-[family-name:var(--font-dm-sans)] text-base leading-relaxed text-white/85 sm:text-lg">
              {slide.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <motion.button
                type="button"
                className="btn-gold flex items-center justify-center gap-2 px-8 py-3.5 text-sm"
                onClick={slide.primary.onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {slide.primary.label}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
              {slide.secondary && (
                <motion.button
                  type="button"
                  className="rounded-[50px] border border-white/40 px-8 py-3.5 font-[family-name:var(--font-dm-sans)] text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
                  onClick={slide.secondary.onClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {slide.secondary.label}
                </motion.button>
              )}
            </div>

            <div className="mt-10 flex items-center gap-8">
              {[
                { value: '200+', label: 'Références' },
                { value: '500+', label: 'Clientes' },
                { value: '48h', label: 'Livraison' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gold sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-xs text-white/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:left-6"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:right-6"
        aria-label="Slide suivant"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots + progress */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-8 bg-gold'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Aller au slide ${i + 1}`}
              aria-current={i === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="font-[family-name:var(--font-dm-sans)] text-xs tracking-wider text-white/60">
            Défiler
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5 text-gold" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
