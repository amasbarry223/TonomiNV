import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { promoCodes as defaultCodes, flashSales as defaultFlash, type PromoCode, type FlashSale } from '@/data/promos'

interface AdminPromosStore {
  promoCodes: PromoCode[]
  flashSales: FlashSale[]
  addPromoCode: (data: Omit<PromoCode, 'id'>) => void
  updatePromoCode: (id: string, data: Partial<Omit<PromoCode, 'id'>>) => void
  deletePromoCode: (id: string) => void
  resetPromoCodes: () => void
}

export const useAdminPromosStore = create<AdminPromosStore>()(
  persist(
    (set) => ({
      promoCodes: defaultCodes,
      flashSales: defaultFlash,

      addPromoCode: (data) =>
        set((s) => ({
          promoCodes: [{ id: `promo-${Date.now()}`, ...data }, ...s.promoCodes],
        })),

      updatePromoCode: (id, data) =>
        set((s) => ({
          promoCodes: s.promoCodes.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),

      deletePromoCode: (id) =>
        set((s) => ({ promoCodes: s.promoCodes.filter((c) => c.id !== id) })),

      resetPromoCodes: () => set({ promoCodes: defaultCodes }),
    }),
    { name: 'tonomi-admin-promos' }
  )
)
