'use client'

import { useState, useEffect } from 'react'
import { X, Truck, Tag, Globe, RefreshCw, Gem } from 'lucide-react'
import { useNavStore } from '@/stores/nav-store'

const ITEMS = [
  { icon: Truck,    text: 'Livraison gratuite dès 30 000 FCFA · Bamako & inter-pays', action: null },
  { icon: Tag,      text: 'Code BIENVENUE10 · −10% sur votre 1ère commande',          action: 'promotions' as const },
  { icon: Globe,    text: 'Livraison partout en Afrique de l\'Ouest',                  action: null },
  { icon: RefreshCw,text: 'Retours gratuits · 14 jours · Satisfaite ou remboursée',   action: null },
  { icon: Gem,      text: 'Artisanat malien authentique · 200+ références uniques',    action: null },
]

const STORAGE_KEY = 'tonomi-bar-v4'

export default function AnnouncementBar() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const { navigate } = useNavStore()

  useEffect(() => {
    setMounted(true)
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  if (!mounted || !visible) return null

  // Duplicate items so the marquee loops seamlessly
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="relative overflow-hidden bg-stone-900 border-b border-white/[0.06]">
      {/* Subtle gold shimmer line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF6A]/60 to-transparent" />

      <div className="flex items-center">
        {/* Marquee track */}
        <div className="flex-1 overflow-hidden py-2.5">
          <div className="animate-marquee whitespace-nowrap">
            {doubled.map((item, i) => {
              const Icon = item.icon
              const content = (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 mx-8 font-[family-name:var(--font-dm-sans)] text-[11px] sm:text-xs text-white/75 tracking-wide"
                >
                  <Icon size={12} className="text-[#D4AF6A] shrink-0" />
                  {item.text}
                  <span className="text-[#D4AF6A]/40 mx-2">·</span>
                </span>
              )

              return item.action ? (
                <button
                  key={i}
                  onClick={() => navigate(item.action!)}
                  className="hover:text-[#D4AF6A] transition-colors cursor-pointer"
                >
                  {content}
                </button>
              ) : content
            })}
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="shrink-0 px-3 text-white/30 hover:text-white/70 transition-colors"
          aria-label="Fermer"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}
