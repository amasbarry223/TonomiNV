'use client'

import { Fragment } from 'react'
import type { AdminProduct } from '@/stores/admin-products-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ProductImageUploader from '@/components/admin/ProductImageUploader'
import {
  PRODUCT_FORM_STEPS,
  isProductFormStepDone,
  type ProductFormState,
  type ProductFormStepKey,
} from '@/components/admin/product-form-types'
import { useAdminCategoriesStore } from '@/stores/admin-categories-store'
import {
  DEFAULT_CARE_TIPS,
  cloneDefaultSizeGuide,
  formatCareTips,
} from '@/lib/product-content'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editProduct: AdminProduct | null
  form: ProductFormState
  setForm: React.Dispatch<React.SetStateAction<ProductFormState>>
  formTab: ProductFormStepKey
  setFormTab: (tab: ProductFormStepKey) => void
  formProductId: string
  onSave: () => void
  onCancel: () => void
}

function StepIndicator({
  current,
  onSelect,
  form,
}: {
  current: ProductFormStepKey
  onSelect: (key: ProductFormStepKey) => void
  form: ProductFormState
}) {
  const index = PRODUCT_FORM_STEPS.findIndex((s) => s.key === current)

  return (
    <nav aria-label="Étapes" className="space-y-2">
      <div className="flex items-center w-full">
        {PRODUCT_FORM_STEPS.map((step, i) => {
          const done = isProductFormStepDone(step.key, form)
          const active = step.key === current

          return (
            <Fragment key={step.key}>
              <button
                type="button"
                onClick={() => onSelect(step.key)}
                title={step.label}
                className="flex flex-col items-center gap-1 shrink-0 group"
              >
                <span
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                    active && 'bg-[#D4AF6A] text-white shadow-sm',
                    !active && done && 'bg-emerald-500 text-white',
                    !active && !done && 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  )}
                >
                  {done && !active ? <Check className="w-4 h-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    'text-[10px] font-medium hidden sm:block',
                    active ? 'text-slate-900' : 'text-slate-500'
                  )}
                >
                  {step.short}
                </span>
              </button>
              {i < PRODUCT_FORM_STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-1.5 rounded-full min-w-[12px]',
                    done ? 'bg-emerald-300' : 'bg-slate-200'
                  )}
                />
              )}
            </Fragment>
          )
        })}
      </div>
      <p className="text-xs text-slate-500 text-center sm:text-left">
        Étape {index + 1} sur {PRODUCT_FORM_STEPS.length} · {PRODUCT_FORM_STEPS[index]?.label}
      </p>
    </nav>
  )
}

