'use client'

import { useState, useRef, useMemo, useEffect, lazy, Suspense } from 'react'
const ImageLightbox = lazy(() => import('@/components/ui/ImageLightbox'))
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  ChevronRight,
  ChevronLeft,
  Home,
  Maximize2,
  Truck,
  RefreshCcw,
  Shield,
  PenLine,
  X,
  Send,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { ProductImage } from '@/components/ui/product-image'
import { getProductsByCategory, type Product } from '@/data/products'
import { getProductCareTips, getProductSizeGuide } from '@/lib/product-content'
import { resolveProductById } from '@/lib/resolve-product'
import { categories as staticCategories, type Category } from '@/data/categories'
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'
import { useNavStore } from '@/stores/nav-store'
import ProductCard from '@/components/catalog/ProductCard'
import { formatPrice, getSwatchStyle } from '@/lib/product-display'

// Mock reviews
const mockReviews = [
  {
    id: 'r1',
    author: 'Aminata D.',
    location: 'Bamako',
    rating: 5,
    date: '15 Jan 2025',
    comment: 'Qualité exceptionnelle ! Le produit correspond parfaitement à la description. Je recommande vivement TONOMI.',
  },
  {
    id: 'r2',
    author: 'Fatoumata S.',
    location: 'Ségou',
    rating: 4,
    date: '28 Déc 2024',
    comment: 'Très beau produit, finitions soignées. La livraison était rapide. Un petit bémol sur l\'emballage.',
  },
  {
    id: 'r3',
    author: 'Mariam T.',
    location: 'Kayes',
    rating: 5,
    date: '10 Déc 2024',
    comment: 'Magnifique ! L\'artisanat malien à son meilleur. J\'ai reçu beaucoup de compliments. Merci TONOMI !',
  },
  {
    id: 'r4',
    author: 'Oumou B.',
    location: 'Mopti',
    rating: 4,
    date: '5 Nov 2024',
    comment: 'Joli produit, conforme aux photos. Le prix est raisonnable pour cette qualité. Je reviendrai.',
  },
  {
    id: 'r5',
    author: 'Aïssata K.',
    location: 'Tombouctou',
    rating: 3,
    date: '20 Oct 2024',
    comment: 'Produit correct dans l\'ensemble mais la couleur est légèrement différente de la photo.',
  },
]

export default function ProductPage() {
  const { selectedProductId, goCatalogue } = useNavStore()
  const product = selectedProductId ? resolveProductById(selectedProductId) ?? null : null

  if (!selectedProductId) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="font-[family-name:var(--font-dm-sans)] text-text-mid">
            Sélectionnez un produit depuis le catalogue.
          </p>
          <button onClick={() => goCatalogue()} className="mt-4 btn-gold px-6 py-2.5 text-sm">
            Voir le catalogue
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-text-dark mb-2">
            Produit introuvable
          </h2>
          <p className="font-[family-name:var(--font-dm-sans)] text-text-mid">
            Ce produit n&apos;existe pas ou a été retiré.
          </p>
          <button
            onClick={() => goCatalogue()}
            className="mt-4 btn-gold px-6 py-2.5 text-sm"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    )
  }

  return <ProductDetail product={product} />
}

