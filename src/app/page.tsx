'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import BackToTop from '@/components/shared/BackToTop'
import { useNavStore } from '@/stores/nav-store'

// Home section components
import HeroSection from '@/components/home/HeroSection'
import NewArrivals from '@/components/home/NewArrivals'
import BestSellers from '@/components/home/BestSellers'
import BrandStory from '@/components/home/BrandStory'
import CategoriesSection from '@/components/home/CategoriesSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import PresenceSection from '@/components/home/PresenceSection'
import InstagramFeed from '@/components/home/InstagramFeed'
import NewsletterSection from '@/components/home/NewsletterSection'

// Page components
import PromotionsPage from '@/components/promotions/PromotionsPage'
import AboutPage from '@/components/about/AboutPage'
import ContactPage from '@/components/contact/ContactPage'
import CatalogPage from '@/components/catalog/CatalogPage'
import ProductPage from '@/components/product/ProductPage'

// Admin components
import AdminLayout from '@/components/admin/AdminLayout'

const pageVariants = {
  initial: { opacity: 0, y: 8, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)' },
}

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.35,
}

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <CategoriesSection />
      <NewArrivals />
      <BestSellers />
      <BrandStory />
      <PresenceSection />
      <TestimonialsSection />
      <InstagramFeed />
      <NewsletterSection />
    </div>
  )
}

export default function Home() {
  const { currentPage } = useNavStore()

  // Admin page has its own layout (no Navbar/Footer)
  if (currentPage === 'admin') {
    return <AdminLayout />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'catalogue':
        return <CatalogPage />
      case 'product':
        return <ProductPage />
      case 'promotions':
        return <PromotionsPage />
      case 'about':
        return <AboutPage />
      case 'contact':
        return <ContactPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <CartDrawer />
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          className="flex-1"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  )
}
