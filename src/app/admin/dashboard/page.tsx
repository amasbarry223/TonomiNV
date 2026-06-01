'use client'

import { useState, useMemo, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useCustomerStore, ORDER_STATUS_LABELS } from '@/stores/customer-store'
import { useAdminProductsStore } from '@/stores/admin-products-store'
import { promoCodes } from '@/data/promos'
import { seedCustomers, seedOrders } from '@/data/seed'
import { getProductById } from '@/data/products'
import {
  ShoppingCart, Package, TrendingUp, Tag,
  Clock, CheckCircle, ArrowRight,
  ArrowUpRight, ArrowDownRight, Sparkles, Users,
} from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/product-display'
import { toast } from 'sonner'

// ─────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { dot: string; text: string }> = {
  pending:    { dot: '#F59E0B', text: 'text-yellow-600'  },
  confirmed:  { dot: '#3B82F6', text: 'text-blue-600'    },
  processing: { dot: '#8B5CF6', text: 'text-purple-600'  },
  shipped:    { dot: '#6366F1', text: 'text-indigo-600'  },
  delivered:  { dot: '#10B981', text: 'text-emerald-600' },
  cancelled:  { dot: '#EF4444', text: 'text-red-500'     },
}

// ─────────────────────────────────────────────────────────────
// TREND BADGE
// ─────────────────────────────────────────────────────────────
function TrendBadge({ current, previous }: { current: number; previous: number }) {
  if (!previous || current === previous) return null
  const pct = Math.round(((current - previous) / previous) * 100)
  const up = pct > 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
      up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
    }`}>
      {up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
      {up ? '+' : ''}{pct}%
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
// SPARKLINE
// ─────────────────────────────────────────────────────────────
function Sparkline({ values, color = '#D4AF6A' }: { values: number[]; color?: string }) {
  if (values.length < 2) return null
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1
  const W = 72, H = 28
  const pts = values.map((v, i) => ({
    x: (i / (values.length - 1)) * W,
    y: H - ((v - min) / range) * H * 0.85 - H * 0.075,
  }))
  const path = pts.reduce((p, pt, i) => {
    if (i === 0) return `M${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
    const prev = pts[i - 1]
    const cx = (prev.x + pt.x) / 2
    return `${p} C${cx.toFixed(1)},${prev.y.toFixed(1)} ${cx.toFixed(1)},${pt.y.toFixed(1)} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
  }, '')
  const area = `${path} L${pts[pts.length - 1].x},${H} L${pts[0].x},${H} Z`
  const gid = `sg${color.replace('#', '')}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: 72, height: 28 }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// AREA CHART
// ─────────────────────────────────────────────────────────────
function AreaChart({ data, color = '#D4AF6A' }: {
  data: { label: string; value: number; count: number }[]
  color?: string
}) {
  const W = 640, H = 130
  const PAD = { t: 12, r: 20, b: 32, l: 56 }
  const iW = W - PAD.l - PAD.r
  const iH = H - PAD.t - PAD.b
  const max = Math.max(...data.map(d => d.value), 1)

  const pts = data.map((d, i) => ({
    x: PAD.l + (i / Math.max(data.length - 1, 1)) * iW,
    y: PAD.t + (1 - d.value / max) * iH,
    ...d,
  }))

  const line = pts.reduce((p, pt, i) => {
    if (i === 0) return `M${pt.x},${pt.y}`
    const prev = pts[i - 1]
    const cx = (prev.x + pt.x) / 2
    return `${p} C${cx},${prev.y} ${cx},${pt.y} ${pt.x},${pt.y}`
  }, '')
  const area = `${line} L${pts[pts.length - 1].x},${PAD.t + iH} L${pts[0].x},${PAD.t + iH} Z`

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    y: PAD.t + iH - t * iH,
    val: Math.round(max * t),
  }))

  const step = Math.max(1, Math.ceil(data.length / 8))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="areag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={PAD.l} y1={t.y} x2={W - PAD.r} y2={t.y}
            stroke={i === 0 ? '#e2e8f0' : '#f1f5f9'}
            strokeWidth={i === 0 ? 1 : 0.5}
            strokeDasharray={i > 0 ? '3 3' : undefined} />
          <text x={PAD.l - 8} y={t.y + 4} textAnchor="end" fontSize="8.5" fill="#cbd5e1">
            {t.val === 0 ? '0' : t.val >= 1000 ? `${(t.val / 1000).toFixed(0)}k` : t.val}
          </text>
        </g>
      ))}

      <path d={area} fill="url(#areag)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />

      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={p.value > 0 ? 3.5 : 2}
            fill={p.value > 0 ? 'white' : '#f1f5f9'}
            stroke={p.value > 0 ? color : '#e2e8f0'} strokeWidth="2" />
          <title>{p.label} : {formatPrice(p.value)} ({p.count} cmde{p.count > 1 ? 's' : ''})</title>
          <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
        </g>
      ))}

      {pts.map((p, i) => i % step === 0 && (
        <text key={i} x={p.x} y={H - 6} textAnchor="middle" fontSize="8.5" fill="#94a3b8">
          {p.label}
        </text>
      ))}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// STATUS DONUT — redesigné
