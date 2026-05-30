'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useFilterStore } from '@/stores/filter-store'

export default function CatalogSearchBar() {
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery)
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery)
  const [searchFocused, setSearchFocused] = useState(false)

  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery)
    setLocalQuery(searchQuery)
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (localQuery !== searchQuery) {
        setSearchQuery(localQuery)
      }
    }, 300)
    return () => window.clearTimeout(timer)
  }, [localQuery, searchQuery, setSearchQuery])

  return (
    <div className="relative flex-1 max-w-md">
      <motion.div
        animate={{ rotate: searchFocused ? 90 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute left-3 top-1/2 -translate-y-1/2"
      >
        <Search className="w-4 h-4 text-text-mid/60" />
      </motion.div>
      <Input
        type="text"
        placeholder="Rechercher un accessoire..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onFocus={() => setSearchFocused(true)}
        onBlur={() => setSearchFocused(false)}
        className="pl-10 pr-4 h-10 rounded-xl border-gold/20 bg-white/60 font-[family-name:var(--font-dm-sans)] text-sm focus:border-gold focus:ring-gold/20 placeholder:text-text-mid/40"
      />
    </div>
  )
}
