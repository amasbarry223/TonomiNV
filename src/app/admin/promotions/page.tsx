'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import AdminLayout from '@/components/admin/AdminLayout'
import { type PromoCode, type FlashSale } from '@/data/promos'
import { useAdminPromosStore } from '@/stores/admin-promos-store'
import { useAdminProductsStore } from '@/stores/admin-products-store'
import { formatPrice } from '@/lib/product-display'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Tag,
  Zap,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  X,
  Ticket,
  Clock,
  Package,
  Download,
} from 'lucide-react'
import { exportToCSV } from '@/lib/admin-export'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type CodeFilter = '' | 'active' | 'expired'
type FlashFilter = '' | 'active' | 'expired' | 'soldout'

const EMPTY_FORM = {
  code: '',
  type: 'percentage' as PromoCode['type'],
  discount: '',
  minPurchase: '',
  description: '',
  validUntil: '',
}

function isExpired(validUntil: string) {
  return new Date(validUntil) < new Date()
}

function isFlashExpired(endsAt: string) {
  return new Date(endsAt) < new Date()
}

function flashStatus(sale: FlashSale) {
  if (isFlashExpired(sale.endsAt)) return { label: 'Expirée', cls: 'bg-red-100 text-red-700' }
  if (sale.stockLeft === 0) return { label: 'Épuisée', cls: 'bg-slate-100 text-slate-600' }
  return { label: 'Active', cls: 'bg-orange-100 text-orange-800' }
}

