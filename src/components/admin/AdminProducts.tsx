'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  Loader2,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

// Types
interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  pricePromo: number | null
  category: string
  colors: string[]
  sizes: string[]
  images: string[]
  stock: number
  rating: number
  reviewCount: number
  badge: string | null
  isNew: boolean
  isBestSeller: boolean
  material: string
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface ProductFormData {
  name: string
  slug: string
  description: string
  price: string
  pricePromo: string
  category: string
  colors: string
  sizes: string
  images: string
  stock: string
  badge: string
  isNew: boolean
  isBestSeller: boolean
  material: string
}

const emptyForm: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  price: '',
  pricePromo: '',
  category: '',
  colors: '',
  sizes: '',
  images: '',
  stock: '0',
  badge: '',
  isNew: false,
  isBestSeller: false,
  material: '',
}

function formatFCFA(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA'
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminProducts() {
  // Data state
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  // Filter state
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  // UI state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductFormData>(emptyForm)

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Erreur lors du chargement des catégories')
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error(err)
      toast.error('Impossible de charger les catégories')
    }
  }, [])

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (categoryFilter) params.set('category', categoryFilter)
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())

      const res = await fetch(`/api/products?${params.toString()}`)
      if (!res.ok) throw new Error('Erreur lors du chargement des produits')
      const data = await res.json()

      setProducts(data.products)
      setPagination(data.pagination)
    } catch (err) {
      console.error(err)
      toast.error('Impossible de charger les produits')
    } finally {
      setLoading(false)
    }
  }, [search, categoryFilter, pagination.page, pagination.limit])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Handle name change and auto-generate slug
  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugify(name),
    }))
  }

  // Open create dialog
  const openCreateDialog = () => {
    setEditingProduct(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  // Open edit dialog
  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      pricePromo: product.pricePromo?.toString() || '',
      category: product.category,
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : product.colors,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes,
      images: Array.isArray(product.images) ? product.images.join(', ') : product.images,
      stock: product.stock.toString(),
      badge: product.badge || '',
      isNew: product.isNew,
      isBestSeller: product.isBestSeller,
      material: product.material,
    })
    setDialogOpen(true)
  }

  // Save product (create or update)
  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Le nom du produit est requis')
      return
    }
    if (!form.price || Number(form.price) <= 0) {
      toast.error('Le prix doit être supérieur à 0')
      return
    }
    if (!form.category) {
      toast.error('La catégorie est requise')
      return
    }

    setSaving(true)
    try {
      const body = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        description: form.description,
        price: Number(form.price),
        pricePromo: form.pricePromo ? Number(form.pricePromo) : null,
        category: form.category,
        colors: form.colors,
        sizes: form.sizes,
        images: form.images,
        stock: Number(form.stock) || 0,
        badge: form.badge || null,
        isNew: form.isNew,
        isBestSeller: form.isBestSeller,
        material: form.material,
      }

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error('Erreur lors de la mise à jour')
        toast.success('Produit mis à jour avec succès')
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error('Erreur lors de la création')
        toast.success('Produit créé avec succès')
      }

      setDialogOpen(false)
      fetchProducts()
    } catch (err) {
      console.error(err)
      toast.error(editingProduct ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création')
    } finally {
      setSaving(false)
    }
  }

  // Delete product
  const handleDelete = async () => {
    if (!deletingProduct) return
    try {
      const res = await fetch(`/api/products/${deletingProduct.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Erreur lors de la suppression')
      toast.success('Produit supprimé avec succès')
      setDeleteDialogOpen(false)
      setDeletingProduct(null)
      fetchProducts()
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la suppression')
    }
  }

  // Pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page }))
    }
  }

  // Stock badge color
  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">Épuisé</Badge>
    if (stock <= 10) return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">{stock}</Badge>
    return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">{stock}</Badge>
  }

  // Status badge
  const getStatusBadge = (product: Product) => {
    const badges = []
    if (product.badge === 'nouveau' || product.isNew) {
      badges.push(<Badge key="new" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">Nouveau</Badge>)
    }
    if (product.badge === 'promo' || product.pricePromo) {
      badges.push(<Badge key="promo" className="bg-gold/20 text-copper hover:bg-gold/20 border-0 text-xs">Promo</Badge>)
    }
    if (product.badge === 'epuise' || product.stock === 0) {
      badges.push(<Badge key="epuise" className="bg-red-100 text-red-700 hover:bg-red-100 border-0 text-xs">Épuisé</Badge>)
    }
    if (product.isBestSeller) {
      badges.push(<Badge key="best" className="bg-tonomi-accent/20 text-copper hover:bg-tonomi-accent/20 border-0 text-xs">Best-seller</Badge>)
    }
    return badges.length > 0 ? <div className="flex flex-wrap gap-1">{badges}</div> : <span className="text-text-mid text-xs">—</span>
  }

  // Get product thumbnail
  const getThumbnail = (product: Product) => {
    const images = Array.isArray(product.images) ? product.images : []
    if (images.length > 0 && images[0]) {
      return images[0]
    }
    return '/images/placeholder-product.png'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-text-dark">Gestion des Produits</h2>
          <p className="text-text-mid text-sm mt-1">
            {pagination.total} produit{pagination.total !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="btn-gold text-sm px-5 py-2.5 h-auto border-0 shadow-none"
        >
          <Plus size={16} className="mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4 bg-warm-white border-gold/20 warm-shadow">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-mid" />
            <Input
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPagination((prev) => ({ ...prev, page: 1 }))
              }}
              className="pl-9 bg-cream/50 border-gold/20 focus:border-gold h-10"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('')
                  setPagination((prev) => ({ ...prev, page: 1 }))
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-mid hover:text-text-dark"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-text-mid flex-shrink-0" />
            <Select
              value={categoryFilter}
              onValueChange={(val) => {
                setCategoryFilter(val === 'all' ? '' : val)
                setPagination((prev) => ({ ...prev, page: 1 }))
              }}
            >
              <SelectTrigger className="w-[200px] bg-cream/50 border-gold/20 focus:border-gold h-10">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="bg-warm-white border-gold/20 warm-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gold/15 hover:bg-transparent">
                <TableHead className="text-text-mid font-semibold text-xs uppercase tracking-wider">Image</TableHead>
                <TableHead className="text-text-mid font-semibold text-xs uppercase tracking-wider">Nom</TableHead>
                <TableHead className="text-text-mid font-semibold text-xs uppercase tracking-wider">Catégorie</TableHead>
                <TableHead className="text-text-mid font-semibold text-xs uppercase tracking-wider">Prix</TableHead>
                <TableHead className="text-text-mid font-semibold text-xs uppercase tracking-wider">Stock</TableHead>
                <TableHead className="text-text-mid font-semibold text-xs uppercase tracking-wider">Statut</TableHead>
                <TableHead className="text-text-mid font-semibold text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-gold/10">
                    <TableCell><Skeleton className="w-10 h-10 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-beige/60 flex items-center justify-center">
                        <Package size={28} className="text-caramel/50" />
                      </div>
                      <p className="text-text-mid font-medium">Aucun produit trouvé</p>
                      <p className="text-text-mid/60 text-sm">
                        {search || categoryFilter
                          ? 'Essayez de modifier vos filtres'
                          : 'Commencez par ajouter votre premier produit'}
                      </p>
                      {!search && !categoryFilter && (
                        <Button
                          onClick={openCreateDialog}
                          variant="outline"
                          className="mt-2 border-gold/30 text-caramel hover:bg-gold/10"
                        >
                          <Plus size={16} className="mr-2" />
                          Ajouter un produit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // Product rows
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-b border-gold/10 hover:bg-cream/50 transition-colors"
                  >
                    <TableCell>
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-beige/40 flex-shrink-0">
                        <img
                          src={getThumbnail(product)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = ''
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-text-dark text-sm leading-tight">{product.name}</p>
                        <p className="text-text-mid/60 text-xs mt-0.5">{product.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gold/20 text-text-mid text-xs bg-cream/50">
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        {product.pricePromo ? (
                          <>
                            <p className="font-semibold text-copper text-sm">
                              {formatFCFA(product.pricePromo)}
                            </p>
                            <p className="text-text-mid/50 text-xs line-through">
                              {formatFCFA(product.price)}
                            </p>
                          </>
                        ) : (
                          <p className="font-medium text-text-dark text-sm">
                            {formatFCFA(product.price)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStockBadge(product.stock)}</TableCell>
                    <TableCell>{getStatusBadge(product)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                          className="h-8 w-8 p-0 text-caramel hover:text-copper hover:bg-gold/10"
                        >
                          <Edit size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingProduct(product)
                            setDeleteDialogOpen(true)
                          }}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gold/15">
            <p className="text-text-mid text-sm">
              Page {pagination.page} sur {pagination.totalPages}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="h-8 w-8 p-0 border-gold/20 text-text-mid hover:bg-gold/10 hover:text-caramel"
              >
                <ChevronLeft size={16} />
              </Button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first, last, current, and adjacent pages
                  return (
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.page) <= 1
                  )
                })
                .map((page, idx, arr) => {
                  // Add ellipsis indicator
                  const prevPage = arr[idx - 1]
                  const showEllipsis = prevPage && page - prevPage > 1
                  return (
                    <span key={page} className="flex items-center">
                      {showEllipsis && (
                        <span className="px-1 text-text-mid/40 text-sm">...</span>
                      )}
                      <Button
                        variant={page === pagination.page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className={
                          page === pagination.page
                            ? 'h-8 w-8 p-0 bg-gold hover:bg-caramel text-warm-white border-0'
                            : 'h-8 w-8 p-0 border-gold/20 text-text-mid hover:bg-gold/10 hover:text-caramel'
                        }
                      >
                        {page}
                      </Button>
                    </span>
                  )
                })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="h-8 w-8 p-0 border-gold/20 text-text-mid hover:bg-gold/10 hover:text-caramel"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-warm-white border-gold/20">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-text-dark">
              {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Name & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-dark text-sm font-medium">
                  Nom du produit <span className="text-red-400">*</span>
                </Label>
                <Input
                  placeholder="Ex: Collier Doré Élégance"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="bg-cream/50 border-gold/20 focus:border-gold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text-dark text-sm font-medium">Slug</Label>
                <Input
                  placeholder="auto-généré depuis le nom"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="bg-cream/50 border-gold/20 focus:border-gold"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-text-dark text-sm font-medium">Description</Label>
              <Textarea
                placeholder="Description détaillée du produit..."
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="bg-cream/50 border-gold/20 focus:border-gold resize-none"
              />
            </div>

            {/* Price & Promo Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-dark text-sm font-medium">
                  Prix (FCFA) <span className="text-red-400">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="Ex: 15000"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  className="bg-cream/50 border-gold/20 focus:border-gold"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text-dark text-sm font-medium">Prix promo (FCFA)</Label>
                <Input
                  type="number"
                  placeholder="Optionnel"
                  value={form.pricePromo}
                  onChange={(e) => setForm((prev) => ({ ...prev, pricePromo: e.target.value }))}
                  className="bg-cream/50 border-gold/20 focus:border-gold"
                  min="0"
                />
              </div>
            </div>

            {/* Category & Material */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-dark text-sm font-medium">
                  Catégorie <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, category: val }))}
                >
                  <SelectTrigger className="w-full bg-cream/50 border-gold/20 focus:border-gold">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-text-dark text-sm font-medium">Matière</Label>
                <Input
                  placeholder="Ex: Cuir véritable"
                  value={form.material}
                  onChange={(e) => setForm((prev) => ({ ...prev, material: e.target.value }))}
                  className="bg-cream/50 border-gold/20 focus:border-gold"
                />
              </div>
            </div>

            {/* Colors & Sizes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-dark text-sm font-medium">Couleurs</Label>
                <Input
                  placeholder="Séparées par des virgules: Or, Argent, Noir"
                  value={form.colors}
                  onChange={(e) => setForm((prev) => ({ ...prev, colors: e.target.value }))}
                  className="bg-cream/50 border-gold/20 focus:border-gold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text-dark text-sm font-medium">Tailles</Label>
                <Input
                  placeholder="Séparées par des virgules: S, M, L, XL"
                  value={form.sizes}
                  onChange={(e) => setForm((prev) => ({ ...prev, sizes: e.target.value }))}
                  className="bg-cream/50 border-gold/20 focus:border-gold"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <Label className="text-text-dark text-sm font-medium">Images (URLs)</Label>
              <Input
                placeholder="URLs séparées par des virgules"
                value={form.images}
                onChange={(e) => setForm((prev) => ({ ...prev, images: e.target.value }))}
                className="bg-cream/50 border-gold/20 focus:border-gold"
              />
              <p className="text-text-mid/60 text-xs">
                Entrez les URLs des images séparées par des virgules
              </p>
            </div>

            {/* Stock & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-dark text-sm font-medium">Stock</Label>
                <Input
                  type="number"
                  placeholder="Quantité en stock"
                  value={form.stock}
                  onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                  className="bg-cream/50 border-gold/20 focus:border-gold"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text-dark text-sm font-medium">Badge</Label>
                <Select
                  value={form.badge}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, badge: val }))}
                >
                  <SelectTrigger className="w-full bg-cream/50 border-gold/20 focus:border-gold">
                    <SelectValue placeholder="Aucun badge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="nouveau">Nouveau</SelectItem>
                    <SelectItem value="promo">Promo</SelectItem>
                    <SelectItem value="epuise">Épuisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border border-gold/20 bg-cream/30 p-3">
                <Label className="text-text-dark text-sm font-medium cursor-pointer">Nouveauté</Label>
                <Switch
                  checked={form.isNew}
                  onCheckedChange={(val) => setForm((prev) => ({ ...prev, isNew: val }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gold/20 bg-cream/30 p-3">
                <Label className="text-text-dark text-sm font-medium cursor-pointer">Best-seller</Label>
                <Switch
                  checked={form.isBestSeller}
                  onCheckedChange={(val) => setForm((prev) => ({ ...prev, isBestSeller: val }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2 border-t border-gold/15">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-gold/20 text-text-mid hover:bg-cream hover:text-text-dark"
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="btn-gold text-sm px-6 border-0 shadow-none"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : editingProduct ? (
                'Mettre à jour'
              ) : (
                'Créer le produit'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-warm-white border-gold/20">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-text-dark">
              Confirmer la suppression
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-text-mid">
              Êtes-vous sûr de vouloir supprimer le produit{' '}
              <span className="font-semibold text-text-dark">&ldquo;{deletingProduct?.name}&rdquo;</span> ?
            </p>
            <p className="text-text-mid/60 text-sm mt-2">
              Cette action est irréversible.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setDeletingProduct(null)
              }}
              className="border-gold/20 text-text-mid hover:bg-cream hover:text-text-dark"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white border-0"
            >
              <Trash2 size={16} className="mr-2" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
