'use client'

import { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import ProductFormModal from '@/components/admin/ProductFormModal'
import {
  EMPTY_PRODUCT_FORM,
  type ProductFormState,
  type ProductFormStepKey,
} from '@/components/admin/product-form-types'
import { useAdminProductsStore, type AdminProduct } from '@/stores/admin-products-store'
import { useAdminCategoriesStore } from '@/stores/admin-categories-store'
import { formatPrice } from '@/lib/product-display'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  Search, Plus, Pencil, Trash2, Star, Package,
  RotateCcw, Download, AlertTriangle, LayoutGrid,
  List, X, ChevronUp, ChevronDown, Eye,
  ToggleLeft, ToggleRight, CheckCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { exportToCSV } from '@/lib/admin-export'
import {
  DEFAULT_CARE_TIPS,
  DEFAULT_SIZE_GUIDE,
  cloneDefaultSizeGuide,
  formatCareTips,
  parseCareTips,
  sanitizeSizeGuide,
} from '@/lib/product-content'

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const CAT_COLORS: Record<string, string> = {
  bijoux:               'bg-yellow-50 text-yellow-700 border-yellow-200',
  sacs:                 'bg-purple-50 text-purple-700 border-purple-200',
  foulards:             'bg-pink-50 text-pink-700 border-pink-200',
  lunettes:             'bg-sky-50 text-sky-700 border-sky-200',
  ceintures:            'bg-orange-50 text-orange-700 border-orange-200',
  'accessoires-cheveux':'bg-rose-50 text-rose-700 border-rose-200',
}

function getCategoryBadgeClass(slug: string): string {
  return CAT_COLORS[slug] ?? 'bg-slate-50 text-slate-600 border-slate-200'
}

type SortKey  = 'name' | 'price' | 'stock' | 'rating'
type ViewMode = 'grid' | 'list'

function SortBtn({
  k,
  label,
  sortKey,
  sortDir,
  onSort,
}: {
  k: SortKey
  label: string
  sortKey: SortKey
  sortDir: 'asc' | 'desc'
  onSort: (key: SortKey) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSort(k)}
      className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
    >
      {label}
      <span className="flex flex-col gap-0">
        <ChevronUp
          className={`w-2.5 h-2.5 -mb-0.5 ${sortKey === k && sortDir === 'asc' ? 'text-[#D4AF6A]' : 'text-slate-300'}`}
        />
        <ChevronDown
          className={`w-2.5 h-2.5 ${sortKey === k && sortDir === 'desc' ? 'text-[#D4AF6A]' : 'text-slate-300'}`}
        />
      </span>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// STOCK BADGE
// ─────────────────────────────────────────────────────────────
function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />Épuisé</span>
  if (stock <= 5)
    return <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">{stock} u.</span>
  return <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">{stock} u.</span>
}

// ─────────────────────────────────────────────────────────────
// PRODUCT CARD (grid)
// ─────────────────────────────────────────────────────────────
function ProductCard({
  product, onView, onEdit, onDelete, onToggle,
}: {
  product: AdminProduct
  onView:   () => void
  onEdit:   () => void
  onDelete: () => void
  onToggle: () => void
}) {
  const categories = useAdminCategoriesStore((s) => s.categories)
  const catCls = getCategoryBadgeClass(product.category)
  const catLabel = categories.find((c) => c.slug === product.category)?.name ?? product.category

  return (
    <div className={`group relative bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 ${
      product.isActive ? 'border-slate-100' : 'border-slate-200 opacity-60'
    }`}>

      {/* Image zone */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
            <Package className="w-10 h-10" />
            <span className="text-xs">Aucune image</span>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catCls}`}>
            {catLabel}
          </span>
          {product.badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              product.badge === 'nouveau' ? 'bg-emerald-500 text-white' :
              product.badge === 'promo'   ? 'bg-[#D4AF6A] text-white' :
              'bg-slate-500 text-white'
            }`}>
              {product.badge === 'nouveau' ? 'Nouveau' : product.badge === 'promo' ? 'Promo' : 'Épuisé'}
            </span>
          )}
        </div>

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={onView}
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-slate-700 transition-all hover:scale-110 shadow-md"
            title="Voir le détail">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={onEdit}
            className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center text-white transition-all hover:scale-110 shadow-md"
            title="Modifier">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={onDelete}
            className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-white transition-all hover:scale-110 shadow-md"
            title="Supprimer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info zone */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-1 mb-2"
          style={{ fontFamily: 'var(--font-dm-sans)' }}>
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          {product.pricePromo ? (
            <>
              <span className="text-base font-bold text-[#D4AF6A]"
                style={{ fontFamily: 'var(--font-playfair)' }}>
                {formatPrice(product.pricePromo)}
              </span>
              <span className="text-xs text-slate-400 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-base font-bold text-slate-900"
              style={{ fontFamily: 'var(--font-playfair)' }}>
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <StockBadge stock={product.stock} />
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[#D4AF6A] fill-[#D4AF6A]" />
            <span className="text-xs font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Toggle actif */}
        <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
          <button onClick={onToggle}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors">
            {product.isActive
              ? <><ToggleRight className="w-5 h-5 text-emerald-500" /><span className="text-emerald-600">Actif</span></>
              : <><ToggleLeft  className="w-5 h-5 text-slate-400" /><span className="text-slate-400">Inactif</span></>
            }
          </button>
          <span className="text-[10px] text-slate-300 font-mono">{product.id.split('-').slice(-1)}</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PRODUCT ROW (list)
// ─────────────────────────────────────────────────────────────
function ProductRow({
  product, onView, onEdit, onDelete, onToggle,
}: {
  product: AdminProduct
  onView:   () => void
  onEdit:   () => void
  onDelete: () => void
  onToggle: () => void
}) {
  const categories = useAdminCategoriesStore((s) => s.categories)
  const catLabel = categories.find((c) => c.slug === product.category)?.name ?? product.category
  const catCls   = getCategoryBadgeClass(product.category)

  return (
    <>
      {/* Mobile card (<lg) */}
      <div
        className={`lg:hidden mx-4 my-3 rounded-2xl border border-slate-100 bg-white shadow-sm p-4 space-y-3 ${
          !product.isActive ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-14 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
            {product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catCls}`}>
                {catLabel}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{product.id}</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-3">
              <div>
                <p className="text-base font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {formatPrice(product.pricePromo ?? product.price)}
                </p>
                {product.pricePromo && (
                  <p className="text-xs text-slate-400 line-through">{formatPrice(product.price)}</p>
                )}
              </div>
              <StockBadge stock={product.stock} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[#D4AF6A] fill-[#D4AF6A]" />
            <span className="text-sm font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({product.reviewCount})</span>
          </div>
          <button onClick={onToggle} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold">
            {product.isActive
              ? <><ToggleRight className="w-4 h-4 text-emerald-500" /><span className="text-emerald-700">Actif</span></>
              : <><ToggleLeft className="w-4 h-4 text-slate-400" /><span className="text-slate-500">Inactif</span></>
            }
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={onView}
            className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" /> Détail
          </button>
          <button
            onClick={onEdit}
            className="h-10 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Pencil className="w-4 h-4" /> Modifier
          </button>
          <button
            onClick={onDelete}
            className="h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Suppr.
          </button>
        </div>
      </div>

      {/* Desktop row (lg+) */}
      <div
        className={`hidden lg:flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/80 transition-colors group border-b border-slate-50 last:border-0 ${
          !product.isActive ? 'opacity-55' : ''
        }`}
      >
        {/* Image */}
        <div className="w-12 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
          {product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-4 h-4 text-slate-300" />
            </div>
          )}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
          <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${catCls}`}>
            {catLabel}
          </span>
        </div>

        {/* Price */}
        <div className="shrink-0 text-right w-32">
          <p className="text-sm font-bold text-slate-800" style={{ fontFamily: 'var(--font-playfair)' }}>
            {formatPrice(product.price)}
          </p>
          {product.pricePromo && (
            <p className="text-xs text-emerald-600 font-medium">{formatPrice(product.pricePromo)}</p>
          )}
        </div>

        {/* Stock */}
        <div className="shrink-0 w-24 flex justify-center">
          <StockBadge stock={product.stock} />
        </div>

        {/* Rating */}
        <div className="shrink-0 w-20 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-[#D4AF6A] fill-[#D4AF6A]" />
          <span className="text-sm font-semibold text-slate-700">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-slate-400">({product.reviewCount})</span>
        </div>

        {/* Toggle */}
        <div className="shrink-0 w-20">
          <button onClick={onToggle} className="flex items-center gap-1 transition-colors">
            {product.isActive
              ? <><ToggleRight className="w-5 h-5 text-emerald-500" /><span className="text-xs text-emerald-600 font-semibold">Actif</span></>
              : <><ToggleLeft  className="w-5 h-5 text-slate-300" /><span className="text-xs text-slate-400">Inactif</span></>
            }
          </button>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onView}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button onClick={onEdit}
            className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete}
            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const { products, updateProduct, deleteProduct, toggleActive, addProduct, reset } = useAdminProductsStore()
  // ⚠️ Ne pas filtrer directement dans le selector Zustand :
  // cela crée une nouvelle référence à chaque render et peut déclencher "getSnapshot should be cached".
  const allCategories = useAdminCategoriesStore((s) => s.categories)
  const categories = useMemo(() => allCategories.filter((c) => c.isActive), [allCategories])

  // ── Filters
  const [search,        setSearch]        = useState('')
  const [categoryFilter,setCategoryFilter] = useState('')
  const [activeFilter,  setActiveFilter]  = useState<'all' | 'active' | 'inactive'>('all')
  const [lowStockOnly,  setLowStockOnly]  = useState(false)
  const [sortKey,       setSortKey]       = useState<SortKey>('name')
  const [sortDir,       setSortDir]       = useState<'asc' | 'desc'>('asc')
  const [viewMode,      setViewMode]      = useState<ViewMode>('grid')

  // ── Dialogs
  const [viewProduct,  setViewProduct]  = useState<AdminProduct | null>(null)
  const [editProduct,  setEditProduct]  = useState<AdminProduct | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null)
  const [showAdd,      setShowAdd]      = useState(false)

  // ── Form
  const [form,    setForm]    = useState<ProductFormState>(EMPTY_PRODUCT_FORM)
  const [formTab, setFormTab] = useState<ProductFormStepKey>('general')
  const [draftProductId, setDraftProductId] = useState(() => `prod-${Date.now()}`)

  // ── Filtered list
  const filtered = useMemo(() => {
    let list = [...products]
    if (search)          list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    if (categoryFilter)  list = list.filter(p => p.category === categoryFilter)
    if (activeFilter === 'active')   list = list.filter(p => p.isActive)
    if (activeFilter === 'inactive') list = list.filter(p => !p.isActive)
    if (lowStockOnly)    list = list.filter(p => p.stock <= 5)
    list.sort((a, b) => {
      const va = (typeof a[sortKey] === 'string' ? (a[sortKey] as string).toLowerCase() : a[sortKey]) as string | number
      const vb = (typeof b[sortKey] === 'string' ? (b[sortKey] as string).toLowerCase() : b[sortKey]) as string | number
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
    })
    return list
  }, [products, search, categoryFilter, activeFilter, lowStockOnly, sortKey, sortDir])

  // ── Stats
  const stats = useMemo(() => ({
    total:    products.length,
    active:   products.filter(p => p.isActive).length,
    lowStock: products.filter(p => p.isActive && p.stock <= 5 && p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  }), [products])

  // ── Handlers
  const openEdit = (p: AdminProduct) => {
    setEditProduct(p)
    setDraftProductId(p.id)
    setFormTab('general')
    setForm({
      name: p.name, price: String(p.price),
      pricePromo: String(p.pricePromo ?? ''), stock: String(p.stock),
      description: p.description, category: p.category, material: p.material || '',
      careTips: formatCareTips(p.careTips ?? DEFAULT_CARE_TIPS),
      sizeGuide: p.sizeGuide?.length ? p.sizeGuide.map((r) => ({ ...r })) : cloneDefaultSizeGuide(),
      images: [...p.images],
    })
  }

  const openAdd = () => {
    setShowAdd(true)
    setDraftProductId(`prod-${Date.now()}`)
    setFormTab('general')
    setForm(EMPTY_PRODUCT_FORM)
  }

  const formProductId = editProduct?.id ?? draftProductId

  const closeForm = () => {
    setShowAdd(false)
    setEditProduct(null)
    setFormTab('general')
    setForm(EMPTY_PRODUCT_FORM)
  }

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Le nom est obligatoire'); return }
    if (!form.price)        { toast.error('Le prix est obligatoire'); return }
    const careTips = parseCareTips(form.careTips)
    const sizeGuide = sanitizeSizeGuide(form.sizeGuide)
    if (!careTips.length) {
      toast.error('Ajoutez au moins un conseil d\'entretien')
      return
    }
    if (!sizeGuide.length) {
      toast.error('Ajoutez au moins une ligne au guide des tailles')
      return
    }
    if (!form.images.length) {
      toast.error('Ajoutez au moins une photo (onglet Médias)')
      setFormTab('media')
      return
    }
    const data = {
      name: form.name.trim(),
      price: Number(form.price),
      pricePromo: form.pricePromo ? Number(form.pricePromo) : undefined,
      stock: Number(form.stock) || 0,
      description: form.description,
      category: form.category,
      material: form.material,
      careTips,
      sizeGuide,
      images: form.images,
    }
    if (editProduct) {
      updateProduct(editProduct.id, data)
      toast.success('Produit mis à jour !')
    } else {
      addProduct({ ...data, id: draftProductId })
      toast.success('Produit créé !')
    }
    closeForm()
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteProduct(deleteTarget.id)
    toast.success(`${deleteTarget.name} supprimé`)
    setDeleteTarget(null)
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const isFormOpen = showAdd || !!editProduct

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">

        {/* ══════ HEADER ══════ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Produits
            </h1>
            <p className="text-sm text-slate-400 mt-0.5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Gérez votre catalogue de produits TONOMI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { exportToCSV(filtered, `tonomi-produits-${Date.now()}`); toast.success('Export lancé') }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:border-slate-300 transition-colors">
              <Download className="w-4 h-4" /> Exporter
            </button>
            <button onClick={() => { reset(); toast.success('Catalogue réinitialisé') }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:border-slate-300 transition-colors"
              title="Réinitialiser">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF6A] hover:bg-[#C8956C] text-white text-sm font-semibold shadow-sm shadow-[#D4AF6A]/25 transition-all">
              <Plus className="w-4 h-4" /> Nouveau produit
            </button>
          </div>
        </div>

        {/* ══════ KPI STATS ══════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total produits',  value: stats.total,      cls: 'text-slate-800',   bg: 'bg-slate-50',    icon: Package },
            { label: 'Actifs',          value: stats.active,     cls: 'text-emerald-700', bg: 'bg-emerald-50',  icon: CheckCircle },
            { label: 'Stock faible',    value: stats.lowStock,   cls: 'text-orange-700',  bg: 'bg-orange-50',   icon: AlertTriangle },
            { label: 'Épuisés',         value: stats.outOfStock, cls: 'text-red-700',     bg: 'bg-red-50',      icon: X },
          ].map(({ label, value, cls, bg, icon: Icon }) => (
            <div key={label} className={`${bg} rounded-2xl border border-slate-100 p-4 flex items-center gap-3`}>
              <Icon className={`w-5 h-5 ${cls} shrink-0`} />
              <div>
                <p className={`text-2xl font-bold ${cls}`} style={{ fontFamily: 'var(--font-playfair)' }}>{value}</p>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ══════ FILTERS ══════ */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
          {/* Search + view toggle + sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un produit par nom ou description…"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A]/50"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View mode */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 shrink-0">
              <button onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-visible -mx-4 px-4 pb-1">
            <button
              onClick={() => setCategoryFilter('')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                !categoryFilter
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}>
              Toutes ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.slug).length
              const active = categoryFilter === cat.slug
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(active ? '' : cat.slug)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                    active
                      ? 'bg-[#D4AF6A] text-white border-[#D4AF6A]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-[#D4AF6A]/40'
                  }`}>
                  {(cat.emoji ? `${cat.emoji} ` : '') + cat.name} ({count})
                </button>
              )
            })}
          </div>

          {/* Status + stock + sort */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center bg-slate-100 rounded-xl p-1">
              {(['all', 'active', 'inactive'] as const).map(opt => (
                <button key={opt}
                  onClick={() => setActiveFilter(opt)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    activeFilter === opt ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}>
                  {opt === 'all' ? 'Tous' : opt === 'active' ? 'Actifs' : 'Inactifs'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setLowStockOnly(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                lowStockOnly
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-orange-600 border-orange-200 hover:border-orange-400'
              }`}>
              <AlertTriangle className="w-3.5 h-3.5" />
              Stock faible
            </button>

            <div className="ml-auto flex items-center gap-2 text-sm text-slate-400">
              <span>Trier :</span>
              <SortBtn k="name" label="Nom" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortBtn k="price" label="Prix" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortBtn k="stock" label="Stock" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortBtn k="rating" label="Note" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            </div>
          </div>
        </div>

        {/* ══════ RESULT COUNT ══════ */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-800">{filtered.length}</span>
            {' '}produit{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}
            {search && <span className="text-slate-400"> pour « {search} »</span>}
          </p>
          {(search || categoryFilter || activeFilter !== 'all' || lowStockOnly) && (
            <button
              onClick={() => { setSearch(''); setCategoryFilter(''); setActiveFilter('all'); setLowStockOnly(false) }}
              className="flex items-center gap-1.5 text-xs text-[#D4AF6A] hover:text-[#C8956C] font-semibold transition-colors">
              <X className="w-3.5 h-3.5" /> Effacer les filtres
            </button>
          )}
        </div>

        {/* ══════ CONTENT ══════ */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-slate-700">Aucun produit trouvé</p>
              <p className="text-sm text-slate-400 mt-1">Modifiez vos filtres ou ajoutez un nouveau produit</p>
            </div>
            <button onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF6A] hover:bg-[#C8956C] text-white text-sm font-semibold transition-all">
              <Plus className="w-4 h-4" /> Nouveau produit
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* ── Grid ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p}
                onView={()   => setViewProduct(p)}
                onEdit={()   => openEdit(p)}
                onDelete={()  => setDeleteTarget(p)}
                onToggle={()  => { toggleActive(p.id); toast.success(`${p.name} ${p.isActive ? 'désactivé' : 'activé'}`) }}
              />
            ))}
          </div>
        ) : (
          /* ── List ── */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* List header */}
            <div className="hidden lg:flex items-center gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50">
              <div className="flex-1">
                <SortBtn k="name" label="Produit" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              </div>
              <div className="shrink-0 w-32 text-right">
                <SortBtn k="price" label="Prix" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              </div>
              <div className="shrink-0 w-24 text-center">
                <SortBtn k="stock" label="Stock" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              </div>
              <div className="shrink-0 w-20">
                <SortBtn k="rating" label="Note" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              </div>
              <div className="shrink-0 w-20 text-xs font-semibold text-slate-500">Statut</div>
              <div className="shrink-0 w-24" />
            </div>
            {filtered.map(p => (
              <ProductRow key={p.id} product={p}
                onView={()   => setViewProduct(p)}
                onEdit={()   => openEdit(p)}
                onDelete={()  => setDeleteTarget(p)}
                onToggle={()  => { toggleActive(p.id); toast.success(`${p.name} ${p.isActive ? 'désactivé' : 'activé'}`) }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          VIEW DIALOG
      ══════════════════════════════════════════════════════════ */}
      <Dialog open={!!viewProduct} onOpenChange={o => !o && setViewProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">
            {viewProduct ? `Détail — ${viewProduct.name}` : 'Détail du produit'}
          </DialogTitle>
          {viewProduct && (
            <>
              {/* Image header */}
              <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden rounded-t-2xl">
                {viewProduct.images[0] ? (
                  <img src={viewProduct.images[0]} alt={viewProduct.name}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-slate-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border mb-2 ${
                    getCategoryBadgeClass(viewProduct.category)
                  }`}>
                    {useAdminCategoriesStore.getState().categories.find((c) => c.slug === viewProduct.category)?.name ?? viewProduct.category}
                  </span>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {viewProduct.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-lg font-bold text-[#D4AF6A]" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {formatPrice(viewProduct.pricePromo ?? viewProduct.price)}
                    </span>
                    {viewProduct.pricePromo && (
                      <span className="text-sm text-white/60 line-through">{formatPrice(viewProduct.price)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* KPIs */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {viewProduct.stock === 0 ? '0' : viewProduct.stock}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">En stock</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-[#D4AF6A] fill-[#D4AF6A]" />
                      <p className="text-xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-playfair)' }}>
                        {viewProduct.rating.toFixed(1)}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{viewProduct.reviewCount} avis</p>
                  </div>
                  <div className={`rounded-xl p-3 text-center ${viewProduct.isActive ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                    <p className={`text-sm font-bold ${viewProduct.isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {viewProduct.isActive ? '✓ Actif' : '— Inactif'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Statut boutique</p>
                  </div>
                </div>

                {/* Description */}
                {viewProduct.description && (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{viewProduct.description}</p>
                  </div>
                )}

                {/* Material */}
                {viewProduct.material && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Matière</p>
                    <p className="text-sm font-semibold text-purple-900">{viewProduct.material}</p>
                  </div>
                )}

                {/* Sizes & Colors */}
                <div className="grid grid-cols-2 gap-3">
                  {viewProduct.colors.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Couleurs</p>
                      <div className="flex flex-wrap gap-1.5">
                        {viewProduct.colors.map(c => (
                          <span key={c} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium capitalize">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {viewProduct.sizes.length > 0 && viewProduct.sizes[0] !== 'unique' && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tailles</p>
                      <div className="flex flex-wrap gap-1.5">
                        {viewProduct.sizes.map(s => (
                          <span key={s} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => { setViewProduct(null); openEdit(viewProduct) }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-colors">
                    <Pencil className="w-4 h-4" /> Modifier
                  </button>
                  <button
                    onClick={() => { setViewProduct(null); setDeleteTarget(viewProduct) }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold transition-colors">
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ProductFormModal
        open={isFormOpen}
        onOpenChange={(o) => { if (!o) closeForm() }}
        editProduct={editProduct}
        form={form}
        setForm={setForm}
        formTab={formTab}
        setFormTab={setFormTab}
        formProductId={formProductId}
        onSave={handleSave}
        onCancel={closeForm}
      />

      {/* ══════════════════════════════════════════════════════════
          DELETE CONFIRM
      ══════════════════════════════════════════════════════════ */}
      <Dialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="sr-only">
            <DialogTitle>Supprimer ce produit</DialogTitle>
            <DialogDescription>Confirmation de suppression irréversible.</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Supprimer ce produit ?
                </p>
                <p className="text-sm text-slate-500 mt-0.5">Cette action est irréversible.</p>
              </div>
            </div>

            {deleteTarget && (
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                <div className="w-10 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                  {deleteTarget.images[0] ? (
                    <img src={deleteTarget.images[0]} alt={deleteTarget.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <Package className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{deleteTarget.name}</p>
                  <p className="text-xs text-slate-500">{formatPrice(deleteTarget.price)}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">
                Annuler
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </AdminLayout>
  )
}