export default function PromotionsPage() {
  const { promoCodes, flashSales, addPromoCode, updatePromoCode, deletePromoCode, resetPromoCodes } =
    useAdminPromosStore()
  const { products } = useAdminProductsStore()

  const [tab, setTab] = useState('codes')
  const [search, setSearch] = useState('')
  const [codeFilter, setCodeFilter] = useState<CodeFilter>('')
  const [flashFilter, setFlashFilter] = useState<FlashFilter>('')
  const [editCode, setEditCode] = useState<PromoCode | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PromoCode | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const filteredCodes = useMemo(() => {
    let list = promoCodes
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      )
    }
    if (codeFilter === 'active') list = list.filter((c) => !isExpired(c.validUntil))
    if (codeFilter === 'expired') list = list.filter((c) => isExpired(c.validUntil))
    return list
  }, [promoCodes, search, codeFilter])

  const filteredFlash = useMemo(() => {
    let list = flashSales
    if (flashFilter === 'active') {
      list = list.filter((s) => !isFlashExpired(s.endsAt) && s.stockLeft > 0)
    }
    if (flashFilter === 'expired') {
      list = list.filter((s) => isFlashExpired(s.endsAt))
    }
    if (flashFilter === 'soldout') {
      list = list.filter((s) => !isFlashExpired(s.endsAt) && s.stockLeft === 0)
    }
    return list
  }, [flashSales, flashFilter])

  const stats = useMemo(() => {
    const codesActive = promoCodes.filter((c) => !isExpired(c.validUntil)).length
    const codesExpired = promoCodes.length - codesActive
    const flashActive = flashSales.filter(
      (s) => !isFlashExpired(s.endsAt) && s.stockLeft > 0
    ).length
    return {
      codesActive,
      codesExpired,
      flashActive,
      totalCodes: promoCodes.length,
    }
  }, [promoCodes, flashSales])

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    toast.success(`Code ${code} copié`)
    setTimeout(() => setCopied(null), 2000)
  }

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setEditCode(null)
    setShowAdd(true)
  }

  const openEdit = (code: PromoCode) => {
    setEditCode(code)
    setForm({
      code: code.code,
      type: code.type,
      discount: String(code.discount),
      minPurchase: String(code.minPurchase ?? ''),
      description: code.description,
      validUntil: code.validUntil,
    })
    setShowAdd(true)
  }

  const closeForm = () => {
    setShowAdd(false)
    setEditCode(null)
    setForm(EMPTY_FORM)
  }

  const handleSave = () => {
    if (!form.code.trim()) {
      toast.error('Le code est obligatoire')
      return
    }
    if (!form.discount || Number.isNaN(Number(form.discount))) {
      toast.error('La valeur de remise est obligatoire')
      return
    }
    const payload: Omit<PromoCode, 'id'> = {
      code: form.code.toUpperCase().trim(),
      type: form.type,
      discount: Number(form.discount),
      minPurchase: form.minPurchase ? Number(form.minPurchase) : 0,
      description: form.description,
      validUntil: form.validUntil || '2099-12-31',
    }
    if (editCode) {
      updatePromoCode(editCode.id, payload)
      toast.success(`Code ${payload.code} mis à jour`)
    } else {
      addPromoCode(payload)
      toast.success(`Code ${payload.code} créé`)
    }
    closeForm()
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deletePromoCode(deleteTarget.id)
    toast.success(`Code ${deleteTarget.code} supprimé`)
    setDeleteTarget(null)
  }

  const resetFilters = () => {
    setSearch('')
    setCodeFilter('')
    setFlashFilter('')
  }

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Promotions
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Codes promo et ventes flash
            </p>
          </div>
          <div className="flex items-center gap-2">
            {tab === 'codes' && (
              <button
                type="button"
                onClick={() => {
                  exportToCSV(filteredCodes, `tonomi-promos-${Date.now()}`)
                  toast.success('Export CSV lancé')
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:border-slate-300 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exporter ({filteredCodes.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                resetPromoCodes()
                toast.success('Codes promo réinitialisés')
              }}
              title="Réinitialiser les codes"
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-slate-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {tab === 'codes' && (
              <button
                type="button"
                onClick={openAdd}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF6A] hover:bg-[#C8956C] text-white text-sm font-semibold shadow-sm shadow-[#D4AF6A]/25 transition-all"
              >
                <Plus className="w-4 h-4" /> Nouveau code
              </button>
            )}
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: 'Codes actifs',
              value: stats.codesActive,
              icon: Ticket,
              bg: 'bg-emerald-50',
              cls: 'text-emerald-700',
              border: 'border-emerald-100',
            },
            {
              label: 'Codes expirés',
              value: stats.codesExpired,
              icon: Clock,
              bg: 'bg-red-50',
              cls: 'text-red-600',
              border: 'border-red-100',
            },
            {
              label: 'Ventes flash actives',
              value: stats.flashActive,
              icon: Zap,
              bg: 'bg-orange-50',
              cls: 'text-orange-700',
              border: 'border-orange-100',
            },
            {
              label: 'Total codes',
              value: stats.totalCodes,
              icon: Tag,
              bg: 'bg-[#D4AF6A]/8',
              cls: 'text-[#D4AF6A]',
              border: 'border-[#D4AF6A]/20',
            },
          ].map(({ label, value, icon: Icon, bg, cls, border }) => (
            <div
              key={label}
              className={cn('rounded-2xl border p-4 flex items-center gap-3', bg, border)}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm">
                <Icon className={cn('w-4 h-4', cls)} />
              </div>
              <div>
                <p
                  className={cn('text-xl font-bold', cls)}
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {value}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="w-full sm:w-auto h-auto flex flex-wrap gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
            <TabsTrigger
              value="codes"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 data-[state=active]:bg-[#D4AF6A] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Tag className="w-4 h-4" />
              Codes promo
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-black/10 data-[state=active]:bg-white/25">
                {promoCodes.length}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="flash"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 data-[state=active]:bg-[#D4AF6A] data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Zap className="w-4 h-4" />
              Ventes flash
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-black/10 data-[state=active]:bg-white/25">
                {flashSales.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* ── CODES PROMO ── */}
          <TabsContent value="codes" className="mt-0 space-y-4 outline-none">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un code ou une description…"
                  className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A]/50"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: '' as CodeFilter, label: 'Tous', count: promoCodes.length },
                  {
                    key: 'active' as CodeFilter,
                    label: 'Actifs',
                    count: stats.codesActive,
                  },
                  {
                    key: 'expired' as CodeFilter,
                    label: 'Expirés',
                    count: stats.codesExpired,
                  },
                ].map(({ key, label, count }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setCodeFilter(key)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all',
                      codeFilter === key
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    )}
                  >
                    {label}
                    <span
                      className={cn(
                        'text-xs font-bold px-1.5 py-0.5 rounded-full',
                        codeFilter === key ? 'bg-white/20' : 'bg-slate-100'
                      )}
                    >
                      {count}
                    </span>
                  </button>
                ))}
                {(search || codeFilter) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="ml-auto flex items-center gap-1.5 text-xs text-[#D4AF6A] font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-500">
              <span className="font-bold text-slate-800">{filteredCodes.length}</span> code
              {filteredCodes.length !== 1 ? 's' : ''} promo
            </p>

            {filteredCodes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <Tag className="w-8 h-8 text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-slate-700">Aucun code trouvé</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Créez un code ou modifiez vos filtres
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAdd}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF6A] text-white text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" /> Nouveau code
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="hidden lg:grid grid-cols-[1.4fr_1fr_1fr_1fr_0.8fr_auto] gap-4 px-6 py-3.5 border-b border-slate-100 bg-slate-50/70">
                  {['Code', 'Remise', 'Min. commande', 'Expiration', 'Statut', ''].map(
                    (h) => (
                      <p
                        key={h}
                        className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                      >
                        {h}
                      </p>
                    )
                  )}
                </div>
                <div className="divide-y divide-slate-50">
                  {filteredCodes.map((code) => {
                    const expired = isExpired(code.validUntil)
                    return (
                      <div
                        key={code.id}
                        className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr_0.8fr_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50/80 transition-colors group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                              {code.code}
                            </code>
                            <button
                              type="button"
                              onClick={() => copyCode(code.code)}
                              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#D4AF6A] hover:border-[#D4AF6A]/40 opacity-0 group-hover:opacity-100 lg:opacity-100 transition-all"
                              title="Copier"
                            >
                              {copied === code.code ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                            {code.description}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-[#D4AF6A]">
                          {code.type === 'percentage'
                            ? `−${code.discount}%`
                            : `−${formatPrice(code.discount)}`}
                        </p>
                        <p className="text-sm text-slate-600">
                          {code.minPurchase ? formatPrice(code.minPurchase) : '—'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(code.validUntil).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        <span
                          className={cn(
                            'inline-flex w-fit text-[10px] font-semibold px-2 py-0.5 rounded-full',
                            expired
                              ? 'bg-red-100 text-red-700'
                              : 'bg-emerald-100 text-emerald-700'
                          )}
                        >
                          {expired ? 'Expiré' : 'Actif'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(code)}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                            title="Modifier"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(code)}
                            className="w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-50"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── VENTES FLASH ── */}
          <TabsContent value="flash" className="mt-0 space-y-4 outline-none">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: '' as FlashFilter, label: 'Toutes', count: flashSales.length },
                  {
                    key: 'active' as FlashFilter,
                    label: 'Actives',
                    count: stats.flashActive,
                  },
                  {
                    key: 'expired' as FlashFilter,
                    label: 'Expirées',
                    count: flashSales.filter((s) => isFlashExpired(s.endsAt)).length,
                  },
                  {
                    key: 'soldout' as FlashFilter,
                    label: 'Épuisées',
                    count: flashSales.filter(
                      (s) => !isFlashExpired(s.endsAt) && s.stockLeft === 0
                    ).length,
                  },
                ].map(({ key, label, count }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setFlashFilter(key)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all',
                      flashFilter === key
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    )}
                  >
                    {label}
                    <span
                      className={cn(
                        'text-xs font-bold px-1.5 py-0.5 rounded-full',
                        flashFilter === key ? 'bg-white/20' : 'bg-slate-100'
                      )}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Ventes flash liées au catalogue — configuration avancée à venir.
              </p>
            </div>

            <p className="text-sm text-slate-500">
              <span className="font-bold text-slate-800">{filteredFlash.length}</span> vente
              {filteredFlash.length !== 1 ? 's' : ''} flash
            </p>

            {filteredFlash.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 gap-3">
                <Zap className="w-10 h-10 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">Aucune vente flash</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="hidden lg:grid grid-cols-[2fr_0.8fr_1.2fr_1fr_0.8fr] gap-4 px-6 py-3.5 border-b border-slate-100 bg-slate-50/70">
                  {['Produit', 'Remise', 'Stock', 'Fin', 'Statut'].map((h) => (
                    <p
                      key={h}
                      className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                    >
                      {h}
                    </p>
                  ))}
                </div>
                <div className="divide-y divide-slate-50">
                  {filteredFlash.map((sale) => {
                    const product = products.find((p) => p.id === sale.productId)
                    const status = flashStatus(sale)
                    const stockPct = Math.round(
                      (sale.stockLeft / sale.totalStock) * 100
                    )
                    const img = product?.images[0]

                    return (
                      <div
                        key={sale.id}
                        className="grid grid-cols-1 lg:grid-cols-[2fr_0.8fr_1.2fr_1fr_0.8fr] gap-4 items-center px-6 py-4 hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                            {img ? (
                              <Image
                                src={img}
                                alt=""
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-slate-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {product?.name ?? sale.productId}
                            </p>
                            <p className="text-xs text-slate-400 capitalize">
                              {product?.category ?? '—'}
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-orange-600">−{sale.discount}%</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                stockPct < 20 ? 'bg-red-400' : 'bg-[#D4AF6A]'
                              )}
                              style={{ width: `${stockPct}%` }}
                            />
                          </div>
                          <span
                            className={cn(
                              'text-xs font-semibold tabular-nums',
                              stockPct < 20 ? 'text-red-500' : 'text-slate-600'
                            )}
                          >
                            {sale.stockLeft}/{sale.totalStock}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {new Date(sale.endsAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <span
                          className={cn(
                            'inline-flex w-fit text-[10px] font-semibold px-2 py-0.5 rounded-full',
                            status.cls
                          )}
                        >
                          {status.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal code promo */}
      <Dialog open={showAdd} onOpenChange={(o) => !o && closeForm()}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
            <DialogTitle
              className="text-lg"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {editCode ? 'Modifier le code' : 'Nouveau code promo'}
            </DialogTitle>
            <p className="text-sm text-slate-500">
              {editCode
                ? `Mise à jour de ${editCode.code}`
                : 'Créez un code utilisable au panier'}
            </p>
          </DialogHeader>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-2">
              <Label>Code *</Label>
              <Input
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                }
                className="h-10 rounded-lg font-mono uppercase"
                placeholder="SOLDES20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      type: e.target.value as PromoCode['type'],
                    }))
                  }
                  className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30"
                >
                  <option value="percentage">Pourcentage (%)</option>
                  <option value="fixed">Montant fixe (FCFA)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>
                  Valeur * {form.type === 'percentage' ? '(%)' : '(FCFA)'}
                </Label>
                <Input
                  type="number"
                  value={form.discount}
                  onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
                  className="h-10 rounded-lg"
                  placeholder={form.type === 'percentage' ? '20' : '5000'}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Commande minimum (FCFA)</Label>
              <Input
                type="number"
                value={form.minPurchase}
                onChange={(e) => setForm((f) => ({ ...f, minPurchase: e.target.value }))}
                className="h-10 rounded-lg"
                placeholder="10000"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="h-10 rounded-lg"
                placeholder="10% sur la première commande"
              />
            </div>
            <div className="space-y-2">
              <Label>Date d&apos;expiration</Label>
              <Input
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
                className="h-10 rounded-lg"
              />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[#D4AF6A] hover:bg-[#C8956C] text-white text-sm font-semibold"
            >
              {editCode ? 'Enregistrer' : 'Créer le code'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Suppression */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm p-0 gap-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-2 text-red-600 text-lg">
              <AlertTriangle className="w-5 h-5" />
              Supprimer le code
            </DialogTitle>
          </DialogHeader>
          <p className="px-6 py-3 text-sm text-slate-600">
            Supprimer{' '}
            <code className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded">
              {deleteTarget?.code}
            </code>{' '}
            ? Action irréversible.
          </p>
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold"
            >
              Supprimer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
