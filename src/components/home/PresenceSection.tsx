'use client'

import { useState, useCallback } from 'react'
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

// World TopoJSON URL
const geoUrl =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// ISO 3166-1 numeric codes for active countries
interface CountryInfo {
  id: string
  name: string
  capital: string
  flag: string
  coordinates: [number, number]
  since: string
  status: 'actif' | 'en développement'
  clients: string
}

const activeCountries: CountryInfo[] = [
  {
    id: '466',
    name: 'Mali',
    capital: 'Bamako',
    flag: '🇲🇱',
    coordinates: [-7.99, 12.65],
    since: '2019',
    status: 'actif',
    clients: '2000+',
  },
  {
    id: '686',
    name: 'Sénégal',
    capital: 'Dakar',
    flag: '🇸🇳',
    coordinates: [-17.45, 14.69],
    since: '2021',
    status: 'actif',
    clients: '800+',
  },
  {
    id: '384',
    name: "Côte d'Ivoire",
    capital: 'Abidjan',
    flag: '🇨🇮',
    coordinates: [-5.55, 5.35],
    since: '2022',
    status: 'actif',
    clients: '600+',
  },
  {
    id: '854',
    name: 'Burkina Faso',
    capital: 'Ouagadougou',
    flag: '🇧🇫',
    coordinates: [-1.53, 12.37],
    since: '2022',
    status: 'actif',
    clients: '400+',
  },
  {
    id: '324',
    name: 'Guinée',
    capital: 'Conakry',
    flag: '🇬🇳',
    coordinates: [-13.68, 9.95],
    since: '2023',
    status: 'actif',
    clients: '300+',
  },
  {
    id: '562',
    name: 'Niger',
    capital: 'Niamey',
    flag: '🇳🇪',
    coordinates: [2.11, 13.51],
    since: '2023',
    status: 'actif',
    clients: '250+',
  },
  {
    id: '204',
    name: 'Bénin',
    capital: 'Cotonou',
    flag: '🇧🇯',
    coordinates: [2.32, 6.49],
    since: '2024',
    status: 'en développement',
    clients: '100+',
  },
  {
    id: '768',
    name: 'Togo',
    capital: 'Lomé',
    flag: '🇹🇬',
    coordinates: [1.22, 6.13],
    since: '2024',
    status: 'en développement',
    clients: '100+',
  },
  {
    id: '288',
    name: 'Ghana',
    capital: 'Accra',
    flag: '🇬🇭',
    coordinates: [-0.19, 5.56],
    since: '2024',
    status: 'en développement',
    clients: '150+',
  },
  {
    id: '504',
    name: 'Maroc',
    capital: 'Casablanca',
    flag: '🇲🇦',
    coordinates: [-7.59, 33.57],
    since: '2023',
    status: 'actif',
    clients: '350+',
  },
  {
    id: '250',
    name: 'France',
    capital: 'Paris',
    flag: '🇫🇷',
    coordinates: [2.35, 48.86],
    since: '2024',
    status: 'en développement',
    clients: '50+',
  },
]

const activeIds = new Set(activeCountries.map((c) => c.id))

const stats = [
  { icon: Globe2, value: '11', label: 'Pays', description: 'présence internationale' },
  { icon: Truck, value: '5000+', label: 'Livraisons', description: 'dans la sous-région' },
  { icon: Users, value: '5000+', label: 'Clientes', description: 'satisfaites' },
]