export default function ProductFormModal({
  open,
  onOpenChange,
  editProduct,
  form,
  setForm,
  formTab,
  setFormTab,
  formProductId,
  onSave,
  onCancel,
}: Props) {
  const categories = useAdminCategoriesStore((s) => s.categories)
  const stepIndex = PRODUCT_FORM_STEPS.findIndex((s) => s.key === formTab)
  const current = PRODUCT_FORM_STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === PRODUCT_FORM_STEPS.length - 1

  const goNext = () => {
    if (!isLast) setFormTab(PRODUCT_FORM_STEPS[stepIndex + 1].key)
  }
  const goPrev = () => {
    if (!isFirst) setFormTab(PRODUCT_FORM_STEPS[stepIndex - 1].key)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden rounded-2xl border-slate-200">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-4 border-b border-slate-100 bg-slate-50/50">
          <div className="space-y-1 text-left">
            <DialogTitle
              className="text-xl text-slate-900"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {editProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              <span className="hidden sm:inline">{current?.label} — </span>
              {editProduct
                ? 'Mettez à jour les informations du catalogue.'
                : 'Renseignez les champs étape par étape.'}
            </DialogDescription>
          </div>
          <StepIndicator current={formTab} onSelect={setFormTab} form={form} />
        </DialogHeader>

        <div className="px-6 py-5 max-h-[min(400px,55vh)] overflow-y-auto">
          {formTab === 'general' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Nom du produit *</Label>
                <Input
                  id="product-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ex. Collier Amira"
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-category">Catégorie</Label>
                <select
                  id="product-category"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A]"
                >
                  {categories
                    .filter((c) => c.isActive)
                    .map((c) => (
                      <option key={c.id} value={c.slug}>
                        {(c.emoji ? `${c.emoji} ` : '') + c.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="product-price">Prix (FCFA) *</Label>
                  <Input
                    id="product-price"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="25000"
                    className="h-10 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-promo">Prix promo</Label>
                  <Input
                    id="product-promo"
                    type="number"
                    value={form.pricePromo}
                    onChange={(e) => setForm((f) => ({ ...f, pricePromo: e.target.value }))}
                    placeholder="—"
                    className="h-10 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-stock">Stock</Label>
                  <Input
                    id="product-stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    placeholder="15"
                    className="h-10 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {formTab === 'media' && (
            <ProductImageUploader
              productId={formProductId}
              images={form.images}
              onChange={(images) => setForm((f) => ({ ...f, images }))}
            />
          )}

          {formTab === 'content' && (
            <div className="space-y-2">
              <Label htmlFor="product-desc">Description</Label>
              <Textarea
                id="product-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={6}
                placeholder="Décrivez le produit pour la fiche boutique…"
                className="rounded-lg resize-none text-sm"
              />
              <p className="text-xs text-slate-400 text-right">
                {form.description.length} caractères
              </p>
            </div>
          )}

          {formTab === 'material' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-material">Matière</Label>
                <Input
                  id="product-material"
                  value={form.material}
                  onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
                  placeholder="Or plaqué, cuir véritable…"
                  className="h-10 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="product-care">Conseils d&apos;entretien</Label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, careTips: formatCareTips(DEFAULT_CARE_TIPS) }))
                    }
                    className="text-xs font-medium text-[#9A7B3C] hover:underline"
                  >
                    Valeurs par défaut
                  </button>
                </div>
                <Textarea
                  id="product-care"
                  value={form.careTips}
                  onChange={(e) => setForm((f) => ({ ...f, careTips: e.target.value }))}
                  rows={3}
                  className="rounded-lg resize-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Guide des tailles</Label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, sizeGuide: cloneDefaultSizeGuide() }))
                    }
                    className="text-xs font-medium text-[#9A7B3C] hover:underline"
                  >
                    Valeurs par défaut
                  </button>
                </div>
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 text-xs">
                        <th className="py-2 px-2 text-left font-semibold">Taille</th>
                        <th className="py-2 px-2 text-left font-semibold">Mesure</th>
                        <th className="py-2 px-2 text-left font-semibold">Fit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.sizeGuide.map((row, i) => (
                        <tr key={i} className="border-t border-slate-100">
                          {(['size', 'measure', 'fit'] as const).map((field) => (
                            <td key={field} className="p-1">
                              <Input
                                value={row[field]}
                                onChange={(e) =>
                                  setForm((f) => ({
                                    ...f,
                                    sizeGuide: f.sizeGuide.map((r, j) =>
                                      j === i ? { ...r, [field]: e.target.value } : r
                                    ),
                                  }))
                                }
                                className="h-8 text-xs rounded-md border-slate-200"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {formTab === 'shipping' && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Informations automatiques</p>
              <p>
                Les tarifs de livraison (Bamako, Mali, Afrique de l&apos;Ouest) et la
                politique de retours (14 jours) sont affichés sur chaque fiche produit sans
                configuration supplémentaire.
              </p>
              <ul className="list-disc list-inside text-xs space-y-1 text-slate-500">
                <li>Livraison gratuite dès 30 000 FCFA</li>
                <li>Retour gratuit sous 14 jours</li>
              </ul>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-white">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            Annuler
          </button>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
            )}
            {!isLast ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1 h-9 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSave}
                className="inline-flex items-center gap-1 h-9 px-4 rounded-lg bg-[#D4AF6A] hover:bg-[#C8956C] text-white text-sm font-semibold"
              >
                <Check className="w-4 h-4" />
                {editProduct ? 'Enregistrer' : 'Créer le produit'}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
