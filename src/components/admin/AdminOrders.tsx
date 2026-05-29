'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import {
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'

// Types
interface OrderItem {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
  color: string
  size: string
  image: string
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  discount: number
  total: number
  status: string
  promoCode: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Status config
const statusConfig: Record<string, { label: string; badgeClass: string; icon: React.ReactNode }> = {
  pending: {
    label: 'En attente',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: <Clock size={14} />,
  },
  confirmed: {
    label: 'Confirmée',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <CheckCircle size={14} />,
  },
  shipped: {
    label: 'Expédiée',
    badgeClass: 'bg-gold/15 text-caramel border-gold/30',
    icon: <Truck size={14} />,
  },
  delivered: {
    label: 'Livrée',
    badgeClass: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle size={14} />,
  },
  cancelled: {
    label: 'Annulée',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    icon: <XCircle size={14} />,
  },
}

const statusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
]

// Helpers
function formatFCFA(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'
}

function formatOrderId(id: string): string {
  return id.substring(0, 8).toUpperCase()
}

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.pending
  return (
    <Badge variant="outline" className={`${config.badgeClass} gap-1 font-medium`}>
      {config.icon}
      {config.label}
    </Badge>
  )
}

// Loading skeleton
function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-lg" />
        ))}
      </div>
      <Card className="border-gold/15">
        <CardContent className="p-0">
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gold/10 last:border-0">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    all: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  })

  // Detail dialog
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [editStatus, setEditStatus] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [saving, setSaving] = useState(false)

  // Fetch orders
  const fetchOrders = useCallback(async (status: string, page: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (status && status !== 'all') params.set('status', status)
      params.set('page', page.toString())
      params.set('limit', '10')
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/orders?${params.toString()}`)
      if (!res.ok) throw new Error('Erreur lors du chargement')
      const data = await res.json()

      setOrders(data.orders || [])
      if (data.pagination) {
        setPagination(data.pagination)
      } else {
        setPagination({
          page: data.page || 1,
          limit: 10,
          total: data.total || 0,
          totalPages: data.totalPages || 1,
        })
      }
    } catch {
      toast.error('Erreur lors du chargement des commandes')
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  // Fetch status counts
  const fetchStatusCounts = useCallback(async () => {
    try {
      const statuses = ['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
      const counts: Record<string, number> = { all: 0 }

      const results = await Promise.all(
        statuses.map(async (status) => {
          const params = new URLSearchParams()
          if (status) params.set('status', status)
          params.set('limit', '1')
          const res = await fetch(`/api/orders?${params.toString()}`)
          if (!res.ok) return { status, total: 0 }
          const data = await res.json()
          return { status, total: data.pagination?.total || data.total || 0 }
        })
      )

      results.forEach((r) => {
        if (r.status === '') {
          counts.all = r.total
        } else {
          counts[r.status] = r.total
        }
      })

      setStatusCounts(counts)
    } catch {
      // silently fail for counts
    }
  }, [])

  // Fetch order detail
  const fetchOrderDetail = useCallback(async (id: string) => {
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/orders/${id}`)
      if (!res.ok) throw new Error('Erreur')
      const data = await res.json()
      setSelectedOrder(data)
      setEditStatus(data.status)
      setEditNotes(data.notes || '')
    } catch {
      toast.error('Erreur lors du chargement du détail')
    } finally {
      setDetailLoading(false)
    }
  }, [])

  // Update order status inline
  const updateOrderStatus = useCallback(async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Erreur')
      const updated = await res.json()

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      )

      const config = statusConfig[status]
      toast.success(`Statut mis à jour : ${config?.label || status}`)
      fetchStatusCounts()
    } catch {
      toast.error('Erreur lors de la mise à jour du statut')
    }
  }, [fetchStatusCounts])

  // Save detail changes
  const saveDetailChanges = useCallback(async () => {
    if (!selectedOrder) return
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: editStatus, notes: editNotes }),
      })
      if (!res.ok) throw new Error('Erreur')
      const updated = await res.json()

      setSelectedOrder(updated)
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, status: editStatus, notes: editNotes }
            : o
        )
      )
      toast.success('Commande mise à jour avec succès')
      setDetailOpen(false)
      fetchStatusCounts()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }, [selectedOrder, editStatus, editNotes, fetchStatusCounts])

  // Delete order
  const deleteOrder = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erreur')
      toast.success('Commande supprimée')
      fetchOrders(activeTab, pagination.page)
      fetchStatusCounts()
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }, [activeTab, pagination.page, fetchOrders, fetchStatusCounts])

  // Initial load
  useEffect(() => {
    fetchOrders('all', 1)
    fetchStatusCounts()
  }, [fetchOrders, fetchStatusCounts])

  // Tab change handler
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setSearchQuery('')
    fetchOrders(value, 1)
  }

  // Search handler
  const handleSearch = () => {
    fetchOrders(activeTab, 1)
  }

  // Open detail
  const openDetail = (id: string) => {
    fetchOrderDetail(id)
    setDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-text-dark">
            Commandes
          </h2>
          <p className="text-sm text-text-mid mt-1">
            Gérer et suivre les commandes clients
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="bg-warm-white border border-gold/15 h-auto flex-wrap gap-1 p-1">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-gold/15 data-[state=active]:text-caramel text-text-mid text-xs sm:text-sm"
          >
            Toutes ({statusCounts.all})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 text-text-mid text-xs sm:text-sm"
          >
            En attente ({statusCounts.pending || 0})
          </TabsTrigger>
          <TabsTrigger
            value="confirmed"
            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-text-mid text-xs sm:text-sm"
          >
            Confirmées ({statusCounts.confirmed || 0})
          </TabsTrigger>
          <TabsTrigger
            value="shipped"
            className="data-[state=active]:bg-gold/15 data-[state=active]:text-caramel text-text-mid text-xs sm:text-sm"
          >
            Expédiées ({statusCounts.shipped || 0})
          </TabsTrigger>
          <TabsTrigger
            value="delivered"
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 text-text-mid text-xs sm:text-sm"
          >
            Livrées ({statusCounts.delivered || 0})
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700 text-text-mid text-xs sm:text-sm"
          >
            Annulées ({statusCounts.cancelled || 0})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-mid/50" />
          <Input
            placeholder="Rechercher par nom, email, n° commande..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9 bg-warm-white border-gold/20 focus:border-gold focus:ring-gold/20 text-sm"
          />
        </div>
        <Button
          onClick={handleSearch}
          variant="outline"
          className="border-gold/20 text-text-mid hover:bg-gold/10 hover:text-caramel"
        >
          <Search size={16} />
        </Button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <OrdersSkeleton />
      ) : orders.length === 0 ? (
        <Card className="border-gold/15">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-beige/60 flex items-center justify-center">
                <Clock size={28} className="text-text-mid/40" />
              </div>
              <p className="text-text-mid font-medium">Aucune commande trouvée</p>
              <p className="text-sm text-text-mid/60">
                Les commandes apparaîtront ici dès qu&apos;elles seront passées
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-gold/15 overflow-hidden">
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gold/15 hover:bg-transparent">
                    <TableHead className="text-text-mid font-semibold">N° Commande</TableHead>
                    <TableHead className="text-text-mid font-semibold">Client</TableHead>
                    <TableHead className="text-text-mid font-semibold text-center">Articles</TableHead>
                    <TableHead className="text-text-mid font-semibold">Total</TableHead>
                    <TableHead className="text-text-mid font-semibold">Statut</TableHead>
                    <TableHead className="text-text-mid font-semibold">Date</TableHead>
                    <TableHead className="text-text-mid font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-b border-gold/10 hover:bg-beige/30">
                      <TableCell className="font-mono text-sm font-semibold text-text-dark">
                        #{formatOrderId(order.id)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-text-dark text-sm">{order.customerName}</p>
                          <p className="text-xs text-text-mid">{order.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-beige/80 text-text-mid text-xs font-semibold">
                          {order.items?.length || 0}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-text-dark">
                        {formatFCFA(order.total)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={order.status} />
                          <Select
                                            value={order.status}
                                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                                          >
                                            <SelectTrigger
                                              size="sm"
                                              className="w-7 h-7 p-0 border-0 bg-transparent shadow-none hover:bg-beige/60 [&>svg]:hidden"
                                            >
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {statusOptions.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                  {opt.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-text-mid">
                        {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDetail(order.id)}
                            className="h-8 w-8 text-text-mid hover:text-caramel hover:bg-gold/10"
                            title="Voir le détail"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteOrder(order.id)}
                            className="h-8 w-8 text-text-mid hover:text-red-600 hover:bg-red-50"
                            title="Supprimer"
                          >
                            <XCircle size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gold/10">
              {orders.map((order) => (
                <div key={order.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-sm font-semibold text-text-dark">
                        #{formatOrderId(order.id)}
                      </p>
                      <p className="text-sm font-medium text-text-dark mt-0.5">{order.customerName}</p>
                      <p className="text-xs text-text-mid">{order.customerEmail}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-mid">
                      {order.items?.length || 0} article(s) · {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                    </span>
                    <span className="font-semibold text-text-dark">{formatFCFA(order.total)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger size="sm" className="w-auto min-w-[140px] border-gold/20 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDetail(order.id)}
                        className="h-8 w-8 text-text-mid hover:text-caramel hover:bg-gold/10"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteOrder(order.id)}
                        className="h-8 w-8 text-text-mid hover:text-red-600 hover:bg-red-50"
                      >
                        <XCircle size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="border-t border-gold/10 px-6 py-3 flex items-center justify-between">
              <p className="text-sm text-text-mid">
                {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchOrders(activeTab, pagination.page - 1)}
                  className="border-gold/20 text-text-mid hover:bg-gold/10 hover:text-caramel h-8 text-xs"
                >
                  Précédent
                </Button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1]
                    const showEllipsis = prev !== undefined && p - prev > 1
                    return (
                      <span key={p} className="flex items-center">
                        {showEllipsis && <span className="px-1 text-text-mid/50">…</span>}
                        <Button
                          variant={p === pagination.page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => fetchOrders(activeTab, p)}
                          className={
                            p === pagination.page
                              ? 'bg-gold text-warm-white hover:bg-gold/90 h-8 w-8 text-xs'
                              : 'border-gold/20 text-text-mid hover:bg-gold/10 hover:text-caramel h-8 w-8 text-xs'
                          }
                        >
                          {p}
                        </Button>
                      </span>
                    )
                  })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchOrders(activeTab, pagination.page + 1)}
                  className="border-gold/20 text-text-mid hover:bg-gold/10 hover:text-caramel h-8 text-xs"
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-warm-white border-gold/20">
          {detailLoading ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <Separator />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Separator />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : selectedOrder ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-xl text-text-dark flex items-center gap-3">
                  Commande #{formatOrderId(selectedOrder.id)}
                  <StatusBadge status={selectedOrder.status} />
                </DialogTitle>
              </DialogHeader>

              {/* Customer Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-text-dark mb-2">Informations client</h4>
                  <div className="bg-cream/60 rounded-lg p-4 space-y-1">
                    <p className="text-sm text-text-dark font-medium">{selectedOrder.customerName}</p>
                    <p className="text-sm text-text-mid">{selectedOrder.customerEmail}</p>
                    <p className="text-sm text-text-mid">{selectedOrder.customerPhone}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-semibold text-text-dark mb-2">Articles commandés</h4>
                  <div className="bg-cream/60 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gold/15 hover:bg-transparent">
                          <TableHead className="text-text-mid text-xs font-semibold">Produit</TableHead>
                          <TableHead className="text-text-mid text-xs font-semibold text-right">Prix</TableHead>
                          <TableHead className="text-text-mid text-xs font-semibold text-center">Qté</TableHead>
                          <TableHead className="text-text-mid text-xs font-semibold">Couleur</TableHead>
                          <TableHead className="text-text-mid text-xs font-semibold">Taille</TableHead>
                          <TableHead className="text-text-mid text-xs font-semibold text-right">Sous-total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items?.map((item) => (
                          <TableRow key={item.id} className="border-b border-gold/10 hover:bg-beige/20">
                            <TableCell className="text-sm font-medium text-text-dark">
                              {item.productName}
                            </TableCell>
                            <TableCell className="text-sm text-text-mid text-right">
                              {formatFCFA(item.price)}
                            </TableCell>
                            <TableCell className="text-sm text-text-dark text-center font-medium">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-sm text-text-mid">
                              {item.color || '—'}
                            </TableCell>
                            <TableCell className="text-sm text-text-mid">
                              {item.size || '—'}
                            </TableCell>
                            <TableCell className="text-sm font-semibold text-text-dark text-right">
                              {formatFCFA(item.price * item.quantity)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-cream/60 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-mid">Sous-total</span>
                    <span className="text-text-dark">{formatFCFA(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-text-mid">Réduction{selectedOrder.promoCode ? ` (${selectedOrder.promoCode})` : ''}</span>
                      <span className="text-green-600">-{formatFCFA(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <Separator className="bg-gold/20" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-text-dark">Total</span>
                    <span className="text-caramel text-lg">{formatFCFA(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-text-mid">
                  <Clock size={14} />
                  <span>Commande passée le {format(new Date(selectedOrder.createdAt), 'dd/MM/yyyy à HH:mm')}</span>
                </div>

                <Separator className="bg-gold/20" />

                {/* Edit Status & Notes */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-text-dark">Statut de la commande</Label>
                    <Select value={editStatus} onValueChange={setEditStatus}>
                      <SelectTrigger className="w-full border-gold/20">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-text-dark">Notes</Label>
                    <Textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Ajouter des notes internes..."
                      className="min-h-[80px] border-gold/20 focus:border-gold bg-warm-white resize-none"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDetailOpen(false)}
                  className="border-gold/20 text-text-mid hover:bg-beige/60"
                >
                  Annuler
                </Button>
                <Button
                  onClick={saveDetailChanges}
                  disabled={saving}
                  className="bg-gold hover:bg-gold/90 text-warm-white"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
