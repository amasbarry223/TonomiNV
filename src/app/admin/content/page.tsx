'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminStore, type HeroSlide } from '@/stores/admin-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  Image, Pencil, RotateCcw, Eye, EyeOff, GripVertical,
  CheckCircle, Sparkles, AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

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
  const { heroSlides, updateHeroSlide, setHeroSlides, resetHeroSlides } = useAdminStore()
  const [editSlide, setEditSlide] = useState<HeroSlide | null>(null)
  const [form, setForm] = useState<HeroSlide | null>(null)
  const [saved, setSaved] = useState(false)

  const openEdit = (slide: HeroSlide) => {
    setEditSlide(slide)
    setForm({ ...slide })
  }

  const handleSave = () => {
    if (!form) return
    updateHeroSlide(form.id, form)
    setEditSlide(null)
    setSaved(true)
    toast.success('Slide mis à jour !')
    setTimeout(() => setSaved(false), 3000)
  }

  const handleToggle = (id: string) => {
    const slide = heroSlides.find((s) => s.id === id)
    if (!slide) return
    updateHeroSlide(id, { active: !slide.active })
    toast.success(`Slide ${slide.active ? 'masqué' : 'activé'}`)
  }

  const handleReset = () => {
    resetHeroSlides()
    toast.success('Slides réinitialisés aux valeurs par défaut')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Contenu Hero
            </h2>
            <p className="text-sm text-slate-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Modifiez les slides du carousel principal de la page d&apos;accueil.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-dm-sans)' }}>Enregistré</span>
              </div>
            )}
            <Button variant="outline" onClick={handleReset} className="gap-2 rounded-xl border-slate-200 text-slate-600">
              <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
            </Button>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-[#D4AF6A]/8 border border-[#D4AF6A]/20 rounded-2xl p-4">
          <Sparkles className="w-4 h-4 text-[#D4AF6A] mt-0.5 shrink-0" />
          <p className="text-sm text-slate-700" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Les modifications sont appliquées en temps réel sur la page d&apos;accueil du site.
            Activez/désactivez les slides avec le bouton œil.
          </p>
        </div>

        {/* Slides list */}
        <div className="space-y-3">
          {heroSlides.map((slide, i) => (
            <div key={slide.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${slide.active ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
              <div className="flex items-start gap-4">
                {/* Drag handle + number */}
                <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                  <GripVertical className="w-4 h-4 text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>

                {/* Content preview */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 bg-[#D4AF6A]/10 text-[#D4AF6A] text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <Sparkles className="w-2.5 h-2.5" /> {slide.badge}
                    </span>
                    {!slide.active && (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-2.5 h-2.5" /> Masqué
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-slate-900 text-base leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {slide.title}{' '}
                    <span className="text-[#D4AF6A]">{slide.highlight}</span>
                  </p>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
                      CTA: {slide.ctaPrimary}
                    </span>
                    <span className="text-[10px] bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-full font-medium">
                      Image: {IMAGE_OPTIONS.find((o) => o.key === slide.imageKey)?.label ?? slide.imageKey}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleToggle(slide.id)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      slide.active ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                    }`}>
                    {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(slide)}
                    className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Slide Modal */}
      <Dialog open={!!editSlide} onOpenChange={(o) => !o && setEditSlide(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-playfair)' }}>
              Modifier le slide
            </DialogTitle>
          </DialogHeader>
          {form && (
            <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Badge</Label>
                <Input value={form.badge} onChange={(e) => setForm((f) => f ? { ...f, badge: e.target.value } : f)}
                  className="mt-1 rounded-xl" placeholder="Collection 2025" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Titre</Label>
                  <Input value={form.title} onChange={(e) => setForm((f) => f ? { ...f, title: e.target.value } : f)}
                    className="mt-1 rounded-xl" placeholder="L'élégance africaine" />
                </div>
                <div>
                  <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Mot en or</Label>
                  <Input value={form.highlight} onChange={(e) => setForm((f) => f ? { ...f, highlight: e.target.value } : f)}
                    className="mt-1 rounded-xl" placeholder="réinventée" />
                </div>
              </div>
              <div>
                <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm((f) => f ? { ...f, description: e.target.value } : f)}
                  className="mt-1 rounded-xl resize-none" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>CTA principal</Label>
                  <Input value={form.ctaPrimary} onChange={(e) => setForm((f) => f ? { ...f, ctaPrimary: e.target.value } : f)}
                    className="mt-1 rounded-xl" placeholder="Découvrir…" />
                </div>
                <div>
                  <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>CTA secondaire</Label>
                  <Input value={form.ctaSecondary ?? ''} onChange={(e) => setForm((f) => f ? { ...f, ctaSecondary: e.target.value } : f)}
                    className="mt-1 rounded-xl" placeholder="Optionnel" />
                </div>
              </div>
              <div>
                <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Image de fond</Label>
                <select value={form.imageKey} onChange={(e) => {
                  const opt = IMAGE_OPTIONS.find((o) => o.key === e.target.value)
                  setForm((f) => f ? { ...f, imageKey: e.target.value, imageCategory: opt?.cat ?? f.imageCategory } : f)
                }}
                  className="mt-1 w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {IMAGE_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>{o.label} ({o.cat})</option>
                  ))}
                </select>
              </div>

              {/* Preview badge */}
              <div className="bg-slate-900 rounded-xl p-4 text-center">
                <span className="text-[10px] text-[#D4AF6A]/70 uppercase tracking-widest block mb-1">Aperçu</span>
                <p className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {form.title} <span className="text-[#D4AF6A]">{form.highlight}</span>
                </p>
                <p className="text-slate-400 text-xs mt-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {form.description}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditSlide(null)}>Annuler</Button>
            <Button onClick={handleSave} className="bg-[#D4AF6A] hover:bg-[#C8956C] text-white border-0">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
