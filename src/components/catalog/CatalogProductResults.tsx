'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { products } from '@/data/products'
import { useFilterStore } from '@/stores/filter-store'
import ProductGrid from './ProductGrid'
import type { Product } from '@/data/products'

interface CatalogProductResultsProps {
  onQuickView: (product: Product) => void
}

export default function CatalogProductResults({ onQuickView }: CatalogProductResultsProps) {
  const category = useFilterStore((s) => s.category)
  const priceRange = useFilterStore((s) => s.priceRange)
  const colors = useFilterStore((s) => s.colors)
  const sizes = useFilterStore((s) => s.sizes)
  const sort = useFilterStore((s) => s.sort)
  const searchQuery = useFilterStore((s) => s.searchQuery)

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (category) {
      result = result.filter((p) => p.category === category)
    }

    result = result.filter((p) => {
      const price = p.pricePromo ?? p.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    if (colors.length > 0) {
      result = result.filter((p) => p.colors.some((c) => colors.includes(c)))
    }

    if (sizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s) => sizes.includes(s)))
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      )
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => (a.pricePromo ?? a.price) - (b.pricePromo ?? b.price))
        break
      case 'price-desc':
        result.sort((a, b) => (b.pricePromo ?? b.price) - (a.pricePromo ?? a.price))
        break
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'bestseller':
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0))
        break
      default:
        result.sort(
          (a, b) =>
            (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.rating - a.rating
        )
    }

    return result
  }, [category, priceRange, colors, sizes, sort, searchQuery])

  return (
    <motion.div
      className="flex-1 min-w-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <ProductGrid products={filteredProducts} onQuickView={onQuickView} />
    </motion.div>
  )
}
