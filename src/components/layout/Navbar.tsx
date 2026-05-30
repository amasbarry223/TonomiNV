'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ShoppingBag, Menu } from 'lucide-react'
import { useNavStore, type PageName } from '@/stores/nav-store'
import { useCartStore } from '@/stores/cart-store'
import { useWishlistStore } from '@/stores/wishlist-store'
import { Badge } from '@/components/ui/badge'

const SearchOverlay = dynamic(() => import('./SearchOverlay'), { ssr: false })
const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false })

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
  const setCartOpen = useCartStore((s) => s.setCartOpen)
  const cartCount = useCartStore((s) =>
    s.items.reduce((n, i) => n + i.quantity, 0)
  )
  const wishlistCount = useWishlistStore((s) => s.items.length)

  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

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
          className={`bg-white transition-all duration-500 ${
            scrolled
              ? 'shadow-md border-b border-black/10'
              : 'border-b border-black/5'
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
                <span className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold tracking-wider text-black">
                  TONOMI
                </span>
              </motion.button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => handleNavClick(link.page)}
                    className="relative px-4 py-2 font-[family-name:var(--font-dm-sans)] text-sm font-medium tracking-wide transition-colors text-black hover:text-black/70"
                  >
                    {link.label}
                    {currentPage === link.page && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-black"
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
                  className="relative p-2 rounded-full text-black hover:text-black/70 hover:bg-black/5 transition-colors"
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
                  className="relative p-2 rounded-full text-black hover:text-black/70 hover:bg-black/5 transition-colors"
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
                  className="relative p-2 rounded-full text-black hover:text-black/70 hover:bg-black/5 transition-colors"
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

                {/* Mobile Menu Toggle */}
                <motion.button
                  className="md:hidden p-2 rounded-full text-black hover:text-black/70 hover:bg-black/5 transition-colors"
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
      {searchOpen && <SearchOverlay open={searchOpen} onClose={closeSearch} />}

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            onClose={closeMobileMenu}
            currentPage={currentPage}
            onNavigate={handleNavClick}
          />
        )}
      </AnimatePresence>
    </>
  )
}
