'use client'

import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  ChevronRight,
  Home,
  ZoomIn,
  Truck,
  RefreshCcw,
  Shield,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { getProductById, getProductsByCategory, type Product } from '@/data/products'
import { categories } from '@/data/categories'
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'
import { useNavStore } from '@/stores/nav-store'
import ProductCard from '@/components/catalog/ProductCard'

const formatPrice = (price: number) => price.toLocaleString('fr-FR') + ' FCFA'

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
  multicolore: 'linear-gradient(135deg, #D4AF6A, #E8C547, #C8956C)',
  doré: '#D4AF6A',
  cognac: '#834333',
  sable: '#C2B280',
  naturel: '#E8D5B7',
  indigo: '#4B0082',
  kaki: '#8B7355',
  écaille: '#6B3A2A',
  tortue: '#8B6914',
  'noir et blanc': 'linear-gradient(90deg, #1a1a1a 50%, #FFFFFF 50%)',
  émeraude: '#046307',
  violet: '#7C3AED',
  transparent: '#F5F5F5',
  ivoire: '#FFFFF0',
}

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
  const { selectedProductId, goHome, goCatalogue } = useNavStore()
  const product = getProductById(selectedProductId ?? '')

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
  const { addItem } = useCartStore()
  const { isInWishlist, toggleItem } = useWishlistStore()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const imageRef = useRef<HTMLDivElement>(null)

  const inWishlist = isInWishlist(product.id)
  const isOutOfStock = product.stock === 0
  const categoryName = categories.find((c) => c.slug === product.category)?.name ?? product.category

  // Similar products
  const similarProducts = useMemo(() => {
    return getProductsByCategory(product.category)
      .filter((p) => p.id !== product.id)
      .slice(0, 6)
  }, [product.category, product.id])

  // Review stats
  const reviewStats = useMemo(() => {
    const total = mockReviews.length
    const avg = mockReviews.reduce((sum, r) => sum + r.rating, 0) / total
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: mockReviews.filter((r) => r.rating === star).length,
      percent: (mockReviews.filter((r) => r.rating === star).length / total) * 100,
    }))
    return { total, avg, distribution }
  }, [])

  const handleAddToCart = () => {
    if (isOutOfStock) return
    setAddingToCart(true)
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product.id}-${selectedColor}-${selectedSize}-${Date.now()}-${i}`,
        productId: product.id,
        name: product.name,
        price: product.pricePromo ?? product.price,
        quantity: 1,
        color: selectedColor,
        size: selectedSize,
        image: product.images[selectedImage],
      })
    }
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
                  {product.images.map((_, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-gold ring-2 ring-gold/20'
                          : 'border-transparent hover:border-gold/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-beige to-gold/20 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gold/30" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div
                ref={imageRef}
                className="relative flex-1 aspect-[3/4] bg-gradient-to-br from-beige to-gold/20 rounded-2xl overflow-hidden cursor-crosshair"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-gold/20" />
                </div>
                {product.badge && (
                  <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    product.badge === 'nouveau' ? 'bg-emerald-500 text-white' :
                    product.badge === 'promo' ? 'bg-caramel text-white' :
                    'bg-gray-400 text-white'
                  }`}>
                    {product.badge === 'nouveau' ? 'Nouveau' : product.badge === 'promo' ? 'Promo' : 'Épuisé'}
                  </span>
                )}
                {/* Zoom indicator */}
                <motion.div
                  className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm rounded-full p-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isZooming ? 1 : 0 }}
                >
                  <ZoomIn className="w-4 h-4 text-text-mid" />
                </motion.div>
                {/* Zoom overlay */}
                <AnimatePresence>
                  {isZooming && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        background: `radial-gradient(circle at ${zoomPos.x}% ${zoomPos.y}%, rgba(212,175,106,0.15) 0%, transparent 50%)`,
                      }}
                    />
                  )}
                </AnimatePresence>
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
                      style={{ background: colorSwatchMap[color] || '#999' }}
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
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
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
                  Livraison gratuite<br />dès 25 000 FCFA
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
                    <li>Éviter le contact avec l&apos;eau et les parfums</li>
                    <li>Ranger dans un endroit sec à l&apos;abri de la lumière</li>
                    <li>Nettoyer délicatement avec un chiffon doux</li>
                    <li>Conserver dans sa pochette TONOMI d&apos;origine</li>
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
                        <tr className="border-b border-gold/10">
                          <td className="py-2 pr-4">S</td>
                          <td className="py-2 pr-4">14-16 cm</td>
                          <td className="py-2">Fin</td>
                        </tr>
                        <tr className="border-b border-gold/10">
                          <td className="py-2 pr-4">M</td>
                          <td className="py-2 pr-4">16-18 cm</td>
                          <td className="py-2">Standard</td>
                        </tr>
                        <tr className="border-b border-gold/10">
                          <td className="py-2 pr-4">L</td>
                          <td className="py-2 pr-4">18-20 cm</td>
                          <td className="py-2">Large</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4">XL</td>
                          <td className="py-2 pr-4">20-22 cm</td>
                          <td className="py-2">Très large</td>
                        </tr>
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
                        <li>Livraison standard (3-5 jours) : 2 500 FCFA</li>
                        <li>Livraison express (24-48h) : 4 000 FCFA</li>
                        <li>Gratuite dès 25 000 FCFA d&apos;achat</li>
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

              <button className="mt-6 w-full btn-gold px-6 py-2.5 text-xs">
                Écrire un avis
              </button>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {mockReviews.map((review) => (
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
        </motion.section>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-text-dark mb-8">
              Vous aimerez aussi
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {similarProducts.map((p) => (
                <div key={p.id} className="flex-shrink-0 w-48 sm:w-56">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}
