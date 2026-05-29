'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
import { Plus, Edit, Trash2, Tag, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface PromoCode {
  id: string
  code: string
  discount: number
  type: string
  description: string
  minPurchase: number
  validUntil: string
  isActive: boolean
  usageCount: number
  createdAt: string
  updatedAt: string
}

interface PromoFormData {
  code: string
  discount: number
  type: string
  description: string
  minPurchase: number
  validUntil: string
  isActive: boolean
}

const emptyForm: PromoFormData = {
  code: '',
  discount: 0,
  type: 'percentage',
  description: '',
  minPurchase: 0,
  validUntil: '',
  isActive: true,
}

function formatFCFA(amount: number): string {
  return amount.toLocaleString('fr-FR').replace(/\u202F/g, ' ') + ' FCFA'
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function isExpired(dateStr: string): boolean {
  if (!dateStr) return false
  try {
    const date = new Date(dateStr)
    const now = new Date()
    return date < now
  } catch {
    return false
  }
}

export default function AdminPromos() {
  const [promos, setPromos] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState<PromoFormData>(emptyForm)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchPromos = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/promos')
      if (!res.ok) throw new Error('Erreur lors du chargement')
      const data = await res.json()
      setPromos(data)
    } catch {
      toast.error('Erreur lors du chargement des codes promo')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPromos()
  }, [fetchPromos])

  const handleCopy = useCallback(async (promo: PromoCode) => {
    try {
      await navigator.clipboard.writeText(promo.code)
      setCopiedId(promo.id)
      toast.success('Code copié !')
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error('Impossible de copier le code')
    }
  }, [])

  const handleToggleActive = useCallback(async (promo: PromoCode) => {
    try {
      const res = await fetch(`/api/promos/${promo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !promo.isActive }),
      })
      if (!res.ok) throw new Error('Erreur lors de la mise à jour')
      toast.success(
        promo.isActive
          ? 'Code promo désactivé'
          : 'Code promo activé'
      )
      fetchPromos()
    } catch {
      toast.error('Erreur lors de la mise à jour du statut')
    }
  }, [fetchPromos])

  const openAddDialog = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (promo: PromoCode) => {
    setEditingId(promo.id)
    setForm({
      code: promo.code,
      discount: promo.discount,
      type: promo.type,
      description: promo.description,
      minPurchase: promo.minPurchase,
      validUntil: promo.validUntil,
      isActive: promo.isActive,
    })
    setDialogOpen(true)
  }

  const handleSave = useCallback(async () => {
    if (!form.code.trim()) {
      toast.error('Le code est requis')
      return
    }
    if (form.discount <= 0) {
      toast.error('La remise doit être supérieure à 0')
      return
    }
    if (form.type === 'percentage' && form.discount > 100) {
      toast.error('Le pourcentage ne peut pas dépasser 100')
      return
    }
    if (!form.validUntil) {
      toast.error('La date de validité est requise')
      return
    }

    try {
      setSaving(true)
      const url = editingId ? `/api/promos/${editingId}` : '/api/promos'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          code: form.code.toUpperCase(),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde')
      }

      toast.success(
        editingId
          ? 'Code promo modifié avec succès'
          : 'Code promo créé avec succès'
      )
      setDialogOpen(false)
      fetchPromos()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
      )
    } finally {
      setSaving(false)
    }
  }, [editingId, form, fetchPromos])

  const openDeleteDialog = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = useCallback(async () => {
    if (!deletingId) return

    try {
      setDeleting(true)
      const res = await fetch(`/api/promos/${deletingId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression')
      }

      toast.success('Code promo supprimé avec succès')
      setDeleteDialogOpen(false)
      setDeletingId(null)
      fetchPromos()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erreur lors de la suppression'
      )
    } finally {
      setDeleting(false)
    }
  }, [deletingId, fetchPromos])

  const getPromoToDelete = () => {
    if (!deletingId) return null
    return promos.find((p) => p.id === deletingId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
            <Tag size={20} className="text-caramel" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-text-dark">
              Codes Promo
            </h1>
            <p className="text-sm text-text-mid">
              {promos.length} code{promos.length !== 1 ? 's' : ''} promo
            </p>
          </div>
        </div>

        <Button
          onClick={openAddDialog}
          className="btn-gold gap-2 px-6"
        >
          <Plus size={16} />
          Ajouter un code
        </Button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="glass-card overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32" />
                </div>
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
      {!loading && promos.length === 0 && (
        <Card className="glass-card p-12 text-center">
          <Tag size={48} className="mx-auto text-text-mid/40 mb-4" />
          <h3 className="font-serif text-lg text-text-dark mb-2">
            Aucun code promo
          </h3>
          <p className="text-sm text-text-mid mb-6">
            Commencez par créer votre premier code promo.
          </p>
          <Button onClick={openAddDialog} className="btn-gold gap-2">
            <Plus size={16} />
            Ajouter un code
          </Button>
        </Card>
      )}

      {/* Promos Grid */}
      {!loading && promos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((promo) => {
            const expired = isExpired(promo.validUntil)
            return (
              <Card
                key={promo.id}
                className="glass-card overflow-hidden warm-shadow hover:warm-shadow-lg transition-all duration-300 group"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Code + Copy */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xl font-bold text-text-dark tracking-wider">
                      {promo.code}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(promo)}
                      className="h-8 w-8 p-0 border-gold/30 text-text-mid hover:bg-gold/10 hover:text-caramel hover:border-gold/50"
                    >
                      {copiedId === promo.id ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </Button>
                  </div>

                  {/* Discount */}
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-sm font-semibold px-3 py-1 ${
                        promo.isActive && !expired
                          ? 'bg-gold/15 text-caramel border border-gold/30'
                          : 'bg-beige/60 text-text-mid border border-gold/10'
                      }`}
                    >
                      {promo.type === 'percentage'
                        ? `${promo.discount}%`
                        : formatFCFA(promo.discount)}
                    </Badge>
                    {expired && (
                      <Badge variant="outline" className="text-xs border-red-300 text-red-500">
                        Expiré
                      </Badge>
                    )}
                    {!promo.isActive && !expired && (
                      <Badge variant="outline" className="text-xs border-gold/20 text-text-mid">
                        Inactif
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  {promo.description && (
                    <p className="text-sm text-text-mid line-clamp-2 leading-relaxed">
                      {promo.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="space-y-1.5 text-sm">
                    {promo.minPurchase > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-text-mid">Achat minimum</span>
                        <span className="font-medium text-text-dark">
                          {formatFCFA(promo.minPurchase)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-text-mid">Valide jusqu&apos;au</span>
                      <span className={`font-medium ${expired ? 'text-red-500' : 'text-text-dark'}`}>
                        {formatDate(promo.validUntil)}
                      </span>
                    </div>
                  </div>

                  {/* Usage count badge */}
                  {promo.usageCount > 0 && (
                    <div className="flex items-center">
                      <Badge className="bg-beige/80 text-caramel border border-gold/20 text-xs">
                        {promo.usageCount} utilisation{promo.usageCount !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  )}

                  {/* Switch + Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gold/10">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={promo.isActive}
                        onCheckedChange={() => handleToggleActive(promo)}
                        className="data-[state=checked]:bg-gold data-[state=unchecked]:bg-beige"
                      />
                      <span className="text-xs text-text-mid">
                        {promo.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(promo)}
                        className="h-8 w-8 p-0 border-gold/30 text-text-mid hover:bg-gold/10 hover:text-caramel hover:border-gold/50"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(promo.id)}
                        className="h-8 w-8 p-0 border-gold/30 text-text-mid hover:bg-red-50 hover:text-red-600 hover:border-red-200"
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
              {editingId ? 'Modifier le code promo' : 'Nouveau code promo'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="promo-code" className="text-text-dark text-sm font-medium">
                Code <span className="text-caramel">*</span>
              </Label>
              <Input
                id="promo-code"
                value={form.code}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="EX: PROMO2024"
                className="font-mono tracking-wider border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30 uppercase"
              />
              <p className="text-[11px] text-text-mid">
                Saisie automatique en majuscules
              </p>
            </div>

            {/* Discount + Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="promo-discount" className="text-text-dark text-sm font-medium">
                  Remise <span className="text-caramel">*</span>
                </Label>
                <Input
                  id="promo-discount"
                  type="number"
                  min={1}
                  value={form.discount || ''}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discount: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="10"
                  className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo-type" className="text-text-dark text-sm font-medium">
                  Type <span className="text-caramel">*</span>
                </Label>
                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30 w-full">
                    <SelectValue placeholder="Type de remise" />
                  </SelectTrigger>
                  <SelectContent className="bg-warm-white border-gold/20">
                    <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                    <SelectItem value="fixed">Montant fixe (FCFA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="promo-desc" className="text-text-dark text-sm font-medium">
                Description
              </Label>
              <Input
                id="promo-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Description du code promo..."
                className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30"
              />
            </div>

            {/* Min Purchase */}
            <div className="space-y-2">
              <Label htmlFor="promo-min" className="text-text-dark text-sm font-medium">
                Achat minimum (FCFA)
              </Label>
              <Input
                id="promo-min"
                type="number"
                min={0}
                value={form.minPurchase || ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    minPurchase: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="0"
                className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30"
              />
            </div>

            {/* Valid Until */}
            <div className="space-y-2">
              <Label htmlFor="promo-valid" className="text-text-dark text-sm font-medium">
                Valide jusqu&apos;au <span className="text-caramel">*</span>
              </Label>
              <Input
                id="promo-valid"
                type="date"
                value={form.validUntil}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, validUntil: e.target.value }))
                }
                className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-gold/20 bg-cream/30 p-4">
              <div>
                <Label className="text-text-dark text-sm font-medium">
                  Code actif
                </Label>
                <p className="text-xs text-text-mid mt-0.5">
                  Les codes inactifs ne peuvent pas être utilisés
                </p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, isActive: checked }))
                }
                className="data-[state=checked]:bg-gold data-[state=unchecked]:bg-beige"
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

          <p className="text-text-mid py-4">
            Êtes-vous sûr de vouloir supprimer le code promo{' '}
            <span className="font-semibold font-mono text-text-dark">
              {getPromoToDelete()?.code}
            </span>
            {' '}? Cette action est irréversible.
          </p>

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
