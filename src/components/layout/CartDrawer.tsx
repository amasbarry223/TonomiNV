'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'
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

// Suggested products for the "Produits que vous aimerez" section
const suggestedProducts = [
  {
    id: 'sug-1',
    name: 'Bracelet Massaï Doré',
    price: 15000,
    image: '/placeholder-bracelet.jpg',
  },
  {
    id: 'sug-2',
    name: 'Sac Bandoulière Cuir',
    price: 35000,
    image: '/placeholder-sac.jpg',
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

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
  } = useCartStore()

  const { toggleItem, isWishlisted } = useWishlistStore()
  const [couponInput, setCouponInput] = useState('')
  const itemCount = getItemCount()
  const subtotal = getSubtotal()
  const discountAmount = (subtotal * couponDiscount) / 100
  const shipping = 2000
  const total = subtotal - discountAmount + shipping

  const handleApplyCoupon = () => {
    if (couponInput.trim().toUpperCase() === 'TONOMI10') {
      applyCoupon('TONOMI10', 10)
      setCouponInput('')
    } else if (couponInput.trim().toUpperCase() === 'BIENVENUE') {
      applyCoupon('BIENVENUE', 15)
      setCouponInput('')
    }
  }

  return (
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
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-beige/40 overflow-hidden shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-beige to-gold/20 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-gold/40" />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-text-dark truncate">
                      {item.name}
                    </h4>
                    {(item.color || item.size) && (
                      <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mt-0.5">
                        {[item.color, item.size].filter(Boolean).join(' / ')}
                      </p>
                    )}
                    <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-gold mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-beige/60 flex items-center justify-center hover:bg-gold/20 transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3 h-3 text-text-mid" />
                        </button>
                        <span className="font-[family-name:var(--font-dm-sans)] text-xs font-medium w-6 text-center text-text-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                  />
                </div>
                <Button
                  onClick={handleApplyCoupon}
                  variant="outline"
                  className="h-9 px-3 border-gold/30 text-gold hover:bg-gold/10 rounded-xl font-[family-name:var(--font-dm-sans)] text-sm"
                >
                  Appliquer
                </Button>
              </div>
              {coupon && (
                <p className="text-xs text-green-600 mt-1.5 font-[family-name:var(--font-dm-sans)]">
                  ✨ Code &quot;{coupon.code}&quot; appliqué — {coupon.discount}% de réduction
                </p>
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
                  <span>Réduction ({couponDiscount}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-[family-name:var(--font-dm-sans)] text-sm text-text-mid">
                <span>Livraison estimée</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <Separator className="bg-gold/15 my-1" />
              <div className="flex justify-between font-[family-name:var(--font-playfair)] text-lg font-semibold text-text-dark">
                <span>Total</span>
                <span className="text-gold">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="px-5 pb-3">
              <Button className="w-full btn-gold h-12 text-sm tracking-wider border-0">
                Commander
              </Button>
            </div>

            {/* Suggested Products */}
            <div className="px-5 pb-5">
              <p className="font-[family-name:var(--font-cormorant)] text-sm font-semibold text-text-dark mb-3">
                Produits que vous aimerez
              </p>
              <div className="flex gap-3">
                {suggestedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-1 bg-warm-white rounded-2xl p-3 border border-gold/10"
                  >
                    <div className="w-full h-16 rounded-xl bg-gradient-to-br from-beige to-gold/20 mb-2 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-gold/30" />
                    </div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-dark truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-gold">
                        {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={() => {
                          if (!isWishlisted(product.id)) {
                            toggleItem({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                            })
                          }
                        }}
                        className="text-text-mid hover:text-gold transition-colors"
                        aria-label="Ajouter aux favoris"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
