'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Gem,
  ShieldCheck,
  Users,
  Leaf,
  Sparkles,
  Award,
  Globe,
  Heart,
  ArrowRight,
} from 'lucide-react'
import { ProductImage } from '@/components/ui/product-image'
import { getProductImagePaths } from '@/data/product-image-map'

const ABOUT_HEADER_IMAGE = getProductImagePaths('prod-001', 'bijoux', 1)[0]
const HISTOIRE_IMAGE = getProductImagePaths('prod-009', 'sacs', 1)[0]

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const startTime = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, target])

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString('fr-FR')}{suffix}
    </span>
  )
}

// ─── Timeline Data ────────────────────────────────────────────────────────────
const milestones = [
  {
    year: '2020',
    title: 'Fondation',
    description:
      'TONOMI naît de la passion de créer des accessoires de mode qui célèbrent l\'élégance africaine. Une aventure commence à Bamako, au cœur du Mali.',
  },
  {
    year: '2021',
    title: 'Première Collection',
    description:
      'Lancement de notre première collection de bijoux et foulards, inspirée des motifs bogolan et du savoir-faire artisanal malien.',
  },
  {
    year: '2022',
    title: 'Expansion',
    description:
      'Ouverture de notre boutique en ligne et expansion vers le Sénégal, la Guinée et la Côte d\'Ivoire. TONOMI dépasse les frontières maliennes.',
  },
  {
    year: '2023',
    title: 'Reconnaissance',
    description:
      'TONOMI est sélectionnée parmi les marques émergentes les plus prometteuses d\'Afrique de l\'Ouest. Plus de 200 références au catalogue.',
  },
  {
    year: '2024',
    title: 'Aujourd\'hui',
    description:
      'Plus de 500 clientes satisfaites à travers 5 pays. TONOMI continue de croître tout en restant fidèle à ses valeurs d\'artisanat et d\'élégance.',
  },
]

// ─── Values Data ──────────────────────────────────────────────────────────────
const values = [
  {
    Icon: Gem,
    title: 'Élégance',
    description:
      'Chaque pièce est conçue pour sublimer la beauté naturelle de la femme africaine avec raffinement et sophistication.',
    keyword: 'Raffinement',
  },
  {
    Icon: ShieldCheck,
    title: 'Qualité',
    description:
      'Nous sélectionnons les meilleurs matériaux et collaborons avec des artisans d\'exception pour garantir une qualité irréprochable.',
    keyword: 'Excellence',
  },
  {
    Icon: Users,
    title: 'Proximité',
    description:
      'Un service client attentif et personnalisé. Chaque cliente est unique et mérite une attention particulière.',
    keyword: 'Attention',
  },
  {
    Icon: Leaf,
    title: 'Durabilité',
    description:
      'Nous privilégions les matériaux durables et les pratiques éco-responsables pour un mode plus conscient.',
    keyword: 'Responsabilité',
  },
]

// ─── Team Data ────────────────────────────────────────────────────────────────
const team = [
  {
    name: 'Aminata Traoré',
    role: 'Fondatrice & Directrice Créative',
    initials: 'AT',
    color: 'bg-gold',
    bio: 'Passionnée de mode et de culture africaine, Aminata a fondé TONOMI pour réinventer l\'accessoire de mode malien avec une touche contemporaine.',
  },
  {
    name: 'Fatoumata Diallo',
    role: 'Responsable Production',
    initials: 'FD',
    color: 'bg-caramel',
    bio: 'Fatoumata veille à la qualité de chaque pièce. Son œil expert et son lien étroit avec nos artisans garantissent l\'excellence de nos produits.',
  },
  {
    name: 'Mariam Keïta',
    role: 'Directrice Marketing',
    initials: 'MK',
    color: 'bg-copper',
    bio: 'Mariam raconte l\'histoire de TONOMI à travers nos campagnes et nos réseaux sociaux. Elle fait rayonner la marque au-delà des frontières.',
  },
  {
    name: 'Kadiatou Coulibaly',
    role: 'Service Client',
    initials: 'KC',
    color: 'bg-blush',
    bio: 'Kadiatou est la voix chaleureuse de TONOMI. Elle s\'assure que chaque cliente vive une expérience d\'achat exceptionnelle et personnalisée.',
  },
]

