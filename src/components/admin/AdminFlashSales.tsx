'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Edit, Trash2, Zap, Clock, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface FlashSale {
  id: string
  productId: string
  discount: number
  stockLeft: number
  totalStock: number
  endsAt: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  pricePromo: number | null
  images: string | string[]
  category: string
}

interface FlashSaleFormData {
  productId: string
  discount: number
  totalStock: number
  stockLeft: number
  endsAt: string
  isActive: boolean
}

const emptyForm: FlashSaleFormData = {
  productId: '',
  discount: 0,
  totalStock: 0,
  stockLeft: 0,
  endsAt: '',
  isActive: true,
}

function formatFCFA(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'
}

function isExpired(endsAt: string): boolean {
  return new Date(endsAt) < new Date()
}

function getStockPercentage(stockLeft: number, totalStock: number): number {
  if (totalStock === 0) return 0
  return Math.round((stockLeft / totalStock) * 100)
}

function getStockBarColor(stockLeft: number, totalStock: number): string {
  const pct = getStockPercentage(stockLeft, totalStock)
  if (pct > 50) return 'bg-emerald-500'
  if (pct >= 20) return 'bg-orange-400'
  return 'bg-red-500'
}

function getStockBarBgColor(stockLeft: number, totalStock: number): string {
  const pct = getStockPercentage(stockLeft, totalStock)
  if (pct > 50) return 'bg-emerald-100'
  if (pct >= 20) return 'bg-orange-100'
  return 'bg-red-100'
}

function formatEndsAt(endsAt: string): string {
  try {
    const date = new Date(endsAt)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return endsAt
  }
}

