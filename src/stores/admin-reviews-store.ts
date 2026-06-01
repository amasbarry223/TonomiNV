import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAdminLogsStore } from '@/stores/admin-logs-store'
import { useAdminStore } from '@/stores/admin-store'

export type ReviewStatus = 'pending' | 'approved' | 'hidden'

export interface ProductReview {
  id: string
  productId: string
  author: string
  location?: string
  rating: number
  comment: string
  status: ReviewStatus
  createdAt: string
}

const DEFAULT_REVIEWS: ProductReview[] = [
  {
    id: 'rev-001',
    productId: 'prod-002',
    author: 'Aminata D.',
    location: 'Bamako',
    rating: 5,
    comment:
      "Qualité exceptionnelle ! Le bracelet est magnifique, finitions soignées. Je recommande TONOMI.",
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    id: 'rev-002',
    productId: 'prod-010',
    author: 'Fatoumata S.',
    location: 'Ségou',
    rating: 4,
    comment:
      'Très beau sac, conforme aux photos. La livraison a été rapide. Petit bémol : j’aurais aimé un packaging plus rigide.',
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
  {
    id: 'rev-003',
    productId: 'prod-013',
    author: 'Mariam T.',
    location: 'Kayes',
    rating: 5,
    comment:
      'Super foulard ! Le tissu est doux et les couleurs sont superbes. Je reçois beaucoup de compliments.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'rev-004',
    productId: 'prod-001',
    author: 'Oumou B.',
    location: 'Mopti',
    rating: 3,
    comment:
      "Produit correct mais la couleur est légèrement différente de la photo. Globalement satisfaite.",
    status: 'hidden',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
  },
]

interface AdminReviewsStore {
  reviews: ProductReview[]
  addReview: (data: Omit<ProductReview, 'id' | 'createdAt' | 'status'> & { status?: ReviewStatus }) => void
  updateReview: (id: string, data: Partial<Pick<ProductReview, 'author' | 'location' | 'rating' | 'comment' | 'status'>>) => void
  deleteReview: (id: string) => void
  resetReviews: () => void
}

export const useAdminReviewsStore = create<AdminReviewsStore>()(
  persist(
    (set) => ({
      reviews: DEFAULT_REVIEWS,

      addReview: (data) =>
        set((s) => ({
          reviews: [
            {
              id: `rev-${Date.now()}`,
              createdAt: new Date().toISOString(),
              status: data.status ?? 'pending',
              ...data,
            },
            ...s.reviews,
          ],
        })),

      updateReview: (id, data) =>
        set((s) => {
          const before = s.reviews.find((r) => r.id === id)
          const actor = useAdminStore.getState()
          useAdminLogsStore.getState().append({
            action: 'update',
            entityType: 'review',
            entityId: id,
            summary: `Avis mis à jour (${before?.productId ?? '—'}): ${before?.author ?? id}`,
            actorUserId: actor.currentUserId ?? undefined,
            actorEmail: actor.currentUserEmail ?? undefined,
            metadata: { fields: Object.keys(data), status: data.status ?? before?.status },
          })
          return {
            reviews: s.reviews.map((r) => (r.id === id ? { ...r, ...data } : r)),
          }
        }),

      deleteReview: (id) =>
        set((s) => {
          const before = s.reviews.find((r) => r.id === id)
          const actor = useAdminStore.getState()
          useAdminLogsStore.getState().append({
            action: 'delete',
            entityType: 'review',
            entityId: id,
            summary: `Avis supprimé (${before?.productId ?? '—'}): ${before?.author ?? id}`,
            actorUserId: actor.currentUserId ?? undefined,
            actorEmail: actor.currentUserEmail ?? undefined,
          })
          return { reviews: s.reviews.filter((r) => r.id !== id) }
        }),

      resetReviews: () => {
        const actor = useAdminStore.getState()
        useAdminLogsStore.getState().append({
          action: 'reset',
          entityType: 'review',
          summary: 'Réinitialisation des avis admin',
          actorUserId: actor.currentUserId ?? undefined,
          actorEmail: actor.currentUserEmail ?? undefined,
        })
        set({ reviews: DEFAULT_REVIEWS })
      },
    }),
    { name: 'tonomi-admin-reviews' }
  )
)

