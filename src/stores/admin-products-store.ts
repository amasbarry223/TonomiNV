import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { products as defaultProducts, type Product } from '@/data/products'

export interface AdminProduct extends Product {
  isActive: boolean
}

interface AdminProductsStore {
  products: AdminProduct[]
  addProduct: (data: Pick<AdminProduct, 'name' | 'price' | 'stock' | 'description' | 'category'> & { pricePromo?: number }) => void
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
        const product: AdminProduct = {
          id: `prod-${Date.now()}`,
          slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          images: [],
          colors: [],
          sizes: [],
          rating: 0,
          reviewCount: 0,
          isNew: true,
          isBestSeller: false,
          material: '',
          isActive: true,
          ...data,
        }
        set((s) => ({ products: [product, ...s.products] }))
      },

      updateProduct: (id, data) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),

      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      toggleActive: (id) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
        })),

      reset: () => set({ products: toAdminProducts(defaultProducts) }),
    }),
    { name: 'tonomi-admin-products' }
  )
)
