'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { getNewProducts } from '@/data/products'
import { useNavStore } from '@/stores/nav-store'
import ProductCard from './ProductCard'

export default function NewArrivals() {
  const newProducts = getNewProducts()
  const { goCatalog } = useNavStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 320
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
    setTimeout(checkScroll, 400)
  }

  return (
    <section className="py-16 sm:py-20 bg-warm-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.span
                className="inline-flex items-center gap-1 bg-gold/10 text-gold px-3 py-1 rounded-full font-[family-name:var(--font-dm-sans)] text-xs font-semibold tracking-wider uppercase"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3" />
                NEW
              </motion.span>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark">
              Nouvelles Arrivées
            </h2>
            <p className="font-[family-name:var(--font-dm-sans)] text-text-mid mt-2">
              Les dernières pièces de notre collection
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-4 h-4 text-gold" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Suivant"
            >
              <ChevronRight className="w-4 h-4 text-gold" />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {newProducts.map((product, index) => (
            <div key={product.id} className="flex-shrink-0 w-64 sm:w-72 snap-start">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {/* Voir tout */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            className="inline-flex items-center gap-2 font-[family-name:var(--font-dm-sans)] text-sm font-medium text-gold hover:text-caramel transition-colors"
            onClick={() => goCatalog()}
            whileHover={{ x: 4 }}
          >
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
