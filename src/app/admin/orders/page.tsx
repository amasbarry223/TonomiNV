'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  useCustomerStore, PAYMENT_INFO,
  type CustomerOrder as Order, type CustomerOrderStatus,
} from '@/stores/customer-store'
import { formatPrice } from '@/lib/product-display'
import {
  Search, ShoppingCart, Eye, Package,
  TrendingUp, Download, X, Clock, CheckCircle, Truck,
  AlertCircle, RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
import { exportToCSV } from '@/lib/admin-export'

// ─────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────
const ALL_STATUSES: CustomerOrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled',
]

const STATUS: Record<CustomerOrderStatus, {
  label: string; dot: string; bg: string; text: string; border: string
  icon: React.ElementType; step?: number
}> = {
  pending:    { label: 'En attente',      dot: '#F59E0B', bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-300', icon: Clock,         step: 0 },
  confirmed:  { label: 'Confirmée',       dot: '#3B82F6', bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-300',   icon: CheckCircle,   step: 1 },
  processing: { label: 'En préparation',  dot: '#8B5CF6', bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-300', icon: Package,       step: 2 },
  shipped:    { label: 'Expédiée',        dot: '#6366F1', bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-300', icon: Truck,         step: 3 },
  delivered:  { label: 'Livrée',          dot: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300',icon: CheckCircle,   step: 4 },
  cancelled:  { label: 'Annulée',         dot: '#EF4444', bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-300',    icon: AlertCircle,   step: -1 },
}

const PAYMENT_ICON: Record<string, string> = {
  orange_money: '🟠', wave: '🔵', mobi_money: '🟣', especes: '💵',
}

// ─────────────────────────────────────────────────────────────
// CUSTOMER AVATAR
// ─────────────────────────────────────────────────────────────
function Avatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-[#D4AF6A]', 'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-pink-500', 'bg-indigo-500']
  const color  = colors[name.charCodeAt(0) % colors.length]
  const sz = size === 'lg' ? 'w-12 h-12 text-base' : 'w-9 h-9 text-xs'
  return (
    <div className={`${sz} ${color} rounded-full flex items-center justify-center font-bold text-white shrink-0`}>
      {initials}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const { orders, updateOrderStatus } = useCustomerStore()
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState<CustomerOrderStatus | ''>('')
  const [updatingId,   setUpdatingId]   = useState<string | null>(null)

  // ── Derived
  const filtered = useMemo(() => {
    let list = [...orders].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    if (search) list = list.filter(o =>
      o.number.toLowerCase().includes(search.toLowerCase()) ||
      `${o.address.firstName} ${o.address.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      o.address.email.toLowerCase().includes(search.toLowerCase()) ||
      o.address.city.toLowerCase().includes(search.toLowerCase())
    )
    if (statusFilter) list = list.filter(o => o.status === statusFilter)
    return list
  }, [orders, search, statusFilter])

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0)
    const avgTicket = orders.length ? Math.round(revenue / orders.length) : 0
    return {
      total:     orders.length,
      revenue,
      avgTicket,
      pending:   orders.filter(o => o.status === 'pending').length,
      inProgress: orders.filter(o => ['confirmed','processing','shipped'].includes(o.status)).length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    }
  }, [orders])

  const handleStatusChange = (order: Order, status: CustomerOrderStatus) => {
    setUpdatingId(order.id)
    updateOrderStatus(order.id, status)
    toast.success(`${order.number} → ${STATUS[status].label}`)
    setTimeout(() => setUpdatingId(null), 500)
  }

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">

        {/* ══════ HEADER ══════ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Commandes
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {orders.length} commande{orders.length !== 1 ? 's' : ''} au total
            </p>
          </div>
          <button
            onClick={() => { exportToCSV(filtered, `tonomi-commandes-${Date.now()}`); toast.success('Export CSV lancé') }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:border-slate-300 transition-colors">
            <Download className="w-4 h-4" /> Exporter ({filtered.length})
          </button>
        </div>

        {/* ══════ KPI STATS ══════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Chiffre d\'affaires', value: formatPrice(stats.revenue),   icon: TrendingUp,    bg: 'bg-[#D4AF6A]/8',  cls: 'text-[#D4AF6A]',   border: 'border-[#D4AF6A]/20' },
            { label: 'Panier moyen',         value: formatPrice(stats.avgTicket), icon: ShoppingCart,  bg: 'bg-blue-50',       cls: 'text-blue-600',     border: 'border-blue-100' },
            { label: 'En cours',             value: stats.inProgress,             icon: Package,       bg: 'bg-purple-50',     cls: 'text-purple-600',   border: 'border-purple-100' },
            { label: 'Livrées',              value: stats.delivered,              icon: CheckCircle,   bg: 'bg-emerald-50',    cls: 'text-emerald-600',  border: 'border-emerald-100' },
          ].map(({ label, value, icon: Icon, bg, cls, border }) => (
            <div key={label} className={`${bg} rounded-2xl border ${border} p-4 flex items-center gap-3`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm`}>
                <Icon className={`w-4.5 h-4.5 ${cls}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${cls}`} style={{ fontFamily: 'var(--font-playfair)' }}>{value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ══════ FILTERS ══════ */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par N° commande, client, email, ville…"
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A]/50"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                !statusFilter
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}>
              Toutes ({orders.length})
            </button>
            {ALL_STATUSES.map(st => {
              const sc    = STATUS[st]
              const count = orders.filter(o => o.status === st).length
              const active = statusFilter === st
              return (
                <button key={st} onClick={() => setStatusFilter(active ? '' : st)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    active
                      ? `${sc.bg} ${sc.text} ${sc.border}`
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sc.dot }} />
                  {sc.label}
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-white/60' : 'bg-slate-100'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}

            {(search || statusFilter) && (
              <button onClick={() => { setSearch(''); setStatusFilter('') }}
                className="ml-auto flex items-center gap-1.5 text-xs text-[#D4AF6A] hover:text-[#C8956C] font-semibold transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* ══════ RESULT LABEL ══════ */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-800">{filtered.length}</span>
            {' '}commande{filtered.length !== 1 ? 's' : ''}
            {statusFilter && <span className="text-slate-400"> — {STATUS[statusFilter].label}</span>}
          </p>
        </div>

        {/* ══════ TABLE ══════ */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-slate-700">Aucune commande trouvée</p>
              <p className="text-sm text-slate-400 mt-1">Modifiez vos filtres de recherche</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* Table header */}
            <div className="hidden lg:grid grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr_1.4fr_auto] gap-4 px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50/70">
              {['Commande', 'Client', 'Date', 'Paiement', 'Total', 'Statut', ''].map((h, i) => (
                <p key={i} className="text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</p>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-50">
              {filtered.map(order => {
                const sc = STATUS[order.status]
                const name = `${order.address.firstName} ${order.address.lastName}`
                return (
                  <div key={order.id}
                    className={`grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr_1.4fr_auto] gap-4 items-center px-4 sm:px-6 py-4 hover:bg-slate-50/80 transition-colors group ${
                      updatingId === order.id ? 'opacity-50' : ''
                    }`}>

                    {/* Commande */}
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 rounded-full shrink-0" style={{ backgroundColor: sc.dot }} />
                      <div>
                        <p className="font-mono text-sm font-bold text-slate-800">{order.number}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {order.items.length} article{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Client */}
                    <div className="flex items-center gap-2.5">
                      <Avatar name={name} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
                        <p className="text-xs text-slate-400 truncate">{order.address.city}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-sm text-slate-700 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(order.createdAt).getFullYear()}
                      </p>
                    </div>

                    {/* Paiement */}
                    <div>
                      <p className="text-sm text-slate-700">
                        {PAYMENT_ICON[order.payment]} {PAYMENT_INFO[order.payment]?.label?.split(' ')[0]}
                      </p>
                    </div>

                    {/* Total */}
                    <div>
                      <p className="text-base font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {formatPrice(order.total)}
                      </p>
                      {order.discount > 0 && (
                        <p className="text-xs text-emerald-600 font-medium">−{formatPrice(order.discount)}</p>
                      )}
                    </div>

                    {/* Statut inline change */}
                    <div>
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order, e.target.value as CustomerOrderStatus)}
                        className={`text-xs font-bold px-3 py-2 rounded-xl border cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 transition-all ${sc.bg} ${sc.text} ${sc.border}`}
                      >
                        {ALL_STATUSES.map(st => (
                          <option key={st} value={st}>{STATUS[st].label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Action */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#D4AF6A] hover:text-white text-slate-600 text-xs font-semibold transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">Détail</span>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer count */}
            <div className="px-4 sm:px-6 py-3 border-t border-slate-50 bg-slate-50/50">
              <p className="text-xs text-slate-400">
                {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
                {stats.pending > 0 && (
                  <span className="ml-3 text-yellow-600 font-semibold">
                    · {stats.pending} en attente de traitement
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

    </AdminLayout>
  )
}
