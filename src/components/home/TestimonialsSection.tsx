'use client'

import { motion } from 'framer-motion'
import { Star, BadgeCheck } from 'lucide-react'
import { testimonials, type Testimonial } from '@/data/testimonials'

// ─── Data prep ────────────────────────────────────────────────────────────────
const avgRating = (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
const fiveStarCount = testimonials.filter((t) => t.rating === 5).length

const mid = Math.ceil(testimonials.length / 2)
const row1 = [...testimonials.slice(0, mid), ...testimonials.slice(0, mid)]   // doubled for loop
const row2 = [...testimonials.slice(mid),    ...testimonials.slice(mid)]       // doubled for loop

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${cls} ${i < rating ? 'text-gold fill-gold' : 'text-beige fill-beige'}`} />
      ))}
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'w-14 h-14 text-sm' : size === 'md' ? 'w-10 h-10 text-xs' : 'w-8 h-8 text-[10px]'
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br from-gold to-caramel flex items-center justify-center shrink-0 shadow-sm`}>
      <span className="font-[family-name:var(--font-dm-sans)] font-bold text-white leading-none">
        {initials}
      </span>
    </div>
  )
}

// ─── Marquee card ─────────────────────────────────────────────────────────────
function MarqueeCard({ t }: { t: Testimonial }) {
  return (
    <div className="mx-2.5 w-72 shrink-0 bg-white rounded-2xl border border-gold/12 p-5 shadow-sm shadow-gold/5 hover:shadow-md hover:shadow-gold/10 transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <Stars rating={t.rating} />
        <BadgeCheck className="w-4 h-4 text-gold shrink-0" />
      </div>
      <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-dark leading-relaxed line-clamp-3">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="flex items-center gap-2.5 mt-4 pt-4 border-t border-gold/8">
        <Avatar initials={t.avatar} size="sm" />
        <div className="min-w-0">
          <p className="font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-text-dark truncate">
            {t.name}
          </p>
          <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-text-mid truncate">
            {t.location}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-beige/60 to-cream overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-[family-name:var(--font-dm-sans)] text-sm text-gold tracking-[0.3em] uppercase">
            Témoignages
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark mt-2">
            Ce que disent nos <span className="text-gold-gradient">clientes</span>
          </h2>

          {/* Aggregate stats */}
          <motion.div
            className="inline-flex items-center gap-4 mt-5 bg-white border border-gold/20 rounded-full px-6 py-2.5 shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span className="font-[family-name:var(--font-playfair)] text-lg font-bold text-text-dark">
                {avgRating}
              </span>
              <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">/5</span>
            </div>
            <div className="w-px h-4 bg-gold/20" />
            <span className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid">
              <span className="font-semibold text-text-dark">{testimonials.length}</span> avis
            </span>
            <div className="w-px h-4 bg-gold/20" />
            <div className="flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5 text-gold" />
              <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
                <span className="font-semibold text-text-dark">{fiveStarCount}</span> × 5 étoiles
              </span>
            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* ── Marquee rows — full bleed ── */}
      <div className="space-y-3">

        {/* Row 1 → left */}
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <div className="animate-marquee">
            {row1.map((t, i) => (
              <MarqueeCard key={`r1-${t.id}-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Row 2 → right (reverse) */}
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <div className="animate-marquee-reverse">
            {row2.map((t, i) => (
              <MarqueeCard key={`r2-${t.id}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <motion.div
        className="text-center mt-12 px-4"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid">
          Rejoignez nos{' '}
          <span className="font-semibold text-text-dark">{testimonials.length}+ clientes satisfaites</span>
          {' '}à travers l&apos;Afrique de l&apos;Ouest
        </p>
      </motion.div>
    </section>
  )
}
