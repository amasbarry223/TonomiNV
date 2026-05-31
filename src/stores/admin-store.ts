import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const ADMIN_EMAIL = 'admin@tonomi.com'
const ADMIN_PASSWORD = 'tonomi2024'

export interface HeroSlide {
  id: string
  badge: string
  title: string
  highlight: string
  description: string
  ctaPrimary: string
  ctaSecondary?: string
  imageKey: string // prod-008, prod-005, etc.
  imageCategory: string // sacs, bijoux, etc.
  active: boolean
}

const DEFAULT_SLIDES: HeroSlide[] = [
  { id: 'collection', badge: 'Collection 2025', title: "L'élégance africaine", highlight: 'réinventée', description: 'Sacs en cuir exotique et finitions dorées, conçus au cœur du Mali.', ctaPrimary: 'Découvrir la collection', ctaSecondary: 'Nos promotions', imageKey: 'prod-008', imageCategory: 'sacs', active: true },
  { id: 'bijoux', badge: 'Bijoux', title: 'Brillez avec', highlight: 'audace', description: 'Colliers, bracelets et boucles inspirés du savoir-faire mandingue.', ctaPrimary: 'Voir les bijoux', imageKey: 'prod-005', imageCategory: 'bijoux', active: true },
  { id: 'lifestyle', badge: 'Artisanat malien', title: 'Tradition &', highlight: 'modernité', description: 'Wax, bazin et textiles nobles pour un style unique et affirmé.', ctaPrimary: 'Explorer les foulards', imageKey: 'prod-013', imageCategory: 'foulards', active: true },
  { id: 'flash', badge: 'Offre limitée', title: 'Soldes', highlight: 'exceptionnelles', description: "Jusqu'à –50 % sur une sélection de pièces iconiques TONOMI.", ctaPrimary: 'Profiter des offres', ctaSecondary: 'Tout le catalogue', imageKey: 'prod-009', imageCategory: 'sacs', active: true },
  { id: 'cabas', badge: 'Best-seller', title: 'Le cabas', highlight: 'signature', description: 'Volume généreux, cuir embossé et anses tressées pour le quotidien chic.', ctaPrimary: 'Voir les sacs', imageKey: 'prod-010', imageCategory: 'sacs', active: true },
]

interface AdminStore {
  isAuthenticated: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  heroSlides: HeroSlide[]
  setHeroSlides: (slides: HeroSlide[]) => void
  updateHeroSlide: (id: string, data: Partial<HeroSlide>) => void
  resetHeroSlides: () => void
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (email, password) => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true })
          return { success: true }
        }
        return { success: false, error: 'Email ou mot de passe incorrect.' }
      },
      logout: () => set({ isAuthenticated: false }),
      heroSlides: DEFAULT_SLIDES,
      setHeroSlides: (heroSlides) => set({ heroSlides }),
      updateHeroSlide: (id, data) =>
        set((s) => ({
          heroSlides: s.heroSlides.map((sl) => (sl.id === id ? { ...sl, ...data } : sl)),
        })),
      resetHeroSlides: () => set({ heroSlides: DEFAULT_SLIDES }),
    }),
    { name: 'tonomi-admin' }
  )
)

export { DEFAULT_SLIDES }