function ProductDetail({ product }: { product: Product }) {
  const { goHome, goCatalogue } = useNavStore()
  const addItem = useCartStore((s) => s.addItem)
  const toggleItem = useWishlistStore((s) => s.toggleItem)
  const inWishlist = useWishlistStore((s) =>
    s.items.some((i) => i.productId === product.id)
  )

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '')
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const imageRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const similarRef = useRef<HTMLDivElement>(null)

  function scrollSimilar(dir: 'left' | 'right') {
    const el = similarRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'right' ? 240 : -240, behavior: 'smooth' })
  }

  const [reviews, setReviews] = useState(mockReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewHover, setReviewHover] = useState(0)
  const [reviewAuthor, setReviewAuthor] = useState('')
  const [reviewLocation, setReviewLocation] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reviewAuthor.trim() || !reviewComment.trim()) return
    const now = new Date()
    const date = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    setReviews((prev) => [
      {
        id: `r-${Date.now()}`,
        author: reviewAuthor.trim(),
        location: reviewLocation.trim() || 'Mali',
        rating: reviewRating,
        date,
        comment: reviewComment.trim(),
      },
      ...prev,
    ])
    setReviewSubmitted(true)
    setShowReviewForm(false)
    setReviewAuthor('')
    setReviewLocation('')
    setReviewComment('')
    setReviewRating(5)
    setTimeout(() => setReviewSubmitted(false), 4000)
  }

  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const categories = staticCategories
  const similarProducts = useMemo(
    () =>
      getProductsByCategory(product.category)
        .filter((p) => p.id !== product.id)
        .slice(0, 6),
    [product.category, product.id]
  )

  const isOutOfStock = product.stock === 0
  const categoryName = categories.find((c) => c.slug === product.category)?.name ?? product.category

  // Review stats
  const reviewStats = useMemo(() => {
    const total = reviews.length
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / total
    const countsByStar = reviews.reduce(
      (acc, r) => {
        acc[r.rating] = (acc[r.rating] ?? 0) + 1
        return acc
      },
      {} as Record<number, number>
    )
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: countsByStar[star] ?? 0,
      percent: ((countsByStar[star] ?? 0) / total) * 100,
    }))
    return { total, avg, distribution }
  }, [reviews])

  const handleAddToCart = () => {
    if (isOutOfStock) return
    setAddingToCart(true)
    addItem({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      price: product.pricePromo ?? product.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
      image: product.images[selectedImage] || product.images[0],
    })
    setTimeout(() => setAddingToCart(false), 800)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  const renderStars = (rating: number, size: string = 'w-4 h-4') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.floor(rating)
            ? 'text-gold fill-gold'
            : i < rating
            ? 'text-gold fill-gold/50'
            : 'text-beige'
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav
          className="flex items-center gap-1.5 font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mb-6 flex-wrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button onClick={goHome} className="flex items-center gap-1 hover:text-gold transition-colors">
            <Home className="w-3.5 h-3.5" />
            Accueil
          </button>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <button onClick={() => goCatalogue()} className="hover:text-gold transition-colors">
            Catalogue
          </button>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <button onClick={() => goCatalogue(product.category)} className="hover:text-gold transition-colors">
            {categoryName}
          </button>
          <ChevronRight className="w-3 h-3 opacity-40" />
          <span className="text-gold font-medium truncate max-w-[150px]">{product.name}</span>
        </motion.nav>

        {/* Product Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnails - Vertical on desktop */}
              {product.images.length > 1 && (
                <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] pb-2 sm:pb-0 sm:pr-2">
                  {product.images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all bg-beige/40 ${
                        selectedImage === idx
                          ? 'border-gold ring-2 ring-gold/20'
                          : 'border-transparent hover:border-gold/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ProductImage
                        src={img}
                        alt={`${product.name} - vue ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div
                ref={imageRef}
                className="relative flex-1 aspect-[3/4] bg-beige/40 rounded-2xl overflow-hidden cursor-zoom-in group/main"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                onClick={() => { setLightboxIdx(selectedImage); setLightboxOpen(true) }}
              >
                {/* Fullscreen hint */}
                <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 opacity-0 group-hover/main:opacity-100 transition-opacity duration-200">
                  <Maximize2 className="w-3.5 h-3.5 text-white" />
                  <span className="font-[family-name:var(--font-dm-sans)] text-white text-[10px] font-medium">Agrandir</span>
                </div>
                {/* Image with zoom */}
                <div
                  className="absolute inset-0"
                  style={{
                    transform: isZooming ? 'scale(1.35)' : 'scale(1)',
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transition: isZooming ? 'none' : 'transform 0.4s ease',
                  }}
                >
                  <ProductImage
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={selectedImage === 0}
                  />
                </div>
                {product.badge && (
                  <span className={`absolute top-4 left-4 z-10 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    product.badge === 'nouveau' ? 'bg-emerald-500 text-white' :
                    product.badge === 'promo' ? 'bg-caramel text-white' :
                    'bg-gray-400 text-white'
                  }`}>
                    {product.badge === 'nouveau' ? 'Nouveau' : product.badge === 'promo' ? 'Promo' : 'Épuisé'}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Category */}
            <p className="font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-widest text-text-mid/60 mb-2">
              {categoryName}
            </p>

            {/* Title */}
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-text-dark mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating, 'w-4.5 h-4.5')}
              </div>
              <button
                className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid hover:text-gold transition-colors underline underline-offset-2"
                onClick={() => {
                  document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {product.reviewCount} avis
              </button>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
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
                      <span className="font-[family-name:var(--font-dm-sans)] text-3xl font-bold text-caramel">
                        {formatPrice(product.pricePromo)}
                      </span>
                      <span className="font-[family-name:var(--font-dm-sans)] text-base text-text-mid/50 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="ml-1 bg-caramel/10 text-caramel text-xs font-semibold px-2 py-0.5 rounded-full">
                        -{Math.round(((product.price - product.pricePromo) / product.price) * 100)}%
                      </span>
                    </>
                  ) : (
                    <span className="font-[family-name:var(--font-dm-sans)] text-3xl font-bold text-gold">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="mb-5">
                <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark mb-3">
                  Couleur: <span className="font-normal text-text-mid capitalize">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-gold ring-2 ring-gold/30'
                          : 'border-gold/20 hover:border-gold/50'
                      }`}
                      style={getSwatchStyle(color)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke={color === 'blanc' || color === 'ivoire' || color === 'naturel' ? '#2C1810' : '#FFFFFF'}
                            strokeWidth={3}
                          >
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
                <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark mb-3">
                  Taille: <span className="font-normal text-text-mid">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-11 px-4 rounded-xl font-[family-name:var(--font-dm-sans)] text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-gold text-white shadow-md'
                          : 'bg-beige/50 text-text-mid hover:bg-gold/10 hover:text-gold'
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

            {/* Quantity Selector */}
            <div className="mb-6">
              <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark mb-3">
                Quantité
              </p>
              <div className="flex items-center gap-3">
                <motion.button
                  className="w-10 h-10 rounded-xl border border-gold/20 flex items-center justify-center text-text-mid hover:bg-gold/10 hover:text-gold transition-colors disabled:opacity-40"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={quantity}
                    className="w-12 text-center font-[family-name:var(--font-dm-sans)] text-lg font-semibold text-text-dark"
                    initial={{ scale: 1.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {quantity}
                  </motion.span>
                </AnimatePresence>
                <motion.button
                  className="w-10 h-10 rounded-xl border border-gold/20 flex items-center justify-center text-text-mid hover:bg-gold/10 hover:text-gold transition-colors disabled:opacity-40"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="font-[family-name:var(--font-dm-sans)] text-xs text-caramel">
                    Plus que {product.stock} en stock
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 mb-6">
              <motion.button
                className={`flex-1 py-3.5 rounded-xl font-[family-name:var(--font-dm-sans)] text-sm font-semibold tracking-wide flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'btn-gold text-white'
                }`}
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                whileTap={!isOutOfStock ? { scale: 0.97 } : {}}
              >
                <ShoppingBag className="w-4 h-4" />
                {addingToCart ? 'Ajouté au panier !' : isOutOfStock ? 'Produit épuisé' : 'Ajouter au panier'}
              </motion.button>
              <motion.button
                className={`px-6 py-3.5 rounded-xl border font-[family-name:var(--font-dm-sans)] text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                  inWishlist
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-gold/30 text-text-mid hover:text-gold hover:bg-gold/5'
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
                {inWishlist ? 'Dans mes favoris' : 'Ajouter aux favoris'}
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-beige/30">
                <Truck className="w-5 h-5 text-gold mb-1.5" />
                <span className="font-[family-name:var(--font-dm-sans)] text-[10px] text-text-mid leading-tight">
                  Livraison gratuite<br />dès 30 000 FCFA
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-beige/30">
                <RefreshCcw className="w-5 h-5 text-gold mb-1.5" />
                <span className="font-[family-name:var(--font-dm-sans)] text-[10px] text-text-mid leading-tight">
                  Retours gratuits<br />sous 14 jours
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-beige/30">
                <Shield className="w-5 h-5 text-gold mb-1.5" />
                <span className="font-[family-name:var(--font-dm-sans)] text-[10px] text-text-mid leading-tight">
                  Paiement<br />sécurisé
                </span>
              </div>
            </div>

            {/* Accordion Details */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description" className="border-gold/20">
                <AccordionTrigger className="font-[family-name:var(--font-cormorant)] text-base font-semibold text-text-dark hover:text-gold hover:no-underline">
                  Description
                </AccordionTrigger>
                <AccordionContent className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid leading-relaxed">
                  {product.description}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="materials" className="border-gold/20">
                <AccordionTrigger className="font-[family-name:var(--font-cormorant)] text-base font-semibold text-text-dark hover:text-gold hover:no-underline">
                  Matières & Entretien
                </AccordionTrigger>
                <AccordionContent className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid leading-relaxed">
                  <p className="mb-2"><strong>Matière :</strong> {product.material}</p>
                  <p className="mb-1">Conseils d&apos;entretien :</p>
                  <ul className="list-disc list-inside space-y-1">
                    {getProductCareTips(product).map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="size-guide" className="border-gold/20">
                <AccordionTrigger className="font-[family-name:var(--font-cormorant)] text-base font-semibold text-text-dark hover:text-gold hover:no-underline">
                  Guide des tailles
                </AccordionTrigger>
                <AccordionContent className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid leading-relaxed">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gold/20">
                          <th className="py-2 pr-4 font-semibold text-text-dark">Taille</th>
                          <th className="py-2 pr-4 font-semibold text-text-dark">Tour</th>
                          <th className="py-2 font-semibold text-text-dark">Correspondance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getProductSizeGuide(product).map((row, i, rows) => (
                          <tr
                            key={`${row.size}-${i}`}
                            className={i < rows.length - 1 ? 'border-b border-gold/10' : ''}
                          >
                            <td className="py-2 pr-4 font-medium">{row.size}</td>
                            <td className="py-2 pr-4">{row.measure}</td>
                            <td className="py-2">{row.fit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs italic">Si vous hésitez entre deux tailles, choisissez la taille supérieure.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping" className="border-gold/20">
                <AccordionTrigger className="font-[family-name:var(--font-cormorant)] text-base font-semibold text-text-dark hover:text-gold hover:no-underline">
                  Livraison & Retours
                </AccordionTrigger>
                <AccordionContent className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid leading-relaxed">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-text-dark mb-1">Livraison</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Bamako : 2 000 FCFA (2-5 jours ouvrés)</li>
                        <li>Autres villes Mali : 5 000 FCFA</li>
                        <li>International : 15 000 FCFA</li>
                        <li>Gratuite dès 30 000 FCFA d&apos;achat</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-text-dark mb-1">Retours</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Retour gratuit sous 14 jours</li>
                        <li>Le produit doit être non porté et dans son emballage d&apos;origine</li>
                        <li>Remboursement sous 5-7 jours ouvrés</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.section
          id="reviews-section"
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-text-dark mb-8">
            Avis clients
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <div className="glass-card p-6 text-center">
              <p className="font-[family-name:var(--font-dm-sans)] text-5xl font-bold text-text-dark mb-2">
                {reviewStats.avg.toFixed(1)}
              </p>
              <div className="flex items-center justify-center gap-0.5 mb-2">
                {renderStars(Math.round(reviewStats.avg), 'w-5 h-5')}
              </div>
              <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mb-6">
                Basé sur {reviewStats.total} avis
              </p>

              {/* Distribution */}
              <div className="space-y-2">
                {reviewStats.distribution.map((item) => (
                  <div key={item.star} className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid w-3">{item.star}</span>
                    <Star className="w-3 h-3 text-gold fill-gold" />
                    <Progress value={item.percent} className="flex-1 h-2 bg-beige" />
                    <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid w-6 text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>

              {reviewSubmitted && (
                <motion.p
                  className="mt-4 font-[family-name:var(--font-dm-sans)] text-xs text-gold font-semibold text-center"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Merci pour votre avis !
                </motion.p>
              )}

              <button
                className="mt-6 w-full btn-gold px-6 py-2.5 text-xs flex items-center justify-center gap-2"
                onClick={() => setShowReviewForm((v) => !v)}
              >
                {showReviewForm ? <X className="w-3.5 h-3.5" /> : <PenLine className="w-3.5 h-3.5" />}
                {showReviewForm ? 'Annuler' : 'Écrire un avis'}
              </button>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {showReviewForm && (
                  <motion.form
                    key="review-form"
                    onSubmit={handleReviewSubmit}
                    className="glass-card p-5 space-y-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="font-[family-name:var(--font-playfair)] text-base font-bold text-text-dark">
                      Votre avis
                    </p>

                    {/* Star Rating */}
                    <div>
                      <label className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mb-1 block">
                        Note *
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setReviewHover(star)}
                            onMouseLeave={() => setReviewHover(0)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                star <= (reviewHover || reviewRating)
                                  ? 'text-gold fill-gold'
                                  : 'text-beige fill-beige'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name + Location */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mb-1 block">
                          Nom *
                        </label>
                        <input
                          type="text"
                          value={reviewAuthor}
                          onChange={(e) => setReviewAuthor(e.target.value)}
                          placeholder="Ex : Aminata D."
                          required
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gold/20 bg-warm-white focus:outline-none focus:border-gold font-[family-name:var(--font-dm-sans)] text-text-dark placeholder:text-text-mid/40"
                        />
                      </div>
                      <div>
                        <label className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mb-1 block">
                          Ville
                        </label>
                        <input
                          type="text"
                          value={reviewLocation}
                          onChange={(e) => setReviewLocation(e.target.value)}
                          placeholder="Ex : Bamako"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gold/20 bg-warm-white focus:outline-none focus:border-gold font-[family-name:var(--font-dm-sans)] text-text-dark placeholder:text-text-mid/40"
                        />
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mb-1 block">
                        Commentaire *
                      </label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Partagez votre expérience avec ce produit…"
                        required
                        rows={3}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gold/20 bg-warm-white focus:outline-none focus:border-gold font-[family-name:var(--font-dm-sans)] text-text-dark placeholder:text-text-mid/40 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-gold px-6 py-2.5 text-xs flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Publier mon avis
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    className="glass-card p-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark">
                          {review.author}
                        </p>
                        <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid/60">
                          {review.location} · {review.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {renderStars(review.rating, 'w-3.5 h-3.5')}
                      </div>
                    </div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid leading-relaxed">
                      {review.comment}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-text-dark">
                Vous aimerez aussi
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollSimilar('left')}
                  className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-text-mid hover:bg-gold hover:text-white hover:border-gold transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollSimilar('right')}
                  className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-text-mid hover:bg-gold hover:text-white hover:border-gold transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div ref={similarRef} className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {similarProducts.map((p) => (
                <div key={p.id} className="flex-shrink-0 w-48 sm:w-56">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && (
        <Suspense fallback={null}>
          <ImageLightbox
            images={product.images}
            initialIndex={lightboxIdx}
            productName={product.name}
            onClose={() => setLightboxOpen(false)}
          />
        </Suspense>
      )}

      {/* Sticky mobile CTA */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-gold/15 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="flex-1 min-w-0">
              <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid truncate">
                {product.name}
              </p>
              <p className="font-[family-name:var(--font-playfair)] text-base font-bold text-gold">
                {formatPrice(product.pricePromo ?? product.price)}
              </p>
            </div>
            <motion.button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
              className={`shrink-0 px-5 py-2.5 rounded-xl font-[family-name:var(--font-dm-sans)] text-sm font-semibold flex items-center gap-2 ${
                isOutOfStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'btn-gold text-white border-0'
              }`}
              whileTap={!isOutOfStock ? { scale: 0.96 } : {}}
            >
              <ShoppingBag className="w-4 h-4" />
              {addingToCart ? 'Ajouté !' : isOutOfStock ? 'Épuisé' : 'Ajouter'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
