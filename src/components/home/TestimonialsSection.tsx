'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials } from '@/data/testimonials'

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const total = testimonials.length

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total)
  }, [total])

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [isPaused, next])

  const testimonial = testimonials[current]

  return (
    <section
      className="py-16 sm:py-24 bg-beige grain-texture overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-[family-name:var(--font-dm-sans)] text-sm text-gold tracking-[0.3em] uppercase">
            Témoignages
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark mt-2">
            Ce que disent nos clientes
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonial.id}
              className="text-center px-4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-gold/30 mx-auto mb-6" />

              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-gold fill-gold' : 'text-beige'}`}
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl italic text-text-dark leading-relaxed max-w-2xl mx-auto">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-8 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                  <span className="font-[family-name:var(--font-playfair)] text-sm font-bold text-gold">
                    {testimonial.avatar}
                  </span>
                </div>
                <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark">
                  {testimonial.name}
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mt-0.5">
                  {testimonial.location}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gold/30 bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-gold/10 transition-colors hidden sm:flex"
            aria-label="Témoignage précédent"
          >
            <ChevronLeft className="w-4 h-4 text-gold" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gold/30 bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-gold/10 transition-colors hidden sm:flex"
            aria-label="Témoignage suivant"
          >
            <ChevronRight className="w-4 h-4 text-gold" />
          </button>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === current ? 'w-6 bg-gold' : 'bg-gold/30 hover:bg-gold/50'
              }`}
              aria-label={`Aller au témoignage ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