// ─── Stats Data ───────────────────────────────────────────────────────────────
const stats = [
  { value: 2020, suffix: '', label: 'Fondée en' },
  { value: 200, suffix: '+', label: 'Références' },
  { value: 500, suffix: '+', label: 'Clientes' },
  { value: 5, suffix: '', label: 'Pays' },
]

// ─── Timeline Item ────────────────────────────────────────────────────────────
// TimelineItem supprimé — remplacé par rendu inline dans la section

// ─── Main About Page ──────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative pt-36 pb-12 sm:pt-44 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <ProductImage
            src={ABOUT_HEADER_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/75" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/15 text-gold border border-white/20 backdrop-blur-sm px-5 py-2 rounded-full mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold tracking-wide uppercase">
                Qui sommes-nous
              </span>
            </motion.div>

            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Notre <span className="text-gold-gradient">Histoire</span>
            </h1>

            <motion.p
              className="mt-4 font-[family-name:var(--font-dm-sans)] text-lg sm:text-xl text-gold font-semibold tracking-[0.15em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Élégance • Artisanat • Tradition Malienne
            </motion.p>

            <motion.p
              className="mt-4 font-[family-name:var(--font-dm-sans)] text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              TONOMI Accessoires est née de la conviction que l&apos;élégance africaine
              mérite d&apos;être célébrée — une fusion de tradition malienne et de modernité.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Notre Histoire Section ── */}
      <section className="py-16 sm:py-24 bg-cream overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Photo — gauche */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Cercle décoratif derrière */}
              <div className="absolute -top-6 -left-6 w-48 h-48 rounded-full bg-gold/8 -z-10" />
              <div className="absolute -bottom-8 -right-4 w-32 h-32 rounded-full bg-caramel/10 -z-10" />

              {/* Image principale */}
              <div className="relative rounded-3xl overflow-hidden warm-shadow-lg aspect-[3/4]">
                <ProductImage
                  src={HISTOIRE_IMAGE}
                  alt="Artisanat TONOMI"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                {/* Overlay dégradé bas */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Badge flottant */}
                <motion.div
                  className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-4"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <p className="font-[family-name:var(--font-cormorant)] text-base italic text-text-dark leading-snug">
                    &ldquo;Chaque pièce raconte une histoire, celle des artisans du Mali.&rdquo;
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-xs text-gold font-semibold mt-1.5 uppercase tracking-wider">
                    TONOMI — Fondée en 2019
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Texte + stats — droite */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="font-[family-name:var(--font-dm-sans)] text-sm tracking-[0.3em] uppercase text-gold font-semibold">
                Notre Histoire
              </span>

              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mt-3 leading-tight">
                L&apos;art de sublimer<br />
                <span className="text-gold-gradient">la femme africaine</span>
              </h2>

              <div className="flex items-center gap-3 mt-5 mb-7">
                <div className="h-px w-12 bg-gradient-to-r from-gold to-gold/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                <div className="h-px w-8 bg-gradient-to-r from-gold/30 to-transparent" />
              </div>

              <div className="space-y-5 mb-10">
                <p className="font-[family-name:var(--font-dm-sans)] text-base text-text-mid leading-relaxed">
                  Chez TONOMI, chaque accessoire raconte une histoire — celle du savoir-faire artisanal malien,
                  transmis de génération en génération. Nos créations puisent leur inspiration dans la richesse
                  culturelle du Mali, du bogolan aux perles traditionnelles.
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] text-base text-text-mid leading-relaxed">
                  Nous croyons que l&apos;élégance n&apos;a pas de frontières. C&apos;est pourquoi nous sélectionnons
                  avec soin les meilleurs matériaux et collaborons avec des artisans passionnés pour vous offrir
                  des pièces d&apos;exception, à la fois authentiques et contemporaines.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 200, suffix: '+', label: 'Références', sub: 'accessoires uniques' },
                  { value: 48,  suffix: 'h', label: 'Livraison',  sub: 'partout au Mali' },
                  { value: 100, suffix: '%', label: 'Satisfaction', sub: 'garantie' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  >
                    <p className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-gold">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark mt-1">
                      {stat.label}
                    </p>
                    <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mt-0.5">
                      {stat.sub}
                    </p>
                    {i < 2 && (
                      <div className="hidden sm:block absolute top-1/2 right-0 w-px h-8 bg-gold/15 -translate-y-1/2" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Timeline Section ── */}
      <section className="py-16 sm:py-24 bg-cream overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-[family-name:var(--font-dm-sans)] text-sm tracking-[0.3em] uppercase text-gold font-semibold">
              Notre Parcours
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark mt-3">
              Les Étapes <span className="text-gold-gradient">Clés</span>
            </h2>
          </motion.div>

          {/* ── Desktop : horizontal timeline ── */}
          <div className="hidden lg:block">
            {/* Connecting line */}
            <div className="relative flex items-start justify-between px-4">
              {/* Background line */}
              <div className="absolute top-5 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

              {milestones.map((m, i) => {
                const isEven = i % 2 === 0
                return (
                  <motion.div
                    key={m.year}
                    className="flex flex-col items-center w-1/5 px-2"
                    initial={{ opacity: 0, y: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.12 }}
                  >
                    {/* Card above or below the node */}
                    {!isEven && (
                      <div className="mb-6 w-full bg-white rounded-2xl border border-gold/15 p-5 warm-shadow group hover:border-gold/35 transition-colors">
                        <h3 className="font-[family-name:var(--font-playfair)] text-base font-bold text-text-dark group-hover:text-gold transition-colors">
                          {m.title}
                        </h3>
                        <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mt-2 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    )}

                    {/* Node */}
                    <div className="flex flex-col items-center z-10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-caramel flex items-center justify-center shadow-lg shadow-gold/25 shrink-0">
                        <span className="font-[family-name:var(--font-dm-sans)] text-xs font-bold text-white">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gold mt-3">
                        {m.year}
                      </span>
                    </div>

                    {isEven && (
                      <div className="mt-6 w-full bg-white rounded-2xl border border-gold/15 p-5 warm-shadow group hover:border-gold/35 transition-colors">
                        <h3 className="font-[family-name:var(--font-playfair)] text-base font-bold text-text-dark group-hover:text-gold transition-colors">
                          {m.title}
                        </h3>
                        <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mt-2 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* ── Mobile / Tablet : vertical ── */}
          <div className="lg:hidden relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-gold/60 via-gold/30 to-transparent" />

            <div className="space-y-0">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  className="flex gap-6 pb-10 relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  {/* Node */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-caramel flex items-center justify-center shadow-md shadow-gold/20 z-10">
                      <span className="font-[family-name:var(--font-dm-sans)] text-xs font-bold text-white">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-2xl border border-gold/15 p-5 warm-shadow">
                    <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gold">
                      {m.year}
                    </span>
                    <h3 className="font-[family-name:var(--font-playfair)] text-base font-bold text-text-dark mt-1">
                      {m.title}
                    </h3>
                    <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-2 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Nos Valeurs Section ── */}
      <section className="py-16 sm:py-24 bg-warm-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-[family-name:var(--font-dm-sans)] text-sm tracking-[0.3em] uppercase text-gold font-semibold">
              Ce qui nous anime
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark mt-3">
              Nos <span className="text-gold-gradient">Valeurs</span>
            </h2>
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Card 1 — Élégance — large, col-span-2 on lg */}
            <motion.div
              className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0f02] to-[#0f0800] p-8 sm:p-10 min-h-[280px] flex flex-col justify-between group cursor-default"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
            >
              {/* Decorative big icon */}
              <Gem className="absolute -bottom-6 -right-6 w-40 h-40 text-gold/6 rotate-12" />
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gold/4 blur-3xl" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/20 flex items-center justify-center mb-6">
                  <Gem className="w-6 h-6 text-gold" />
                </div>
                <span className="font-[family-name:var(--font-dm-sans)] text-[10px] text-gold/60 uppercase tracking-[0.25em]">01</span>
                <h3 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-white mt-1 leading-tight">
                  Élégance
                </h3>
              </div>
              <p className="relative z-10 font-[family-name:var(--font-dm-sans)] text-sm text-white/55 leading-relaxed max-w-md group-hover:text-white/75 transition-colors duration-300 mt-4">
                Chaque pièce est conçue pour sublimer la beauté naturelle de la femme africaine avec raffinement et sophistication.
              </p>
            </motion.div>

            {/* Card 2 — Qualité */}
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold/12 via-gold/6 to-transparent border border-gold/15 p-8 min-h-[280px] flex flex-col justify-between group cursor-default"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 text-gold/8 rotate-6" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/20 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-gold" />
                </div>
                <span className="font-[family-name:var(--font-dm-sans)] text-[10px] text-gold/50 uppercase tracking-[0.25em]">02</span>
                <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-text-dark mt-1 leading-tight">
                  Qualité
                </h3>
              </div>
              <p className="relative z-10 font-[family-name:var(--font-dm-sans)] text-sm text-text-mid leading-relaxed group-hover:text-text-dark transition-colors duration-300 mt-4">
                Matériaux d&apos;exception et artisans passionnés pour une qualité irréprochable.
              </p>
            </motion.div>

            {/* Card 3 — Proximité */}
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-caramel/10 via-caramel/5 to-transparent border border-caramel/15 p-8 min-h-[240px] flex flex-col justify-between group cursor-default"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              whileHover={{ scale: 1.01 }}
            >
              <Users className="absolute -bottom-4 -right-4 w-28 h-28 text-caramel/10 rotate-6" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-caramel/15 border border-caramel/20 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-caramel" />
                </div>
                <span className="font-[family-name:var(--font-dm-sans)] text-[10px] text-caramel/50 uppercase tracking-[0.25em]">03</span>
                <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-text-dark mt-1 leading-tight">
                  Proximité
                </h3>
              </div>
              <p className="relative z-10 font-[family-name:var(--font-dm-sans)] text-sm text-text-mid leading-relaxed group-hover:text-text-dark transition-colors duration-300 mt-4">
                Service client attentif et personnalisé — chaque cliente est unique.
              </p>
            </motion.div>

            {/* Card 4 — Durabilité — large, col-span-2 on lg */}
            <motion.div
              className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-beige to-cream border border-gold/10 p-8 sm:p-10 min-h-[240px] flex flex-col justify-between group cursor-default"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.01 }}
            >
              <Leaf className="absolute -bottom-4 -right-6 w-36 h-36 text-gold/8 rotate-12" />
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-gold/4 blur-3xl -translate-x-1/2 -translate-y-1/2" />

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gold/12 border border-gold/15 flex items-center justify-center mb-6">
                    <Leaf className="w-6 h-6 text-gold" />
                  </div>
                  <span className="font-[family-name:var(--font-dm-sans)] text-[10px] text-gold/50 uppercase tracking-[0.25em]">04</span>
                  <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-text-dark mt-1 leading-tight">
                    Durabilité
                  </h3>
                </div>
                <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid leading-relaxed max-w-sm group-hover:text-text-dark transition-colors duration-300 sm:pt-16">
                  Matériaux durables et pratiques éco-responsables pour une mode plus consciente et respectueuse.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Notre Équipe Section ── */}
      <section className="py-16 sm:py-20 bg-warm-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-[family-name:var(--font-dm-sans)] text-sm tracking-[0.3em] uppercase text-gold font-semibold">
              Les visages de TONOMI
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark mt-3">
              Notre Équipe
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="glass-card p-6 text-center warm-shadow cursor-default"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{
                  rotate: [0, -1, 1, 0],
                  boxShadow: '0 12px 35px rgba(212, 175, 106, 0.25)',
                }}
              >
                <div
                  className={`w-20 h-20 mx-auto rounded-full ${member.color} flex items-center justify-center mb-4 shadow-md`}
                >
                  <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white">
                    {member.initials}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-text-dark">
                  {member.name}
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-xs text-gold font-medium mt-1 tracking-wide uppercase">
                  {member.role}
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-3 leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chiffres Clés Section ── */}
      <section className="py-16 sm:py-20 bg-beige/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-[family-name:var(--font-dm-sans)] text-sm tracking-[0.3em] uppercase text-gold font-semibold">
              En chiffres
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark mt-3">
              Chiffres Clés
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center glass-card p-6 warm-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-gold">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-2 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
