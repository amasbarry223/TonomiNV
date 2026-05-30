'use client'

import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'
import BackToTop from '@/components/shared/BackToTop'
import { PageSkeleton, SectionSkeleton } from '@/components/ui/page-skeleton'
import { useNavStore } from '@/stores/nav-store'

import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import NewArrivals from '@/components/home/NewArrivals'
import BestSellers from '@/components/home/BestSellers'

const CartDrawer = dynamic(() => import('@/components/layout/CartDrawer'), { ssr: false })

const BrandStory = dynamic(() => import('@/components/home/BrandStory'), {
  loading: () => <SectionSkeleton className="min-h-[480px]" />,
})
const PresenceSection = dynamic(() => import('@/components/home/PresenceSection'), {
  ssr: false,
  loading: () => <SectionSkeleton className="min-h-[520px]" />,
})
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), {
  loading: () => <SectionSkeleton className="min-h-[400px]" />,
})
const InstagramFeed = dynamic(() => import('@/components/home/InstagramFeed'), {
  loading: () => <SectionSkeleton className="min-h-[360px]" />,
})
const NewsletterSection = dynamic(() => import('@/components/home/NewsletterSection'), {
  loading: () => <SectionSkeleton className="min-h-[280px]" />,
})

const CatalogPage = dynamic(() => import('@/components/catalog/CatalogPage'), {
  loading: () => <PageSkeleton />,
})
const ProductPage = dynamic(() => import('@/components/product/ProductPage'), {
  loading: () => <PageSkeleton />,
})
const PromotionsPage = dynamic(() => import('@/components/promotions/PromotionsPage'), {
  loading: () => <PageSkeleton />,
})
const AboutPage = dynamic(() => import('@/components/about/AboutPage'), {
  loading: () => <PageSkeleton />,
})
const ContactPage = dynamic(() => import('@/components/contact/ContactPage'), {
  loading: () => <PageSkeleton />,
})

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const pageTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
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
