'use client'

import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useFilterStore, AVAILABLE_COLORS, AVAILABLE_SIZES } from '@/stores/filter-store'
import type { Category } from '@/data/categories'
import { formatPrice, COLOR_SWATCH_MAP } from '@/lib/product-display'

interface FilterSidebarProps {
  categories?: Category[]
}

export default function FilterSidebar({ categories = [] }: FilterSidebarProps) {
  const {
    category,
    priceRange,
    colors,
    sizes,
    setCategory,
    setPriceRange,
    toggleColor,
    toggleSize,
    resetFilters,
    hasActiveFilters,
  } = useFilterStore()

  const active = hasActiveFilters()

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-text-dark">
          Filtres
        </h3>
        <motion.button
          onClick={resetFilters}
          className={`flex items-center gap-1.5 font-[family-name:var(--font-dm-sans)] text-xs transition-colors ${
            active ? 'text-caramel hover:text-gold' : 'text-text-mid/40'
          }`}
          whileTap={active ? { scale: 0.95 } : {}}
          animate={!active ? { x: [0, -2, 2, -2, 2, 0] } : {}}
          transition={{ duration: 0.4 }}
          disabled={!active}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Réinitialiser
        </motion.button>
      </div>

      <Separator className="bg-gold/20" />

      {/* Category Filter */}
      <div>
        <h4 className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark mb-3">
          Catégorie
        </h4>
        <div className="space-y-2">
          <button
            onClick={() => setCategory('')}
            className={`w-full text-left px-3 py-2 rounded-xl font-[family-name:var(--font-dm-sans)] text-sm transition-all ${
              category === ''
                ? 'bg-gold/15 text-gold font-medium'
                : 'text-text-mid hover:bg-beige/50'
            }`}
          >
            Toutes les catégories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setCategory(cat.slug === category ? '' : cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-xl font-[family-name:var(--font-dm-sans)] text-sm transition-all flex items-center justify-between ${
                category === cat.slug
                  ? 'bg-gold/15 text-gold font-medium'
                  : 'text-text-mid hover:bg-beige/50'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs opacity-60">({cat.productCount})</span>
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-gold/20" />

      {/* Price Range */}
      <div>
        <h4 className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark mb-3">
          Prix
        </h4>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          min={0}
          max={100000}
          step={1000}
          className="mt-2"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
            {formatPrice(priceRange[0])}
          </span>
          <span className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
            {formatPrice(priceRange[1])}
          </span>
        </div>
      </div>

      <Separator className="bg-gold/20" />

      {/* Color Filter */}
      <div>
        <h4 className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark mb-3">
          Couleur
        </h4>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_COLORS.map((color) => {
            const isSelected = colors.includes(color.value)
            const swatchColor = COLOR_SWATCH_MAP[color.value] || '#999'
            return (
              <motion.button
                key={color.value}
                onClick={() => toggleColor(color.value)}
                className="relative group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={color.label}
                aria-label={`Filtrer par couleur ${color.label}`}
                aria-pressed={isSelected}
              >
                <div
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    isSelected
                      ? 'border-gold ring-2 ring-gold/30'
                      : 'border-gold/20 hover:border-gold/50'
                  }`}
                  style={{
                    background: swatchColor,
                  }}
                />
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={color.value === 'blanc' ? '#2C1810' : '#FFFFFF'}
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      <Separator className="bg-gold/20" />

      {/* Size Filter */}
      <div>
        <h4 className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark mb-3">
          Taille
        </h4>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = sizes.includes(size.value)
            return (
              <motion.button
                key={size.value}
                onClick={() => toggleSize(size.value)}
                className={`min-w-[44px] h-10 px-3 rounded-xl font-[family-name:var(--font-dm-sans)] text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-gold text-white shadow-md'
                    : 'bg-beige/50 text-text-mid hover:bg-gold/10 hover:text-gold'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-pressed={isSelected}
              >
                {size.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Reset Button at Bottom */}
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={resetFilters}
            variant="outline"
            className="w-full border-gold/30 text-gold hover:bg-gold/10 font-[family-name:var(--font-dm-sans)]"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser les filtres
          </Button>
        </motion.div>
      )}
    </div>
  )
}
