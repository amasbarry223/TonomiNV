'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  Home,
  AlertCircle,
  Heart,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Product } from '@/data/products'
import type { Category } from '@/data/categories'
import { useFilterStore, SORT_OPTIONS } from '@/stores/filter-store'
import { useNavStore } from '@/stores/nav-store'
import { useWishlistStore } from '@/stores/wishlist-store'
import FilterSidebar from './FilterSidebar'
import FilterDrawer from './FilterDrawer'
import ProductGrid from './ProductGrid'
import QuickViewModal from './QuickViewModal'

export default function CatalogPage() {
  const {
    category,
    priceRange,
    colors,
    sizes,
    sort,
    searchQuery,
    viewMode,
    setCategory,
    setSort,
    setSearchQuery,
    setViewMode,
  } = useFilterStore()

  const { goHome, selectedCategory } = useNavStore()
  const { items: wishlistItems } = useWishlistStore()
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  // API data
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if this is a wishlist view
  const isWishlistView = selectedCategory === 'wishlist'

  // Sync selected category from nav store to filter store
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'wishlist') {
      setCategory(selectedCategory)
    }
  }, [selectedCategory, setCategory])

  // Fetch products and categories from API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?limit=100'),
          fetch('/api/categories'),
        ])
        if (!productsRes.ok || !categoriesRes.ok) throw new Error('Failed to fetch data')
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()
        setAllProducts(productsData.products as Product[])
        setCategories(categoriesData as Category[])
      } catch {
        setError('Impossible de charger le catalogue')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    Promise.all([
      fetch('/api/products?limit=100'),
      fetch('/api/categories'),
    ])
      .then(async ([productsRes, categoriesRes]) => {
        if (!productsRes.ok || !categoriesRes.ok) throw new Error('Failed')
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()
        setAllProducts(productsData.products as Product[])
        setCategories(categoriesData as Category[])
      })
      .catch(() => setError('Impossible de charger le catalogue'))
      .finally(() => setLoading(false))
  }

  // Wishlist products derived from API data
  const wishlistProducts = useMemo(() => {
    return wishlistItems
      .map((item) => allProducts.find((p) => p.id === item.productId))
      .filter((p): p is Product => p !== undefined)
  }, [wishlistItems, allProducts])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Category filter
    if (category) {
      result = result.filter((p) => p.category === category)
    }

    // Price range filter
    result = result.filter((p) => {
      const price = p.pricePromo ?? p.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Color filter
    if (colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => colors.includes(c))
      )
    }

    // Size filter
    if (sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => sizes.includes(s))
      )
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      )
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => (a.pricePromo ?? a.price) - (b.pricePromo ?? b.price))
        break
      case 'price-desc':
        result.sort((a, b) => (b.pricePromo ?? b.price) - (a.pricePromo ?? a.price))
        break
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'bestseller':
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0))
        break
      default: // featured
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.rating - a.rating)
    }

    return result
  }, [allProducts, category, priceRange, colors, sizes, sort, searchQuery])

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

  // Wishlist view
  if (isWishlistView) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
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

          {/* Page Header */}
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

          {/* Wishlist Content */}
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
                isLoading={false}
                onQuickView={handleQuickView}
              />
            </motion.div>
          )}
        </div>

        {/* Quick View Modal */}
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
        {/* Breadcrumb */}
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

        {/* Page Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark">
            Catalogue
          </h1>
          <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-2">
            {loading ? 'Chargement...' : `${filteredProducts.length} produit${filteredProducts.length !== 1 ? 's' : ''}`}
            {activeCategoryName && (
              <span> dans <span className="text-gold font-medium">{activeCategoryName}</span></span>
            )}
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
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
        )}

        {!error && (
          <>
            {/* Search + Controls Row */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {/* Mobile Filter Button */}
              <FilterDrawer categories={categories} />

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <motion.div
                  animate={{ rotate: searchFocused ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                >
                  <Search className="w-4 h-4 text-text-mid/60" />
                </motion.div>
                <Input
                  type="text"
                  placeholder="Rechercher un accessoire..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="pl-10 pr-4 h-10 rounded-xl border-gold/20 bg-white/60 font-[family-name:var(--font-dm-sans)] text-sm focus:border-gold focus:ring-gold/20 placeholder:text-text-mid/40"
                />
              </div>

              {/* Sort */}
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

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-white/60 border border-gold/20 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
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
                  className={`p-2 rounded-lg transition-all ${
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

            {/* Main Content */}
            <div className="flex gap-8">
              {/* Desktop Sidebar */}
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

              {/* Product Grid */}
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <ProductGrid
                  products={filteredProducts}
                  isLoading={loading}
                  onQuickView={handleQuickView}
                />
              </motion.div>
            </div>
          </>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        open={quickViewOpen}
        onClose={handleCloseQuickView}
      />
    </div>
  )
}
