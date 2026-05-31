'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  Copy,
  Check,
  ShoppingBag,
  Zap,
  Tag,
  Package,
  Heart,
  Star,
  ArrowRight,
  AlertCircle,
  Flame,
  Timer,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { products as staticProducts, type Product } from '@/data/products'
import {
  promoCodes as staticPromoCodes,
  getActiveFlashSales,
  type PromoCode,
  type FlashSale,
} from '@/data/promos'
import { useCartStore } from '@/stores/cart-store'
import { useNavStore } from '@/stores/nav-store'
import { ProductImage } from '@/components/ui/product-image'
import { getProductImagePaths } from '@/data/product-image-map'
import { toast } from 'sonner'

const PROMO_HEADER_IMAGE = getProductImagePaths('prod-009', 'sacs', 1)[0]

// ─── Countdown Digit with Flip ───────────────────────────────────────────────
function FlipDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0')

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flip-card">
        <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden"
          style={{ perspective: '300px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gold to-caramel rounded-xl flex items-center justify-center shadow-lg">
            <AnimatePresence mode="wait">
              <motion.span
                key={display}
                className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-white"
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {display}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/20" />
        </div>
      </div>
      <span className="font-[family-name:var(--font-dm-sans)] text-xs text-white/75 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function SaleCountdown({ endsAt }: { endsAt?: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const endDate = endsAt ? new Date(endsAt) : (() => {
      const d = new Date()
      d.setDate(d.getDate() + 7)
      return d
    })()

    const tick = () => {
      const now = new Date()
      const diff = endDate.getTime() - now.getTime()
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <FlipDigit value={timeLeft.days} label="Jours" />
      <span className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-gold mt-[-20px]">:</span>
      <FlipDigit value={timeLeft.hours} label="Heures" />
      <span className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-gold mt-[-20px]">:</span>
      <FlipDigit value={timeLeft.minutes} label="Minutes" />
      <span className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-gold mt-[-20px]">:</span>
      <FlipDigit value={timeLeft.seconds} label="Secondes" />
    </div>
  )
}

