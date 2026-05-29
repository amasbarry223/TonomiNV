'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react'
import { useNavStore } from '@/stores/nav-store'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function HeroSection() {
  const { goCatalog, goPromotions } = useNavStore()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100vh] flex items-center overflow-hidden particles-bg"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-beige" />

      {/* Decorative slow-spinning gold circle */}
      <div className="absolute top-20 right-10 w-72 h-72 opacity-10 pointer-events-none hidden lg:block">
        <div className="w-full h-full rounded-full border-[3px] border-gold animate-spin-slow" />
      </div>
      <div className="absolute bottom-32 left-10 w-48 h-48 opacity-5 pointer-events-none hidden lg:block">
        <div className="w-full h-full rounded-full border-2 border-caramel animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      </div>

      {/* Decorative floating dots */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-gold/30 animate-float" />
      <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-gold/20 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-caramel/20 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            style={{ y: textY }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="font-[family-name:var(--font-dm-sans)] text-sm text-gold tracking-[0.3em] uppercase">
                Collection 2025
              </span>
              <Sparkles className="w-4 h-4 text-gold" />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-dark leading-[1.1]"
            >
              L&apos;élégance africaine{' '}
              <span className="text-gold-gradient">réinventée</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 font-[family-name:var(--font-dm-sans)] text-base sm:text-lg text-text-mid max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Découvrez nos accessoires de mode haut de gamme, façonnés avec passion au cœur du Mali.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <motion.button
                className="btn-gold px-8 py-3.5 text-sm flex items-center gap-2"
                onClick={() => goCatalog()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Découvrir la Collection
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="px-8 py-3.5 text-sm font-[family-name:var(--font-dm-sans)] font-medium text-text-mid hover:text-gold border border-gold/30 rounded-[50px] transition-colors hover:border-gold"
                onClick={() => goPromotions()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Nos Promotions
              </motion.button>
            </motion.div>

            {/* Stats mini */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex items-center justify-center lg:justify-start gap-8"
            >
              {[
                { value: '200+', label: 'Références' },
                { value: '500+', label: 'Clientes' },
                { value: '48h', label: 'Livraison' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-gold">
                    {stat.value}
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Product Image */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            style={{ y: imageY, scale: imageScale }}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-72 h-96 sm:w-80 sm:h-[440px] lg:w-96 lg:h-[520px]">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 via-caramel/10 to-transparent rounded-3xl blur-2xl" />

              {/* Image container */}
              <div className="relative w-full h-full glass-card overflow-hidden warm-shadow-lg">
                <img
                  src="/images/products/necklace-1.png"
                  alt="Collier TONOMI - Collection phare"
                  className="w-full h-full object-cover"
                />

                {/* Overlay gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-text-dark/20 to-transparent" />

                {/* Floating tag */}
                <motion.div
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 warm-shadow"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-gold">
                    Best-Seller ✨
                  </span>
                </motion.div>
              </div>

              {/* Decorative floating element */}
              <motion.div
                className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-gold/10 animate-float"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid tracking-wider">
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gold" />
        </motion.div>
      </motion.div>
    </section>
  )
}
