'use client'

import { useState, useCallback, useRef, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import {
  Globe2,
  MapPin,
  Truck,
  Users,
  ChevronRight,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useAdminPresenceStore } from '@/stores/admin-presence-store'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

type CountryInfo = ReturnType<typeof useAdminPresenceStore.getState>['presence']['countries'][number]

function buildGeographyStyle(isActive: boolean) {
  return {
    default: {
      fill: isActive ? '#D4AF6A' : '#F0E6D3',
      stroke: '#FFFFFF',
      strokeWidth: 0.5,
      outline: 'none',
      cursor: isActive ? 'pointer' : 'default',
    },
    hover: {
      fill: isActive ? '#E8C547' : '#F0E6D3',
      stroke: isActive ? '#C8956C' : '#FFFFFF',
      strokeWidth: isActive ? 1.5 : 0.5,
      outline: 'none',
      cursor: isActive ? 'pointer' : 'default',
    },
    pressed: {
      fill: isActive ? '#C8956C' : '#F0E6D3',
      outline: 'none',
    },
  }
}

const MapGeography = memo(function MapGeography({
  geo,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onSelectCountry,
}: {
  geo: { id: string; rsmKey: string; [key: string]: unknown }
  isActive: boolean
  onMouseEnter: (geo: { id: string }) => void
  onMouseLeave: () => void
  onMouseMove: (e: React.MouseEvent) => void
  onSelectCountry: (country: CountryInfo) => void
}) {
  const style = useMemo(() => buildGeographyStyle(isActive), [isActive])

  return (
    <Geography
      geography={geo}
      onMouseEnter={() => onMouseEnter(geo)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove as React.MouseEventHandler<SVGPathElement>}
      onClick={() => {
        const country = activeCountries.find((c) => c.id === geo.id)
        if (country) onSelectCountry(country)
      }}
      style={style}
      tabIndex={-1}
    />
  )
})

const STAT_ICON: Record<string, React.ElementType> = {
  globe: Globe2,
  truck: Truck,
  users: Users,
}

export default function PresenceSection() {
  const presence = useAdminPresenceStore((s) => s.presence)
  const [hoveredCountry, setHoveredCountry] = useState<CountryInfo | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const activeCountries = useMemo(() => presence.countries, [presence.countries])
  const activeIds = useMemo(() => new Set(activeCountries.map((c) => c.id)), [activeCountries])

  const handleGeographyMouseEnter = useCallback((geo: { id: string }) => {
    const country = activeCountries.find((c) => c.id === geo.id)
    if (country) setHoveredCountry(country)
  }, [activeCountries])

  const handleGeographyMouseLeave = useCallback(() => {
    setHoveredCountry(null)
    setTooltipPos(null)
  }, [])

  const moveRafRef = useRef<number | null>(null)
  const handleGeographyMouseMove = useCallback((e: React.MouseEvent) => {
    if (moveRafRef.current !== null) return
    moveRafRef.current = requestAnimationFrame(() => {
      setTooltipPos({ x: e.clientX, y: e.clientY })
      moveRafRef.current = null
    })
  }, [])

  if (!presence.enabled) return null

  return (
    <section className="py-16 sm:py-24 bg-cream overflow-hidden">
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
            {presence.headerKicker}
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mt-3 leading-tight">
            {presence.titlePrefix}{' '}
            <span className="text-gold-gradient">{presence.titleBrand}</span>{' '}
            {presence.titleSuffix}
          </h2>
          <p className="font-[family-name:var(--font-dm-sans)] text-text-mid mt-4 max-w-2xl mx-auto leading-relaxed">
            {presence.subtitle}
          </p>
        </motion.div>

        {/* ── Stats Bar ── */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {presence.stats.map((stat, index) => {
            const Icon = STAT_ICON[stat.iconKey] ?? Globe2
            return (
            <motion.div
              key={stat.label}
              className="glass-card p-4 sm:p-6 text-center warm-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Icon className="w-6 h-6 text-gold mx-auto mb-2" />
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
          )})}
        </motion.div>

        {/* ── Map + Country List ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Map */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-card p-2 sm:p-4 warm-shadow-lg">
              <ComposableMap
                projection="geoAzimuthalEqualArea"
                projectionConfig={{ rotate: [-10, -10, 0], center: [5, 5], scale: 420 }}
                style={{ width: '100%', height: 'auto' }}
              >
                <ZoomableGroup zoom={1} maxZoom={4} minZoom={0.8}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <MapGeography
                          key={geo.rsmKey}
                          geo={geo}
                          isActive={activeIds.has(geo.id)}
                          onMouseEnter={handleGeographyMouseEnter}
                          onMouseLeave={handleGeographyMouseLeave}
                          onMouseMove={handleGeographyMouseMove}
                          onSelectCountry={setSelectedCountry}
                        />
                      ))
                    }
                  </Geographies>

                  {activeCountries.map((country) => (
                    <Marker
                      key={country.id}
                      coordinates={country.coordinates}
                      onClick={() => setSelectedCountry(country)}
                    >
                      <g className="cursor-pointer">
                        <circle r={8} fill="rgba(212,175,106,0.2)" stroke="none">
                          <animate attributeName="r" from="4" to="12" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle r={4} fill={country.status === 'actif' ? '#D4AF6A' : '#C8956C'} stroke="#FFFFFF" strokeWidth={1.5} />
                        <circle r={1.5} fill="#FFFFFF" />
                      </g>
                    </Marker>
                  ))}
                </ZoomableGroup>
              </ComposableMap>

              <div className="flex items-center justify-center gap-6 mt-3 pb-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gold" />
                  <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">Pays actifs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-caramel" />
                  <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">En développement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-beige" />
                  <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">Prochainement</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Country List */}
          <motion.div
            className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-bold text-text-dark mb-4 sticky top-0 bg-cream py-2 z-10">
              Nos pays d&apos;opération
            </h3>
            {activeCountries.map((country, index) => (
              <motion.button
                key={country.id}
                className="w-full text-left glass-card p-3 warm-shadow hover:warm-shadow-lg transition-all duration-300 group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -2, scale: 1.01 }}
                onClick={() => setSelectedCountry(country)}
              >
                <div className="flex items-center gap-3">
                  {/* Drapeau réel */}
                  <div className="flex-shrink-0">
                    <Image
                      src={`https://flagcdn.com/w40/${country.flagCode}.png`}
                      alt={`Drapeau ${country.name}`}
                      width={32}
                      height={22}
                      className="rounded object-cover shadow-sm"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark truncate">
                        {country.name}
                      </p>
                      <ChevronRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin className="w-3 h-3 text-gold flex-shrink-0" />
                      <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid truncate">
                        {country.capital}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-[family-name:var(--font-dm-sans)] font-medium ${
                      country.status === 'actif'
                        ? 'bg-gold/15 text-gold'
                        : 'bg-caramel/15 text-caramel'
                    }`}
                  >
                    {country.status === 'actif' ? 'Actif' : 'En dev.'}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Hover Tooltip ── */}
      {hoveredCountry && tooltipPos && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltipPos.x + 16, top: tooltipPos.y - 16 }}
        >
          <div className="glass-card px-4 py-3 warm-shadow bg-white/90 flex items-center gap-3">
            <Image
              src={`https://flagcdn.com/w40/${hoveredCountry.flagCode}.png`}
              alt={hoveredCountry.name}
              width={28}
              height={19}
              className="rounded object-cover shadow-sm"
              unoptimized
            />
            <div>
              <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark">
                {hoveredCountry.name}
              </p>
              <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
                {hoveredCountry.capital} · {hoveredCountry.clients} clientes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Country Detail Modal ── */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-text-dark/40 backdrop-blur-sm"
              onClick={() => setSelectedCountry(null)}
            />
            <motion.div
              className="relative glass-card p-6 sm:p-8 warm-shadow-lg bg-white max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <button
                onClick={() => setSelectedCountry(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-beige/60 flex items-center justify-center hover:bg-beige transition-colors"
              >
                <X className="w-4 h-4 text-text-mid" />
              </button>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Image
                    src={`https://flagcdn.com/w160/${selectedCountry.flagCode}.png`}
                    alt={`Drapeau ${selectedCountry.name}`}
                    width={80}
                    height={54}
                    className="rounded-lg shadow-md object-cover"
                    unoptimized
                  />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-text-dark mt-2">
                  {selectedCountry.name}
                </h3>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-[family-name:var(--font-dm-sans)] font-medium ${
                    selectedCountry.status === 'actif'
                      ? 'bg-gold/15 text-gold'
                      : 'bg-caramel/15 text-caramel'
                  }`}
                >
                  {selectedCountry.status === 'actif' ? '✓ Actif' : '◜ En développement'}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-cream/60 rounded-xl">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">Capitale</p>
                    <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark">{selectedCountry.capital}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cream/60 rounded-xl">
                  <Users className="w-5 h-5 text-gold flex-shrink-0" />
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">Clientes</p>
                    <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark">{selectedCountry.clients} clientes satisfaites</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cream/60 rounded-xl">
                  <Truck className="w-5 h-5 text-gold flex-shrink-0" />
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">Présence depuis</p>
                    <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark">{selectedCountry.since}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="btn-gold px-6 py-2.5 font-[family-name:var(--font-dm-sans)] text-xs"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
