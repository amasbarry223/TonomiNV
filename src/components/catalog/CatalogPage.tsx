'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutGrid,
  List,
  ChevronRight,
  Home,
  Heart,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

export default function CatalogPage() {
  const category = useFilterStore((s) => s.category)
  const sort = useFilterStore((s) => s.sort)
  const viewMode = useFilterStore((s) => s.viewMode)
  const setCategory = useFilterStore((s) => s.setCategory)
  const setSort = useFilterStore((s) => s.setSort)
  const setViewMode = useFilterStore((s) => s.setViewMode)

  const { goHome, selectedCategory } = useNavStore()
  const wishlistItems = useWishlistStore((s) => s.items)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  const isWishlistView = selectedCategory === 'wishlist'

  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'wishlist') {
      setCategory(selectedCategory)
    }
  }, [selectedCategory, setCategory])

  const wishlistProducts = useMemo(() => {
    return wishlistItems
      .map((item) => productsById.get(item.productId))
      .filter((p): p is Product => p !== undefined)
  }, [wishlistItems])

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product)
    setQuickViewOpen(true)
  }, [])

  const handleCloseQuickView = useCallback(() => {
    setQuickViewOpen(false)
    setTimeout(() => setQuickViewProduct(null), 200)
  }, [])

  const activeCategoryName = category
    ? categories.find((c) => c.slug === category)?.name
    : null

  if (isWishlistView) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.nav
            className="flex items-center gap-1.5 font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={goHome}
              className="flex items-center gap-1 hover:text-gold transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Accueil
            </button>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className="text-gold font-medium">Mes Favoris</span>
          </motion.nav>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-gold fill-gold" />
              <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark">
                Mes Favoris
              </h1>
            </div>
            <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-2">
              {wishlistProducts.length} produit{wishlistProducts.length !== 1 ? 's' : ''} dans vos favoris
            </p>
          </motion.div>

          {wishlistProducts.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 rounded-full bg-beige/60 flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-gold/30" />
              </div>
              <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-text-dark mb-2">
                Aucun favori pour le moment
              </h2>
              <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid max-w-sm text-center mb-6">
                Parcourez notre catalogue et cliquez sur le cœur pour ajouter vos accessoires préférés
              </p>
              <button
                onClick={() => {
                  const { goCatalogue } = useNavStore.getState()
                  goCatalogue()
                }}
                className="btn-gold px-6 py-2.5 text-sm"
              >
                Découvrir le catalogue
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <ProductGrid
                products={wishlistProducts}
                onQuickView={handleQuickView}
              />
            </motion.div>
          )}
        </div>

        <QuickViewModal
          product={quickViewProduct}
          open={quickViewOpen}
          onClose={handleCloseQuickView}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.nav
          className="flex items-center gap-1.5 font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={goHome}
            className="flex items-center gap-1 hover:text-gold transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Accueil
          </button>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-gold font-medium">Catalogue</span>
          {activeCategoryName && (
            <>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <span className="text-gold font-medium">{activeCategoryName}</span>
            </>
          )}
        </motion.nav>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark">
            Catalogue
          </h1>
          {activeCategoryName && (
            <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-2">
              Catégorie : <span className="text-gold font-medium">{activeCategoryName}</span>
            </p>
          )}
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <FilterDrawer categories={categories} />
          <CatalogSearchBar />

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px] h-10 rounded-xl border-gold/20 bg-white/60 font-[family-name:var(--font-dm-sans)] text-sm">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gold/20">
              {SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="font-[family-name:var(--font-dm-sans)] text-sm"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 bg-white/60 border border-gold/20 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gold text-white'
                  : 'text-text-mid hover:text-gold'
              }`}
              aria-label="Vue grille"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-gold text-white'
                  : 'text-text-mid hover:text-gold'
              }`}
              aria-label="Vue liste"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="flex gap-8">
          <motion.aside
            className="hidden lg:block w-64 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="sticky top-28">
              <FilterSidebar categories={categories} />
            </div>
          </motion.aside>

          <CatalogProductResults onQuickView={handleQuickView} />
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        open={quickViewOpen}
        onClose={handleCloseQuickView}
      />
    </div>
  )
}
