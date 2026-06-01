import { getProductById, type Product } from '@/data/products'
import { useAdminProductsStore } from '@/stores/admin-products-store'

/** Fusionne le catalogue statique avec les overrides admin (persistés). */
export function resolveProductById(id: string): Product | undefined {
  const admin = useAdminProductsStore.getState().products.find((p) => p.id === id)
  const base = getProductById(id)
  if (admin && base) return { ...base, ...admin }
  if (admin) return admin
  return base
}
