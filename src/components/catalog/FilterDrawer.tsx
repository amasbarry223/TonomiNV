'use client'

import { SlidersHorizontal } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import FilterSidebar from './FilterSidebar'
import { useFilterStore } from '@/stores/filter-store'

export default function FilterDrawer() {
  const { hasActiveFilters } = useFilterStore()
  const active = hasActiveFilters()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-beige/50 hover:bg-gold/10 transition-colors font-[family-name:var(--font-dm-sans)] text-sm text-text-mid">
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
          {active && (
            <span className="w-2 h-2 rounded-full bg-caramel animate-pulse" />
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto bg-cream">
        <SheetHeader>
          <SheetTitle className="font-[family-name:var(--font-playfair)] text-xl text-text-dark">
            Filtres
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-8">
          <FilterSidebar />
        </div>
      </SheetContent>
    </Sheet>
  )
}
