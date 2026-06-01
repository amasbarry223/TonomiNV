import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { products as defaultProducts, type Product } from '@/data/products'
import { DEFAULT_CARE_TIPS, cloneDefaultSizeGuide } from '@/lib/product-content'
import { useAdminLogsStore } from '@/stores/admin-logs-store'
import { useAdminStore } from '@/stores/admin-store'

export interface AdminProduct extends Product {
  isActive: boolean
}

interface AdminProductsStore {
  products: AdminProduct[]
  addProduct: (
    data: Pick<AdminProduct, 'name' | 'price' | 'stock' | 'description' | 'category'> & {
      id?: string
      images?: string[]
      pricePromo?: number
      material?: string
      careTips?: string[]
      sizeGuide?: Product['sizeGuide']
    }
  ) => void
  updateProduct: (id: string, data: Partial<AdminProduct>) => void
  deleteProduct: (id: string) => void
  toggleActive: (id: string) => void
  reset: () => void
}

function toAdminProducts(list: Product[]): AdminProduct[] {
  return list.map((p) => ({ ...p, isActive: true }))
}

export const useAdminProductsStore = create<AdminProductsStore>()(
  persist(
    (set, get) => ({
      products: toAdminProducts(defaultProducts),

      addProduct: (data) => {
        const id = data.id ?? `prod-${Date.now()}`
        const product: AdminProduct = {
          id,
          slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          images: data.images ?? [],
          colors: [],
          sizes: [],
          rating: 0,
          reviewCount: 0,
          isNew: true,
          isBestSeller: false,
          material: data.material ?? '',
          careTips: data.careTips ?? [...DEFAULT_CARE_TIPS],
          sizeGuide: data.sizeGuide ?? cloneDefaultSizeGuide(),
          isActive: true,
          ...data,
        }
        set((s) => ({ products: [product, ...s.products] }))
        const actor = useAdminStore.getState()
        useAdminLogsStore.getState().append({
          action: 'create',
          entityType: 'product',
          entityId: product.id,
          summary: `Produit créé: ${product.name}`,
          actorUserId: actor.currentUserId ?? undefined,
          actorEmail: actor.currentUserEmail ?? undefined,
        })
      },

      updateProduct: (id, data) =>
        set((s) => {
          const before = s.products.find((p) => p.id === id)
          const next = s.products.map((p) => (p.id === id ? { ...p, ...data } : p))
          const actor = useAdminStore.getState()
          useAdminLogsStore.getState().append({
            action: 'update',
            entityType: 'product',
            entityId: id,
            summary: `Produit mis à jour: ${before?.name ?? id}`,
            actorUserId: actor.currentUserId ?? undefined,
            actorEmail: actor.currentUserEmail ?? undefined,
            metadata: { fields: Object.keys(data) },
          })
          return { products: next }
        }),

      deleteProduct: (id) =>
        set((s) => {
          const before = s.products.find((p) => p.id === id)
          const actor = useAdminStore.getState()
          useAdminLogsStore.getState().append({
            action: 'delete',
            entityType: 'product',
            entityId: id,
            summary: `Produit supprimé: ${before?.name ?? id}`,
            actorUserId: actor.currentUserId ?? undefined,
            actorEmail: actor.currentUserEmail ?? undefined,
          })
          return { products: s.products.filter((p) => p.id !== id) }
        }),

      toggleActive: (id) =>
        set((s) => {
          const before = s.products.find((p) => p.id === id)
          const nextActive = !(before?.isActive ?? true)
          const actor = useAdminStore.getState()
          useAdminLogsStore.getState().append({
            action: 'toggle',
            entityType: 'product',
            entityId: id,
            summary: `Produit ${nextActive ? 'activé' : 'désactivé'}: ${before?.name ?? id}`,
            actorUserId: actor.currentUserId ?? undefined,
            actorEmail: actor.currentUserEmail ?? undefined,
            metadata: { isActive: nextActive },
          })
          return {
            products: s.products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
          }
        }),

      reset: () => {
        const actor = useAdminStore.getState()
        useAdminLogsStore.getState().append({
          action: 'reset',
          entityType: 'product',
          summary: 'Réinitialisation du catalogue admin produits',
          actorUserId: actor.currentUserId ?? undefined,
          actorEmail: actor.currentUserEmail ?? undefined,
        })
        set({ products: toAdminProducts(defaultProducts) })
      },
    }),
    { name: 'tonomi-admin-products' }
  )
)
