'use client'

import { useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useCustomerStore, ORDER_STATUS_LABELS } from '@/stores/customer-store'
import { useAdminProductsStore } from '@/stores/admin-products-store'
import { promoCodes } from '@/data/promos'
import {
  ShoppingCart, Package, TrendingUp, Tag,
  Clock, CheckCircle, AlertCircle, ArrowRight, BarChart3,
} from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/product-display'

// ── Area Chart ────────────────────────────────────────────────────────────────
function AreaChart({ data, color = '#D4AF6A' }: {
  data: { label: string; value: number; count: number }[]
  color?: string
}) {
  const W = 560, H = 110
  const PAD = { t: 10, r: 16, b: 28, l: 50 }
  const iW = W - PAD.l - PAD.r
  const iH = H - PAD.t - PAD.b
  const max = Math.max(...data.map((d) => d.value), 1)

  const pts = data.map((d, i) => ({
    x: PAD.l + (i / Math.max(data.length - 1, 1)) * iW,
    y: PAD.t + (1 - d.value / max) * iH,
    ...d,
  }))

  // Smooth cubic bezier
  const line = pts.reduce((p, pt, i) => {
    if (i === 0) return `M${pt.x},${pt.y}`
    const prev = pts[i - 1]
    const cx = (prev.x + pt.x) / 2
    return `${p} C${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`
  }, '')

  const area = `${line} L${pts[pts.length - 1].x},${PAD.t + iH} L${pts[0].x},${PAD.t + iH} Z`

  // Y-axis ticks (4 levels)
  const yTicks = [0, 0.33, 0.66, 1].map((t) => ({
    y: PAD.t + iH - t * iH,
    val: Math.round(max * t),
  }))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((t) => (
        <g key={t.val}>
          <line x1={PAD.l} y1={t.y} x2={W - PAD.r} y2={t.y} stroke="#f1f5f9" strokeWidth="1" />
          <text x={PAD.l - 6} y={t.y + 3.5} textAnchor="end" fontSize="8" fill="#94a3b8">
            {t.val >= 1000 ? `${Math.round(t.val / 1000)}k` : t.val}
          </text>
        </g>
      ))}

      {/* Area + Line */}
      <path d={area} fill="url(#ag)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />

      {/* Points */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="white" stroke={color} strokeWidth="2" />
          {/* Tooltip on hover using title */}
          <title>{p.label}: {formatPrice(p.value)} ({p.count} cmd)</title>
          <circle cx={p.x} cy={p.y} r="8" fill="transparent" />
        </g>
      ))}

      {/* X labels */}
      {pts.map((p, i) => (
        <text key={i} x={p.x} y={H - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">
          {p.label}
        </text>
      ))}
    </svg>
  )
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ values, color = '#D4AF6A' }: { values: number[]; color?: string }) {
  if (values.length < 2) return null
  const max = Math.max(...values, 1)
  const W = 64, H = 24
  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1)) * W,
    y: H - (v / max) * H,
  }))
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-16 h-6">
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.7" />
    </svg>
  )
}

