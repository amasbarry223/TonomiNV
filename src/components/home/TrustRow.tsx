'use client'

import { motion } from 'framer-motion'
import { Truck, RefreshCw, Gem, Shield } from 'lucide-react'

const PILLARS = [
  {
    icon: Truck,
    title: 'Livraison rapide',
    desc: '48h à Bamako · Inter-pays',
    color: 'text-amber-400',
    glow: 'rgba(212,175,106,0.35)',
  },
  {
    icon: RefreshCw,
    title: 'Retours faciles',
    desc: '14 jours · Satisfaite ou remboursée',
    color: 'text-emerald-400',
    glow: 'rgba(52,211,153,0.25)',
  },
  {
    icon: Gem,
    title: '100% Artisanal',
    desc: 'Savoir-faire malien authentique',
    color: 'text-amber-300',
    glow: 'rgba(212,175,106,0.35)',
  },
  {
    icon: Shield,
    title: 'Paiement sécurisé',
    desc: 'Orange Money · Wave · Mobi',
    color: 'text-sky-400',
    glow: 'rgba(56,189,248,0.25)',
  },
]

export default function TrustRow() {
  return (
    <section className="bg-stone-900 border-b border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group flex items-center gap-3 glass-dark rounded-2xl px-4 py-3.5 cursor-default transition-all duration-200 hover:border-white/20"
              style={{ '--glow': p.glow } as React.CSSProperties}
            >
              {/* Icon container */}
              <div
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                <p.icon size={17} className={p.color} />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-white/90 leading-tight truncate">
                  {p.title}
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-white/45 mt-0.5 leading-tight">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
