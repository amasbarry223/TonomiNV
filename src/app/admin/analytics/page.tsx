'use client'

import { useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useCustomerStore, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/stores/customer-store'
import { useAdminProductsStore } from '@/stores/admin-products-store'
import { formatPrice } from '@/lib/product-display'
import { TrendingUp, ShoppingCart, Package, Users, Star } from 'lucide-react'

// ── Simple SVG Bar Chart ──────────────────────────────────────────────────────
function BarChart({ data, label }: { data: { name: string; value: number }[]; label: string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.name} className="flex items-center gap-3">
          <span className="w-24 text-[11px] text-slate-500 text-right shrink-0 truncate" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {d.name}
          </span>
          <div className="flex-1 h-7 bg-slate-100 rounded-lg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF6A] to-[#C8956C] rounded-lg flex items-center justify-end pr-2 transition-all duration-700"
              style={{ width: `${(d.value / max) * 100}%`, minWidth: d.value > 0 ? '2rem' : '0' }}
            >
              {d.value > 0 && (
                <span className="text-[10px] font-bold text-white">{d.value}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Donut Chart ────────────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, d) => s + d.value, 0)
  if (total === 0) return (
    <div className="flex items-center justify-center h-32 text-slate-400 text-sm">Aucune donnée</div>
  )

  let currentAngle = -90
  const radius = 40
  const cx = 60, cy = 60

  const paths = segments.map((seg) => {
    const pct = seg.value / total
    const angle = pct * 360
    const startAngle = (currentAngle * Math.PI) / 180
    currentAngle += angle
    const endAngle = (currentAngle * Math.PI) / 180
    const largeArc = angle > 180 ? 1 : 0
    const x1 = cx + radius * Math.cos(startAngle)
    const y1 = cy + radius * Math.sin(startAngle)
    const x2 = cx + radius * Math.cos(endAngle)
    const y2 = cy + radius * Math.sin(endAngle)
    return { path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`, ...seg }
  })

  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {paths.map((p) => (
          <path key={p.label} d={p.path} fill={p.color} className="hover:opacity-80 transition-opacity" />
        ))}
        <circle cx="60" cy="60" r="22" fill="white" />
        <text x="60" y="64" textAnchor="middle" className="text-xs font-bold" style={{ fontSize: '11px', fill: '#1e293b', fontWeight: 700 }}>
          {total}
        </text>
      </svg>
      <div className="space-y-2 flex-1">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-slate-600 flex-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>{s.label}</span>
            <span className="text-xs font-semibold text-slate-800">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const { orders } = useCustomerStore()
  const { products } = useAdminProductsStore()

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0)
    const avgOrder = orders.length ? revenue / orders.length : 0

    // Orders by status
    const byStatus = Object.entries(
      orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc }, {} as Record<string, number>)
    ).map(([status, value]) => ({
      label: ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] ?? status,
      value,
      color: { pending: '#EAB308', confirmed: '#3B82F6', processing: '#8B5CF6', shipped: '#6366F1', delivered: '#10B981', cancelled: '#EF4444' }[status] ?? '#94A3B8',
    }))

    // Revenue by category (from orders × product data)
    const productMap = new Map(products.map((p) => [p.id, p]))
    const revenueByCategory: Record<string, number> = {}
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const product = productMap.get(item.productId)
        const cat = product?.category ?? 'autre'
        revenueByCategory[cat] = (revenueByCategory[cat] ?? 0) + item.price * item.quantity
      })
    })
    const byCategoryData = Object.entries(revenueByCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value: Math.round(value / 1000) })) // en milliers

    // Stock by category
    const stockByCategory = Object.entries(
      products.reduce((acc, p) => { acc[p.category] = (acc[p.category] ?? 0) + p.stock; return acc }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)

    // Top products by rating
    const topProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5)

    // Low stock products
    const lowStock = products.filter((p) => p.stock <= 3 && p.isActive).slice(0, 5)

    return { revenue, avgOrder, byStatus, byCategoryData, stockByCategory, topProducts, lowStock }
  }, [orders, products])

  const kpis = [
    { label: 'Chiffre d\'affaires', value: formatPrice(stats.revenue), icon: TrendingUp, color: 'text-[#D4AF6A] bg-[#D4AF6A]/10' },
    { label: 'Commandes', value: String(orders.length), icon: ShoppingCart, color: 'text-blue-600 bg-blue-50' },
    { label: 'Panier moyen', value: stats.avgOrder ? formatPrice(Math.round(stats.avgOrder)) : '—', icon: Package, color: 'text-purple-600 bg-purple-50' },
    { label: 'Produits actifs', value: String(products.filter((p) => p.isActive).length), icon: Package, color: 'text-emerald-600 bg-emerald-50' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Analytics
          </h2>
          <p className="text-sm text-slate-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Vue d&apos;ensemble des performances de la boutique
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>{label}</p>
                  <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Orders by status */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 text-sm mb-5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Commandes par statut
            </h3>
            {stats.byStatus.length > 0 ? (
              <DonutChart segments={stats.byStatus} />
            ) : (
              <div className="flex items-center justify-center h-24 text-slate-400 text-sm">Aucune commande</div>
            )}
          </div>

          {/* Revenue by category */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 text-sm mb-5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Revenus par catégorie
              <span className="text-xs text-slate-400 font-normal ml-2">(en milliers FCFA)</span>
            </h3>
            {stats.byCategoryData.length > 0 ? (
              <BarChart data={stats.byCategoryData} label="revenus" />
            ) : (
              <div className="flex items-center justify-center h-24 text-slate-400 text-sm">Aucune donnée</div>
            )}
          </div>

          {/* Stock by category */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 text-sm mb-5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Stock par catégorie
            </h3>
            <BarChart data={stats.stockByCategory} label="stock" />
          </div>

          {/* Top products */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 text-sm mb-5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Top produits (par note)
            </h3>
            <div className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF6A]/15 text-[#D4AF6A] text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400">{p.category}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3 h-3 text-[#D4AF6A] fill-[#D4AF6A]" />
                    <span className="text-xs font-semibold text-slate-700">{p.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs font-bold text-[#D4AF6A] shrink-0 w-24 text-right">{formatPrice(p.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low stock alert */}
        {stats.lowStock.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <h3 className="font-semibold text-orange-800 text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              ⚠️ Stock faible ({stats.lowStock.length} produit{stats.lowStock.length > 1 ? 's' : ''})
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.lowStock.map((p) => (
                <div key={p.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-orange-100">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{p.name}</p>
                    <p className="text-[10px] text-orange-600 font-semibold">
                      {p.stock === 0 ? 'Épuisé' : `${p.stock} restant${p.stock > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
