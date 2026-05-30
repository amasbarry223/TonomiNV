'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, Eye, AlertCircle } from 'lucide-react'
import type { Product } from '@/data/products'
import { useNavStore } from '@/stores/nav-store'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from './ProductCard'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

function CardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <Skeleton className="aspect-[3/4] rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-2/3" />
      </div>
    </div>
  )
}

export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { goProduct } = useNavStore()
  const [quickViewProduct, setQuickViewProduct] = useState<string | null>(null)

  const selectedProduct = bestSellers.find((p) => p.id === quickViewProduct)

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/products?limit=100')
        if (!res.ok) throw new Error('Failed to fetch products')
        const data = await res.json()
        const filtered = (data.products as Product[]).filter((p) => p.isBestSeller)
        setBestSellers(filtered)
      } catch {
        setError('Impossible de charger les best-sellers')
      } finally {
        setLoading(false)
      }
    }
    fetchBestSellers()
  }, [])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    fetch('/api/products?limit=100')
      .then((res) => {
        if (!res.ok) throw new Error('Failed')
        return res.json()
      })
      .then((data) => {
        const filtered = (data.products as Product[]).filter((p) => p.isBestSeller)
        setBestSellers(filtered)
      })
      .catch(() => setError('Impossible de charger les best-sellers'))
      .finally(() => setLoading(false))
  }

  return (
    <section className="py-16 sm:py-20 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Award className="w-5 h-5 text-gold" />
            <span className="font-[family-name:var(--font-dm-sans)] text-sm text-gold tracking-[0.2em] uppercase">
              Les plus aimés
            </span>
            <Award className="w-5 h-5 text-gold" />
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark">
            Best-Sellers
          </h2>

          {/* Animated counter */}
          <motion.div
            className="mt-4 inline-flex items-center gap-2 bg-gold/10 rounded-full px-5 py-2"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-gold">
              <AnimatedCounter target={500} suffix="+" />
            </span>
            <span className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid">
              clientes satisfaites
            </span>
          </motion.div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onQuickView={() => setQuickViewProduct(product.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Dialog */}
      <Dialog open={!!quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-warm-white border-gold/20">
          <DialogTitle className="sr-only">Aperçu rapide</DialogTitle>
          {selectedProduct && (
            <div className="flex flex-col sm:flex-row">
              <div className="relative aspect-[3/4] sm:aspect-auto sm:w-1/2 bg-gradient-to-br from-beige to-gold/10">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                {selectedProduct.badge && (
                  <span className="absolute top-3 left-3 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedProduct.badge === 'nouveau' ? 'Nouveau' : selectedProduct.badge === 'promo' ? 'Promo' : 'Épuisé'}
                  </span>
                )}
              </div>
              <div className="p-6 sm:w-1/2 flex flex-col justify-between">
                <div>
                  <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-text-dark">
                    {selectedProduct.name}
                  </h3>
                  <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mt-1 uppercase tracking-wider">
                    {selectedProduct.category}
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-3 leading-relaxed line-clamp-3">
                    {selectedProduct.description}
                  </p>
                  <div className="mt-4">
                    {selectedProduct.pricePromo ? (
                      <div className="flex items-center gap-2">
                        <span className="font-[family-name:var(--font-dm-sans)] text-xl font-bold text-gold">
                          {new Intl.NumberFormat('fr-FR').format(selectedProduct.pricePromo)} FCFA
                        </span>
                        <span className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid line-through">
                          {new Intl.NumberFormat('fr-FR').format(selectedProduct.price)} FCFA
                        </span>
                      </div>
                    ) : (
                      <span className="font-[family-name:var(--font-dm-sans)] text-xl font-bold text-gold">
                        {new Intl.NumberFormat('fr-FR').format(selectedProduct.price)} FCFA
                      </span>
                    )}
                  </div>
                </div>
                <motion.button
                  className="mt-6 w-full btn-gold py-3 text-sm flex items-center justify-center gap-2"
                  onClick={() => {
                    goProduct(selectedProduct.id)
                    setQuickViewProduct(null)
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Eye className="w-4 h-4" />
                  Voir le produit
                </motion.button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
