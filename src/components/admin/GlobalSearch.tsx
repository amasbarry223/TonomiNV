'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminProductsStore } from '@/stores/admin-products-store'
import { useCustomerStore } from '@/stores/customer-store'
import { Search, Package, ShoppingCart, Users, X } from 'lucide-react'
import { formatPrice } from '@/lib/product-display'

export default function GlobalSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { products } = useAdminProductsStore()
  const { orders } = useCustomerStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (e.key === 'Escape') { setQuery(''); setOpen(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const results = useMemo(() => {
    if (!query || query.length < 2) return { products: [], orders: [] }
    const q = query.toLowerCase()
    return {
      products: products.filter((p) =>
        p.name.toLowerCase().includes(q) || p.category.includes(q) || p.id.includes(q)
      ).slice(0, 4),
      orders: orders.filter((o) =>
        o.number.toLowerCase().includes(q) ||
        `${o.address.firstName} ${o.address.lastName}`.toLowerCase().includes(q) ||
        o.address.email.toLowerCase().includes(q)
      ).slice(0, 4),
    }
  }, [query, products, orders])

  const hasResults = results.products.length > 0 || results.orders.length > 0

  const navigate = (href: string) => {
    router.push(href)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="relative flex-1 max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Rechercher… (⌘K)"
          className="w-full bg-slate-100 hover:bg-slate-200 focus:bg-white border border-transparent focus:border-slate-200 rounded-xl pl-8 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/20 transition-all placeholder:text-slate-400"
          style={{ fontFamily: 'var(--font-dm-sans)' }}
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false) }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && query.length >= 2 && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-10 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
            {!hasResults ? (
              <div className="flex items-center gap-3 px-4 py-4 text-slate-400">
                <Search className="w-4 h-4 shrink-0" />
                <span className="text-sm">Aucun résultat pour &ldquo;{query}&rdquo;</span>
              </div>
            ) : (
              <>
                {results.products.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                      Produits
                    </p>
                    {results.products.map((p) => (
                      <button key={p.id} onClick={() => navigate('/admin/products')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left">
                        <div className="w-7 h-7 rounded-lg bg-[#D4AF6A]/10 flex items-center justify-center shrink-0">
                          <Package className="w-3.5 h-3.5 text-[#D4AF6A]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-800 truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.category}</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-600 shrink-0">{formatPrice(p.price)}</span>
                      </button>
                    ))}
                  </div>
                )}
                {results.orders.length > 0 && (
                  <div className="border-t border-slate-50">
                    <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                      Commandes
                    </p>
                    {results.orders.map((o) => (
                      <button key={o.id} onClick={() => navigate('/admin/orders')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <ShoppingCart className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-800">{o.number}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {o.address.firstName} {o.address.lastName}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-[#D4AF6A] shrink-0">{formatPrice(o.total)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
