'use client'

import { useMemo, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminCategoriesStore, slugify, type AdminCategory } from '@/stores/admin-categories-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

type FormState = {
  name: string
  slug: string
  emoji: string
  description: string
}

const EMPTY: FormState = { name: '', slug: '', emoji: '', description: '' }

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, resetCategories } =
    useAdminCategoriesStore()

  const [form, setForm] = useState<FormState>(EMPTY)
  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const [deleting, setDeleting] = useState<AdminCategory | null>(null)

  const sorted = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  }, [categories])

  const openEdit = (cat: AdminCategory) => {
    setEditing(cat)
    setForm({
      name: cat.name,
      slug: cat.slug,
      emoji: cat.emoji ?? '',
      description: cat.description ?? '',
    })
  }

  const closeEdit = () => {
    setEditing(null)
    setForm(EMPTY)
  }

  const handleAdd = () => {
    if (!form.name.trim()) {
      toast.error('Le nom est obligatoire')
      return
    }
    const s = form.slug.trim() ? slugify(form.slug) : slugify(form.name)
    addCategory({
      name: form.name.trim(),
      slug: s,
      emoji: form.emoji.trim() || undefined,
      description: form.description.trim() || '',
    })
    toast.success('Catégorie ajoutée')
    setForm(EMPTY)
  }

  const handleUpdate = () => {
    if (!editing) return
    if (!form.name.trim()) {
      toast.error('Le nom est obligatoire')
      return
    }
    updateCategory(editing.id, {
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
      emoji: form.emoji.trim() || undefined,
      description: form.description.trim() || '',
    })
    toast.success('Catégorie mise à jour')
    closeEdit()
  }

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Catégories
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Gérez les catégories utilisées dans le back-office (produits, filtres, badges).
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              resetCategories()
              toast.success('Catégories réinitialisées')
            }}
            className="rounded-xl"
          >
            Réinitialiser
          </Button>
        </div>

        {/* Add */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-4 h-4 text-[#D4AF6A]" />
            <p className="text-sm font-bold text-slate-800">Ajouter une catégorie</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="h-10 rounded-xl"
                placeholder="Ex : Montres"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="h-10 rounded-xl font-mono"
                placeholder="ex : montres (auto si vide)"
              />
            </div>
            <div className="space-y-2">
              <Label>Emoji</Label>
              <Input
                value={form.emoji}
                onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                className="h-10 rounded-xl"
                placeholder="⌚"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="rounded-xl resize-none"
                rows={3}
                placeholder="Description optionnelle (pour le front si vous la réutilisez plus tard)."
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleAdd} className="rounded-xl bg-[#D4AF6A] hover:bg-[#C8956C]">
              <Plus className="w-4 h-4" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {sorted.length} catégorie{sorted.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="divide-y divide-slate-50">
            {sorted.map((cat) => (
              <div key={cat.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-lg">
                  {cat.emoji ?? '🏷️'}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {cat.name}
                    {!cat.isActive && <span className="ml-2 text-xs font-semibold text-slate-400">(inactive)</span>}
                  </p>
                  <p className="text-xs text-slate-400 font-mono truncate">{cat.slug}</p>
                  {cat.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 shrink-0"
                  title={cat.isActive ? 'Désactiver' : 'Activer'}
                >
                  {cat.isActive ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(cat)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 shrink-0"
                  title="Modifier"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(cat)}
                  className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 shrink-0"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Edit */}
        <Dialog open={!!editing} onOpenChange={(o) => !o && closeEdit()}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'var(--font-playfair)' }}>
                Modifier la catégorie
              </DialogTitle>
              <DialogDescription>
                Change le nom / slug / emoji. Le slug est celui stocké dans les produits.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="h-10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="h-10 rounded-xl font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Emoji</Label>
                <Input value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))} className="h-10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="rounded-xl resize-none" rows={3} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={closeEdit} className="rounded-xl">
                Annuler
              </Button>
              <Button onClick={handleUpdate} className="rounded-xl bg-[#D4AF6A] hover:bg-[#C8956C]">
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete */}
        <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-red-600" style={{ fontFamily: 'var(--font-playfair)' }}>
                Supprimer la catégorie
              </DialogTitle>
              <DialogDescription>
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-slate-700">
                Supprimer <span className="font-bold">{deleting?.name}</span> ?
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDeleting(null)} className="flex-1 rounded-xl">
                  Annuler
                </Button>
                <Button
                  onClick={() => {
                    if (!deleting) return
                    deleteCategory(deleting.id)
                    toast.success('Catégorie supprimée')
                    setDeleting(null)
                  }}
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

