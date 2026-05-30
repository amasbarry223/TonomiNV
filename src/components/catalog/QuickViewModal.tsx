'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingBag, Heart, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { type Product } from '@/data/products'
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'
import { useNavStore } from '@/stores/nav-store'
import { formatPrice, getSwatchStyle } from '@/lib/product-display'
import { ProductImage } from '@/components/ui/product-image'

interface QuickViewModalProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export default function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [addingToCart, setAddingToCart] = useState(false)
  const { addItem } = useCartStore()
  const { isInWishlist, toggleItem } = useWishlistStore()
  const { goProduct } = useNavStore()

  if (!product) return null

  const inWishlist = isInWishlist(product.id)
  const isOutOfStock = product.stock === 0
  const currentColor = selectedColor || product.colors[0]
  const currentSize = selectedSize || product.sizes[0]

  const handleAddToCart = () => {
    if (isOutOfStock) return
    setAddingToCart(true)
    addItem({
      id: `${product.id}-${currentColor}-${currentSize}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.pricePromo ?? product.price,
      quantity: 1,
      color: currentColor,
      size: currentSize,
      image: product.images[0],
    })
    setTimeout(() => {
      setAddingToCart(false)
      onClose()
    }, 800)
  }

  const handleViewFull = () => {
    onClose()
    goProduct(product.id)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-gold fill-gold' : 'text-beige'
        }`}
      />
    ))
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-cream border-gold/20 p-0 overflow-hidden">
        <DialogTitle className="sr-only">{product.name} - Aperçu rapide</DialogTitle>
        <DialogDescription className="sr-only">
          Aperçu rapide du produit {product.name}
        </DialogDescription>
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative sm:w-1/2 aspect-square bg-gradient-to-br from-beige to-gold/20 overflow-hidden">
            <ProductImage
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
            {product.badge && (
              <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${
                product.badge === 'nouveau' ? 'bg-emerald-500 text-white' :
                product.badge === 'promo' ? 'bg-caramel text-white' :
                'bg-gray-400 text-white'
              }`}>
                {product.badge === 'nouveau' ? 'Nouveau' : product.badge === 'promo' ? 'Promo' : 'Épuisé'}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="sm:w-1/2 p-6 flex flex-col">
            {/* Category */}
            <p className="font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-widest text-text-mid/60 mb-2">
              {product.category}
            </p>

            {/* Name */}
            <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-text-dark mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating)}
              </div>
              <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
                ({product.reviewCount} avis)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={product.pricePromo ?? product.price}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-2"
                >
                  {product.pricePromo ? (
                    <>
                      <span className="font-[family-name:var(--font-dm-sans)] text-2xl font-bold text-caramel">
                        {formatPrice(product.pricePromo)}
                      </span>
                      <span className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid/50 line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="font-[family-name:var(--font-dm-sans)] text-2xl font-bold text-gold">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="mb-4">
                <p className="font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-text-dark mb-2">
                  Couleur: <span className="font-normal text-text-mid">{currentColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                        currentColor === color
                          ? 'border-gold ring-2 ring-gold/30'
                          : 'border-gold/20 hover:border-gold/50'
                      }`}
                      style={getSwatchStyle(color)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={color}
                    >
                      {currentColor === color && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke={color === 'blanc' || color === 'ivoire' || color === 'naturel' ? '#2C1810' : '#FFFFFF'} strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes.length > 0 && product.sizes[0] !== 'unique' && (
              <div className="mb-5">
                <p className="font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-text-dark mb-2">
                  Taille: <span className="font-normal text-text-mid">{currentSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[40px] h-9 px-3 rounded-xl font-[family-name:var(--font-dm-sans)] text-sm font-medium transition-all ${
                        currentSize === size
                          ? 'bg-gold text-white shadow-md'
                          : 'bg-beige/50 text-text-mid hover:bg-gold/10'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto space-y-3">
              <motion.button
                className={`w-full py-3 rounded-xl font-[family-name:var(--font-dm-sans)] text-sm font-semibold tracking-wide flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'btn-gold text-white'
                }`}
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                whileTap={!isOutOfStock ? { scale: 0.97 } : {}}
              >
                <ShoppingBag className="w-4 h-4" />
                {addingToCart ? 'Ajouté !' : isOutOfStock ? 'Épuisé' : 'Ajouter au panier'}
              </motion.button>

              <div className="flex items-center gap-2">
                <motion.button
                  className={`flex-1 py-2.5 rounded-xl border border-gold/30 font-[family-name:var(--font-dm-sans)] text-sm flex items-center justify-center gap-2 transition-colors ${
                    inWishlist ? 'text-red-500 border-red-200 bg-red-50' : 'text-text-mid hover:text-gold hover:bg-gold/5'
                  }`}
                  onClick={() =>
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
                  whileTap={{ scale: 0.97 }}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500' : ''}`} />
                  {inWishlist ? 'En favori' : 'Favoris'}
                </motion.button>

                <motion.button
                  className="flex-1 py-2.5 rounded-xl border border-gold/30 font-[family-name:var(--font-dm-sans)] text-sm text-text-mid flex items-center justify-center gap-2 hover:text-gold hover:bg-gold/5 transition-colors"
                  onClick={handleViewFull}
                  whileTap={{ scale: 0.97 }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Fiche complète
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
