'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutGrid, List, ChevronRight, ChevronLeft,
  Home, Heart, X, ArrowUpDown, Sparkles, LayoutList, SlidersHorizontal,
} from 'lucide-react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { categories } from '@/data/categories'
import { productsById } from '@/data/product-index'
import type { Product } from '@/data/products'
import { useFilterStore, SORT_OPTIONS } from '@/stores/filter-store'
import { useNavStore } from '@/stores/nav-store'
import { useWishlistStore } from '@/stores/wishlist-store'
import FilterSidebar from './FilterSidebar'
import FilterDrawer from './FilterDrawer'
import ProductGrid from './ProductGrid'
import QuickViewModal from './QuickViewModal'
import CatalogSearchBar from './CatalogSearchBar'
import CatalogProductResults from './CatalogProductResults'
import { ProductImage } from '@/components/ui/product-image'
import { getProductImagePaths } from '@/data/product-image-map'

const CATALOG_HEADER_IMAGE = getProductImagePaths('prod-008', 'sacs', 1)[0]

// ─── Category Strip ───────────────────────────────────────────────────────────
function CategoryStrip({
  active,
  onChange,
}: {
  active: string
  onChange: (slug: string) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const updateArrows = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect() }
  }, [updateArrows])

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 200 : -200, behavior: 'smooth' })
  }

  const totalProducts = categories.reduce((s, c) => s + c.productCount, 0)

  return (
    <div className="bg-white border-b border-gold/10 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center">

          {/* Left arrow */}
          <AnimatePresence>
            {canLeft && (
              <motion.button
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15 }}
                onClick={() => scroll('left')}
                className="absolute left-0 z-10 w-8 h-8 rounded-full bg-white border border-gold/20 shadow-md flex items-center justify-center hover:bg-gold hover:border-gold hover:text-white text-text-mid transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Left fade mask */}
          {canLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-[5] pointer-events-none" />
          )}

          {/* Scrollable pills */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto py-3 scrollbar-hide flex-1 px-2"
          >
            {/* Tout voir */}
            <motion.button
              onClick={() => onChange('')}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 font-[family-name:var(--font-dm-sans)] ${
                active === ''
                  ? 'bg-gold text-white shadow-md shadow-gold/25'
                  : 'bg-cream text-text-mid border border-gold/15 hover:border-gold/40 hover:text-gold'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              Tout voir
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                active === '' ? 'bg-white/20 text-white' : 'bg-gold/10 text-gold'
              }`}>
                {totalProducts}
              </span>
            </motion.button>

            {/* Dynamic categories */}
            {categories.map((cat) => {
              const isActive = active === cat.slug
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => onChange(cat.slug)}
                  whileTap={{ scale: 0.96 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 font-[family-name:var(--font-dm-sans)] ${
                    isActive
                      ? 'bg-gold text-white shadow-md shadow-gold/25'
                      : 'bg-cream text-text-mid border border-gold/15 hover:border-gold/40 hover:text-gold'
                  }`}
                >
                  {cat.name}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gold/10 text-gold'
                  }`}>
                    {cat.productCount}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* Right fade mask */}
          {canRight && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-[5] pointer-events-none" />
          )}

          {/* Right arrow */}
          <AnimatePresence>
            {canRight && (
              <motion.button
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                transition={{ duration: 0.15 }}
                onClick={() => scroll('right')}
                className="absolute right-0 z-10 w-8 h-8 rounded-full bg-white border border-gold/20 shadow-md flex items-center justify-center hover:bg-gold hover:border-gold hover:text-white text-text-mid transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default function CatalogPage() {
  const category    = useFilterStore((s) => s.category)
  const sort        = useFilterStore((s) => s.sort)
  const viewMode    = useFilterStore((s) => s.viewMode)
  const setCategory = useFilterStore((s) => s.setCategory)
  const setSort     = useFilterStore((s) => s.setSort)
  const setViewMode = useFilterStore((s) => s.setViewMode)
  const activeColors    = useFilterStore((s) => s.colors)
  const activeSizes     = useFilterStore((s) => s.sizes)
  const priceRange      = useFilterStore((s) => s.priceRange)
  const toggleColor     = useFilterStore((s) => s.toggleColor)
  const toggleSize      = useFilterStore((s) => s.toggleSize)
  const setPriceRange   = useFilterStore((s) => s.setPriceRange)
  const resetFilters    = useFilterStore((s) => s.resetFilters)
  const hasActiveFilters = useFilterStore((s) => s.hasActiveFilters)

  const { goHome, selectedCategory } = useNavStore()
  const wishlistItems = useWishlistStore((s) => s.items)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [quickViewOpen, setQuickViewOpen]         = useState(false)

  const isWishlistView = selectedCategory === 'wishlist'

  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'wishlist') {
      setCategory(selectedCategory)
    }
  }, [selectedCategory, setCategory])

  const wishlistProducts = useMemo(() =>
    wishlistItems.map((item) => productsById.get(item.productId))
      .filter((p): p is Product => p !== undefined),
  [wishlistItems])

  const handleQuickView   = useCallback((p: Product) => { setQuickViewProduct(p); setQuickViewOpen(true) }, [])
  const handleCloseQuickView = useCallback(() => { setQuickViewOpen(false); setTimeout(() => setQuickViewProduct(null), 200) }, [])

  const activeCatLabel = category ? categories.find((c) => c.slug === category)?.name ?? '' : ''

  /* ─── Wishlist view ─────────────────────────────────────── */
  if (isWishlistView) {
    return (
      <div className="min-h-screen pt-28 pb-16 bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-text-mid mb-6 font-[family-name:var(--font-dm-sans)]">
            <button onClick={goHome} className="flex items-center gap-1 hover:text-gold transition-colors">
              <Home className="w-3.5 h-3.5" /> Accueil
            </button>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className="text-gold font-medium">Mes Favoris</span>
          </nav>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-400 fill-red-400" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-text-dark">
                Mes Favoris
              </h1>
              <p className="text-sm text-text-mid font-[family-name:var(--font-dm-sans)] mt-0.5">
                {wishlistProducts.length} produit{wishlistProducts.length !== 1 ? 's' : ''} sauvegardé{wishlistProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5">
                <Heart className="w-10 h-10 text-red-200" />
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-text-dark mb-2">
                Aucun favori pour le moment
              </h2>
              <p className="text-sm text-text-mid max-w-xs font-[family-name:var(--font-dm-sans)] mb-6 leading-relaxed">
                Cliquez sur le ❤ sur n'importe quel produit pour l'ajouter à vos favoris.
              </p>
              <button onClick={() => useNavStore.getState().goCatalogue()} className="btn-gold px-6 py-2.5 text-sm">
                Découvrir la collection
              </button>
            </div>
          ) : (
            <ProductGrid products={wishlistProducts} onQuickView={handleQuickView} />
          )}
        </div>
        <QuickViewModal product={quickViewProduct} open={quickViewOpen} onClose={handleCloseQuickView} />
      </div>
    )
  }

  /* ─── Main catalog view ─────────────────────────────────── */
  return (
    <div className="min-h-screen bg-cream">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-10 sm:pt-44 sm:pb-14 overflow-hidden">
        <div className="absolute inset-0">
          <ProductImage
            src={CATALOG_HEADER_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/75" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-6 font-[family-name:var(--font-dm-sans)]">
            <button onClick={goHome} className="flex items-center gap-1 hover:text-white/80 transition-colors">
              <Home className="w-3.5 h-3.5" /> Accueil
            </button>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className={activeCatLabel ? 'text-white/50' : 'text-gold font-medium'}>Catalogue</span>
            {activeCatLabel && (
              <>
                <ChevronRight className="w-3 h-3 opacity-40" />
                <span className="text-gold font-medium">{activeCatLabel}</span>
              </>
            )}
          </nav>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/15 text-gold border border-white/20 backdrop-blur-sm px-5 py-2 rounded-full mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold tracking-wide uppercase">
                Notre Boutique
              </span>
            </motion.div>

            <motion.div key={category} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {activeCatLabel
                  ? <><span className="text-gold-gradient">{activeCatLabel}</span></>
                  : <>La <span className="text-gold-gradient">Collection</span></>
                }
              </h1>
              <motion.p
                className="mt-4 font-[family-name:var(--font-dm-sans)] text-lg sm:text-xl text-gold font-semibold tracking-[0.15em] uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Bijoux • Sacs • Foulards • Accessoires
              </motion.p>
              <motion.p
                className="mt-3 font-[family-name:var(--font-dm-sans)] text-sm sm:text-base text-white/75 max-w-xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {category
                  ? categories.find((c) => c.slug === category)?.description ?? ''
                  : 'Toute la collection — pièces artisanales du Mali'
                }
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Category pills strip ─────────────────────────────── */}
      <CategoryStrip active={category} onChange={setCategory} />

      {/* ── Sticky toolbar ─────────────────────────────────── */}
      <div className="sticky top-[72px] z-20 bg-cream/95 backdrop-blur-sm border-b border-gold/10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="flex-1">
              <CatalogSearchBar />
            </div>

            {/* Mobile filter drawer */}
            <FilterDrawer categories={categories} />

            {/* Sort */}
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-auto h-10 rounded-xl border-gold/20 bg-white font-[family-name:var(--font-dm-sans)] text-sm gap-1.5 px-3 hidden sm:flex">
                <ArrowUpDown className="w-3.5 h-3.5 text-text-mid" />
                <SelectValue placeholder="Trier" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gold/20">
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="font-[family-name:var(--font-dm-sans)] text-sm">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View toggle */}
            <div className="flex items-center gap-0.5 bg-white border border-gold/20 rounded-xl p-1">
              {([
                { mode: 'grid', Icon: LayoutGrid, label: 'Grille' },
                { mode: 'list', Icon: List, label: 'Liste' },
              ] as const).map(({ mode, Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-label={label}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === mode
                      ? 'bg-gold text-white shadow-sm'
                      : 'text-text-mid hover:text-gold hover:bg-gold/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Active filter chips */}
          <AnimatePresence>
            {hasActiveFilters() && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-2 pt-2.5">
                  <span className="text-[11px] text-text-mid font-[family-name:var(--font-dm-sans)] flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3" /> Actifs :
                  </span>
                  {activeColors.map((c) => (
                    <button key={c} onClick={() => toggleColor(c)}
                      className="inline-flex items-center gap-1 bg-gold/10 text-gold border border-gold/20 rounded-full px-2.5 py-0.5 text-xs font-[family-name:var(--font-dm-sans)] font-medium hover:bg-gold/20 transition-colors">
                      {c} <X className="w-2.5 h-2.5" />
                    </button>
                  ))}
                  {activeSizes.map((s) => (
                    <button key={s} onClick={() => toggleSize(s)}
                      className="inline-flex items-center gap-1 bg-gold/10 text-gold border border-gold/20 rounded-full px-2.5 py-0.5 text-xs font-[family-name:var(--font-dm-sans)] font-medium hover:bg-gold/20 transition-colors">
                      Taille {s} <X className="w-2.5 h-2.5" />
                    </button>
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                    <button onClick={() => setPriceRange([0, 100000])}
                      className="inline-flex items-center gap-1 bg-gold/10 text-gold border border-gold/20 rounded-full px-2.5 py-0.5 text-xs font-[family-name:var(--font-dm-sans)] font-medium hover:bg-gold/20 transition-colors">
                      {priceRange[0].toLocaleString('fr-FR')} – {priceRange[1].toLocaleString('fr-FR')} FCFA
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                  <button onClick={resetFilters}
                    className="text-[11px] text-text-mid hover:text-red-500 underline underline-offset-2 font-[family-name:var(--font-dm-sans)] transition-colors">
                    Tout effacer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-7">
          {/* Sidebar desktop */}
          <motion.aside
            className="hidden lg:block w-60 shrink-0"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="sticky top-40 bg-white rounded-2xl border border-gold/10 shadow-sm p-5">
              <FilterSidebar categories={categories} />
            </div>
          </motion.aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <CatalogProductResults onQuickView={handleQuickView} />
          </div>
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} open={quickViewOpen} onClose={handleCloseQuickView} />
    </div>
  )
}
