'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2 } from 'lucide-react'
import { searchProducts } from '@/data/products'
import { formatPrice } from '@/lib/product-display'
import { useNavStore } from '@/stores/nav-store'
import { ProductImage } from '@/components/ui/product-image'

interface SearchResult {
  id: string
  name: string
  category: string
  price: number
  pricePromo?: number
  images: string[]
}

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { goProduct } = useNavStore()

  const loading = query.trim() !== debouncedQuery.trim()

  const results = useMemo<SearchResult[]>(() => {
    if (!debouncedQuery.trim()) return []
    return searchProducts(debouncedQuery).slice(0, 5)
  }, [debouncedQuery])

  const handleClose = useCallback(() => {
    setQuery('')
    setDebouncedQuery('')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, handleClose])

  const handleSelect = useCallback((product: SearchResult) => {
    goProduct(product.id)
    handleClose()
  }, [goProduct, handleClose])

  const categoryNameMap: Record<string, string> = {
    bijoux: 'Bijoux',
    sacs: 'Sacs',
    foulards: 'Foulards',
    lunettes: 'Lunettes',
    ceintures: 'Ceintures',
    'accessoires-cheveux': 'Accessoires Cheveux',
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Search Overlay */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-[70] pt-4 px-4 sm:px-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="mx-auto max-w-2xl">
              {/* Search Bar */}
              <motion.div
                className="bg-cream/90 backdrop-blur-xl border border-gold/20 rounded-2xl shadow-[0_8px_40px_rgba(212,175,106,0.15)] overflow-hidden"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* Input Area */}
                <div className="flex items-center gap-3 px-5 py-4">
                  <Search className="w-5 h-5 text-gold flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un accessoire..."
                    className="flex-1 bg-transparent font-[family-name:var(--font-dm-sans)] text-base text-text-dark placeholder:text-text-mid/50 outline-none"
                  />
                  {loading && (
                    <Loader2 className="w-5 h-5 text-gold animate-spin flex-shrink-0" />
                  )}
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-full hover:bg-gold/10 transition-colors flex-shrink-0"
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5 text-text-mid" />
                  </button>
                </div>

                {/* Results Dropdown */}
                <AnimatePresence>
                  {results.length > 0 && (
                    <motion.div
                      className="border-t border-gold/10"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-2">
                        {results.map((product, idx) => (
                          <motion.button
                            key={product.id}
                            onClick={() => handleSelect(product)}
                            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gold/5 transition-colors text-left"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            {/* Product Image */}
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-beige/40 flex-shrink-0">
                              {product.images && product.images.length > 0 ? (
                                <ProductImage
                                  src={product.images[0]}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  sizes="40px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Search className="w-4 h-4 text-gold/30" />
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-text-dark truncate">
                                {product.name}
                              </p>
                              <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
                                {categoryNameMap[product.category] || product.category}
                              </p>
                            </div>

                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                              <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-gold">
                                {formatPrice(product.pricePromo ?? product.price)}
                              </p>
                              {product.pricePromo && (
                                <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-text-mid/50 line-through">
                                  {formatPrice(product.price)}
                                </p>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* No results */}
                <AnimatePresence>
                  {query.trim() && !loading && results.length === 0 && (
                    <motion.div
                      className="border-t border-gold/10 px-5 py-6 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid">
                        Aucun résultat pour &laquo;{query}&raquo;
                      </p>
                      <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid/60 mt-1">
                        Essayez un autre terme de recherche
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick hints when empty */}
                <AnimatePresence>
                  {!query.trim() && (
                    <motion.div
                      className="border-t border-gold/10 px-5 py-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid/60 mb-2">
                        Suggestions populaires
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['Collier', 'Sac', 'Lunettes', 'Bracelet', 'Foulard'].map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-3 py-1.5 rounded-full bg-gold/5 border border-gold/10 font-[family-name:var(--font-dm-sans)] text-xs text-text-mid hover:bg-gold/10 hover:text-gold transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
