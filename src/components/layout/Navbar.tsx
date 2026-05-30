'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ShoppingBag, Menu, Settings } from 'lucide-react'
import { useNavStore, type PageName } from '@/stores/nav-store'
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'
import { Badge } from '@/components/ui/badge'
import MobileMenu from './MobileMenu'
import SearchOverlay from './SearchOverlay'
import { useRouter } from 'next/navigation'

const navLinks: { label: string; page: PageName }[] = [
  { label: 'Accueil', page: 'home' },
  { label: 'Catalogue', page: 'catalogue' },
  { label: 'Promotions', page: 'promotions' },
  { label: 'À Propos', page: 'about' },
  { label: 'Contact', page: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { currentPage, navigate } = useNavStore()
  const { getItemCount, setCartOpen } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const router = useRouter()

  const cartCount = getItemCount()
  const wishlistCount = wishlistItems.length

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (page: PageName) => {
    navigate(page)
    setMobileMenuOpen(false)
    setSearchOpen(false)
  }

  const handleWishlistClick = () => {
    navigate('catalogue', { category: 'wishlist' })
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? 'bg-cream/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(212,175,106,0.12)] border-b border-gold/20'
              : 'bg-transparent'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between sm:h-20">
              {/* Logo */}
              <motion.button
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2 focus:outline-none"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold tracking-wider text-gold">
                  TONOMI
                </span>
              </motion.button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => handleNavClick(link.page)}
                    className="relative px-4 py-2 font-[family-name:var(--font-dm-sans)] text-sm font-medium tracking-wide transition-colors text-text-mid hover:text-gold"
                  >
                    {link.label}
                    {currentPage === link.page && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #D4AF6A, #E8C547)',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </nav>

              {/* Right Icons */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Search */}
                <motion.button
                  className="relative p-2 rounded-full text-text-mid hover:text-gold hover:bg-beige/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchOpen(true)}
                  aria-label="Rechercher"
                >
                  <Search className="w-5 h-5" />
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  onClick={handleWishlistClick}
                  className="relative p-2 rounded-full text-text-mid hover:text-gold hover:bg-beige/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Favoris"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-gold text-white border-0 rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </Badge>
                  )}
                </motion.button>

                {/* Cart */}
                <motion.button
                  onClick={() => setCartOpen(true)}
                  className="relative p-2 rounded-full text-text-mid hover:text-gold hover:bg-beige/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Panier"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-gold text-white border-0 rounded-full flex items-center justify-center">
                      {cartCount}
                    </Badge>
                  )}
                </motion.button>

                {/* Admin */}
                <motion.button
                  onClick={() => router.push('/admin')}
                  className="relative p-2 rounded-full text-text-mid hover:text-caramel hover:bg-beige/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Administration"
                >
                  <Settings className="w-5 h-5" />
                </motion.button>

                {/* Mobile Menu Toggle */}
                <motion.button
                  className="md:hidden p-2 rounded-full text-text-mid hover:text-gold hover:bg-beige/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Menu"
                >
                  <Menu className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            onClose={() => setMobileMenuOpen(false)}
            currentPage={currentPage}
            onNavigate={handleNavClick}
          />
        )}
      </AnimatePresence>
    </>
  )
}
