'use client'

import { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminStore, type HeroSlide } from '@/stores/admin-store'
import { getProductImagePaths } from '@/data/product-image-map'
import { ProductImage } from '@/components/ui/product-image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ImageIcon,
  Pencil,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  Layout,
  MonitorPlay,
  Search,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type SlideFilter = '' | 'active' | 'hidden'

const IMAGE_OPTIONS = [
  { key: 'prod-008', cat: 'sacs', label: 'Sac Bamako' },
  { key: 'prod-009', cat: 'sacs', label: 'Sac Tombouctou' },
  { key: 'prod-010', cat: 'sacs', label: 'Cabas Mopti' },
  { key: 'prod-005', cat: 'bijoux', label: 'Collier Amira' },
  { key: 'prod-001', cat: 'bijoux', label: 'Bijoux dorés' },
  { key: 'prod-013', cat: 'foulards', label: 'Foulard Djenné' },
  { key: 'prod-035', cat: 'bijoux', label: 'Bague élégance' },
]

export default function ContentPage() {
  const { heroSlides, updateHeroSlide, resetHeroSlides } = useAdminStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<SlideFilter>('')
  const [editSlide, setEditSlide] = useState<HeroSlide | null>(null)
  const [form, setForm] = useState<HeroSlide | null>(null)

  const stats = useMemo(() => {
    const active = heroSlides.filter((s) => s.active).length
    return {
      total: heroSlides.length,
      active,
      hidden: heroSlides.length - active,
    }
  }, [heroSlides])

  const filtered = useMemo(() => {
    let list = heroSlides
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.highlight.toLowerCase().includes(q) ||
          s.badge.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      )
    }
    if (filter === 'active') list = list.filter((s) => s.active)
    if (filter === 'hidden') list = list.filter((s) => !s.active)
    return list
  }, [heroSlides, search, filter])

  const openEdit = (slide: HeroSlide) => {
    setEditSlide(slide)
    setForm({ ...slide })
  }

  const closeEdit = () => {
    setEditSlide(null)
    setForm(null)
  }

  const handleSave = () => {
    if (!form) return
    updateHeroSlide(form.id, form)
    toast.success('Slide mis à jour')
    closeEdit()
  }

  const handleToggle = (slide: HeroSlide) => {
    updateHeroSlide(slide.id, { active: !slide.active })
    toast.success(slide.active ? 'Slide masqué' : 'Slide activé')
  }

  const handleReset = () => {
    resetHeroSlides()
    toast.success('Slides réinitialisés')
  }

  const previewImage = form
    ? getProductImagePaths(form.imageKey, form.imageCategory, 1)[0]
    : ''

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
              Contenu Hero
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Modifiez les slides du carousel principal de la page d&apos;accueil
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:border-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              label: 'Total slides',
              value: stats.total,
              icon: Layout,
              bg: 'bg-slate-50',
              cls: 'text-slate-800',
              border: 'border-slate-100',
            },
            {
              label: 'Visibles sur l\'accueil',
              value: stats.active,
              icon: MonitorPlay,
              bg: 'bg-emerald-50',
              cls: 'text-emerald-700',
              border: 'border-emerald-100',
            },
            {
              label: 'Masqués',
              value: stats.hidden,
              icon: EyeOff,
              bg: 'bg-slate-100',
              cls: 'text-slate-600',
              border: 'border-slate-200',
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

        {/* INFO */}
        <div className="flex items-start gap-3 rounded-2xl border border-[#D4AF6A]/20 bg-[#D4AF6A]/8 px-4 py-3">
          <Sparkles className="w-4 h-4 text-[#D4AF6A] mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600 leading-relaxed">
            Les changements sont appliqués en temps réel sur la page d&apos;accueil.
            Seuls les slides <strong className="text-slate-800">actifs</strong> apparaissent
            dans le carousel.
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un slide (titre, badge, texte)…"
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
              { key: '' as SlideFilter, label: 'Tous', count: stats.total },
              { key: 'active' as SlideFilter, label: 'Actifs', count: stats.active },
              { key: 'hidden' as SlideFilter, label: 'Masqués', count: stats.hidden },
            ].map(({ key, label, count }) => (
              <button
                key={label}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all',
                  filter === key
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                )}
              >
                {label}
                <span
                  className={cn(
                    'text-xs font-bold px-1.5 py-0.5 rounded-full',
                    filter === key ? 'bg-white/20' : 'bg-slate-100'
                  )}
                >
                  {count}
                </span>
              </button>
            ))}
            {(search || filter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setFilter('')
                }}
                className="ml-auto flex items-center gap-1.5 text-xs text-[#D4AF6A] font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-500">
          <span className="font-bold text-slate-800">{filtered.length}</span> slide
          {filtered.length !== 1 ? 's' : ''}
        </p>

        {/* LIST */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-20 gap-3">
            <ImageIcon className="w-10 h-10 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">Aucun slide trouvé</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="hidden lg:grid grid-cols-[auto_2fr_1.2fr_auto] gap-4 px-6 py-3.5 border-b border-slate-100 bg-slate-50/70">
              {['#', 'Contenu', 'Visuel & CTA', 'Actions'].map((h) => (
                <p
                  key={h}
                  className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >
                  {h}
                </p>
              ))}
            </div>
            <div className="divide-y divide-slate-50">
              {filtered.map((slide) => {
                const imgSrc = getProductImagePaths(
                  slide.imageKey,
                  slide.imageCategory,
                  1
                )[0]
                const imageLabel =
                  IMAGE_OPTIONS.find((o) => o.key === slide.imageKey)?.label ??
                  slide.imageKey

                return (
                  <div
                    key={slide.id}
                    className={cn(
                      'grid grid-cols-1 lg:grid-cols-[auto_2fr_1.2fr_auto] gap-4 items-center px-6 py-4 transition-colors group',
                      slide.active ? 'hover:bg-slate-50/80' : 'opacity-60 hover:opacity-80'
                    )}
                  >
                    <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {heroSlides.findIndex((s) => s.id === slide.id) + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#9A7B3C] bg-[#D4AF6A]/10 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-2.5 h-2.5" />
                          {slide.badge}
                        </span>
                        {!slide.active && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            Masqué
                          </span>
                        )}
                      </div>
                      <p
                        className="text-base font-bold text-slate-900 leading-tight"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                      >
                        {slide.title}{' '}
                        <span className="text-[#D4AF6A]">{slide.highlight}</span>
                      </p>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {slide.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                        <ProductImage
                          src={imgSrc}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0 text-xs text-slate-500 space-y-1">
                        <p className="truncate">
                          <span className="font-semibold text-slate-700">Image :</span>{' '}
                          {imageLabel}
                        </p>
                        <p className="truncate">
                          <span className="font-semibold text-slate-700">CTA :</span>{' '}
                          {slide.ctaPrimary}
                        </p>
                        {slide.ctaSecondary && (
                          <p className="truncate text-slate-400">{slide.ctaSecondary}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggle(slide)}
                        title={slide.active ? 'Masquer' : 'Activer'}
                        className={cn(
                          'w-8 h-8 rounded-lg border flex items-center justify-center transition-colors',
                          slide.active
                            ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                        )}
                      >
                        {slide.active ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(slide)}
                        title="Modifier"
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <Dialog open={!!editSlide} onOpenChange={(o) => !o && closeEdit()}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
            <DialogTitle
              className="text-lg"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Modifier le slide
            </DialogTitle>
            <p className="text-sm text-slate-500">
              {editSlide?.badge} — position{' '}
              {heroSlides.findIndex((s) => s.id === editSlide?.id) + 1}
            </p>
          </DialogHeader>

          {form && (
            <>
              <div className="px-6 py-5 space-y-4 max-h-[min(420px,55vh)] overflow-y-auto">
                <div className="space-y-2">
                  <Label>Badge</Label>
                  <Input
                    value={form.badge}
                    onChange={(e) =>
                      setForm((f) => (f ? { ...f, badge: e.target.value } : f))
                    }
                    className="h-10 rounded-lg"
                    placeholder="Collection 2025"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Titre</Label>
                    <Input
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => (f ? { ...f, title: e.target.value } : f))
                      }
                      className="h-10 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mot en or</Label>
                    <Input
                      value={form.highlight}
                      onChange={(e) =>
                        setForm((f) => (f ? { ...f, highlight: e.target.value } : f))
                      }
                      className="h-10 rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => (f ? { ...f, description: e.target.value } : f))
                    }
                    rows={3}
                    className="rounded-lg resize-none text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>CTA principal</Label>
                    <Input
                      value={form.ctaPrimary}
                      onChange={(e) =>
                        setForm((f) => (f ? { ...f, ctaPrimary: e.target.value } : f))
                      }
                      className="h-10 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA secondaire</Label>
                    <Input
                      value={form.ctaSecondary ?? ''}
                      onChange={(e) =>
                        setForm((f) =>
                          f ? { ...f, ctaSecondary: e.target.value || undefined } : f
                        )
                      }
                      className="h-10 rounded-lg"
                      placeholder="Optionnel"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Image de fond</Label>
                  <select
                    value={form.imageKey}
                    onChange={(e) => {
                      const opt = IMAGE_OPTIONS.find((o) => o.key === e.target.value)
                      setForm((f) =>
                        f
                          ? {
                              ...f,
                              imageKey: e.target.value,
                              imageCategory: opt?.cat ?? f.imageCategory,
                            }
                          : f
                      )
                    }}
                    className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30"
                  >
                    {IMAGE_OPTIONS.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label} ({o.cat})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hero preview */}
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <div className="relative h-32 bg-slate-900">
                    <ProductImage
                      src={previewImage}
                      alt=""
                      fill
                      className="object-cover opacity-70"
                      sizes="400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-center px-4 max-w-[85%]">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF6A] mb-1">
                        {form.badge}
                      </span>
                      <p
                        className="text-white font-bold text-sm leading-tight"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                      >
                        {form.title}{' '}
                        <span className="text-[#D4AF6A]">{form.highlight}</span>
                      </p>
                      <p className="text-slate-300 text-[10px] mt-1 line-clamp-2">
                        {form.description}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-center text-slate-400 py-2 bg-slate-50">
                    Aperçu carousel accueil
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg bg-[#D4AF6A] hover:bg-[#C8956C] text-white text-sm font-semibold"
                >
                  Enregistrer
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
