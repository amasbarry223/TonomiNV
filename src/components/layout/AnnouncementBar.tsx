'use client'

import { useMemo, useState } from 'react'
import { X, Truck, Tag, Globe, RefreshCw, Gem } from 'lucide-react'
import { useNavStore } from '@/stores/nav-store'
import { useHydrated } from '@/lib/use-hydrated'
import { useAdminAnnouncementStore } from '@/stores/admin-announcement-store'

const ICONS: Record<string, React.ElementType> = {
  truck: Truck,
  tag: Tag,
  globe: Globe,
  refresh: RefreshCw,
  gem: Gem,
}

export default function AnnouncementBar() {
  const hydrated = useHydrated()
  const [dismissed, setDismissed] = useState(false)
  const { navigate } = useNavStore()
  const banner = useAdminAnnouncementStore((s) => s.banner)

  const visible = useMemo(() => {
    if (!hydrated) return false
    if (!banner.enabled) return false
    if (dismissed) return false
    return banner.dismissible ? !localStorage.getItem(banner.storageKey) : true
  }, [hydrated, dismissed, banner.enabled, banner.dismissible, banner.storageKey])

  const dismiss = () => {
    localStorage.setItem(banner.storageKey, '1')
    setDismissed(true)
  }

  if (!visible) return null

  // Duplicate items so the marquee loops seamlessly
  const items = banner.items.filter((it) => it.isActive && it.text.trim())
  if (items.length === 0) return null
  const doubled = [...items, ...items]

  return (
    <div className="relative overflow-hidden bg-stone-900 border-b border-white/[0.06]">
      {/* Subtle gold shimmer line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF6A]/60 to-transparent" />

      <div className="flex items-center">
        {/* Marquee track */}
        <div className="flex-1 overflow-hidden py-2.5">
          <div className="animate-marquee whitespace-nowrap">
            {doubled.map((item, i) => {
              const Icon = ICONS[item.iconKey] ?? Truck
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

              return item.action && item.action !== 'none' ? (
                <button
                  key={i}
                  onClick={() => navigate(item.action as any)}
                  className="hover:text-[#D4AF6A] transition-colors cursor-pointer"
                >
                  {content}
                </button>
              ) : content
            })}
          </div>
        </div>

        {/* Dismiss */}
        {banner.dismissible && (
          <button
            onClick={dismiss}
            className="shrink-0 px-3 text-white/30 hover:text-white/70 transition-colors"
            aria-label="Fermer"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
