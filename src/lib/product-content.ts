import type { Product } from '@/data/products'

export type SizeGuideRow = {
  size: string
  measure: string
  fit: string
}

export const DEFAULT_CARE_TIPS = [
  "Éviter le contact avec l'eau et les parfums",
  "Ranger dans un endroit sec à l'abri de la lumière",
  'Nettoyer délicatement avec un chiffon doux',
  "Conserver dans la pochette TONOMI d'origine",
]

export const DEFAULT_SIZE_GUIDE: SizeGuideRow[] = [
  { size: 'S', measure: '14–16 cm', fit: 'Fin' },
  { size: 'M', measure: '16–18 cm', fit: 'Standard' },
  { size: 'L', measure: '18–20 cm', fit: 'Large' },
  { size: 'XL', measure: '20–22 cm', fit: 'Très large' },
]

export function cloneDefaultSizeGuide(): SizeGuideRow[] {
  return DEFAULT_SIZE_GUIDE.map((row) => ({ ...row }))
}

export function parseCareTips(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function formatCareTips(tips: string[]): string {
  return (tips.length ? tips : DEFAULT_CARE_TIPS).join('\n')
}

export function getProductCareTips(product: Product): string[] {
  return product.careTips?.length ? product.careTips : DEFAULT_CARE_TIPS
}

export function getProductSizeGuide(product: Product): SizeGuideRow[] {
  return product.sizeGuide?.length ? product.sizeGuide : DEFAULT_SIZE_GUIDE
}

export function sanitizeSizeGuide(rows: SizeGuideRow[]): SizeGuideRow[] {
  return rows
    .map((row) => ({
      size: row.size.trim(),
      measure: row.measure.trim(),
      fit: row.fit.trim(),
    }))
    .filter((row) => row.size || row.measure || row.fit)
}
