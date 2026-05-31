'use client'

import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react'
import type { Product } from '@/data/products'
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'
import { useNavStore } from '@/stores/nav-store'
import { formatPrice, PRODUCT_BADGE_CONFIG } from '@/lib/product-display'
import { ProductImage } from '@/components/ui/product-image'

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const toggleItem = useWishlistStore((s) => s.toggleItem)
  const inWishlist = useWishlistStore((s) =>
    s.items.some((i) => i.productId === product.id)
  )
  const goProduct = useNavStore((s) => s.goProduct)

  const isOutOfStock = product.stock === 0

  const handleWishlistToggle = (e: React.MouseEvent) => {
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
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isOutOfStock) return
    setAddingToCart(true)
    const cartPrice = product.pricePromo ?? product.price
    addItem({
      id: `${product.id}-${product.colors[0]}-${product.sizes[0]}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: cartPrice,
      quantity: 1,
      color: product.colors[0],
      size: product.sizes[0],
      image: product.images[0],
    })
    setTimeout(() => setAddingToCart(false), 800)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    onQuickView?.(product)
  }

  const handleClick = () => {
    goProduct(product.id)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? 'text-gold fill-gold'
            : i < rating
            ? 'text-gold fill-gold/50'
            : 'text-beige'
        }`}
      />
    ))
  }

  const badge = product.badge ? PRODUCT_BADGE_CONFIG[product.badge] : null

  return (
    <motion.div
      className="product-card glass-card overflow-hidden cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative aspect-[3/4] bg-gradient-to-br from-beige to-gold/20 overflow-hidden">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="product-image object-cover"
        />

        {badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-[family-name:var(--font-dm-sans)] font-semibold px-3 py-1 rounded-full z-10 ${badge.className}`}
          >
            {badge.label}
          </span>
        )}

        <motion.button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors z-10"
          onClick={handleWishlistToggle}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          aria-label={inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWishlist ? 'text-red-500 fill-red-500' : 'text-text-mid'
            }`}
          />
        </motion.button>

        {onQuickView && (
          <motion.button
            className="absolute top-14 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors z-10"
            onClick={handleQuickView}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Aperçu rapide"
          >
            <Eye className="w-4 h-4 text-text-mid" />
          </motion.button>
        )}

        <motion.div
          className="quick-add absolute bottom-0 left-0 right-0 p-3 z-10"
          onClick={handleAddToCart}
        >
          <button
            className={`w-full py-2.5 rounded-xl font-[family-name:var(--font-dm-sans)] text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-gold text-white'
            }`}
            disabled={isOutOfStock || addingToCart}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {addingToCart
              ? 'Ajouté !'
              : isOutOfStock
              ? 'Épuisé'
              : 'Ajouter au panier'}
          </button>
        </motion.div>
      </div>

      <div className="p-4">
        <p className="font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-widest text-text-mid/60 mb-1">
          {product.category}
        </p>
        <h3 className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-text-dark line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mt-1.5">
          {renderStars(product.rating)}
          <span className="text-[10px] text-text-mid/60 ml-1">
            ({product.reviewCount})
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
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

        {/* Stock urgency */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="font-[family-name:var(--font-dm-sans)] text-[11px] font-medium text-orange-600">
              Plus que {product.stock} en stock
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default memo(ProductCard)