function getTimeRemaining(endsAt: string): string {
  const now = new Date()
  const end = new Date(endsAt)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return 'Expirée'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}j ${hours}h restants`
  if (hours > 0) return `${hours}h ${minutes}min restants`
  return `${minutes}min restants`
}

export default function AdminFlashSales() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState<FlashSaleFormData>(emptyForm)

  const activeSalesCount = useMemo(
    () => flashSales.filter((fs) => fs.isActive && !isExpired(fs.endsAt)).length,
    [flashSales]
  )

  const productMap = useMemo(() => {
    const map: Record<string, Product> = {}
    products.forEach((p) => {
      map[p.id] = p
    })
    return map
  }, [products])

  const fetchFlashSales = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/flash-sales')
      if (!res.ok) throw new Error('Erreur lors du chargement')
      const data = await res.json()
      setFlashSales(data)
    } catch {
      toast.error('Erreur lors du chargement des ventes flash')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products?limit=100')
      if (!res.ok) throw new Error('Erreur lors du chargement')
      const data = await res.json()
      setProducts(data.products || data)
    } catch {
      toast.error('Erreur lors du chargement des produits')
    }
  }, [])

  useEffect(() => {
    fetchFlashSales()
    fetchProducts()
  }, [fetchFlashSales, fetchProducts])

  const openAddDialog = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (fs: FlashSale) => {
    setEditingId(fs.id)
    setForm({
      productId: fs.productId,
      discount: fs.discount,
      totalStock: fs.totalStock,
      stockLeft: fs.stockLeft,
      endsAt: fs.endsAt.includes('T')
        ? fs.endsAt.slice(0, 16)
        : fs.endsAt,
      isActive: fs.isActive,
    })
    setDialogOpen(true)
  }

  const handleSave = useCallback(async () => {
    if (!form.productId) {
      toast.error('Veuillez sélectionner un produit')
      return
    }
    if (form.discount <= 0 || form.discount > 99) {
      toast.error('La réduction doit être entre 1 et 99%')
      return
    }
    if (form.totalStock <= 0) {
      toast.error('Le stock total doit être supérieur à 0')
      return
    }
    if (form.stockLeft < 0 || form.stockLeft > form.totalStock) {
      toast.error('Le stock restant est invalide')
      return
    }
    if (!form.endsAt) {
      toast.error('La date de fin est requise')
      return
    }

    try {
      setSaving(true)
      const url = editingId
        ? `/api/flash-sales/${editingId}`
        : '/api/flash-sales'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: form.productId,
          discount: form.discount,
          totalStock: form.totalStock,
          stockLeft: form.stockLeft,
          endsAt: form.endsAt,
          isActive: form.isActive,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde')
      }

      toast.success(
        editingId
          ? 'Vente flash modifiée avec succès'
          : 'Vente flash créée avec succès'
      )
      setDialogOpen(false)
      fetchFlashSales()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
      )
    } finally {
      setSaving(false)
    }
  }, [editingId, form, fetchFlashSales])

  const openDeleteDialog = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = useCallback(async () => {
    if (!deletingId) return

    try {
      setDeleting(true)
      const res = await fetch(`/api/flash-sales/${deletingId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression')
      }

      toast.success('Vente flash supprimée avec succès')
      setDeleteDialogOpen(false)
      setDeletingId(null)
      fetchFlashSales()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erreur lors de la suppression'
      )
    } finally {
      setDeleting(false)
    }
  }, [deletingId, fetchFlashSales])

  const handleToggleActive = useCallback(
    async (fs: FlashSale) => {
      try {
        const res = await fetch(`/api/flash-sales/${fs.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !fs.isActive }),
        })

        if (!res.ok) throw new Error('Erreur lors de la mise à jour')

        toast.success(
          fs.isActive
            ? 'Vente flash désactivée'
            : 'Vente flash activée'
        )
        fetchFlashSales()
      } catch {
        toast.error('Erreur lors de la mise à jour du statut')
      }
    },
    [fetchFlashSales]
  )

  const getFlashSaleToDelete = () => {
    if (!deletingId) return null
    return flashSales.find((fs) => fs.id === deletingId)
  }

  const getProductName = (productId: string) => {
    const product = productMap[productId]
    return product ? product.name : productId
  }

  const getProductPrice = (productId: string, discount: number) => {
    const product = productMap[productId]
    if (!product) return null
    const originalPrice = product.pricePromo || product.price
    const salePrice = Math.round(originalPrice * (1 - discount / 100))
    return { originalPrice, salePrice }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-tonomi-accent/15 flex items-center justify-center">
            <Zap size={20} className="text-caramel" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-text-dark">
              Ventes Flash
            </h1>
            <p className="text-sm text-text-mid">
              {activeSalesCount} vente{activeSalesCount !== 1 ? 's' : ''} active{activeSalesCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <Button
          onClick={openAddDialog}
          className="btn-gold gap-2 px-6"
        >
          <Plus size={16} />
          Créer une vente flash
        </Button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="glass-card overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-7 w-14 rounded-full" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-5 w-10" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && flashSales.length === 0 && (
        <Card className="glass-card p-12 text-center">
          <Zap size={48} className="mx-auto text-text-mid/40 mb-4" />
          <h3 className="font-serif text-lg text-text-dark mb-2">
            Aucune vente flash
          </h3>
          <p className="text-sm text-text-mid mb-6">
            Créez votre première vente flash pour proposer des offres limitées.
          </p>
          <Button onClick={openAddDialog} className="btn-gold gap-2">
            <Plus size={16} />
            Créer une vente flash
          </Button>
        </Card>
      )}

      {/* Flash Sales Grid */}
      {!loading && flashSales.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashSales.map((fs) => {
            const expired = isExpired(fs.endsAt)
            const outOfStock = fs.stockLeft === 0
            const stockPct = getStockPercentage(fs.stockLeft, fs.totalStock)
            const prices = getProductPrice(fs.productId, fs.discount)

            return (
              <Card
                key={fs.id}
                className={`glass-card overflow-hidden warm-shadow transition-all duration-300 group ${
                  expired || outOfStock
                    ? 'opacity-70'
                    : 'hover:warm-shadow-lg'
                }`}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Top: Product name + Discount badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-base font-semibold text-text-dark leading-tight truncate">
                        {getProductName(fs.productId)}
                      </h3>
                      {prices && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold text-caramel">
                            {formatFCFA(prices.salePrice)}
                          </span>
                          <span className="text-xs text-text-mid line-through">
                            {formatFCFA(prices.originalPrice)}
                          </span>
                        </div>
                      )}
                    </div>
                    <Badge className="bg-tonomi-accent/15 text-caramel border border-tonomi-accent/30 shrink-0 font-bold text-sm px-2.5 py-0.5">
                      -{fs.discount}%
                    </Badge>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="space-y-1.5">
                    <div className={`w-full h-2.5 rounded-full overflow-hidden ${getStockBarBgColor(fs.stockLeft, fs.totalStock)}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getStockBarColor(fs.stockLeft, fs.totalStock)}`}
                        style={{ width: `${stockPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-mid">
                        {fs.stockLeft} / {fs.totalStock} restants
                      </span>
                      <span className={`text-xs font-medium ${
                        stockPct > 50
                          ? 'text-emerald-600'
                          : stockPct >= 20
                            ? 'text-orange-500'
                            : 'text-red-500'
                      }`}>
                        {stockPct}%
                      </span>
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-text-mid shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-text-mid">
                        {formatEndsAt(fs.endsAt)}
                      </p>
                      {!expired && (
                        <p className={`text-xs font-medium ${
                          getTimeRemaining(fs.endsAt).includes('min restants')
                            ? 'text-red-500'
                            : 'text-caramel'
                        }`}>
                          {getTimeRemaining(fs.endsAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {expired && (
                      <Badge className="bg-text-mid/10 text-text-mid border border-text-mid/20 text-xs">
                        Expirée
                      </Badge>
                    )}
                    {outOfStock && !expired && (
                      <Badge className="bg-red-50 text-red-600 border border-red-200 text-xs">
                        Épuisé
                      </Badge>
                    )}
                  </div>

                  {/* Bottom: Active switch + Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gold/10">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={fs.isActive && !expired}
                        disabled={expired}
                        onCheckedChange={() => handleToggleActive(fs)}
                        className={`${
                          fs.isActive && !expired
                            ? 'data-[state=checked]:bg-emerald-500'
                            : ''
                        }`}
                      />
                      <span className={`text-xs ${
                        fs.isActive && !expired
                          ? 'text-emerald-600 font-medium'
                          : 'text-text-mid'
                      }`}>
                        {fs.isActive && !expired ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(fs)}
                        className="gap-1 h-8 w-8 p-0 border-gold/30 text-text-mid hover:bg-gold/10 hover:text-caramel hover:border-gold/50"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(fs.id)}
                        className="gap-1 h-8 w-8 p-0 border-gold/30 text-text-mid hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-warm-white border-gold/20 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-text-dark">
              {editingId ? 'Modifier la vente flash' : 'Nouvelle vente flash'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Product Select */}
            <div className="space-y-2">
              <Label htmlFor="fs-product" className="text-text-dark text-sm font-medium">
                Produit <span className="text-caramel">*</span>
              </Label>
              <Select
                value={form.productId}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, productId: value }))
                }
              >
                <SelectTrigger
                  id="fs-product"
                  className="w-full border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30"
                >
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent className="bg-warm-white border-gold/20 max-h-60">
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <span className="truncate">{product.name}</span>
                      <span className="text-text-mid text-xs ml-2">
                        {formatFCFA(product.price)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.productId && productMap[form.productId] && (
                <p className="text-[11px] text-text-mid">
                  Prix actuel : {formatFCFA(productMap[form.productId].price)}
                  {productMap[form.productId].pricePromo && (
                    <span>
                      {' '}&#x2192; Promo : {formatFCFA(productMap[form.productId].pricePromo!)}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Discount */}
            <div className="space-y-2">
              <Label htmlFor="fs-discount" className="text-text-dark text-sm font-medium">
                Réduction (%) <span className="text-caramel">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="fs-discount"
                  type="number"
                  min={1}
                  max={99}
                  value={form.discount || ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discount: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="22"
                  className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30 pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-mid text-sm">
                  %
                </span>
              </div>
              {form.productId && form.discount > 0 && productMap[form.productId] && (
                <p className="text-[11px] text-caramel font-medium">
                  Prix flash : {formatFCFA(
                    Math.round(
                      (productMap[form.productId].pricePromo || productMap[form.productId].price) *
                        (1 - form.discount / 100)
                    )
                  )}
                </p>
              )}
            </div>

            {/* Stock fields - side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fs-total-stock" className="text-text-dark text-sm font-medium">
                  Stock total <span className="text-caramel">*</span>
                </Label>
                <Input
                  id="fs-total-stock"
                  type="number"
                  min={1}
                  value={form.totalStock || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    setForm((prev) => ({
                      ...prev,
                      totalStock: val,
                      stockLeft: Math.min(prev.stockLeft, val),
                    }))
                  }}
                  placeholder="50"
                  className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fs-stock-left" className="text-text-dark text-sm font-medium">
                  Stock restant <span className="text-caramel">*</span>
                </Label>
                <Input
                  id="fs-stock-left"
                  type="number"
                  min={0}
                  max={form.totalStock}
                  value={form.stockLeft || ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      stockLeft: Math.min(
                        parseInt(e.target.value) || 0,
                        prev.totalStock
                      ),
                    }))
                  }
                  placeholder="50"
                  className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30"
                />
              </div>
            </div>

            {/* End Date/Time */}
            <div className="space-y-2">
              <Label htmlFor="fs-ends-at" className="text-text-dark text-sm font-medium">
                Date de fin <span className="text-caramel">*</span>
              </Label>
              <Input
                id="fs-ends-at"
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, endsAt: e.target.value }))
                }
                className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30"
              />
              {form.endsAt && isExpired(form.endsAt) && (
                <div className="flex items-center gap-1.5 text-orange-500">
                  <AlertTriangle size={12} />
                  <span className="text-[11px]">Cette date est déjà passée</span>
                </div>
              )}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between rounded-lg bg-cream/50 p-3 border border-gold/10">
              <div>
                <Label className="text-text-dark text-sm font-medium cursor-pointer">
                  Vente active
                </Label>
                <p className="text-[11px] text-text-mid">
                  Désactivez pour mettre en pause la vente flash
                </p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, isActive: checked }))
                }
                className={form.isActive ? 'data-[state=checked]:bg-emerald-500' : ''}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-gold/30 text-text-mid hover:bg-beige/60"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="btn-gold gap-2"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-warm-white/30 border-t-warm-white rounded-full animate-spin" />
              ) : null}
              {editingId ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-warm-white border-gold/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-text-dark">
              Confirmer la suppression
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-text-mid">
              Êtes-vous sûr de vouloir supprimer la vente flash pour{' '}
              <span className="font-semibold text-text-dark">
                {getFlashSaleToDelete()
                  ? getProductName(getFlashSaleToDelete()!.productId)
                  : ''}
              </span>
              {' '}? Cette action est irréversible.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gold/30 text-text-mid hover:bg-beige/60"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="destructive"
              className="gap-2"
            >
              {deleting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
