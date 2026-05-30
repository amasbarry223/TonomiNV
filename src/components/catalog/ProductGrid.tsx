'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, PackageSearch } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import ProductCard from './ProductCard'
import type { Product } from '@/data/products'
import { useFilterStore } from '@/stores/filter-store'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  onQuickView?: (product: Product) => void
}

function ProductSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <Skeleton className="aspect-[3/4] rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-2/3" />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-20 h-20 rounded-full bg-beige/60 flex items-center justify-center mb-4">
        <PackageSearch className="w-10 h-10 text-gold/40" />
      </div>
      <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-text-dark mb-2">
        Aucun produit trouvé
      </h3>
      <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid text-center max-w-xs">
        Essayez de modifier vos critères de recherche ou de réinitialiser les filtres pour découvrir nos accessoires.
      </p>
    </motion.div>
  )
}

export default function ProductGrid({ products, isLoading, onQuickView }: ProductGridProps) {
  const { viewMode } = useFilterStore()

  if (isLoading) {
    return (
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
            : 'flex flex-col gap-4'
        }
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return <EmptyState />
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        className="flex flex-col gap-4"
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ProductListItem product={product} onQuickView={onQuickView} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} onQuickView={onQuickView} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

// List view item
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'
import { useNavStore } from '@/stores/nav-store'
import { Star, Heart } from 'lucide-react'

const formatPrice = (price: number) => price.toLocaleString('fr-FR') + ' FCFA'

function ProductListItem({ product, onQuickView }: { product: Product; onQuickView?: (product: Product) => void }) {
  const { goProduct } = useNavStore()
  const { addItem } = useCartStore()
  const { isInWishlist, toggleItem } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)
  const isOutOfStock = product.stock === 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isOutOfStock) return
    addItem({
      id: `${product.id}-${product.colors[0]}-${product.sizes[0]}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.pricePromo ?? product.price,
      quantity: 1,
      color: product.colors[0],
      size: product.sizes[0],
      image: product.images[0],
    })
  }

  return (
    <div
      className="glass-card overflow-hidden cursor-pointer flex gap-4 p-4 product-card"
      onClick={() => goProduct(product.id)}
    >
      {/* Image */}
      <div className="relative w-28 sm:w-36 flex-shrink-0 aspect-[3/4] bg-gradient-to-br from-beige to-gold/20 rounded-xl overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-gold/30" />
        </div>
        {product.badge && (
          <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            product.badge === 'nouveau' ? 'bg-emerald-500 text-white' :
            product.badge === 'promo' ? 'bg-caramel text-white' :
            'bg-gray-400 text-white'
          }`}>
            {product.badge === 'nouveau' ? 'Nouveau' : product.badge === 'promo' ? 'Promo' : 'Épuisé'}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <p className="font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-widest text-text-mid/60 mb-0.5">
            {product.category}
          </p>
          <h3 className="font-[family-name:var(--font-dm-sans)] text-base font-medium text-text-dark">
            {product.name}
          </h3>
          <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mt-1 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-beige'
                }`}
              />
            ))}
            <span className="text-[10px] text-text-mid/60 ml-1">
              ({product.reviewCount})
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {product.pricePromo ? (
              <>
                <span className="font-[family-name:var(--font-dm-sans)] text-base font-bold text-caramel">
                  {formatPrice(product.pricePromo)}
                </span>
                <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid/50 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-[family-name:var(--font-dm-sans)] text-base font-semibold text-gold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              className="p-2 rounded-full hover:bg-beige/50 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                toggleItem({
                  id: product.id,
                  productId: product.id,
                  name: product.name,
                  price: product.pricePromo ?? product.price,
                  image: product.images[0],
                  category: product.category,
                  addedAt: new Date().toISOString(),
                })
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-text-mid'}`} />
            </motion.button>
            <button
              className={`px-4 py-2 rounded-xl font-[family-name:var(--font-dm-sans)] text-xs font-semibold ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'btn-gold text-white'
              }`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? 'Épuisé' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
