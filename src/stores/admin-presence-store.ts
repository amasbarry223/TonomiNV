import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PresenceCountryStatus = 'actif' | 'en développement'

export type PresenceCountry = {
  /** ISO 3166-1 numeric (string), used by world-atlas geographies */
  id: string
  name: string
  capital: string
  flagCode: string
  coordinates: [number, number]
  since: string
  status: PresenceCountryStatus
  clients: string
}

export type PresenceStatIconKey = 'globe' | 'truck' | 'users'

export type PresenceStat = {
  id: string
  iconKey: PresenceStatIconKey
  value: string
  label: string
  description: string
}

export type PresenceConfig = {
  enabled: boolean
  headerKicker: string
  titlePrefix: string
  titleBrand: string
  titleSuffix: string
  subtitle: string
  stats: PresenceStat[]
  countries: PresenceCountry[]
}

const DEFAULT_PRESENCE: PresenceConfig = {
  enabled: true,
  headerKicker: 'Notre Présence',
  titlePrefix: 'Là où',
  titleBrand: 'TONOMI',
  titleSuffix: 'rayonne',
  subtitle:
    "De Bamako au monde, nous apportons l'élégance africaine aux femmes qui osent.\nDécouvrez les pays où nos créations font briller chaque jour.",
  stats: [
    { id: 'stat-1', iconKey: 'globe', value: '6', label: 'Pays', description: 'présence internationale' },
    { id: 'stat-2', iconKey: 'truck', value: '5 000+', label: 'Livraisons', description: 'dans la sous-région' },
    { id: 'stat-3', iconKey: 'users', value: '5 000+', label: 'Clientes', description: 'satisfaites' },
  ],
  countries: [
    { id: '466', name: 'Mali', capital: 'Bamako', flagCode: 'ml', coordinates: [-7.99, 12.65], since: '2019', status: 'actif', clients: '2 000+' },
    { id: '686', name: 'Sénégal', capital: 'Dakar', flagCode: 'sn', coordinates: [-17.45, 14.69], since: '2021', status: 'actif', clients: '800+' },
    { id: '384', name: "Côte d'Ivoire", capital: 'Abidjan', flagCode: 'ci', coordinates: [-5.55, 5.35], since: '2022', status: 'actif', clients: '600+' },
    { id: '854', name: 'Burkina Faso', capital: 'Ouagadougou', flagCode: 'bf', coordinates: [-1.53, 12.37], since: '2022', status: 'actif', clients: '400+' },
    { id: '324', name: 'Guinée', capital: 'Conakry', flagCode: 'gn', coordinates: [-13.68, 9.95], since: '2023', status: 'actif', clients: '300+' },
    { id: '562', name: 'Niger', capital: 'Niamey', flagCode: 'ne', coordinates: [2.11, 13.51], since: '2023', status: 'actif', clients: '250+' },
  ],
}

interface AdminPresenceStore {
  presence: PresenceConfig
  updatePresence: (data: Partial<PresenceConfig>) => void

  addStat: () => void
  updateStat: (id: string, data: Partial<Omit<PresenceStat, 'id'>>) => void
  deleteStat: (id: string) => void

  addCountry: () => void
  updateCountry: (id: string, data: Partial<Omit<PresenceCountry, 'id'>>) => void
  deleteCountry: (id: string) => void

  resetPresence: () => void
}

export const useAdminPresenceStore = create<AdminPresenceStore>()(
  persist(
    (set) => ({
      presence: DEFAULT_PRESENCE,

      updatePresence: (data) =>
        set((s) => ({ presence: { ...s.presence, ...data } })),

      addStat: () =>
        set((s) => ({
          presence: {
            ...s.presence,
            stats: [
              ...s.presence.stats,
              {
                id: `stat-${Date.now()}`,
                iconKey: 'globe',
                value: '1',
                label: 'Nouveau',
                description: 'description',
              },
            ],
          },
        })),
      updateStat: (id, data) =>
        set((s) => ({
          presence: {
            ...s.presence,
            stats: s.presence.stats.map((st) => (st.id === id ? { ...st, ...data } : st)),
          },
        })),
      deleteStat: (id) =>
        set((s) => ({
          presence: { ...s.presence, stats: s.presence.stats.filter((st) => st.id !== id) },
        })),

      addCountry: () =>
        set((s) => ({
          presence: {
            ...s.presence,
            countries: [
              ...s.presence.countries,
              {
                id: String(Date.now()),
                name: 'Nouveau pays',
                capital: '',
                flagCode: 'ml',
                coordinates: [0, 0],
                since: String(new Date().getFullYear()),
                status: 'en développement',
                clients: '0',
              },
            ],
          },
        })),
      updateCountry: (id, data) =>
        set((s) => ({
          presence: {
            ...s.presence,
            countries: s.presence.countries.map((c) => (c.id === id ? { ...c, ...data } : c)),
          },
        })),
      deleteCountry: (id) =>
        set((s) => ({
          presence: {
            ...s.presence,
            countries: s.presence.countries.filter((c) => c.id !== id),
          },
        })),

      resetPresence: () => set({ presence: DEFAULT_PRESENCE }),
    }),
    { name: 'tonomi-admin-presence' }
  )
)

export { DEFAULT_PRESENCE }

