'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Tag,
  Loader2,
} from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { ProductImage } from '@/components/ui/product-image'
import { useWishlistStore } from '@/stores/wishlist-store'
import { useNavStore } from '@/stores/nav-store'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { products as staticProducts } from '@/data/products'
import { validatePromoCode, calculateDiscount } from '@/data/promos'
import { formatPrice } from '@/lib/product-display'
import { toast } from 'sonner'

interface SuggestedProduct {
  id: string
  name: string
  price: number
  images: string
  slug: string
}

const suggestedProducts: SuggestedProduct[] = staticProducts.slice(0, 4).map((p) => ({
  id: p.id,
  name: p.name,
  price: p.pricePromo ?? p.price,
  images: p.images.join(','),
  slug: p.slug,
}))

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
    getSubtotal,
    getItemCount,
    coupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    getTotal,
  } = useCartStore()

  const { toggleItem, isInWishlist } = useWishlistStore()
  const { goCheckout } = useNavStore()
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const itemCount = getItemCount()
  const subtotal = getSubtotal()
  const total = getTotal()
  const shipping = 0 // Free shipping for now

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    const promo = validatePromoCode(couponInput, subtotal)
    if (promo) {
      const discountAmount = calculateDiscount(promo, subtotal)
      applyCoupon(promo.code, discountAmount)
      toast.success(
        `Code "${promo.code}" appliqué ! Réduction: ${discountAmount.toLocaleString('fr-FR')} FCFA`
      )
      setCouponInput('')
    } else {
      toast.error('Code invalide ou conditions non remplies')
    }
    setCouponLoading(false)
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    toast.info('Code promo retiré')
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    setCartOpen(false)
    goCheckout()
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setCartOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-cream border-l border-gold/20 flex flex-col p-0"
        >
          {/* Header */}
          <SheetHeader className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-[family-name:var(--font-playfair)] text-xl text-text-dark">
                Mon Panier
              </SheetTitle>
              <Badge className="bg-gold/10 text-gold border-0 font-[family-name:var(--font-dm-sans)] text-xs">
                {itemCount} {itemCount > 1 ? 'articles' : 'article'}
              </Badge>
            </div>
            <SheetDescription className="sr-only">
              Votre panier d&apos;achats TONOMI
            </SheetDescription>
          </SheetHeader>

          <Separator className="bg-gold/15" />

          {/* Free Shipping Progress */}
          {items.length > 0 && (() => {
            const FREE_THRESHOLD = 30000
            const effective = Math.max(0, subtotal - couponDiscount)
            const remaining = Math.max(0, FREE_THRESHOLD - effective)
            const progress = Math.min(100, (effective / FREE_THRESHOLD) * 100)
            return (
              <div className="px-5 py-3 bg-gradient-to-b from-stone-50/80 to-transparent border-b border-gold/10">
                {remaining === 0 ? (
                  <motion.p
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-[family-name:var(--font-dm-sans)] text-xs text-emerald-600 font-semibold flex items-center gap-1.5 mb-1.5"
                  >
                    <span className="text-sm">🎉</span> Livraison gratuite débloquée !
                  </motion.p>
                ) : (
                  <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mb-1.5">
                    Plus que{' '}
                    <strong className="text-gold">{formatPrice(remaining)}</strong>{' '}
                    pour la livraison gratuite
                  </p>
                )}
                <div className="h-1.5 bg-beige rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      remaining === 0
                        ? 'bg-emerald-400'
                        : 'bg-gradient-to-r from-gold/50 to-gold'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )
          })()}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-5 py-3 min-h-0">
            {items.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-beige/60 flex items-center justify-center mb-5">
                  <ShoppingBag className="w-10 h-10 text-gold/50" />
                </div>
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-text-dark mb-2">
                  Votre panier est vide
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid max-w-[220px]">
                  Découvrez nos accessoires élégants et ajoutez vos favoris
                </p>
                <Button
                  onClick={() => setCartOpen(false)}
                  className="mt-6 btn-gold px-6 py-2 h-auto text-sm border-0"
                >
                  Explorer la boutique
                </Button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-3 py-3 mb-3 border-b border-gold/10 last:border-0"
                  >
                    {/* Product Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-beige/40 overflow-hidden shrink-0">
                      {item.image ? (
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-beige to-gold/20 flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-gold/40" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-text-dark truncate">
                        {item.name}
                      </h4>
                      {(item.color || item.size) && (
                        <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mt-0.5">
                          {[item.color, item.size]
                            .filter(Boolean)
                            .join(' / ')}
                        </p>
                      )}
                      <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-gold mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded-full bg-beige/60 flex items-center justify-center hover:bg-gold/20 transition-colors"
                            aria-label="Diminuer"
                          >
                            <Minus className="w-3 h-3 text-text-mid" />
                          </button>
                          <span className="font-[family-name:var(--font-dm-sans)] text-xs font-medium w-6 text-center text-text-dark">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded-full bg-beige/60 flex items-center justify-center hover:bg-gold/20 transition-colors"
                            aria-label="Augmenter"
                          >
                            <Plus className="w-3 h-3 text-text-mid" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 rounded-full hover:bg-red-50 transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer: Summary + Actions */}
          {items.length > 0 && (
            <div className="border-t border-gold/15 bg-cream">
              {/* Coupon Input */}
              <div className="px-5 pt-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50" />
                    <Input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Code promo"
                      className="pl-8 h-9 text-sm bg-warm-white border-gold/20 focus:border-gold rounded-xl font-[family-name:var(--font-dm-sans)]"
                      disabled={couponLoading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyCoupon()
                      }}
                    />
                  </div>
                  <Button
                    onClick={handleApplyCoupon}
                    variant="outline"
                    disabled={couponLoading || !couponInput.trim()}
                    className="h-9 px-3 border-gold/30 text-gold hover:bg-gold/10 rounded-xl font-[family-name:var(--font-dm-sans)] text-sm"
                  >
                    {couponLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'Appliquer'
                    )}
                  </Button>
                </div>
                {coupon && (
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-green-600 font-[family-name:var(--font-dm-sans)]">
                      ✨ Code &quot;{coupon}&quot; appliqué — Réduction:{' '}
                      {couponDiscount.toLocaleString('fr-FR')} FCFA
                    </p>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-400 hover:text-red-600 font-[family-name:var(--font-dm-sans)] underline"
                    >
                      Retirer
                    </button>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="px-5 pt-3 pb-2 space-y-1.5">
                <div className="flex justify-between font-[family-name:var(--font-dm-sans)] text-sm text-text-mid">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between font-[family-name:var(--font-dm-sans)] text-sm text-green-600">
                    <span>Réduction</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                {shipping > 0 && (
                  <div className="flex justify-between font-[family-name:var(--font-dm-sans)] text-sm text-text-mid">
                    <span>Livraison estimée</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                )}
                <Separator className="bg-gold/15 my-1" />
                <div className="flex justify-between font-[family-name:var(--font-playfair)] text-lg font-semibold text-text-dark">
                  <span>Total</span>
                  <span className="text-gold">
                    {formatPrice(total + shipping)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="px-5 pb-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full btn-gold h-12 text-sm tracking-wider border-0"
                >
                  Commander
                </Button>
              </div>

              {/* Suggested Products */}
              {suggestedProducts.length > 0 && (
                <div className="px-5 pb-5">
                  <p className="font-[family-name:var(--font-cormorant)] text-sm font-semibold text-text-dark mb-3">
                    Produits que vous aimerez
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {suggestedProducts.map((product) => {
                      const firstImage = product.images
                        ? product.images.split(',')[0]
                        : ''
                      return (
                        <div
                          key={product.id}
                          className="flex-shrink-0 w-28 bg-warm-white rounded-2xl p-2.5 border border-gold/10"
                        >
                          <div className="relative w-full h-16 rounded-xl overflow-hidden mb-2">
                            {firstImage ? (
                              <ProductImage
                                src={firstImage}
                                alt={product.name}
                                fill
                                sizes="120px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-beige to-gold/20 flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-gold/30" />
                              </div>
                            )}
                          </div>
                          <p className="font-[family-name:var(--font-dm-sans)] text-[11px] text-text-dark truncate">
                            {product.name}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold text-gold">
                              {formatPrice(product.price)}
                            </span>
                            <button
                              onClick={() => {
                                if (!isInWishlist(product.id)) {
                                  toggleItem({
                                    id: product.id,
                                    productId: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: firstImage,
                                    category: '',
                                    addedAt: new Date().toISOString(),
                                  })
                                  toast.success(
                                    `${product.name} ajouté aux favoris`
                                  )
                                }
                              }}
                              className="text-text-mid hover:text-gold transition-colors"
                              aria-label="Ajouter aux favoris"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

    </>
  )
}
