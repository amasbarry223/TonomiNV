'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, ShoppingCart, Package, Mail, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DashboardData {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalRevenue: number
  ordersByStatus: {
    pending: number
    confirmed: number
    shipped: number
    delivered: number
    cancelled: number
  }
  recentOrders: Array<{
    id: string
    customerName: string
    customerPhone: string
    total: number
    status: string
    createdAt: string
  }>
  topProducts: Array<{
    productId: string
    name: string
    totalSold: number
  }>
  monthlyRevenue: Array<{
    month: string
    revenue: number
  }>
  unreadMessages: number
  subscriberCount: number
}

// ─── Chart Configs ───────────────────────────────────────────────────────────

const revenueChartConfig: ChartConfig = {
  revenue: {
    label: 'Revenu',
    color: '#D4AF6A',
  },
}

const statusChartConfig: ChartConfig = {
  pending: {
    label: 'En attente',
    color: '#E8913A',
  },
  confirmed: {
    label: 'Confirmée',
    color: '#3B82F6',
  },
  shipped: {
    label: 'Expédiée',
    color: '#D4AF6A',
  },
  delivered: {
    label: 'Livrée',
    color: '#22C55E',
  },
  cancelled: {
    label: 'Annulée',
    color: '#EF4444',
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatFCFA(amount: number): string {
  return amount.toLocaleString('fr-FR').replace(/\s/g, ' ') + ' FCFA'
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const statusBadgeClasses: Record<string, string> = {
  pending: 'bg-orange-100 text-orange-700 border-orange-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-amber-100 text-amber-700 border-amber-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
}

// ─── Skeleton Loaders ────────────────────────────────────────────────────────

function KPISkeleton() {
  return (
    <Card className="border-gold/20 bg-warm-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card className="border-gold/20 bg-warm-white">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

function TableSkeleton() {
  return (
    <Card className="border-gold/20 bg-warm-white">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-44" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/6" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KPICard({
  icon: Icon,
  value,
  label,
  iconBg = 'bg-gold/15',
  valueColor = 'text-text-dark',
}: {
  icon: React.ElementType
  value: string
  label: string
  iconBg?: string
  valueColor?: string
}) {
  return (
    <Card className="border-gold/20 bg-warm-white warm-shadow transition-shadow hover:warm-shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', iconBg)}>
            <Icon className="h-6 w-6 text-caramel" />
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn('text-2xl font-bold tracking-tight truncate', valueColor)}>
              {value}
            </p>
            <p className="text-sm text-text-mid">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/dashboard')
        if (!res.ok) throw new Error('Erreur lors du chargement des données')
        const json: DashboardData = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  // ─── Loading State ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-dark font-serif">Tableau de bord</h1>
          <p className="text-text-mid text-sm mt-1">Vue d&apos;ensemble de votre boutique</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <KPISkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TableSkeleton />
          <TableSkeleton />
        </div>
      </div>
    )
  }

  // ─── Error State ────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-text-dark mb-2">Erreur de chargement</h2>
        <p className="text-text-mid text-sm text-center max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gold text-white rounded-lg text-sm font-medium hover:bg-caramel transition-colors"
        >
          Réessayer
        </button>
      </div>
    )
  }

  if (!data) return null

  // ─── Prepare Chart Data ─────────────────────────────────────────────────

  const ordersByStatusData = [
    { status: 'En attente', pending: data.ordersByStatus.pending },
    { status: 'Confirmée', confirmed: data.ordersByStatus.confirmed },
    { status: 'Expédiée', shipped: data.ordersByStatus.shipped },
    { status: 'Livrée', delivered: data.ordersByStatus.delivered },
    { status: 'Annulée', cancelled: data.ordersByStatus.cancelled },
  ]

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-text-dark font-serif">Tableau de bord</h1>
        <p className="text-text-mid text-sm mt-1">Vue d&apos;ensemble de votre boutique</p>
      </div>

      {/* ─── KPI Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={TrendingUp}
          value={formatFCFA(data.totalRevenue)}
          label="Chiffre d'affaires"
          iconBg="bg-gold/15"
        />
        <KPICard
          icon={ShoppingCart}
          value={data.totalOrders.toString()}
          label="Commandes"
          iconBg="bg-caramel/15"
        />
        <KPICard
          icon={Package}
          value={data.totalProducts.toString()}
          label="Produits"
          iconBg="bg-tonomi-accent/15"
        />
        <KPICard
          icon={Mail}
          value={data.unreadMessages.toString()}
          label="Messages non lus"
          iconBg="bg-copper/15"
        />
      </div>

      {/* ─── Charts Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue - Area Chart */}
        <Card className="border-gold/20 bg-warm-white warm-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-text-dark">
              Revenus mensuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[280px] w-full">
              <AreaChart
                data={data.monthlyRevenue}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF6A" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#D4AF6A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#D4AF6A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6D3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#6B4C3B', fontSize: 12 }}
                  axisLine={{ stroke: '#F0E6D3' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6B4C3B', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) =>
                    value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
                  }
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatFCFA(value as number)}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D4AF6A"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Orders by Status - Bar Chart */}
        <Card className="border-gold/20 bg-warm-white warm-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-text-dark">
              Commandes par statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusChartConfig} className="h-[280px] w-full">
              <BarChart
                data={ordersByStatusData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6D3" vertical={false} />
                <XAxis
                  dataKey="status"
                  tick={{ fill: '#6B4C3B', fontSize: 11 }}
                  axisLine={{ stroke: '#F0E6D3' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6B4C3B', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="pending" name="En attente" fill="#E8913A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="confirmed" name="Confirmée" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="shipped" name="Expédiée" fill="#D4AF6A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delivered" name="Livrée" fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelled" name="Annulée" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ─── Tables Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border-gold/20 bg-warm-white warm-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-text-dark">
              Commandes récentes
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/10 hover:bg-transparent">
                    <TableHead className="text-text-mid font-semibold">Client</TableHead>
                    <TableHead className="text-text-mid font-semibold">Montant</TableHead>
                    <TableHead className="text-text-mid font-semibold">Statut</TableHead>
                    <TableHead className="text-text-mid font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-text-mid py-8">
                        Aucune commande récente
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.recentOrders.map((order) => (
                      <TableRow key={order.id} className="border-gold/10">
                        <TableCell className="font-medium text-text-dark">
                          {order.customerName || order.customerPhone}
                        </TableCell>
                        <TableCell className="text-text-dark">
                          {formatFCFA(order.total)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs font-medium',
                              statusBadgeClasses[order.status] ||
                                'bg-beige text-text-mid border-gold/20'
                            )}
                          >
                            {statusLabels[order.status] || order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-text-mid text-sm">
                          {formatDate(order.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-gold/20 bg-warm-white warm-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-text-dark">
              Produits les plus vendus
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/10 hover:bg-transparent">
                    <TableHead className="text-text-mid font-semibold">Produit</TableHead>
                    <TableHead className="text-text-mid font-semibold">Ventes</TableHead>
                    <TableHead className="text-text-mid font-semibold">Revenu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-text-mid py-8">
                        Aucune donnée de vente
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.topProducts.map((product) => (
                      <TableRow key={product.productId} className="border-gold/10">
                        <TableCell className="font-medium text-text-dark max-w-[180px] truncate">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-xs font-semibold text-caramel">
                              {product.totalSold}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="text-text-mid">
                          —
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Quick Stats Footer ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-beige/60 border border-gold/10 p-4 text-center">
          <p className="text-2xl font-bold text-caramel">{data.totalCategories}</p>
          <p className="text-xs text-text-mid mt-1">Catégories</p>
        </div>
        <div className="rounded-xl bg-beige/60 border border-gold/10 p-4 text-center">
          <p className="text-2xl font-bold text-caramel">{data.ordersByStatus.pending}</p>
          <p className="text-xs text-text-mid mt-1">Commandes en attente</p>
        </div>
        <div className="rounded-xl bg-beige/60 border border-gold/10 p-4 text-center">
          <p className="text-2xl font-bold text-caramel">{data.ordersByStatus.shipped}</p>
          <p className="text-xs text-text-mid mt-1">En cours d&apos;expédition</p>
        </div>
        <div className="rounded-xl bg-beige/60 border border-gold/10 p-4 text-center">
          <p className="text-2xl font-bold text-caramel">{data.subscriberCount}</p>
          <p className="text-xs text-text-mid mt-1">Abonnés newsletter</p>
        </div>
      </div>
    </div>
  )
}
