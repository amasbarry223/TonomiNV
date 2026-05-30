'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'
import { useNavStore } from '@/stores/nav-store'
import type { Product } from '@/data/products'

interface ProductCardProps {
  product: Product
  onQuickView?: () => void
  index?: number
}

const colorSwatchMap: Record<string, string> = {
  noir: '#1a1a1a',
  blanc: '#FFFFFF',
  or: '#D4AF6A',
  argent: '#C0C0C0',
  marron: '#8B4513',
  terracotta: '#CC5500',
  bordeaux: '#722F37',
  bleu: '#2563EB',
  'bleu marine': '#1E3A5F',
  vert: '#16A34A',
  rose: '#F472B6',
  'rose gold': '#B76E79',
  roserose: '#B76E79',
  jaune: '#EAB308',
  orange: '#F97316',
  multicolore: '#D4AF6A',
  doré: '#D4AF6A',
  cognac: '#834333',
  sable: '#C2B280',
  naturel: '#E8D5B7',
  indigo: '#4B0082',
  kaki: '#8B7355',
  écaille: '#6B3A2A',
  tortue: '#8B6914',
  'noir et blanc': '#1a1a1a',
  émeraude: '#046307',
  violet: '#7C3AED',
  transparent: '#F5F5F5',
  ivoire: '#FFFFF0',
}

export default function ProductCard({ product, onQuickView, index = 0 }: ProductCardProps) {
  const [isTilting, setIsTilting] = useState(false)
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 })
  const addItem = useCartStore((s) => s.addItem)
  const toggleItem = useWishlistStore((s) => s.toggleItem)
  const isInWishlist = useWishlistStore((s) => s.isInWishlist)
  const goProduct = useNavStore((s) => s.goProduct)

  const isWishlisted = isInWishlist(product.id)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5
    setTiltStyle({ rotateX, rotateY })
  }, [])

  const handleMouseEnter = () => setIsTilting(true)
  const handleMouseLeave = () => {
    setIsTilting(false)
    setTiltStyle({ rotateX: 0, rotateY: 0 })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: `${product.id}-${product.colors[0]}-${product.sizes[0]}`,
      productId: product.id,
      name: product.name,
      price: product.pricePromo ?? product.price,
      quantity: 1,
      color: product.colors[0],
      size: product.sizes[0],
      image: product.images[0],
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleItem({
      id: `wish-${product.id}`,
      productId: product.id,
      name: product.name,
      price: product.pricePromo ?? product.price,
      image: product.images[0],
      category: product.category,
      addedAt: new Date().toISOString(),
    })
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    onQuickView?.()
  }

  const handleClick = () => {
    goProduct(product.id)
  }

  const badgeColors: Record<string, string> = {
    nouveau: 'bg-emerald-500 text-white',
    promo: 'bg-gold text-white',
    epuise: 'bg-text-mid text-white',
  }

  const badgeLabels: Record<string, string> = {
    nouveau: 'Nouveau',
    promo: 'Promo',
    epuise: 'Épuisé',
  }

  return (
    <motion.div
      className="product-card glass-card overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isTilting
          ? `perspective(800px) rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg)`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg)',
        transition: isTilting ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-beige to-gold/10">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-image w-full h-full object-cover"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-[family-name:var(--font-dm-sans)] font-semibold px-3 py-1 rounded-full ${badgeColors[product.badge]}`}
          >
            {badgeLabels[product.badge]}
          </span>
        )}

        {/* Wishlist Heart */}
        <motion.button
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-10"
          onClick={handleWishlist}
          whileTap={{ scale: 0.85 }}
          aria-label={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-text-mid'}`}
          />
        </motion.button>

        {/* Quick View */}
        {onQuickView && (
          <motion.button
            className="absolute top-14 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-10 opacity-0 group-hover:opacity-100"
            onClick={handleQuickView}
            whileTap={{ scale: 0.85 }}
            aria-label="Aperçu rapide"
          >
            <Eye className="w-4 h-4 text-text-mid" />
          </motion.button>
        )}

        {/* Quick Add on Hover */}
        <div className="quick-add absolute bottom-0 left-0 right-0 p-3">
          <motion.button
            className="w-full btn-gold py-2.5 text-xs flex items-center justify-center gap-2"
            onClick={handleAddToCart}
            whileTap={{ scale: 0.97 }}
            disabled={product.stock === 0}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.stock === 0 ? 'Indisponible' : 'Ajouter au panier'}
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-text-dark truncate">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-beige'}`}
            />
          ))}
          <span className="text-[10px] text-text-mid ml-1">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          {product.pricePromo ? (
            <>
              <span className="font-[family-name:var(--font-dm-sans)] text-base font-semibold text-gold">
                {formatPrice(product.pricePromo)} FCFA
              </span>
              <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid line-through">
                {formatPrice(product.price)} FCFA
              </span>
            </>
          ) : (
            <span className="font-[family-name:var(--font-dm-sans)] text-base font-semibold text-gold">
              {formatPrice(product.price)} FCFA
            </span>
          )}
        </div>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="w-3.5 h-3.5 rounded-full border border-gold/30"
                style={{ backgroundColor: colorSwatchMap[color] || '#999' }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-text-mid">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