export default function PresenceSection() {
  const [hoveredCountry, setHoveredCountry] = useState<CountryInfo | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  const handleGeographyMouseEnter = useCallback((geo: any) => {
    const country = activeCountries.find((c) => c.id === geo.id)
    if (country) {
      setHoveredCountry(country)
    }
  }, [])

  const handleGeographyMouseLeave = useCallback(() => {
    setHoveredCountry(null)
    setTooltipPos(null)
  }, [])

  const handleGeographyMouseMove = useCallback(
    (e: React.MouseEvent) => {
      setTooltipPos({ x: e.clientX, y: e.clientY })
    },
    []
  )

  const handleMarkerClick = useCallback((country: CountryInfo) => {
    setSelectedCountry(country)
  }, [])

  return (
    <section className="py-16 sm:py-24 bg-cream overflow-hidden">
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
            Notre Présence
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark mt-3 leading-tight">
            Là où{' '}
            <span className="text-gold-gradient">TONOMI</span>{' '}
            rayonne
          </h2>
          <p className="font-[family-name:var(--font-dm-sans)] text-text-mid mt-4 max-w-2xl mx-auto leading-relaxed">
            De Bamako au monde, nous apportons l&apos;élégance africaine aux femmes qui osent.
            Découvrez les pays où nos créations font briller chaque jour.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="glass-card p-4 sm:p-6 text-center warm-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
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
        </motion.div>

        {/* Main Content - Map + Country List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Interactive Map */}
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
                projectionConfig={{
                  rotate: [-10, -10, 0],
                  center: [5, 5],
                  scale: 420,
                }}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              >
                <ZoomableGroup zoom={1} maxZoom={4} minZoom={0.8}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const isActive = activeIds.has(geo.id)
                        const isHovered = hoveredCountry?.id === geo.id
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => handleGeographyMouseEnter(geo)}
                            onMouseLeave={handleGeographyMouseLeave}
                            onMouseMove={handleGeographyMouseMove as any}
                            onClick={() => {
                              const country = activeCountries.find((c) => c.id === geo.id)
                              if (country) setSelectedCountry(country)
                            }}
                            style={{
                              default: {
                                fill: isActive
                                  ? '#D4AF6A'
                                  : '#F0E6D3',
                                stroke: '#FFFFFF',
                                strokeWidth: 0.5,
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                cursor: isActive ? 'pointer' : 'default',
                              },
                              hover: {
                                fill: isActive
                                  ? '#E8C547'
                                  : '#F0E6D3',
                                stroke: isActive ? '#C8956C' : '#FFFFFF',
                                strokeWidth: isActive ? 1.5 : 0.5,
                                outline: 'none',
                                cursor: isActive ? 'pointer' : 'default',
                              },
                              pressed: {
                                fill: isActive ? '#C8956C' : '#F0E6D3',
                                outline: 'none',
                              },
                            }}
                          />
                        )
                      })
                    }
                  </Geographies>

                  {/* Markers for active countries */}
                  {activeCountries.map((country) => (
                    <Marker
                      key={country.id}
                      coordinates={country.coordinates}
                      onClick={() => handleMarkerClick(country)}
                    >
                      <g className="cursor-pointer">
                        {/* Pulse ring */}
                        <circle
                          r={8}
                          fill="rgba(212, 175, 106, 0.2)"
                          stroke="none"
                        >
                          <animate
                            attributeName="r"
                            from="4"
                            to="12"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.6"
                            to="0"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                        {/* Outer dot */}
                        <circle
                          r={4}
                          fill={country.status === 'actif' ? '#D4AF6A' : '#C8956C'}
                          stroke="#FFFFFF"
                          strokeWidth={1.5}
                          className="drop-shadow-sm"
                        />
                        {/* Inner dot */}
                        <circle
                          r={1.5}
                          fill="#FFFFFF"
                        />
                      </g>
                    </Marker>
                  ))}
                </ZoomableGroup>
              </ComposableMap>

              {/* Map Legend */}
              <div className="flex items-center justify-center gap-6 mt-3 pb-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gold" />
                  <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
                    Pays actifs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-caramel" />
                  <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
                    En développement
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-beige" />
                  <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
                    Prochainement
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Country List */}
          <motion.div
            className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar"
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
                className="w-full text-left glass-card p-4 warm-shadow hover:warm-shadow-lg transition-all duration-300 group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -2, scale: 1.01 }}
                onClick={() => setSelectedCountry(country)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark truncate">
                        {country.name}
                      </p>
                      <ChevronRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
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

        {/* Hover Tooltip */}
        {hoveredCountry && tooltipPos && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltipPos.x + 16,
              top: tooltipPos.y - 16,
            }}
          >
            <div className="glass-card px-4 py-3 warm-shadow bg-white/90">
              <div className="flex items-center gap-2">
                <span className="text-lg">{hoveredCountry.flag}</span>
                <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark">
                  {hoveredCountry.name}
                </p>
              </div>
              <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mt-1">
                {hoveredCountry.capital} · {hoveredCountry.clients} clientes
              </p>
            </div>
          </div>
        )}

        {/* Country Detail Modal */}
        <AnimatePresence>
          {selectedCountry && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-text-dark/40 backdrop-blur-sm"
                onClick={() => setSelectedCountry(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Modal */}
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
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4 text-text-mid" />
                </button>

                <div className="text-center">
                  <span className="text-5xl">{selectedCountry.flag}</span>
                  <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-text-dark mt-4">
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
                      <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
                        Capitale
                      </p>
                      <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark">
                        {selectedCountry.capital}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-cream/60 rounded-xl">
                    <Users className="w-5 h-5 text-gold flex-shrink-0" />
                    <div>
                      <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
                        Clientes
                      </p>
                      <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark">
                        {selectedCountry.clients} clientes satisfaites
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-cream/60 rounded-xl">
                    <Truck className="w-5 h-5 text-gold flex-shrink-0" />
                    <div>
                      <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
                        Présence depuis
                      </p>
                      <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark">
                        {selectedCountry.since}
                      </p>
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
      </div>
    </section>
  )
}
