'use client'

import { motion } from 'framer-motion'
import { X, Instagram, Facebook, MessageCircle } from 'lucide-react'
import { type PageName } from '@/stores/nav-store'

const navLinks: { label: string; page: PageName }[] = [
  { label: 'Accueil', page: 'home' },
  { label: 'Catalogue', page: 'catalogue' },
  { label: 'Promotions', page: 'promotions' },
  { label: 'À Propos', page: 'about' },
  { label: 'Contact', page: 'contact' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: { duration: 0.2 },
  },
}

interface MobileMenuProps {
  onClose: () => void
  currentPage: PageName
  onNavigate: (page: PageName) => void
}

export default function MobileMenu({ onClose, currentPage, onNavigate }: MobileMenuProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Close Button */}
      <div className="absolute top-4 right-4 z-10">
        <motion.button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-warm-white shadow-sm flex items-center justify-center text-text-mid hover:text-gold transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Logo */}
      <div className="absolute top-5 left-5">
        <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-gold tracking-wider">
          TONOMI
        </span>
      </div>

      {/* Navigation Links */}
      <motion.nav
        className="flex flex-col items-start justify-center min-h-screen px-8 pt-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {navLinks.map((link) => (
          <motion.div
            key={link.page}
            variants={itemVariants}
            className="w-full"
          >
            <button
              onClick={() => onNavigate(link.page)}
              className={`font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl py-3 transition-colors block w-full text-left ${
                currentPage === link.page
                  ? 'text-gold font-semibold'
                  : 'text-text-dark hover:text-gold'
              }`}
            >
              {link.label}
              {currentPage === link.page && (
                <motion.div
                  layoutId="mobileActiveNav"
                  className="h-0.5 mt-1 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #D4AF6A, #E8C547)',
                    width: '40px',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          </motion.div>
        ))}

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="w-16 h-px bg-gold/30 my-6"
        />

        {/* Social Icons */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4"
        >
          <a
            href="https://instagram.com/tonomi"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-warm-white shadow-sm flex items-center justify-center text-caramel hover:text-gold hover:shadow-md transition-all"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://facebook.com/tonomi"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-warm-white shadow-sm flex items-center justify-center text-caramel hover:text-gold hover:shadow-md transition-all"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://wa.me/223XXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-warm-white shadow-sm flex items-center justify-center text-caramel hover:text-gold hover:shadow-md transition-all"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        </motion.div>
      </motion.nav>
    </motion.div>
  )
}