// ─────────────────────────────────────────────────────────────
function StatusDonut({ segments }: {
  segments: { key: string; label: string; value: number; color: string }[]
}) {
  const total = segments.reduce((s, d) => s + d.value, 0)
  if (total === 0) return (
    <p className="text-sm text-slate-300 text-center py-8">Aucune commande</p>
  )

  const r = 46, cx = 60, cy = 60, stroke = 18
  const arcs = segments.reduce<{
    angle: number
    arcs: { key: string; label: string; value: number; color: string; pct: number; path: string }[]
  }>(
    (state, seg) => {
      const pct = seg.value / total
      const sweep = pct * 359.99
      const startRad = (state.angle * Math.PI) / 180
      const endRad = ((state.angle + sweep) * Math.PI) / 180
      const largeArc = sweep > 180 ? 1 : 0
      const x1 = cx + r * Math.cos(startRad), y1 = cy + r * Math.sin(startRad)
      const x2 = cx + r * Math.cos(endRad), y2 = cy + r * Math.sin(endRad)

      return {
        angle: state.angle + sweep,
        arcs: [
          ...state.arcs,
          { ...seg, pct, path: `M${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2}` },
        ],
      }
    },
    { angle: -90, arcs: [] }
  ).arcs

  return (
    <div className="space-y-4">
      {/* Donut centré */}
      <div className="flex justify-center">
        <svg viewBox="0 0 120 120" className="w-32 h-32">
          {arcs.map(a => (
            <path key={a.key} d={a.path} fill="none" stroke={a.color}
              strokeWidth={stroke} strokeLinecap="round">
              <title>{a.label} : {a.value} ({Math.round(a.pct * 100)}%)</title>
            </path>
          ))}
          <circle cx={cx} cy={cy} r={r - stroke / 2 - 3} fill="white" />
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="800" fill="#0f172a">
            {total}
          </text>
          <text x={cx} y={cy + 11} textAnchor="middle" fontSize="9" fill="#94a3b8">
            commandes
          </text>
        </svg>
      </div>
      {/* Légende */}
      <div className="space-y-1.5">
        {arcs.filter(a => a.value > 0).map(a => (
          <div key={a.key} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
            <span className="text-sm text-slate-600 flex-1 font-medium">{a.label}</span>
            <span className="text-sm font-bold text-slate-800">{a.value}</span>
            <span className="text-xs text-slate-400 w-9 text-right tabular-nums">
              {Math.round(a.pct * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { orders, loadDemoData } = useCustomerStore()
  const { products } = useAdminProductsStore()

  useEffect(() => {
    if (orders.length === 0) loadDemoData(seedCustomers, seedOrders)
  }, [orders.length, loadDemoData])

  const [period, setPeriod] = useState<7 | 14 | 30>(14)

  // ── Core metrics
  const totalRevenue   = orders.reduce((s, o) => s + o.total, 0)
  const activeProducts = products.filter(p => p.isActive).length
  const avgOrder       = orders.length ? Math.round(totalRevenue / orders.length) : 0
  const lowStock       = products.filter(p => p.isActive && p.stock <= 5)
  const pendingCount   = orders.filter(o => o.status === 'pending').length
  const uniqueClients  = new Set(orders.map(o => o.address.email)).size

  // ── Area chart
  const areaData = useMemo(() => Array.from({ length: period }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (period - 1 - i))
    const key = d.toISOString().split('T')[0]
    const day = orders.filter(o => o.createdAt.startsWith(key))
    return {
      label: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      value: day.reduce((s, o) => s + o.total, 0),
      count: day.length,
    }
  }), [orders, period])

  // ── Previous period
  const prevData = useMemo(() => Array.from({ length: period }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (period * 2 - 1 - i))
    const key = d.toISOString().split('T')[0]
    const day = orders.filter(o => o.createdAt.startsWith(key))
    return { revenue: day.reduce((s, o) => s + o.total, 0), count: day.length }
  }), [orders, period])

  const currRevenue    = areaData.reduce((s, d) => s + d.value, 0)
  const prevRevenue    = prevData.reduce((s, d) => s + d.revenue, 0)
  const currOrderCount = areaData.reduce((s, d) => s + d.count, 0)
  const prevOrderCount = prevData.reduce((s, d) => s + d.count, 0)
  const activeDays     = areaData.filter(d => d.value > 0).length

  const sparkRev    = areaData.slice(-7).map(d => d.value)
  const sparkOrders = areaData.slice(-7).map(d => d.count)

  // ── Status donut data
  const statusSegments = useMemo(() => {
    const map: Record<string, number> = {}
    orders.forEach(o => { map[o.status] = (map[o.status] ?? 0) + 1 })
    return Object.entries(STATUS_CFG).map(([key, cfg]) => ({
      key,
      label: ORDER_STATUS_LABELS[key as keyof typeof ORDER_STATUS_LABELS] ?? key,
      value: map[key] ?? 0,
      color: cfg.dot,
    })).sort((a, b) => b.value - a.value)
  }, [orders])

  // ── Top products with images
  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; revenue: number; qty: number; image: string }>()
    orders.forEach(o => o.items.forEach(item => {
      const existing = map.get(item.productId) ?? {
        name: item.name, revenue: 0, qty: 0,
        image: getProductById(item.productId)?.images[0] ?? '',
      }
      map.set(item.productId, {
        ...existing,
        revenue: existing.revenue + item.price * item.quantity,
        qty:     existing.qty + item.quantity,
      })
    }))
    const list = [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
    const maxRev = Math.max(...list.map(p => p.revenue), 1)
    return list.map(p => ({ ...p, pct: (p.revenue / maxRev) * 100 }))
  }, [orders])

  // ── Recent orders
  const recentOrders = useMemo(() =>
    [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 7),
    [orders]
  )

  const todayLabel = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">

        {/* ══════════════ HEADER ══════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide"
                style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Boutique active
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Tableau de bord
            </h1>
            <p className="text-sm text-slate-400 mt-0.5 capitalize" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {todayLabel}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {pendingCount > 0 && (
              <Link href="/admin/orders"
                className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-yellow-100 transition-colors"
                style={{ fontFamily: 'var(--font-dm-sans)' }}>
                <Clock className="w-3.5 h-3.5" />
                {pendingCount} en attente
              </Link>
            )}
            <button
              onClick={() => { loadDemoData(seedCustomers, seedOrders); toast.success('Données rechargées !') }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:border-[#D4AF6A]/40 hover:bg-slate-50 transition-all"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A]" /> Démo
            </button>
          </div>
        </div>

        {/* ══════════════ KPI CARDS ══════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* CA — gold gradient */}
          <div className="col-span-2 lg:col-span-1 relative bg-gradient-to-br from-[#fdf8ef] to-white rounded-2xl border border-[#D4AF6A]/20 p-5 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#D4AF6A]/8 group-hover:bg-[#D4AF6A]/12 transition-colors pointer-events-none" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF6A]/15 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#D4AF6A]" />
              </div>
              <Sparkline values={sparkRev} color="#D4AF6A" />
            </div>
            <p className="text-[10px] text-[#C8956C] uppercase tracking-widest mb-1 font-medium"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Chiffre d&apos;affaires
            </p>
            <p className="text-[1.6rem] font-bold text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              {formatPrice(totalRevenue)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400">{period}j : {formatPrice(currRevenue)}</span>
              <TrendBadge current={currRevenue} previous={prevRevenue} />
            </div>
          </div>

          {/* Commandes */}
          <div className="relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-blue-50 group-hover:bg-blue-100/50 transition-colors pointer-events-none" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-blue-500" />
              </div>
              <Sparkline values={sparkOrders} color="#3B82F6" />
            </div>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-1 font-medium"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Commandes
            </p>
            <p className="text-[1.6rem] font-bold text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              {orders.length}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400">moy. {formatPrice(avgOrder)}</span>
              <TrendBadge current={currOrderCount} previous={prevOrderCount} />
            </div>
          </div>

          {/* Clients */}
          <div className="relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-purple-50 group-hover:bg-purple-100/50 transition-colors pointer-events-none" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              {lowStock.length > 0 && (
                <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                  {lowStock.length} alerte{lowStock.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-[10px] text-purple-400 uppercase tracking-widest mb-1 font-medium"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Clients actifs
            </p>
            <p className="text-[1.6rem] font-bold text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              {uniqueClients}
            </p>
            <p className="text-[10px] text-slate-400 mt-2">{activeProducts} produits en ligne</p>
          </div>

          {/* Codes promo */}
          <div className="relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-50 group-hover:bg-emerald-100/50 transition-colors pointer-events-none" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Tag className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <p className="text-[10px] text-emerald-500 uppercase tracking-widest mb-1 font-medium"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Codes promo
            </p>
            <p className="text-[1.6rem] font-bold text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              {promoCodes.length}
            </p>
            <p className="text-[10px] text-slate-400 mt-2">
              {promoCodes.filter(c => new Date(c.validUntil) >= new Date()).length} actifs
            </p>
          </div>
        </div>

        {/* ══════════════ REVENUE CHART ══════════════ */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1"
                style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Évolution des revenus
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#D4AF6A]" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {formatPrice(currRevenue)}
                </span>
                <TrendBadge current={currRevenue} previous={prevRevenue} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {activeDays} jour{activeDays !== 1 ? 's' : ''} avec ventes sur {period}j
                {prevRevenue > 0 && (
                  <span className="ml-2 text-slate-300">· période préc. {formatPrice(prevRevenue)}</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1 shrink-0">
              {([7, 14, 30] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    period === p
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {p}j
                </button>
              ))}
            </div>
          </div>

          {orders.length > 0 ? (
            <AreaChart data={areaData} />
          ) : (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <TrendingUp className="w-10 h-10 text-slate-200" />
              <p className="text-sm text-slate-400">Chargez les données démo pour explorer le graphique</p>
            </div>
          )}
        </div>

        {/* ══════════════ 3-COL ANALYTICS ══════════════ */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* ── Statuts commandes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900"
                style={{ fontFamily: 'var(--font-playfair)' }}>Statuts commandes</h3>
              <Link href="/admin/orders"
                className="text-xs font-semibold text-[#D4AF6A] hover:text-[#C8956C] transition-colors">
                Gérer →
              </Link>
            </div>

            <StatusDonut segments={statusSegments} />

            {orders.length > 0 && (
              <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-3 gap-3">
                {[
                  {
                    label: 'En cours',
                    value: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
                    cls: 'text-blue-600',
                    bg: 'bg-blue-50',
                  },
                  {
                    label: 'Livrées',
                    value: orders.filter(o => o.status === 'delivered').length,
                    cls: 'text-emerald-600',
                    bg: 'bg-emerald-50',
                  },
                  {
                    label: 'Annulées',
                    value: orders.filter(o => o.status === 'cancelled').length,
                    cls: 'text-red-500',
                    bg: 'bg-red-50',
                  },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl py-3 px-2 text-center`}>
                    <p className={`text-2xl font-bold ${s.cls}`}
                      style={{ fontFamily: 'var(--font-playfair)' }}>
                      {s.value}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Top ventes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900"
                style={{ fontFamily: 'var(--font-playfair)' }}>Top ventes</h3>
            </div>

            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3.5">
                    {/* Rang */}
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      i === 0 ? 'bg-[#D4AF6A] text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {i + 1}
                    </span>
                    {/* Image */}
                    <div className="w-11 h-13 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50"
                      style={{ height: 52 }}>
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                    </div>
                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#D4AF6A] to-[#C8956C] transition-all duration-700"
                            style={{ width: `${p.pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 shrink-0 tabular-nums">
                          {p.qty} vendu{p.qty > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    {/* Revenus */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#D4AF6A]"
                        style={{ fontFamily: 'var(--font-playfair)' }}>
                        {formatPrice(p.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-28 text-slate-300 gap-2">
                <Package className="w-8 h-8" />
                <p className="text-sm">Aucune vente enregistrée</p>
              </div>
            )}
          </div>

          {/* ── Commandes récentes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900"
                style={{ fontFamily: 'var(--font-playfair)' }}>Dernières commandes</h3>
              <Link href="/admin/orders"
                className="flex items-center gap-1 text-xs font-semibold text-[#D4AF6A] hover:text-[#C8956C] transition-colors">
                Tout voir <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-300 gap-2">
                <ShoppingCart className="w-8 h-8" />
                <p className="text-sm">Aucune commande</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 flex-1">
                {recentOrders.map(order => {
                  const cfg = STATUS_CFG[order.status]
                  const statusLabel = ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]
                  return (
                    <div key={order.id}
                      className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50/80 transition-colors">
                      {/* Indicateur statut */}
                      <div className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: cfg?.dot ?? '#94a3b8' }} />
                      {/* Infos commande */}
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm font-bold text-slate-800 leading-tight">
                          {order.number}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {order.address.firstName} {order.address.lastName}
                          <span className="text-slate-300 mx-1">·</span>
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      {/* Montant + statut */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-slate-800"
                          style={{ fontFamily: 'var(--font-playfair)' }}>
                          {formatPrice(order.total)}
                        </p>
                        <span className={`inline-block text-[11px] font-semibold mt-0.5 ${cfg?.text ?? 'text-slate-400'}`}>
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════ BOTTOM ROW ══════════════ */}
        <div className="grid lg:grid-cols-2 gap-5">

          {/* ── Alertes stock */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900"
                style={{ fontFamily: 'var(--font-playfair)' }}>Alertes stock</h3>
              <Link href="/admin/products?filter=lowstock"
                className="text-xs font-semibold text-[#D4AF6A] hover:text-[#C8956C] transition-colors">
                Voir tout →
              </Link>
            </div>

            {lowStock.length === 0 ? (
              <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-800">Stocks suffisants</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Aucun produit en stock critique</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {lowStock.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-4">
                    {/* Image */}
                    <div className={`w-12 rounded-xl overflow-hidden shrink-0 border ${
                      p.stock === 0 ? 'border-red-100 bg-red-50' : 'border-orange-100 bg-orange-50'
                    }`} style={{ height: 52 }}>
                      {p.images[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className={`w-4 h-4 ${p.stock === 0 ? 'text-red-300' : 'text-orange-300'}`} />
                        </div>
                      )}
                    </div>
                    {/* Nom + barre */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${p.stock === 0 ? 'bg-red-400' : 'bg-orange-400'}`}
                          style={{ width: `${Math.min((p.stock / 10) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    {/* Badge stock */}
                    {p.stock === 0 ? (
                      <span className="flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        Épuisé
                      </span>
                    ) : (
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
                        {p.stock} u.
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Accès rapide */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 mb-5"
              style={{ fontFamily: 'var(--font-playfair)' }}>Accès rapide</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  href: '/admin/products',
                  icon: Package,
                  label: 'Produits',
                  sub: `${activeProducts} actifs · ${products.length} au total`,
                  iconCls: 'text-purple-600',
                  bg: 'bg-purple-50',
                  border: 'hover:border-purple-200',
                },
                {
                  href: '/admin/orders',
                  icon: ShoppingCart,
                  label: 'Commandes',
                  sub: `${orders.length} · ${pendingCount} en attente`,
                  iconCls: 'text-blue-600',
                  bg: 'bg-blue-50',
                  border: 'hover:border-blue-200',
                },
                {
                  href: '/admin/customers',
                  icon: Users,
                  label: 'Clients',
                  sub: `${uniqueClients} client${uniqueClients > 1 ? 's' : ''} actif${uniqueClients > 1 ? 's' : ''}`,
                  iconCls: 'text-emerald-600',
                  bg: 'bg-emerald-50',
                  border: 'hover:border-emerald-200',
                },
                {
                  href: '/admin/promotions',
                  icon: Tag,
                  label: 'Promotions',
                  sub: `${promoCodes.filter(c => new Date(c.validUntil) >= new Date()).length} codes actifs`,
                  iconCls: 'text-orange-600',
                  bg: 'bg-orange-50',
                  border: 'hover:border-orange-200',
                },
              ].map(({ href, icon: Icon, label, sub, iconCls, bg, border }) => (
                <Link key={href} href={href}
                  className={`flex items-center gap-4 p-4 rounded-2xl border border-slate-100 ${border} hover:bg-slate-50 transition-all group`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bg} group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-5 h-5 ${iconCls}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