// ── Donut Chart ───────────────────────────────────────────────────────────────
function MiniDonut({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, d) => s + d.value, 0)
  if (total === 0) return (
    <div className="flex items-center justify-center h-20 text-slate-400 text-xs">Aucune donnée</div>
  )

  let angle = -90
  const r = 28, cx = 36, cy = 36, stroke = 14

  const arcs = segments.map((seg) => {
    const pct = seg.value / total
    const sweep = pct * 360
    const startRad = (angle * Math.PI) / 180
    angle += sweep
    const endRad = (angle * Math.PI) / 180
    const largeArc = sweep > 180 ? 1 : 0
    const x1 = cx + r * Math.cos(startRad), y1 = cy + r * Math.sin(startRad)
    const x2 = cx + r * Math.cos(endRad), y2 = cy + r * Math.sin(endRad)
    return { path: `M${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2}`, ...seg, pct }
  })

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 72 72" className="w-16 h-16 shrink-0">
        {arcs.map((a) => (
          <path key={a.label} d={a.path} fill="none" stroke={a.color}
            strokeWidth={stroke} strokeLinecap="round">
            <title>{a.label}: {a.value}</title>
          </path>
        ))}
        <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">
          {total}
        </text>
      </svg>
      <div className="space-y-1.5 min-w-0">
        {segments.slice(0, 4).map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-[10px] text-slate-500 truncate">{s.label}</span>
            <span className="text-[10px] font-bold text-slate-700 ml-auto">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Horizontal Bars ───────────────────────────────────────────────────────────
function HBars({ data }: { data: { name: string; value: number; pct: number }[] }) {
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.name}>
          <div className="flex justify-between mb-1">
            <span className="text-[11px] text-slate-600 capitalize">{d.name}</span>
            <span className="text-[11px] font-semibold text-slate-800">{d.value}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D4AF6A] to-[#C8956C] transition-all duration-700"
              style={{ width: `${d.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { cls: string; icon: React.ElementType; dot: string }> = {
  pending:    { cls: 'bg-yellow-100 text-yellow-700', icon: Clock,         dot: '#EAB308' },
  confirmed:  { cls: 'bg-blue-100 text-blue-700',     icon: CheckCircle,   dot: '#3B82F6' },
  processing: { cls: 'bg-purple-100 text-purple-700', icon: Package,       dot: '#8B5CF6' },
  shipped:    { cls: 'bg-indigo-100 text-indigo-700', icon: TrendingUp,    dot: '#6366F1' },
  delivered:  { cls: 'bg-green-100 text-green-700',   icon: CheckCircle,   dot: '#10B981' },
  cancelled:  { cls: 'bg-red-100 text-red-700',       icon: AlertCircle,   dot: '#EF4444' },
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const orders = useCustomerStore((s) => s.orders)
  const { products } = useAdminProductsStore()

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  const activeProducts = products.filter((p) => p.isActive).length
  const avgOrder = orders.length ? totalRevenue / orders.length : 0

  // Last 14 days area chart
  const areaData = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (13 - i))
      const key = d.toISOString().split('T')[0]
      const dayOrders = orders.filter((o) => o.createdAt.startsWith(key))
      return {
        label: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        value: dayOrders.reduce((s, o) => s + o.total, 0),
        count: dayOrders.length,
      }
    })
  }, [orders])

  // Sparkline data (7 days)
  const sparkRevenue = areaData.slice(-7).map((d) => d.value)
  const sparkOrders = areaData.slice(-7).map((d) => d.count)

  // Orders by status (donut)
  const statusSegments = useMemo(() => {
    const map: Record<string, number> = {}
    orders.forEach((o) => { map[o.status] = (map[o.status] ?? 0) + 1 })
    return Object.entries(map).map(([status, value]) => ({
      label: ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] ?? status,
      value,
      color: STATUS_CFG[status]?.dot ?? '#94A3B8',
    })).sort((a, b) => b.value - a.value)
  }, [orders])

  // Stock by category (bars)
  const categoryBars = useMemo(() => {
    const map: Record<string, number> = {}
    products.forEach((p) => { map[p.category] = (map[p.category] ?? 0) + p.stock })
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6)
    const max = Math.max(...entries.map((e) => e[1]), 1)
    return entries.map(([name, value]) => ({ name, value, pct: (value / max) * 100 }))
  }, [products])

  // Recent orders
  const recentOrders = useMemo(() =>
    [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6),
    [orders]
  )

  const kpis = [
    {
      icon: TrendingUp, label: 'Chiffre d\'affaires', value: formatPrice(totalRevenue),
      sub: 'total cumulé', color: 'bg-[#D4AF6A]/15 text-[#D4AF6A]', spark: sparkRevenue, sparkColor: '#D4AF6A',
    },
    {
      icon: ShoppingCart, label: 'Commandes', value: String(orders.length),
      sub: `moy. ${formatPrice(Math.round(avgOrder))}`, color: 'bg-blue-100 text-blue-600', spark: sparkOrders, sparkColor: '#3B82F6',
    },
    {
      icon: Package, label: 'Produits actifs', value: String(activeProducts),
      sub: `${products.length} au total`, color: 'bg-purple-100 text-purple-600', spark: null, sparkColor: '',
    },
    {
      icon: Tag, label: 'Codes promo', value: String(promoCodes.length),
      sub: 'disponibles', color: 'bg-emerald-100 text-emerald-600', spark: null, sparkColor: '',
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Tableau de bord
            </h2>
            <p className="text-sm text-slate-500 mt-0.5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Link href="/admin/analytics"
            className="flex items-center gap-2 text-xs text-[#D4AF6A] hover:text-[#C8956C] border border-[#D4AF6A]/30 hover:border-[#D4AF6A] rounded-xl px-4 py-2 transition-all"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <BarChart3 className="w-3.5 h-3.5" /> Analytics complètes
          </Link>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(({ icon: Icon, label, value, sub, color, spark, sparkColor }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {spark && spark.some((v) => v > 0) && (
                  <Sparkline values={spark} color={sparkColor} />
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900 leading-none" style={{ fontFamily: 'var(--font-playfair)' }}>
                {value}
              </p>
              <p className="text-xs text-slate-500 mt-1.5" style={{ fontFamily: 'var(--font-dm-sans)' }}>{label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5" style={{ fontFamily: 'var(--font-dm-sans)' }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Area chart — Revenue 14 days */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Revenus — 14 derniers jours
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {areaData.filter((d) => d.value > 0).length} jour{areaData.filter((d) => d.value > 0).length !== 1 ? 's' : ''} avec des ventes
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#D4AF6A]" style={{ fontFamily: 'var(--font-playfair)' }}>
                {formatPrice(totalRevenue)}
              </p>
              <p className="text-[10px] text-slate-400">total</p>
            </div>
          </div>
          {orders.length > 0 ? (
            <AreaChart data={areaData} />
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-300">
              <TrendingUp className="w-10 h-10 mb-2" />
              <p className="text-sm text-slate-400">Les données apparaîtront après les premières commandes</p>
            </div>
          )}
        </div>

        {/* Row 3 : orders status + category bars + recent orders */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Donut — statuts */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Statuts commandes
              </h3>
              <Link href="/admin/orders" className="text-[10px] text-[#D4AF6A] hover:underline">
                Gérer →
              </Link>
            </div>
            <MiniDonut segments={statusSegments} />
          </div>

          {/* Bars — stock par catégorie */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Stock par catégorie
              </h3>
              <Link href="/admin/products" className="text-[10px] text-[#D4AF6A] hover:underline">
                Gérer →
              </Link>
            </div>
            <HBars data={categoryBars} />
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Commandes récentes
              </h3>
              <Link href="/admin/orders" className="text-xs text-[#D4AF6A] hover:underline flex items-center gap-1">
                Tout voir <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <ShoppingCart className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-xs">Aucune commande</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentOrders.map((order) => {
                  const cfg = STATUS_CFG[order.status] ?? STATUS_CFG.pending
                  const Icon = cfg.icon
                  return (
                    <div key={order.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-xs font-semibold text-slate-700">{order.number}</span>
                        <p className="text-[10px] text-slate-400 truncate">
                          {order.address.firstName} · {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#D4AF6A] shrink-0" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom row : quick actions + low stock */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Accès rapide
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: '/admin/products', icon: Package, label: 'Produits', sub: `${activeProducts} actifs`, color: 'text-purple-600 bg-purple-50' },
                { href: '/admin/orders', icon: ShoppingCart, label: 'Commandes', sub: `${orders.length} total`, color: 'text-blue-600 bg-blue-50' },
                { href: '/admin/content', icon: TrendingUp, label: 'Hero section', sub: 'Modifier les slides', color: 'text-[#D4AF6A] bg-[#D4AF6A]/10' },
                { href: '/admin/promotions', icon: Tag, label: 'Promotions', sub: `${promoCodes.length} codes`, color: 'text-emerald-600 bg-emerald-50' },
              ].map(({ href, icon: Icon, label, sub, color }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-[#D4AF6A]/30 hover:bg-slate-50 transition-all group">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{label}</p>
                    <p className="text-[10px] text-slate-400 truncate">{sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Low stock alert */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Stock faible
              </h3>
              <Link href="/admin/products?filter=lowstock" className="text-[10px] text-[#D4AF6A] hover:underline">
                Voir tout →
              </Link>
            </div>
            {(() => {
              const lowStock = products.filter((p) => p.isActive && p.stock <= 5).slice(0, 5)
              if (lowStock.length === 0) return (
                <div className="flex items-center gap-3 bg-emerald-50 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <p className="text-xs text-emerald-700">Tous les stocks sont suffisants ✓</p>
                </div>
              )
              return (
                <div className="space-y-2">
                  {lowStock.map((p) => (
                    <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border ${p.stock === 0 ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${p.stock === 0 ? 'bg-red-500' : 'bg-orange-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">{p.name}</p>
                        <div className="w-full bg-white/60 rounded-full h-1 mt-1">
                          <div className={`h-1 rounded-full ${p.stock === 0 ? 'bg-red-400' : 'bg-orange-400'}`}
                            style={{ width: `${Math.min((p.stock / 10) * 100, 100)}%` }} />
                        </div>
                      </div>
                      <span className={`text-xs font-bold shrink-0 ${p.stock === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                        {p.stock === 0 ? 'Épuisé' : `${p.stock} u.`}
                      </span>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
