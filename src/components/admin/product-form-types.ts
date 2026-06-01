import {
  DEFAULT_CARE_TIPS,
  cloneDefaultSizeGuide,
  formatCareTips,
  parseCareTips,
  type SizeGuideRow,
} from '@/lib/product-content'

export type ProductFormState = {
  name: string
  price: string
  pricePromo: string
  stock: string
  description: string
  category: string
  material: string
  careTips: string
  sizeGuide: SizeGuideRow[]
  images: string[]
}

export const EMPTY_PRODUCT_FORM: ProductFormState = {
  name: '',
  price: '',
  pricePromo: '',
  stock: '',
  description: '',
  category: 'bijoux',
  material: '',
  careTips: formatCareTips(DEFAULT_CARE_TIPS),
  sizeGuide: cloneDefaultSizeGuide(),
  images: [],
}

export const PRODUCT_FORM_STEPS = [
  { key: 'general', label: 'Informations', short: 'Infos' },
  { key: 'media', label: 'Photos', short: 'Médias' },
  { key: 'content', label: 'Description', short: 'Texte' },
  { key: 'material', label: 'Matières & tailles', short: 'Détails' },
  { key: 'shipping', label: 'Livraison', short: 'Livraison' },
] as const

export type ProductFormStepKey = (typeof PRODUCT_FORM_STEPS)[number]['key']

export function isProductFormStepDone(
  step: ProductFormStepKey,
  form: ProductFormState
): boolean {
  switch (step) {
    case 'general':
      return Boolean(form.name.trim() && form.price)
    case 'media':
      return form.images.length > 0
    case 'content':
      return form.description.trim().length >= 30
    case 'material':
      return (
        Boolean(form.material.trim()) &&
        parseCareTips(form.careTips).length > 0 &&
        form.sizeGuide.some((r) => r.size.trim())
      )
    case 'shipping':
      return true
    default:
      return false
  }
}

export function productFormProgress(form: ProductFormState): number {
  const done = PRODUCT_FORM_STEPS.filter((s) =>
    isProductFormStepDone(s.key, form)
  ).length
  return Math.round((done / PRODUCT_FORM_STEPS.length) * 100)
}
