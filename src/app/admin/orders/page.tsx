'use client'

import { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  useCustomerStore, PAYMENT_INFO, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS,
  type CustomerOrder as Order, type CustomerOrderStatus,
} from '@/stores/customer-store'
import { formatPrice } from '@/lib/product-display'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Search, ShoppingCart, Eye, MapPin, CreditCard, Package, TrendingUp, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

const ALL_STATUSES: CustomerOrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_DOT: Record<CustomerOrderStatus, string> = {
  pending:    'bg-yellow-400',
  confirmed:  'bg-blue-400',
  processing: 'bg-purple-400',
  shipped:    'bg-indigo-400',
  delivered:  'bg-emerald-400',
  cancelled:  'bg-red-400',
}

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useCustomerStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    if (search) list = list.filter((o) =>
      o.number.toLowerCase().includes(search.toLowerCase()) ||
      `${o.address.firstName} ${o.address.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      o.address.email.toLowerCase().includes(search.toLowerCase())
    )
    if (statusFilter) list = list.filter((o) => o.status === statusFilter)
    return list
  }, [orders, search, statusFilter])

  const stats = useMemo(() => ({
    total: orders.length,
    revenue: orders.reduce((s, o) => s + o.total, 0),
    pending: orders.filter((o) => o.status === 'pending').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  }), [orders])

  const handleStatusChange = (order: Order, status: CustomerOrderStatus) => {
    setUpdatingId(order.id)
    updateOrderStatus(order.id, status)
    toast.success(`Commande ${order.number} → ${ORDER_STATUS_LABELS[status]}`)
    setTimeout(() => setUpdatingId(null), 600)
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Commandes
          </h2>
          <p className="text-sm text-slate-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Gérez et suivez toutes les commandes
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total commandes', value: stats.total, color: 'text-slate-800', bg: 'bg-slate-50' },
            { label: 'Revenus', value: formatPrice(stats.revenue), color: 'text-[#D4AF6A]', bg: 'bg-[#D4AF6A]/8' },
            { label: 'En attente', value: stats.pending, color: 'text-yellow-700', bg: 'bg-yellow-50' },
            { label: 'Livrées', value: stats.delivered, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl border border-slate-200 p-4`}>
              <p className="text-xs text-slate-500 font-medium mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`} style={{ fontFamily: 'var(--font-playfair)' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="N° commande, client, email…"
              className="pl-9 bg-white border-slate-200 rounded-xl h-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setStatusFilter('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${!statusFilter ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
              style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Tous ({orders.length})
            </button>
            {ALL_STATUSES.map((s) => {
              const count = orders.filter((o) => o.status === s).length
              return (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${statusFilter === s ? ORDER_STATUS_COLORS[s] + ' border-current' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                  style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {ORDER_STATUS_LABELS[s]} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Commande</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Paiement</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((o) => (
                  <tr key={o.id} className={`hover:bg-slate-50/60 transition-colors group ${updatingId === o.id ? 'opacity-60' : ''}`}>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-bold text-slate-800">{o.number}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{o.items.length} article{o.items.length > 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-800 text-xs" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                        {o.address.firstName} {o.address.lastName}
                      </p>
                      <p className="text-[10px] text-slate-400">{o.address.city}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-slate-600">
                        {new Date(o.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-slate-600">{PAYMENT_INFO[o.payment]?.label ?? o.payment}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-[#D4AF6A] text-sm" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {formatPrice(o.total)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {/* Inline status selector */}
                      <div className="relative">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o, e.target.value as CustomerOrderStatus)}
                          className={`appearance-none text-[10px] font-semibold px-2.5 pr-6 py-1 rounded-full cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 ${ORDER_STATUS_COLORS[o.status]}`}
                          style={{ fontFamily: 'var(--font-dm-sans)' }}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => setSelected(o)}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-all">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <ShoppingCart className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>Aucune commande trouvée</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-playfair)' }}>
              Commande {selected?.number}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-1 max-h-[70vh] overflow-y-auto pr-1">
              {/* Status update */}
              <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                <span className="text-sm font-medium text-slate-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Changer le statut
                </span>
                <select
                  value={selected.status}
                  onChange={(e) => {
                    handleStatusChange(selected, e.target.value as CustomerOrderStatus)
                    setSelected({ ...selected, status: e.target.value as CustomerOrderStatus })
                  }}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {ALL_STATUSES.filter(s => s !== 'cancelled').map((s, i, arr) => {
                  const progressStatuses = ALL_STATUSES.filter(st => st !== 'cancelled')
                  const statusIndex = selected.status === 'cancelled' ? -1 : progressStatuses.indexOf(selected.status as Exclude<CustomerOrderStatus, 'cancelled'>)
                  const isDone = statusIndex >= 0 && i <= statusIndex
                  return (
                    <div key={s} className="flex items-center gap-1 shrink-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors ${isDone ? 'bg-[#D4AF6A] text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {i + 1}
                      </div>
                      {i < arr.length - 1 && (
                        <div className={`w-8 h-0.5 ${isDone && i < statusIndex ? 'bg-[#D4AF6A]' : 'bg-slate-100'}`} />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Items */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Articles</p>
                {selected.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D4AF6A]/10 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-[#D4AF6A]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{item.name} × {item.quantity}</p>
                      {(item.color || item.size) && (
                        <p className="text-[10px] text-slate-400">{[item.color, item.size].filter(Boolean).join(' / ')}</p>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Sous-total</span><span>{formatPrice(selected.subtotal)}</span>
                </div>
                {selected.discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Réduction</span><span>-{formatPrice(selected.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Livraison</span>
                  <span>{selected.shipping === 0 ? 'Gratuite' : formatPrice(selected.shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total</span>
                  <span className="text-[#D4AF6A]">{formatPrice(selected.total)}</span>
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF6A]" />
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Livraison</span>
                  </div>
                  <p className="text-xs font-medium text-slate-800">{selected.address.firstName} {selected.address.lastName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selected.address.address}</p>
                  <p className="text-xs text-slate-500">{selected.address.city}, {selected.address.country}</p>
                  <p className="text-xs text-slate-400">{selected.address.phone}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-3.5 h-3.5 text-[#D4AF6A]" />
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Paiement</span>
                  </div>
                  <p className="text-xs font-medium text-slate-800">{PAYMENT_INFO[selected.payment]?.label ?? selected.payment}</p>
                  {selected.promoCode && (
                    <p className="text-[10px] text-emerald-600 mt-1">Code : <strong>{selected.promoCode}</strong></p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
