'use client'

import { motion } from 'framer-motion'
import { categories } from '@/data/categories'
import { useNavStore } from '@/stores/nav-store'

export default function CategoriesSection() {
  const { goCatalog } = useNavStore()

  const handleCategoryClick = (slug: string) => {
    goCatalog(slug)
  }

  return (
    <section className="py-16 sm:py-20 bg-beige/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-[family-name:var(--font-dm-sans)] text-sm text-gold tracking-[0.3em] uppercase">
            Explorer
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark mt-2">
            Nos Catégories
          </h2>
          <p className="font-[family-name:var(--font-dm-sans)] text-text-mid mt-3 max-w-md mx-auto">
            Trouvez l&apos;accessoire parfait parmi notre sélection raffinée
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-[4/5]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => handleCategoryClick(category.slug)}
              whileHover={{ scale: 1.02 }}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-text-dark/70 via-text-dark/20 to-transparent transition-all duration-500 group-hover:from-gold/70 group-hover:via-gold/20 group-hover:to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                <motion.div
                  className="transform transition-transform duration-500 group-hover:-translate-y-2"
                >
                  <h3 className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl font-semibold text-white">
                    {category.name}
                  </h3>
                  <div className="overflow-hidden">
                    <motion.p
                      className="font-[family-name:var(--font-dm-sans)] text-xs sm:text-sm text-white/80 mt-1 max-w-[200px]"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      {category.productCount} produits
                    </motion.p>
                  </div>
                </motion.div>
              </div>

              {/* Hover arrow indicator */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
