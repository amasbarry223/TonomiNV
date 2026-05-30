'use client'

import { motion } from 'framer-motion'
import { Instagram, Heart } from 'lucide-react'
import { getProductImagePaths } from '@/data/product-image-map'
import { ProductImage } from '@/components/ui/product-image'

const instagramImages = [
  { src: '/images/instagram/insta-1.png', likes: 234 },
  { src: '/images/instagram/insta-2.png', likes: 189 },
  { src: '/images/instagram/insta-3.png', likes: 312 },
  { src: '/images/instagram/insta-4.png', likes: 156 },
  { src: getProductImagePaths('prod-005', 'bijoux', 1)[0], likes: 278 },
  { src: getProductImagePaths('prod-009', 'sacs', 1)[0], likes: 201 },
]

export default function InstagramFeed() {
  return (
    <section className="py-16 sm:py-20 bg-warm-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Instagram className="w-5 h-5 text-gold" />
            <span className="font-[family-name:var(--font-dm-sans)] text-sm text-gold tracking-[0.2em] uppercase">
              Instagram
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark">
            @tonomi.accessoires
          </h2>
          <p className="font-[family-name:var(--font-dm-sans)] text-text-mid mt-2">
            Suivez-nous pour plus d&apos;inspiration
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
          {instagramImages.map((image, index) => (
            <motion.a
              key={image.src}
              href="https://www.instagram.com/tonomi.accessoires"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ scale: 1.03 }}
            >
              <ProductImage
                src={image.src}
                alt={`TONOMI Instagram ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-text-dark/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 text-white">
                  <Heart className="w-5 h-5 fill-white" />
                  <span className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold">
                    {image.likes}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.a
            href="https://www.instagram.com/tonomi.accessoires"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-2 px-6 py-3 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Instagram className="w-4 h-4" />
            Suivez-nous
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
