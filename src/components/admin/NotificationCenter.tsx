'use client'

import { useState, useMemo } from 'react'
import { useCustomerStore } from '@/stores/customer-store'
import { useAdminProductsStore } from '@/stores/admin-products-store'
import { Bell, Package, ShoppingCart, AlertTriangle, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'

interface Notif {
  id: string
  type: 'order' | 'stock' | 'info'
  title: string
  body: string
  href: string
  urgent?: boolean
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState<string[]>([])
  const orders = useCustomerStore((s) => s.orders)
  const { products } = useAdminProductsStore()

  const notifications = useMemo<Notif[]>(() => {
    const list: Notif[] = []

    // Pending orders
    const pending = orders.filter((o) => o.status === 'pending')
    if (pending.length) {
      list.push({
        id: 'pending-orders',
        type: 'order',
        title: `${pending.length} commande${pending.length > 1 ? 's' : ''} en attente`,
        body: 'Nécessite une confirmation de votre part.',
        href: '/admin/orders',
        urgent: true,
      })
    }

    // Out of stock
    const outOfStock = products.filter((p) => p.isActive && p.stock === 0)
    if (outOfStock.length) {
      list.push({
        id: 'out-of-stock',
        type: 'stock',
        title: `${outOfStock.length} produit${outOfStock.length > 1 ? 's' : ''} épuisé${outOfStock.length > 1 ? 's' : ''}`,
        body: outOfStock.slice(0, 2).map((p) => p.name).join(', ') + (outOfStock.length > 2 ? '…' : ''),
        href: '/admin/products',
        urgent: true,
      })
    }

    // Low stock (1-3)
    const lowStock = products.filter((p) => p.isActive && p.stock > 0 && p.stock <= 3)
    if (lowStock.length) {
      list.push({
        id: 'low-stock',
        type: 'stock',
        title: `${lowStock.length} produit${lowStock.length > 1 ? 's' : ''} en stock faible`,
        body: lowStock.slice(0, 2).map((p) => `${p.name} (${p.stock})`).join(', '),
        href: '/admin/products',
      })
    }

    return list.filter((n) => !dismissed.includes(n.id))
  }, [orders, products, dismissed])

  const urgentCount = notifications.filter((n) => n.urgent).length
  const count = notifications.length

  const ICON = { order: ShoppingCart, stock: Package, info: CheckCircle }
  const COLOR = { order: 'text-blue-500 bg-blue-50', stock: 'text-orange-500 bg-orange-50', info: 'text-emerald-500 bg-emerald-50' }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {count > 0 && (
          <span className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center ${urgentCount > 0 ? 'bg-red-500' : 'bg-[#D4AF6A]'}`}>
            {count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Notifications {count > 0 && <span className="text-slate-400 font-normal">({count})</span>}
              </h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <CheckCircle className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs">Tout est en ordre !</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = ICON[n.type]
                  return (
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${COLOR[n.type]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <Link href={n.href} onClick={() => setOpen(false)} className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                          {n.urgent && <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />}
                          {n.title}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{n.body}</p>
                      </Link>
                      <button
                        onClick={() => setDismissed((d) => [...d, n.id])}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-500 transition-all shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-100">
                <button
                  onClick={() => { setDismissed(notifications.map((n) => n.id)); setOpen(false) }}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                  Tout marquer comme lu
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
