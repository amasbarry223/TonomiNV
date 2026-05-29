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
} from 'lucide-react'

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
    icon: <Gem className="w-7 h-7 text-gold" />,
    title: 'Élégance',
    description:
      'Chaque pièce est conçue pour sublimer la beauté naturelle de la femme africaine avec raffinement et sophistication.',
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-gold" />,
    title: 'Qualité',
    description:
      'Nous sélectionnons les meilleurs matériaux et collaborons avec des artisans d\'exception pour garantir une qualité irréprochable.',
  },
  {
    icon: <Users className="w-7 h-7 text-gold" />,
    title: 'Proximité',
    description:
      'Un service client attentif et personnalisé. Chaque cliente est unique et mérite une attention particulière.',
  },
  {
    icon: <Leaf className="w-7 h-7 text-gold" />,
    title: 'Durabilité',
    description:
      'Nous privilégions les matériaux durables et les pratiques éco-responsables pour un mode plus conscient.',
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
function TimelineItem({
  milestone,
  index,
}: {
  milestone: (typeof milestones)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const isLeft = index % 2 === 0

  return (
    <div ref={ref} className="relative flex items-center">
      {/* Desktop layout */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] w-full items-center gap-6">
        {/* Left content */}
        <motion.div
          className={isLeft ? 'text-right' : ''}
          initial={{ opacity: 0, x: isLeft ? -40 : 0 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {isLeft && (
            <div className="glass-card p-5 warm-shadow inline-block text-left">
              <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-gold">
                {milestone.year}
              </span>
              <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-text-dark mt-1">
                {milestone.title}
              </h3>
              <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-2 leading-relaxed">
                {milestone.description}
              </p>
            </div>
          )}
        </motion.div>

        {/* Center dot */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="w-5 h-5 rounded-full bg-gold border-4 border-cream z-10" />
        </motion.div>

        {/* Right content */}
        <motion.div
          className={!isLeft ? 'text-left' : ''}
          initial={{ opacity: 0, x: !isLeft ? 40 : 0 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {!isLeft && (
            <div className="glass-card p-5 warm-shadow inline-block text-left">
              <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-gold">
                {milestone.year}
              </span>
              <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-text-dark mt-1">
                {milestone.title}
              </h3>
              <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-2 leading-relaxed">
                {milestone.description}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex gap-4 items-start">
        <div className="flex flex-col items-center shrink-0">
          <motion.div
            className="w-4 h-4 rounded-full bg-gold border-3 border-cream z-10"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.4 }}
          />
          {index < milestones.length - 1 && (
            <div className="w-0.5 bg-gradient-to-b from-gold to-gold/20 flex-1 min-h-[40px]" />
          )}
        </div>
        <motion.div
          className="glass-card p-4 warm-shadow mb-6"
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-gold">
            {milestone.year}
          </span>
          <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-text-dark mt-1">
            {milestone.title}
          </h3>
          <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-2 leading-relaxed">
            {milestone.description}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Main About Page ──────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/95 to-cream/80" />
          <div className="absolute inset-0 particles-bg" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="font-[family-name:var(--font-dm-sans)] text-sm tracking-[0.3em] uppercase text-gold font-semibold">
                Qui sommes-nous
              </span>
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold text-text-dark leading-tight mt-4">
                Notre{' '}
                <span className="text-gold-gradient">Histoire</span>
              </h1>
              <p className="font-[family-name:var(--font-dm-sans)] text-base sm:text-lg text-text-mid mt-6 leading-relaxed max-w-lg">
                TONOMI Accessoires est née de la conviction que l&apos;élégance africaine
                mérite d&apos;être célébrée. Nous créons des accessoires de mode qui
                allient tradition malienne et modernité, pour sublimer la femme
                d&apos;aujourd&apos;hui.
              </p>
              <p className="font-[family-name:var(--font-dm-sans)] text-base text-text-mid mt-4 leading-relaxed max-w-lg">
                Chaque pièce raconte une histoire — celle des artisans du Mali, des
                motifs bogolan, des nuits étoilées du Sahel. TONOMI, c&apos;est
                l&apos;accessoire qui vous ressemble.
              </p>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-beige via-gold/10 to-caramel/10 warm-shadow-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-gold/30 mx-auto mb-4" />
                    <p className="font-[family-name:var(--font-cormorant)] text-xl text-text-mid/50 italic">
                      L&apos;élégance africaine réinventée
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold/10 rounded-full" />
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-caramel/10 rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Timeline Section ── */}
      <section className="py-16 sm:py-20 bg-warm-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-[family-name:var(--font-dm-sans)] text-sm tracking-[0.3em] uppercase text-gold font-semibold">
              Notre Parcours
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark mt-3">
              Les Étapes Clés
            </h2>
          </motion.div>

          {/* Gold vertical line (desktop) */}
          <div className="hidden md:block relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gold/50 to-gold/10 -translate-x-1/2" />
            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <TimelineItem key={milestone.year} milestone={milestone} index={i} />
              ))}
            </div>
          </div>

          {/* Mobile timeline */}
          <div className="md:hidden">
            {milestones.map((milestone, i) => (
              <TimelineItem key={milestone.year} milestone={milestone} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Nos Valeurs Section ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-[family-name:var(--font-dm-sans)] text-sm tracking-[0.3em] uppercase text-gold font-semibold">
              Ce qui nous anime
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark mt-3">
              Nos Valeurs
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                className="glass-card p-6 text-center warm-shadow cursor-default group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                whileHover={{ scale: 1.03, boxShadow: '0 12px 35px rgba(212, 175, 106, 0.25)' }}
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  {value.icon}
                </div>
                <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-text-dark">
                  {value.title}
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-3 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
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
