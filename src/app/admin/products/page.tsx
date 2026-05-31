'use client'

import { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminProductsStore, type AdminProduct } from '@/stores/admin-products-store'
import { formatPrice } from '@/lib/product-display'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Search, Plus, Pencil, Trash2, Star, Package,
  ChevronUp, ChevronDown, ToggleLeft, ToggleRight, RotateCcw,
  Download, CheckSquare, Square, Edit3,
} from 'lucide-react'
import { toast } from 'sonner'
import { exportToCSV } from '@/lib/admin-export'

type SortKey = 'name' | 'price' | 'stock' | 'rating'

const CATEGORIES = ['bijoux', 'sacs', 'foulards', 'lunettes', 'ceintures', 'accessoires-cheveux']

const EMPTY_FORM = {
  name: '', price: '', pricePromo: '', stock: '', description: '', category: 'bijoux',
}

export default function ProductsPage() {
  const { products, updateProduct, deleteProduct, toggleActive, addProduct, reset } = useAdminProductsStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const filtered = useMemo(() => {
    let list = [...products]
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    if (categoryFilter) list = list.filter((p) => p.category === categoryFilter)
    if (activeFilter === 'active') list = list.filter((p) => p.isActive)
    if (activeFilter === 'inactive') list = list.filter((p) => !p.isActive)
    list.sort((a, b) => {
      let va: number | string = a[sortKey] as number | string
      let vb: number | string = b[sortKey] as number | string
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
    })
    return list
  }, [products, search, categoryFilter, activeFilter, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="ml-1 inline-flex flex-col gap-0">
      <ChevronUp className={`w-2.5 h-2.5 -mb-0.5 ${sortKey === k && sortDir === 'asc' ? 'text-[#D4AF6A]' : 'text-slate-300'}`} />
      <ChevronDown className={`w-2.5 h-2.5 ${sortKey === k && sortDir === 'desc' ? 'text-[#D4AF6A]' : 'text-slate-300'}`} />
    </span>
  )

  const openEdit = (p: AdminProduct) => {
    setEditProduct(p)
    setForm({ name: p.name, price: String(p.price), pricePromo: String(p.pricePromo ?? ''), stock: String(p.stock), description: p.description, category: p.category })
  }

  const handleSave = () => {
    if (!form.name || !form.price) { toast.error('Nom et prix obligatoires'); return }
    const data = { name: form.name, price: Number(form.price), pricePromo: form.pricePromo ? Number(form.pricePromo) : undefined, stock: Number(form.stock) || 0, description: form.description, category: form.category }
    if (editProduct) {
      updateProduct(editProduct.id, data)
      toast.success('Produit mis à jour !')
      setEditProduct(null)
    } else {
      addProduct(data)
      toast.success('Produit ajouté !')
      setShowAdd(false)
    }
    setForm(EMPTY_FORM)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteProduct(deleteTarget.id)
    toast.success(`${deleteTarget.name} supprimé`)
    setDeleteTarget(null)
  }

  const activeCount = products.filter((p) => p.isActive).length

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Produits
            </h2>
            <p className="text-sm text-slate-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {activeCount} actif{activeCount !== 1 ? 's' : ''} · {products.length} au total
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => { reset(); toast.success('Réinitialisé') }}
              className="gap-2 rounded-xl border-slate-200 text-slate-600 text-xs h-9">
              <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
            </Button>
            <Button onClick={() => { setShowAdd(true); setForm(EMPTY_FORM) }}
              className="bg-[#D4AF6A] hover:bg-[#C8956C] text-white border-0 gap-2 rounded-xl shadow-sm shadow-[#D4AF6A]/20 h-9">
              <Plus className="w-4 h-4" /> Ajouter
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit…"
              className="pl-9 bg-white border-slate-200 rounded-xl h-10" />
          </div>
          <div className="flex gap-2">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 h-10"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>
              <option value="">Toutes catégories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value as typeof activeFilter)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 h-10"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
        </div>

        {/* Stats chips */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat).length
            return (
              <button key={cat} onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${categoryFilter === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-[#D4AF6A]/50'}`}
                style={{ fontFamily: 'var(--font-dm-sans)' }}>
                {cat} ({count})
              </button>
            )
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center" onClick={() => handleSort('name')}>
                      Produit <SortIcon k="name" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Catégorie</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center" onClick={() => handleSort('price')}>Prix <SortIcon k="price" /></button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center" onClick={() => handleSort('stock')}>Stock <SortIcon k="stock" /></button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <button className="flex items-center" onClick={() => handleSort('rating')}>Note <SortIcon k="rating" /></button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => (
                  <tr key={p.id} className={`hover:bg-slate-50/60 transition-colors group ${!p.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#D4AF6A]/10 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-[#D4AF6A]" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-sm line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="outline" className="text-[10px] capitalize border-slate-200 text-slate-600">{p.category}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-800 text-sm">{formatPrice(p.price)}</span>
                      {p.pricePromo && (
                        <span className="ml-1.5 text-xs text-emerald-600 font-medium">→ {formatPrice(p.pricePromo)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock <= 3 ? 'text-orange-500' : 'text-slate-700'}`}>
                        {p.stock === 0 ? 'Épuisé' : `${p.stock} u.`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#D4AF6A] fill-[#D4AF6A]" />
                        <span className="text-xs font-medium text-slate-700">{p.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400">({p.reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => { toggleActive(p.id); toast.success(`${p.name} ${p.isActive ? 'désactivé' : 'activé'}`) }}
                        className="flex items-center gap-1.5 transition-colors">
                        {p.isActive
                          ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                          : <ToggleLeft className="w-5 h-5 text-slate-400" />
                        }
                        <span className={`text-[10px] font-semibold ${p.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {p.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(p)}
                          className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(p)}
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Package className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">Aucun produit trouvé</p>
              </div>
            )}
          </div>
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs text-slate-400" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={showAdd || !!editProduct} onOpenChange={(o) => { if (!o) { setShowAdd(false); setEditProduct(null) } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-playfair)' }}>
              {editProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Nom du produit *</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 rounded-xl" placeholder="Collier Amira…" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Prix (FCFA) *</Label>
                <Input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="mt-1 rounded-xl" type="number" placeholder="15000" />
              </div>
              <div>
                <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Prix promo</Label>
                <Input value={form.pricePromo} onChange={(e) => setForm((f) => ({ ...f, pricePromo: e.target.value }))}
                  className="mt-1 rounded-xl" type="number" placeholder="12000" />
              </div>
              <div>
                <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Stock</Label>
                <Input value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  className="mt-1 rounded-xl" type="number" placeholder="10" />
              </div>
            </div>
            <div>
              <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Catégorie</Label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="mt-1 w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30"
                style={{ fontFamily: 'var(--font-dm-sans)' }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="mt-1 rounded-xl resize-none" rows={3} placeholder="Description du produit…" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setShowAdd(false); setEditProduct(null) }}>Annuler</Button>
            <Button onClick={handleSave} className="bg-[#D4AF6A] hover:bg-[#C8956C] text-white border-0">
              {editProduct ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600" style={{ fontFamily: 'var(--font-playfair)' }}>
              Supprimer le produit ?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <strong>{deleteTarget?.name}</strong> sera définitivement supprimé.
          </p>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Annuler</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white border-0" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
