import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AnnouncementAction = 'none' | 'promotions' | 'catalogue' | 'contact'
export type AnnouncementIconKey = 'truck' | 'tag' | 'globe' | 'refresh' | 'gem'

export type AnnouncementItem = {
  id: string
  iconKey: AnnouncementIconKey
  text: string
  action: AnnouncementAction
  isActive: boolean
}

export type AnnouncementConfig = {
  enabled: boolean
  dismissible: boolean
  storageKey: string
  items: AnnouncementItem[]
}

const DEFAULT_CONFIG: AnnouncementConfig = {
  enabled: true,
  dismissible: true,
  storageKey: 'tonomi-bar-v4',
  items: [
    { id: 'a-1', iconKey: 'truck', text: 'Livraison gratuite dès 30 000 FCFA · Bamako & inter-pays', action: 'none', isActive: true },
    { id: 'a-2', iconKey: 'tag', text: 'Code BIENVENUE10 · −10% sur votre 1ère commande', action: 'promotions', isActive: true },
    { id: 'a-3', iconKey: 'globe', text: "Livraison partout en Afrique de l'Ouest", action: 'none', isActive: true },
    { id: 'a-4', iconKey: 'refresh', text: 'Retours gratuits · 14 jours · Satisfaite ou remboursée', action: 'none', isActive: true },
    { id: 'a-5', iconKey: 'gem', text: 'Artisanat malien authentique · 200+ références uniques', action: 'none', isActive: true },
  ],
}

interface AdminAnnouncementStore {
  banner: AnnouncementConfig
  updateBanner: (data: Partial<AnnouncementConfig>) => void
  addItem: () => void
  updateItem: (id: string, data: Partial<Omit<AnnouncementItem, 'id'>>) => void
  deleteItem: (id: string) => void
  resetBanner: () => void
}

export const useAdminAnnouncementStore = create<AdminAnnouncementStore>()(
  persist(
    (set) => ({
      banner: DEFAULT_CONFIG,
      updateBanner: (data) => set((s) => ({ banner: { ...s.banner, ...data } })),
      addItem: () =>
        set((s) => ({
          banner: {
            ...s.banner,
            items: [
              ...s.banner.items,
              {
                id: `a-${Date.now()}`,
                iconKey: 'truck',
                text: 'Nouveau message',
                action: 'none',
                isActive: true,
              },
            ],
          },
        })),
      updateItem: (id, data) =>
        set((s) => ({
          banner: {
            ...s.banner,
            items: s.banner.items.map((it) => (it.id === id ? { ...it, ...data } : it)),
          },
        })),
      deleteItem: (id) =>
        set((s) => ({
          banner: { ...s.banner, items: s.banner.items.filter((it) => it.id !== id) },
        })),
      resetBanner: () => set({ banner: DEFAULT_CONFIG }),
    }),
    { name: 'tonomi-admin-announcement' }
  )
)

export { DEFAULT_CONFIG }

