'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  useCustomerStore,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  type CustomerOrder,
} from '@/stores/customer-store'
import { formatPrice } from '@/lib/product-display'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  Users,
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  Package,
  Crown,
  Download,
  X,
  RotateCcw,
  Eye,
  UserCheck,
  UserX,
} from 'lucide-react'
import { exportToCSV } from '@/lib/admin-export'
import { toast } from 'sonner'

type CustomerFilter = '' | 'active' | 'inactive'

interface CustomerRow {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: string
  orderCount: number
  totalSpent: number
  lastOrder: CustomerOrder | null
}

function Avatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const colors = [
    'bg-[#D4AF6A]',
    'bg-blue-500',
    'bg-purple-500',
    'bg-emerald-500',
    'bg-pink-500',
    'bg-indigo-500',
  ]
  const color = colors[name.charCodeAt(0) % colors.length]
  const sz = size === 'lg' ? 'w-12 h-12 text-base' : 'w-9 h-9 text-xs'
  return (
    <div
      className={`${sz} ${color} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
    >
      {initials}
    </div>
  )
}

export default function CustomersPage() {
  const { customers, current, orders, savedAddresses } = useCustomerStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<CustomerFilter>('')
  const [selected, setSelected] = useState<CustomerRow | null>(null)

  const customerRows = useMemo<CustomerRow[]>(() => {
    return customers
      .map((c) => {
        const customerOrders = orders.filter(
          (o) => o.address.email.toLowerCase() === c.email.toLowerCase()
        )
        return {
          ...c,
          orderCount: customerOrders.length,
          totalSpent: customerOrders.reduce((s, o) => s + o.total, 0),
          lastOrder: customerOrders[0] ?? null,
        }
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
  }, [customers, orders])

  const filtered = useMemo(() => {
    let list = customerRows
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(search)
      )
    }
    if (filter === 'active') list = list.filter((c) => c.orderCount > 0)
    if (filter === 'inactive') list = list.filter((c) => c.orderCount === 0)
    return list
  }, [customerRows, search, filter])

  const selectedOrders = useMemo(() => {
    if (!selected) return []
    return orders
      .filter((o) => o.address.email.toLowerCase() === selected.email.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [selected, orders])

  const stats = useMemo(() => {
    const withOrders = customerRows.filter((c) => c.orderCount > 0)
    const totalRevenue = customerRows.reduce((s, c) => s + c.totalSpent, 0)
    return {
      total: customers.length,
      active: withOrders.length,
      inactive: customers.length - withOrders.length,
      totalRevenue,
      avgSpend: withOrders.length
        ? Math.round(totalRevenue / withOrders.length)
        : 0,
    }
  }, [customers.length, customerRows])

  const topSpenderId = customerRows[0]?.totalSpent
    ? customerRows[0].id
    : null

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Clients
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {customers.length} client{customers.length !== 1 ? 's' : ''} enregistré
              {customers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              exportToCSV(filtered, `tonomi-clients-${Date.now()}`)
              toast.success('Export CSV lancé')
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:border-slate-300 transition-colors"
          >
            <Download className="w-4 h-4" /> Exporter ({filtered.length})
          </button>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: 'Total clients',
              value: stats.total,
              icon: Users,
              bg: 'bg-slate-50',
              cls: 'text-slate-800',
              border: 'border-slate-100',
            },
            {
              label: 'Clients actifs',
              value: stats.active,
              icon: UserCheck,
              bg: 'bg-emerald-50',
              cls: 'text-emerald-700',
              border: 'border-emerald-100',
            },
            {
              label: 'Revenus clients',
              value: formatPrice(stats.totalRevenue),
              icon: TrendingUp,
              bg: 'bg-[#D4AF6A]/8',
              cls: 'text-[#D4AF6A]',
              border: 'border-[#D4AF6A]/20',
            },
            {
              label: 'Panier moyen',
              value: stats.avgSpend ? formatPrice(stats.avgSpend) : '—',
              icon: ShoppingCart,
              bg: 'bg-blue-50',
              cls: 'text-blue-700',
              border: 'border-blue-100',
            },
          ].map(({ label, value, icon: Icon, bg, cls, border }) => (
            <div
              key={label}
              className={`${bg} rounded-2xl border ${border} p-4 flex items-center gap-3`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm">
                <Icon className={`w-4 h-4 ${cls}`} />
              </div>
              <div>
                <p
                  className={`text-xl font-bold ${cls}`}
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {value}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email ou téléphone…"
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A]/50"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: '' as CustomerFilter, label: 'Tous', count: customerRows.length, icon: Users },
              {
                key: 'active' as CustomerFilter,
                label: 'Actifs',
                count: stats.active,
                icon: UserCheck,
              },
              {
                key: 'inactive' as CustomerFilter,
                label: 'Sans commande',
                count: stats.inactive,
                icon: UserX,
              },
            ].map(({ key, label, count, icon: Icon }) => {
              const active = filter === key
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-white/20' : 'bg-slate-100'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
            {(search || filter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setFilter('')
                }}
                className="ml-auto flex items-center gap-1.5 text-xs text-[#D4AF6A] hover:text-[#C8956C] font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-500">
          <span className="font-bold text-slate-800">{filtered.length}</span> client
          {filtered.length !== 1 ? 's' : ''}
          {filter === 'active' && (
            <span className="text-slate-400"> — avec au moins une commande</span>
          )}
          {filter === 'inactive' && (
            <span className="text-slate-400"> — sans commande</span>
          )}
        </p>

        {/* TABLE */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-slate-700">Aucun client trouvé</p>
              <p className="text-sm text-slate-400 mt-1">
                {customers.length === 0
                  ? 'Les inscriptions storefront apparaîtront ici'
                  : 'Modifiez vos filtres de recherche'}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="hidden lg:grid grid-cols-[2fr_1.2fr_0.8fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3.5 border-b border-slate-100 bg-slate-50/70">
              {[
                'Client',
                'Contact',
                'Commandes',
                'Total dépensé',
                'Dernière commande',
                'Membre depuis',
                '',
              ].map((h) => (
                <p
                  key={h}
                  className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >
                  {h}
                </p>
              ))}
            </div>

            <div className="divide-y divide-slate-50">
              {filtered.map((c) => {
                const name = `${c.firstName} ${c.lastName}`
                const isTop = c.id === topSpenderId && c.totalSpent > 0
                return (
                  <div
                    key={c.id}
                    className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr_0.8fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <Avatar name={name} />
                        {isTop && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                            <Crown className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {name}
                          </p>
                          {c.id === current?.id && (
                            <span className="text-[9px] font-bold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                              Session
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{c.email}</p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600">{c.phone || '—'}</p>

                    <div className="flex items-center gap-1.5">
                      <ShoppingCart className="w-3.5 h-3.5 text-slate-400" />
                      <span
                        className={`text-sm font-semibold ${
                          c.orderCount > 0 ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {c.orderCount}
                      </span>
                    </div>

                    <p
                      className={`text-sm font-bold ${
                        c.totalSpent > 0 ? 'text-[#D4AF6A]' : 'text-slate-400'
                      }`}
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {c.orderCount > 0 ? formatPrice(c.totalSpent) : '—'}
                    </p>

                    <div>
                      {c.lastOrder ? (
                        <span
                          className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[c.lastOrder.status]}`}
                        >
                          {ORDER_STATUS_LABELS[c.lastOrder.status]}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 opacity-0 group-hover:opacity-100 hover:bg-white hover:border-[#D4AF6A]/40 transition-all lg:opacity-100"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Voir
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
          {selected && (
            <>
              <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Avatar name={`${selected.firstName} ${selected.lastName}`} size="lg" />
                  <div>
                    <DialogTitle
                      className="text-lg"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {selected.firstName} {selected.lastName}
                    </DialogTitle>
                    <p className="text-sm text-slate-500">{selected.email}</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: ShoppingCart,
                      label: 'Commandes',
                      value: String(selected.orderCount),
                    },
                    {
                      icon: TrendingUp,
                      label: 'Total dépensé',
                      value:
                        selected.orderCount > 0
                          ? formatPrice(selected.totalSpent)
                          : '—',
                    },
                    {
                      icon: Package,
                      label: 'Panier moyen',
                      value:
                        selected.orderCount > 0
                          ? formatPrice(
                              Math.round(selected.totalSpent / selected.orderCount)
                            )
                          : '—',
                    },
                    {
                      icon: MapPin,
                      label: 'Adresses',
                      value:
                        selected.id === current?.id
                          ? String(savedAddresses.length)
                          : '—',
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className="w-3.5 h-3.5 text-[#D4AF6A]" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {selected.email}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {selected.phone || '—'}
                  </div>
                </div>

                {selectedOrders.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Commandes ({selectedOrders.length})
                    </p>
                    <div className="space-y-2">
                      {selectedOrders.map((o) => (
                        <div
                          key={o.id}
                          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-xs font-bold text-slate-800">
                              {o.number}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {new Date(o.createdAt).toLocaleDateString('fr-FR')} ·{' '}
                              {o.items.length} art.
                            </p>
                          </div>
                          <span
                            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${ORDER_STATUS_COLORS[o.status]}`}
                          >
                            {ORDER_STATUS_LABELS[o.status]}
                          </span>
                          <span
                            className="text-sm font-bold text-[#D4AF6A] shrink-0"
                            style={{ fontFamily: 'var(--font-playfair)' }}
                          >
                            {formatPrice(o.total)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
                {selectedOrders[0] && (
                  <Link
                    href={`/admin/orders/${selectedOrders[0].id}`}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => setSelected(null)}
                  >
                    Voir commande
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                >
                  Fermer
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
