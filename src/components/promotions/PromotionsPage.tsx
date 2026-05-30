'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import type { Product } from '@/data/products'
import type { PromoCode, FlashSale } from '@/data/promos'
import { useCartStore } from '@/stores/cart-store'
import { useNavStore } from '@/stores/nav-store'
import { toast } from 'sonner'

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
      <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid uppercase tracking-wider">
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
        <div className="product-image w-full h-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-gold/30" />
        </div>
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
      className="glass-card overflow-hidden cursor-pointer"
      whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(212, 175, 106, 0.2)' }}
      transition={{ duration: 0.3 }}
      onClick={() => goProduct(product.id)}
    >
      <div className="relative aspect-[3/4] bg-gradient-to-br from-beige to-gold/20 overflow-hidden">
        <div className="product-image w-full h-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-gold/30" />
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-caramel text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          <Zap className="w-3 h-3" /> –{sale.discount}%
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-caramel text-xs font-medium px-2 py-1 rounded-full">
          <Clock className="w-3 h-3" />
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <div className="quick-add absolute bottom-0 inset-x-0 p-3 bg-white/90 backdrop-blur-sm">
          <Button
            className="w-full btn-gold text-xs h-9"
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
            <Zap className="w-3.5 h-3.5 mr-1" /> Acheter flash
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-text-dark line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-[family-name:var(--font-dm-sans)] text-base font-bold text-caramel">
            {promoPrice.toLocaleString('fr-FR')} FCFA
          </span>
          <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid line-through">
            {product.price.toLocaleString('fr-FR')} FCFA
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className={`font-[family-name:var(--font-dm-sans)] text-xs font-semibold ${isLowStock ? 'text-red-600' : 'text-caramel'}`}>
              {sale.stockLeft} restants
            </span>
            <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
              {sale.totalStock} total
            </span>
          </div>
          <Progress
            value={stockPercent}
            className={`h-2 ${isLowStock ? '[&>[data-slot=progress-indicator]]:bg-red-500' : ''}`}
          />
        </div>
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
            <div key={p.id} className="flex items-center gap-2 text-sm">
              <ShoppingBag className="w-4 h-4 text-gold/50" />
              <span className="font-[family-name:var(--font-dm-sans)] text-text-dark flex-1">{p.name}</span>
              <span className="font-[family-name:var(--font-dm-sans)] text-text-mid">
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

// ─── Main Promotions Page ─────────────────────────────────────────────────────
export default function PromotionsPage() {
  const [activeFilter, setActiveFilter] = useState('tout')
  const [promoProducts, setPromoProducts] = useState<Product[]>([])
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [flashSales, setFlashSales] = useState<FlashSale[]>([])
  const [productsMap, setProductsMap] = useState<Record<string, Product>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Find the earliest flash sale end date for countdown
  const earliestEnd = flashSales
    .filter((s) => s.stockLeft > 0 && new Date(s.endsAt) > new Date())
    .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime())[0]?.endsAt

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const [productsRes, promosRes, flashSalesRes] = await Promise.all([
          fetch('/api/products?limit=100'),
          fetch('/api/promos'),
          fetch('/api/flash-sales'),
        ])
        if (!productsRes.ok || !promosRes.ok || !flashSalesRes.ok) throw new Error('Failed to fetch')

        const productsData = await productsRes.json()
        const promosData = await promosRes.json()
        const flashSalesData = await flashSalesRes.json()

        const allProducts = productsData.products as Product[]
        // Filter products with promo prices
        const filtered = allProducts.filter((p) => p.pricePromo !== undefined && p.pricePromo !== null)
        setPromoProducts(filtered)

        // Build products map for flash sale lookups and bundles
        const map: Record<string, Product> = {}
        allProducts.forEach((p) => { map[p.id] = p })
        setProductsMap(map)

        // Filter active promo codes (valid and active)
        const now = new Date()
        const activePromos = (promosData as (PromoCode & { isActive?: boolean })[]).filter(
          (p) => p.isActive !== false && new Date(p.validUntil) > now
        )
        setPromoCodes(activePromos)

        // Filter active flash sales
        const activeFlashSales = (flashSalesData as (FlashSale & { isActive?: boolean })[]).filter(
          (s) => s.isActive !== false && s.stockLeft > 0 && new Date(s.endsAt) > now
        )
        setFlashSales(activeFlashSales)
      } catch {
        setError('Impossible de charger les promotions')
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
      fetch('/api/promos'),
      fetch('/api/flash-sales'),
    ])
      .then(async ([productsRes, promosRes, flashSalesRes]) => {
        if (!productsRes.ok || !promosRes.ok || !flashSalesRes.ok) throw new Error('Failed')
        const productsData = await productsRes.json()
        const promosData = await promosRes.json()
        const flashSalesData = await flashSalesRes.json()
        const allProducts = productsData.products as Product[]
        setPromoProducts(allProducts.filter((p) => p.pricePromo !== undefined && p.pricePromo !== null))
        const map: Record<string, Product> = {}
        allProducts.forEach((p) => { map[p.id] = p })
        setProductsMap(map)
        const now = new Date()
        setPromoCodes((promosData as (PromoCode & { isActive?: boolean })[]).filter((p) => p.isActive !== false && new Date(p.validUntil) > now))
        setFlashSales((flashSalesData as (FlashSale & { isActive?: boolean })[]).filter((s) => s.isActive !== false && s.stockLeft > 0 && new Date(s.endsAt) > now))
      })
      .catch(() => setError('Impossible de charger les promotions'))
      .finally(() => setLoading(false))
  }

  const filteredProducts = activeFilter === 'tout'
    ? promoProducts
    : promoProducts.filter((p) => p.category === activeFilter)

  const filterTabs = [
    { value: 'tout', label: 'Tout' },
    { value: 'bijoux', label: 'Bijoux' },
    { value: 'sacs', label: 'Sacs' },
    { value: 'foulards', label: 'Foulards' },
    { value: 'lunettes', label: 'Lunettes' },
  ]

  return (
    <div className="min-h-screen">
      {/* ── Header with Countdown ── */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-cream to-caramel/10 particles-bg" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-gold/10 text-gold px-5 py-2 rounded-full mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Zap className="w-4 h-4" />
              <span className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold tracking-wide uppercase">
                Offres limitées
              </span>
            </motion.div>

            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold text-text-dark leading-tight">
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
              className="mt-4 font-[family-name:var(--font-dm-sans)] text-sm text-text-mid"
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
              {filterTabs.map((tab) => (
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

      {error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="w-10 h-10 text-caramel/50 mb-3" />
          <p className="font-[family-name:var(--font-dm-sans)] text-text-mid text-sm mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="btn-gold px-6 py-2.5 text-sm"
          >
            Réessayer
          </button>
        </div>
      ) : (
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

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <PromoCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
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
              )}

              {!loading && filteredProducts.length === 0 && (
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
          <section className="py-12 sm:py-16 bg-warm-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-10 h-10 rounded-full bg-caramel/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-caramel" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-text-dark">
                    Ventes Flash
                  </h2>
                  <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid">
                    Dépêchez-vous, stock limité !
                  </p>
                </div>
              </motion.div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <PromoCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {flashSales.map((sale, i) => {
                    const product = productsMap[sale.productId]
                    if (!product) return null
                    return (
                      <motion.div
                        key={sale.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                      >
                        <FlashSaleCard sale={sale} product={product} />
                      </motion.div>
                    )
                  })}
                </div>
              )}
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

              {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PromoCodeSkeleton key={i} />
                  ))}
                </div>
              ) : (
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
              )}
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
      )}
    </div>
  )
}
