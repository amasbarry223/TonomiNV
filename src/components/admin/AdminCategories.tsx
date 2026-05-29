'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  createdAt: string
  updatedAt: string
}

interface CategoryFormData {
  name: string
  slug: string
  description: string
  image: string
  productCount: number
}

const emptyForm: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  image: '',
  productCount: 0,
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState<CategoryFormData>(emptyForm)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Erreur lors du chargement')
      const data = await res.json()
      setCategories(data)
    } catch {
      toast.error('Erreur lors du chargement des catégories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleNameChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }))
  }

  const openAddDialog = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (category: Category) => {
    setEditingId(category.id)
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      productCount: category.productCount,
    })
    setDialogOpen(true)
  }

  const handleSave = useCallback(async () => {
    if (!form.name.trim()) {
      toast.error('Le nom est requis')
      return
    }
    if (!form.slug.trim()) {
      toast.error('Le slug est requis')
      return
    }

    try {
      setSaving(true)
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde')
      }

      toast.success(
        editingId
          ? 'Catégorie modifiée avec succès'
          : 'Catégorie créée avec succès'
      )
      setDialogOpen(false)
      fetchCategories()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
      )
    } finally {
      setSaving(false)
    }
  }, [editingId, form, fetchCategories])

  const openDeleteDialog = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = useCallback(async () => {
    if (!deletingId) return

    try {
      setDeleting(true)
      const res = await fetch(`/api/categories/${deletingId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression')
      }

      toast.success('Catégorie supprimée avec succès')
      setDeleteDialogOpen(false)
      setDeletingId(null)
      fetchCategories()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erreur lors de la suppression'
      )
    } finally {
      setDeleting(false)
    }
  }, [deletingId, fetchCategories])

  const getCategoryToDelete = () => {
    if (!deletingId) return null
    return categories.find((c) => c.id === deletingId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
            <FolderOpen size={20} className="text-caramel" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-text-dark">
              Catégories
            </h1>
            <p className="text-sm text-text-mid">
              {categories.length} catégorie{categories.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <Button
          onClick={openAddDialog}
          className="btn-gold gap-2 px-6"
        >
          <Plus size={16} />
          Ajouter une catégorie
        </Button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="glass-card overflow-hidden">
              <Skeleton className="w-full aspect-video rounded-t-2xl" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <Card className="glass-card p-12 text-center">
          <FolderOpen size={48} className="mx-auto text-text-mid/40 mb-4" />
          <h3 className="font-serif text-lg text-text-dark mb-2">
            Aucune catégorie
          </h3>
          <p className="text-sm text-text-mid mb-6">
            Commencez par créer votre première catégorie de produits.
          </p>
          <Button onClick={openAddDialog} className="btn-gold gap-2">
            <Plus size={16} />
            Ajouter une catégorie
          </Button>
        </Card>
      )}

      {/* Categories Grid */}
      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="glass-card overflow-hidden warm-shadow hover:warm-shadow-lg transition-all duration-300 group"
            >
              {/* Category Image */}
              <div className="relative w-full aspect-video overflow-hidden rounded-t-[20px]">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-beige/60 flex items-center justify-center">
                    <FolderOpen size={40} className="text-text-mid/30" />
                  </div>
                )}
                {/* Product count badge */}
                <Badge className="absolute top-3 right-3 bg-warm-white/90 text-caramel border border-gold/20 backdrop-blur-sm">
                  {category.productCount} produit
                  {category.productCount !== 1 ? 's' : ''}
                </Badge>
              </div>

              <CardContent className="p-4 space-y-2">
                {/* Category name */}
                <h3 className="font-serif text-lg font-semibold text-text-dark leading-tight">
                  {category.name}
                </h3>

                {/* Slug */}
                <p className="text-text-mid text-xs">{category.slug}</p>

                {/* Description */}
                {category.description && (
                  <p className="text-sm text-text-mid line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(category)}
                    className="gap-1.5 border-gold/30 text-text-mid hover:bg-gold/10 hover:text-caramel hover:border-gold/50"
                  >
                    <Edit size={14} />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(category.id)}
                    className="gap-1.5 border-gold/30 text-text-mid hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-warm-white border-gold/20 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-text-dark">
              {editingId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="cat-name" className="text-text-dark text-sm font-medium">
                Nom <span className="text-caramel">*</span>
              </Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nom de la catégorie"
                className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="cat-slug" className="text-text-dark text-sm font-medium">
                Slug <span className="text-caramel">*</span>
              </Label>
              <Input
                id="cat-slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="slug-de-la-categorie"
                className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30"
              />
              <p className="text-[11px] text-text-mid">
                Généré automatiquement à partir du nom
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="cat-desc" className="text-text-dark text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="cat-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Description de la catégorie..."
                rows={3}
                className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30 resize-none"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="cat-image" className="text-text-dark text-sm font-medium">
                URL de l&apos;image
              </Label>
              <Input
                id="cat-image"
                value={form.image}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="https://exemple.com/image.jpg"
                className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30"
              />
            </div>

            {/* Product Count */}
            <div className="space-y-2">
              <Label htmlFor="cat-count" className="text-text-dark text-sm font-medium">
                Nombre de produits
              </Label>
              <Input
                id="cat-count"
                type="number"
                min={0}
                value={form.productCount}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    productCount: parseInt(e.target.value) || 0,
                  }))
                }
                className="border-gold/30 focus:border-gold focus:ring-gold/20 bg-cream/30"
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
            Êtes-vous sûr de vouloir supprimer la catégorie{' '}
            <span className="font-semibold text-text-dark">
              {getCategoryToDelete()?.name}
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
