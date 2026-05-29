'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Package, Clock, ShieldCheck } from 'lucide-react'

const stats = [
  {
    icon: Package,
    value: '200+',
    label: 'Références',
    description: 'accessoires uniques',
  },
  {
    icon: Clock,
    value: '48h',
    label: 'Livraison',
    description: 'partout au Mali',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'Satisfaction',
    description: 'garantie',
  },
]

export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-warm-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="font-[family-name:var(--font-dm-sans)] text-sm text-gold tracking-[0.3em] uppercase">
                Notre Histoire
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mt-3 leading-tight">
                L&apos;art de sublimer{' '}
                <span className="text-gold-gradient">la femme africaine</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 space-y-4"
            >
              <p className="font-[family-name:var(--font-dm-sans)] text-text-mid leading-relaxed">
                Chez TONOMI, chaque accessoire raconte une histoire — celle du savoir-faire artisanal malien,
                transmis de génération en génération. Nos créations puisent leur inspiration dans la richesse
                culturelle du Mali, du bogolan aux perles traditionnelles.
              </p>
              <p className="font-[family-name:var(--font-dm-sans)] text-text-mid leading-relaxed">
                Nous croyons que l&apos;élégance n&apos;a pas de frontières. C&apos;est pourquoi nous sélectionnons
                avec soin les meilleurs matériaux et collaborons avec des artisans passionnés pour vous offrir
                des pièces d&apos;exception, à la fois authentiques et contemporaines.
              </p>
            </motion.div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="glass-card p-4 sm:p-5 text-center warm-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <stat.icon className="w-6 h-6 text-gold mx-auto mb-2" />
                  <p className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-gold">
                    {stat.value}
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-xs sm:text-sm font-medium text-text-dark mt-1">
                    {stat.label}
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-text-mid mt-0.5">
                    {stat.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image */}
          <motion.div
            className="relative"
            style={{ y: imageY }}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto lg:ml-auto">
              {/* Decorative background shape */}
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-gold/20 to-caramel/10 rounded-3xl" />

              {/* Image */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden warm-shadow-lg">
                <img
                  src="/images/about/about-hero.png"
                  alt="Artisan TONOMI au travail"
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-text-dark/10 to-transparent" />
              </div>

              {/* Floating decorative element */}
              <motion.div
                className="absolute -bottom-6 -left-6 w-28 h-28 rounded-2xl glass-card flex items-center justify-center warm-shadow"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="text-center">
                  <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-gold">5+</p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-text-mid">ans d&apos;expertise</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
