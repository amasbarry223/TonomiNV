'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, AlertCircle } from 'lucide-react'
import type { Product } from '@/data/products'
import { useNavStore } from '@/stores/nav-store'
import ProductCard from './ProductCard'
import { Skeleton } from '@/components/ui/skeleton'

function CardSkeleton() {
  return (
    <div className="flex-shrink-0 w-64 sm:w-72">
      <div className="glass-card overflow-hidden">
        <Skeleton className="aspect-[3/4] rounded-none" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </div>
    </div>
  )
}

export default function NewArrivals() {
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { goCatalog } = useNavStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    async function fetchNewProducts() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/products?limit=100')
        if (!res.ok) throw new Error('Failed to fetch products')
        const data = await res.json()
        const filtered = (data.products as Product[]).filter((p) => p.isNew)
        setNewProducts(filtered)
      } catch {
        setError('Impossible de charger les nouvelles arrivées')
      } finally {
        setLoading(false)
      }
    }
    fetchNewProducts()
  }, [])

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }, [])

  useEffect(() => {
    if (!loading && newProducts.length > 0) {
      checkScroll()
    }
  }, [loading, newProducts, checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 320
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
    setTimeout(checkScroll, 400)
  }

  const handleRetry = () => {
    setNewProducts([])
    setLoading(true)
    setError(null)
    fetch('/api/products?limit=100')
      .then((res) => {
        if (!res.ok) throw new Error('Failed')
        return res.json()
      })
      .then((data) => {
        const filtered = (data.products as Product[]).filter((p) => p.isNew)
        setNewProducts(filtered)
      })
      .catch(() => setError('Impossible de charger les nouvelles arrivées'))
      .finally(() => setLoading(false))
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
        {loading ? (
          <div className="flex gap-4 sm:gap-6 overflow-hidden pb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-10 h-10 text-caramel/50 mb-3" />
            <p className="font-[family-name:var(--font-dm-sans)] text-text-mid text-sm mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="btn-gold px-6 py-2.5 text-sm"
            >
              Réessayer
            </button>
          </div>
        ) : (
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
        )}

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