// ─── Promo Product Card ───────────────────────────────────────────────────────
function PromoProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const goProduct = useNavStore((s) => s.goProduct)
  const discount = product.pricePromo
    ? Math.round(((product.price - product.pricePromo!) / product.price) * 100)
    : 0

  return (
    <motion.div
      className="product-card glass-card overflow-hidden cursor-pointer"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => goProduct(product.id)}
    >
      <div className="relative aspect-[3/4] bg-gradient-to-br from-beige to-gold/20 overflow-hidden">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="product-image object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-caramel text-white text-xs font-[family-name:var(--font-dm-sans)] font-semibold border-0">
          –{discount}%
        </Badge>
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-warm-white/80 flex items-center justify-center hover:bg-warm-white transition-colors"
          onClick={(e) => { e.stopPropagation() }}
        >
          <Heart className="w-4 h-4 text-text-mid" />
        </button>
        <div className="quick-add absolute bottom-0 inset-x-0 p-3 bg-white/90 backdrop-blur-sm">
          <Button
            className="w-full btn-gold text-xs h-9"
            onClick={(e) => {
              e.stopPropagation()
              addItem({
                id: `${product.id}-${product.colors[0]}-${product.sizes[0]}`,
                productId: product.id,
                name: product.name,
                price: product.pricePromo ?? product.price,
                quantity: 1,
                color: product.colors[0] || '',
                size: product.sizes[0] || '',
                image: product.images[0] || '',
              })
              toast.success(`${product.name} ajouté au panier`)
            }}
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Ajouter
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-text-dark line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.round(product.rating) ? 'text-gold fill-gold' : 'text-beige'}`}
            />
          ))}
          <span className="text-xs text-text-mid ml-1">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-[family-name:var(--font-dm-sans)] text-base font-bold text-caramel">
            {product.pricePromo?.toLocaleString('fr-FR')} FCFA
          </span>
          <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid line-through">
            {product.price.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Flash Sale Card ──────────────────────────────────────────────────────────
function FlashSaleCard({ sale, product }: { sale: FlashSale; product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const goProduct = useNavStore((s) => s.goProduct)
  const stockPercent = (sale.stockLeft / sale.totalStock) * 100
  const isLowStock = sale.stockLeft <= 3

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const endsAt = new Date(sale.endsAt)
    const tick = () => {
      const now = new Date()
      const diff = endsAt.getTime() - now.getTime()
      if (diff <= 0) return
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [sale.endsAt])

  const promoPrice = Math.round(product.price * (1 - sale.discount / 100))

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl cursor-pointer bg-white/5 border border-white/10 hover:border-gold/40 transition-all duration-300"
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.4)' }}
      transition={{ duration: 0.25 }}
      onClick={() => goProduct(product.id)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Discount badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          <Zap className="w-3 h-3 fill-white" /> –{sale.discount}%
        </div>

        {/* Low stock warning */}
        {isLowStock && (
          <motion.div
            className="absolute top-3 right-3 flex items-center gap-1 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <Flame className="w-3 h-3" /> Presque épuisé
          </motion.div>
        )}

        {/* Countdown overlay at bottom of image */}
        <div className="absolute bottom-0 inset-x-0 px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <Timer className="w-3.5 h-3.5 text-gold" />
            <span className="font-[family-name:var(--font-dm-sans)] text-[10px] text-white/70 uppercase tracking-wider">
              Expire dans
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { v: timeLeft.hours, l: 'h' },
              { v: timeLeft.minutes, l: 'm' },
              { v: timeLeft.seconds, l: 's' },
            ].map((unit, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1 min-w-[36px] text-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={unit.v}
                      className="font-[family-name:var(--font-playfair)] text-base font-bold text-white block"
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 8, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {String(unit.v).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="font-[family-name:var(--font-dm-sans)] text-[10px] text-white/60">{unit.l}</span>
                {i < 2 && <span className="font-bold text-gold text-sm -mx-0.5">:</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-white line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-[family-name:var(--font-playfair)] text-lg font-bold text-gold">
            {promoPrice.toLocaleString('fr-FR')}
          </span>
          <span className="font-[family-name:var(--font-dm-sans)] text-[10px] text-white/40">FCFA</span>
          <span className="font-[family-name:var(--font-dm-sans)] text-xs text-white/30 line-through ml-auto">
            {product.price.toLocaleString('fr-FR')} FCFA
          </span>
        </div>

        {/* Stock bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`font-[family-name:var(--font-dm-sans)] text-[10px] font-semibold flex items-center gap-1 ${isLowStock ? 'text-red-400' : 'text-white/60'}`}>
              {isLowStock && <Flame className="w-3 h-3" />}
              {sale.stockLeft} restant{sale.stockLeft > 1 ? 's' : ''}
            </span>
            <span className="font-[family-name:var(--font-dm-sans)] text-[10px] text-white/30">
              {Math.round(stockPercent)}% dispo
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${isLowStock ? 'bg-gradient-to-r from-red-500 to-orange-400' : 'bg-gradient-to-r from-gold to-caramel'}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${stockPercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-caramel hover:from-caramel hover:to-gold text-white text-xs font-semibold font-[family-name:var(--font-dm-sans)] py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-gold/20"
          onClick={(e) => {
            e.stopPropagation()
            addItem({
              id: `${product.id}-${product.colors[0]}-${product.sizes[0]}`,
              productId: product.id,
              name: product.name,
              price: promoPrice,
              quantity: 1,
              color: product.colors[0] || '',
              size: product.sizes[0] || '',
              image: product.images[0] || '',
            })
            toast.success(`${product.name} ajouté au panier`)
          }}
        >
          <Zap className="w-3.5 h-3.5 fill-white" /> Acheter maintenant
        </button>
      </div>
    </motion.div>
  )
}

// ─── Promo Code Card ──────────────────────────────────────────────────────────
function PromoCodeCard({ promo }: { promo: PromoCode }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(promo.code)
      setCopied(true)
      toast.success(`Code ${promo.code} copié !`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Impossible de copier le code')
    }
  }, [promo.code])

  return (
    <motion.div
      className="glass-card p-5 warm-shadow flex flex-col gap-3"
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(212, 175, 106, 0.2)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid">
            {promo.description}
          </p>
          <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid/70 mt-1">
            Min. {promo.minPurchase.toLocaleString('fr-FR')} FCFA • Expire le{' '}
            {new Date(promo.validUntil).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <Badge className="bg-gold/10 text-gold border-gold/20 text-sm font-semibold shrink-0">
          {promo.type === 'percentage' ? `–${promo.discount}%` : `–${promo.discount.toLocaleString('fr-FR')} F`}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-beige/50 rounded-lg px-4 py-2.5 border border-dashed border-gold/40">
          <span className="font-mono text-base font-bold text-gold tracking-widest">
            {promo.code}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className={`shrink-0 border-gold/40 hover:bg-gold/10 transition-all ${
            copied ? 'bg-green-50 border-green-300 text-green-600' : 'text-gold'
          }`}
          onClick={handleCopy}
        >
          {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
          {copied ? 'Copié !' : 'Copier'}
        </Button>
      </div>
    </motion.div>
  )
}

// ─── Bundle Card ──────────────────────────────────────────────────────────────
function BundleCard({
  title,
  productIds,
  bundlePrice,
  description,
  icon,
  productsMap,
}: {
  title: string
  productIds: string[]
  bundlePrice: number
  description: string
  icon: React.ReactNode
  productsMap: Record<string, Product>
}) {
  const addItem = useCartStore((s) => s.addItem)
  const bundleProducts = productIds.map((id) => productsMap[id]).filter(Boolean) as Product[]
  const originalTotal = bundleProducts.reduce((sum, p) => sum + p.price, 0)
  const savings = originalTotal - bundlePrice
  const savingsPercent = originalTotal > 0 ? Math.round((savings / originalTotal) * 100) : 0

  const handleAddBundle = () => {
    bundleProducts.forEach((p) => {
      addItem({
        id: `${p.id}-${p.colors[0]}-${p.sizes[0]}-bundle`,
        productId: p.id,
        name: p.name,
        price: Math.round(p.price * (bundlePrice / (originalTotal || 1))),
        quantity: 1,
        color: p.colors[0] || '',
        size: p.sizes[0] || '',
        image: p.images[0] || '',
      })
    })
    toast.success(`Pack "${title}" ajouté au panier !`)
  }

  return (
    <motion.div
      className="glass-card overflow-hidden warm-shadow"
      whileHover={{ y: -6, boxShadow: '0 12px 35px rgba(212, 175, 106, 0.25)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-gold/20 to-caramel/10 p-5 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-3">
          {icon}
        </div>
        <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-text-dark">
          {title}
        </h3>
        <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-1">
          {description}
        </p>
      </div>
      <div className="p-5">
        <div className="space-y-2 mb-4">
          {bundleProducts.map((p) => (
            <div key={p.id} className="flex items-center gap-3 text-sm">
              <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-beige">
                <ProductImage
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span className="font-[family-name:var(--font-dm-sans)] text-text-dark flex-1 line-clamp-1">{p.name}</span>
              <span className="font-[family-name:var(--font-dm-sans)] text-text-mid shrink-0">
                {p.price.toLocaleString('fr-FR')} F
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gold/20 pt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid line-through">
              Total : {originalTotal.toLocaleString('fr-FR')} FCFA
            </span>
            <Badge className="bg-caramel/10 text-caramel border-caramel/20 text-xs">
              Économie {savingsPercent}%
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-caramel">
              {bundlePrice.toLocaleString('fr-FR')} FCFA
            </span>
            <span className="font-[family-name:var(--font-dm-sans)] text-xs text-green-700 font-semibold">
              –{savings.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
        </div>
        <Button
          className="w-full btn-gold mt-4 text-sm h-10"
          onClick={handleAddBundle}
        >
          <Package className="w-4 h-4 mr-2" /> Ajouter le pack
        </Button>
      </div>
    </motion.div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function PromoCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <Skeleton className="aspect-[3/4] rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  )
}

function PromoCodeSkeleton() {
  return (
    <div className="glass-card p-5 warm-shadow">
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  )
}

const PROMO_FILTER_TABS = [
  { value: 'tout', label: 'Tout' },
  { value: 'bijoux', label: 'Bijoux' },
  { value: 'sacs', label: 'Sacs' },
  { value: 'foulards', label: 'Foulards' },
  { value: 'lunettes', label: 'Lunettes' },
] as const

function buildPromotionsState() {
  const promoProducts = staticProducts.filter(
    (p) => p.pricePromo !== undefined && p.pricePromo !== null
  )
  const productsMap: Record<string, Product> = {}
  staticProducts.forEach((p) => {
    productsMap[p.id] = p
  })
  const now = new Date()
  const promoCodes = staticPromoCodes.filter((p) => new Date(p.validUntil) > now)
  const flashSales = getActiveFlashSales()
  return { promoProducts, productsMap, promoCodes, flashSales }
}

// ─── Main Promotions Page ─────────────────────────────────────────────────────
export default function PromotionsPage() {
  const [activeFilter, setActiveFilter] = useState('tout')
  const [{ promoProducts, productsMap, promoCodes, flashSales }] = useState(buildPromotionsState)

  const earliestEnd = useMemo(
    () =>
      flashSales
        .filter((s) => s.stockLeft > 0 && new Date(s.endsAt) > new Date())
        .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime())[0]
        ?.endsAt,
    [flashSales]
  )

  const filteredProducts = useMemo(
    () =>
      activeFilter === 'tout'
        ? promoProducts
        : promoProducts.filter((p) => p.category === activeFilter),
    [activeFilter, promoProducts]
  )

  return (
    <div className="min-h-screen">
      {/* ── Header with Countdown ── */}
      <section className="relative pt-36 pb-12 sm:pt-44 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <ProductImage
            src={PROMO_HEADER_IMAGE}
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
              <Zap className="w-4 h-4" />
              <span className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold tracking-wide uppercase">
                Offres limitées
              </span>
            </motion.div>

            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Soldes <span className="text-gold-gradient">Exceptionnelles</span>
            </h1>

            <motion.p
              className="mt-4 font-[family-name:var(--font-dm-sans)] text-lg sm:text-xl text-gold font-semibold tracking-[0.15em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Solder • Jusqu&apos;à –50% • Offres limitées
            </motion.p>

            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <SaleCountdown endsAt={earliestEnd} />
            </motion.div>

            <motion.p
              className="mt-4 font-[family-name:var(--font-dm-sans)] text-sm text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Profitez de nos offres avant qu&apos;il ne soit trop tard !
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Filter Tabs ── */}
      <section className="py-4 bg-warm-white border-y border-gold/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="bg-beige/50 w-full sm:w-auto flex h-auto p-1 rounded-full">
              {PROMO_FILTER_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="font-[family-name:var(--font-dm-sans)] text-sm data-[state=active]:bg-gold data-[state=active]:text-white rounded-full px-4 py-2"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      <>
          {/* ── Offres du Jour ── */}
          <section className="py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-10 h-10 rounded-full bg-caramel/10 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-caramel" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-text-dark">
                    Offres du Jour
                  </h2>
                  <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid">
                    Nos meilleures promotions du moment
                  </p>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <PromoProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Tag className="w-12 h-12 text-gold/30 mx-auto mb-3" />
                  <p className="font-[family-name:var(--font-dm-sans)] text-text-mid">
                    Aucune promotion dans cette catégorie pour le moment.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ── Ventes Flash ── */}
          <section className="py-0 overflow-hidden">
            {/* Ticker animé */}
            <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 py-2 overflow-hidden">
              <motion.div
                className="flex gap-8 whitespace-nowrap"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className="font-[family-name:var(--font-dm-sans)] text-xs font-bold text-white tracking-widest uppercase inline-flex items-center gap-3">
                    <Zap className="w-3 h-3 fill-white inline" /> Vente Flash
                    <span className="opacity-60">•</span>
                    <Flame className="w-3 h-3 fill-white inline" /> Stock Limité
                    <span className="opacity-60">•</span>
                    <Timer className="w-3 h-3 inline" /> Offres Éphémères
                    <span className="opacity-60">•</span>
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Dark section body */}
            <div className="bg-gradient-to-b from-[#0f0800] via-[#1a0f02] to-[#0f0800] py-12 sm:py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                  className="text-center mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 text-orange-400 px-4 py-1.5 rounded-full text-xs font-semibold font-[family-name:var(--font-dm-sans)] uppercase tracking-widest mb-4">
                    <Flame className="w-3.5 h-3.5 fill-orange-400" /> Offres éphémères
                  </div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Ventes{' '}
                    <span className="bg-gradient-to-r from-orange-400 via-gold to-caramel bg-clip-text text-transparent">
                      Flash
                    </span>
                  </h2>
                  <p className="font-[family-name:var(--font-dm-sans)] text-sm text-white/50 mt-3 max-w-md mx-auto">
                    Ces prix ne durent pas. Chaque seconde compte — agissez maintenant avant épuisement des stocks.
                  </p>
                </motion.div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {flashSales.map((sale, i) => {
                    const product = productsMap[sale.productId]
                    if (!product) return null
                    return (
                      <motion.div
                        key={sale.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.07 }}
                      >
                        <FlashSaleCard sale={sale} product={product} />
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ── Codes Promo ── */}
          <section className="py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-text-dark">
                    Codes Promo
                  </h2>
                  <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid">
                    Utilisez ces codes lors de votre commande
                  </p>
                </div>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {promoCodes.map((promo, i) => (
                  <motion.div
                    key={promo.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <PromoCodeCard promo={promo} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Packs & Bundles ── */}
          <section className="py-12 sm:py-16 bg-beige/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-text-dark">
                  Packs & Bundles
                </h2>
                <p className="font-[family-name:var(--font-dm-sans)] text-text-mid mt-2">
                  Économisez encore plus avec nos combinaisons exclusives
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <BundleCard
                  title="Pack Élégance"
                  productIds={['prod-001', 'prod-002', 'prod-003']}
                  bundlePrice={35000}
                  description="Le combo parfait pour briller"
                  icon={<Star className="w-6 h-6 text-gold" />}
                  productsMap={productsMap}
                />
                <BundleCard
                  title="Pack Aventure"
                  productIds={['prod-008', 'prod-018', 'prod-013']}
                  bundlePrice={62000}
                  description="Prête pour toutes les occasions"
                  icon={<ShoppingBag className="w-6 h-6 text-gold" />}
                  productsMap={productsMap}
                />
                <BundleCard
                  title="Pack Royal"
                  productIds={['prod-005', 'prod-035', 'prod-032']}
                  bundlePrice={95000}
                  description="Luxe et prestige au rendez-vous"
                  icon={<Package className="w-6 h-6 text-gold" />}
                  productsMap={productsMap}
                />
              </div>
            </div>
          </section>
      </>
    </div>
  )
}
