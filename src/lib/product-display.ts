import type { CSSProperties } from 'react'

export function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-FR')} FCFA`
}

export const COLOR_SWATCH_MAP: Record<string, string> = {
  noir: '#1a1a1a',
  blanc: '#FFFFFF',
  or: '#D4AF6A',
  argent: '#C0C0C0',
  marron: '#8B4513',
  terracotta: '#CC5500',
  bordeaux: '#722F37',
  bleu: '#2563EB',
  'bleu marine': '#1E3A5F',
  vert: '#16A34A',
  rose: '#F472B6',
  'rose gold': '#B76E79',
  roserose: '#B76E79',
  jaune: '#EAB308',
  orange: '#F97316',
  multicolore: 'linear-gradient(135deg, #D4AF6A, #E8C547, #C8956C, #B87333)',
  doré: '#D4AF6A',
  cognac: '#834333',
  sable: '#C2B280',
  naturel: '#E8D5B7',
  indigo: '#4B0082',
  kaki: '#8B7355',
  écaille: '#6B3A2A',
  tortue: '#8B6914',
  'noir et blanc': 'linear-gradient(90deg, #1a1a1a 50%, #FFFFFF 50%)',
  émeraude: '#046307',
  violet: '#7C3AED',
  transparent: '#F5F5F5',
  ivoire: '#FFFFF0',
}

export function getSwatchStyle(color: string): CSSProperties {
  const value = COLOR_SWATCH_MAP[color] || '#999'
  return value.includes('gradient')
    ? { background: value }
    : { backgroundColor: value }
}

export const PRODUCT_BADGE_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  nouveau: { label: 'Nouveau', className: 'bg-emerald-500 text-white' },
  promo: { label: 'Promo', className: 'bg-caramel text-white' },
  epuise: { label: 'Épuisé', className: 'bg-gray-400 text-white' },
}
