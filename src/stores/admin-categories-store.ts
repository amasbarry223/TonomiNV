import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { categories as defaultCategories, type Category } from '@/data/categories'
import { useAdminLogsStore } from '@/stores/admin-logs-store'
import { useAdminStore } from '@/stores/admin-store'

export type AdminCategory = Category & {
  emoji?: string
  isActive: boolean
}

const DEFAULT_EMOJI_BY_SLUG: Record<string, string> = {
  bijoux: '✨',
  sacs: '👜',
  foulards: '🧣',
  lunettes: '🕶️',
  ceintures: '🔗',
  'accessoires-cheveux': '💫',
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' et ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function toAdminCategories(list: Category[]): AdminCategory[] {
  return list.map((c) => ({
    ...c,
    emoji: DEFAULT_EMOJI_BY_SLUG[c.slug],
    isActive: true,
  }))
}

interface AdminCategoriesStore {
  categories: AdminCategory[]
  addCategory: (data: Pick<AdminCategory, 'name' | 'slug'> & Partial<Pick<AdminCategory, 'description' | 'emoji'>>) => void
  updateCategory: (id: string, data: Partial<Pick<AdminCategory, 'name' | 'slug' | 'description' | 'emoji' | 'image' | 'isActive'>>) => void
  deleteCategory: (id: string) => void
  resetCategories: () => void
}

export const useAdminCategoriesStore = create<AdminCategoriesStore>()(
  persist(
    (set, get) => ({
      categories: toAdminCategories(defaultCategories),

      addCategory: (data) =>
        set((s) => {
          const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.name)
          const id = `cat-${Date.now()}`
          const existing = s.categories.some((c) => c.slug === slug)
          const safeSlug = existing ? `${slug}-${Math.floor(100 + Math.random() * 900)}` : slug

          const newCat: AdminCategory = {
            id,
            name: data.name.trim(),
            slug: safeSlug,
            description: data.description ?? '',
            image: '',
            productCount: 0,
            emoji: data.emoji?.trim() || DEFAULT_EMOJI_BY_SLUG[safeSlug],
            isActive: true,
          }
          const actor = useAdminStore.getState()
          useAdminLogsStore.getState().append({
            action: 'create',
            entityType: 'category',
            entityId: newCat.id,
            summary: `Catégorie créée: ${newCat.name}`,
            actorUserId: actor.currentUserId ?? undefined,
            actorEmail: actor.currentUserEmail ?? undefined,
            metadata: { slug: newCat.slug },
          })
          return { categories: [newCat, ...s.categories] }
        }),

      updateCategory: (id, data) =>
        set((s) => ({
          categories: s.categories.map((c) => {
            if (c.id !== id) return c
            const nextSlug = data.slug !== undefined ? slugify(data.slug) : c.slug
            const actor = useAdminStore.getState()
            useAdminLogsStore.getState().append({
              action: 'update',
              entityType: 'category',
              entityId: id,
              summary: `Catégorie mise à jour: ${c.name}`,
              actorUserId: actor.currentUserId ?? undefined,
              actorEmail: actor.currentUserEmail ?? undefined,
              metadata: { fields: Object.keys(data), slug: nextSlug },
            })
            return {
              ...c,
              ...data,
              name: data.name !== undefined ? data.name : c.name,
              slug: nextSlug,
              emoji:
                data.emoji !== undefined
                  ? data.emoji
                  : c.emoji ?? DEFAULT_EMOJI_BY_SLUG[nextSlug],
            }
          }),
        })),

      deleteCategory: (id) =>
        set((s) => {
          const before = s.categories.find((c) => c.id === id)
          const actor = useAdminStore.getState()
          useAdminLogsStore.getState().append({
            action: 'delete',
            entityType: 'category',
            entityId: id,
            summary: `Catégorie supprimée: ${before?.name ?? id}`,
            actorUserId: actor.currentUserId ?? undefined,
            actorEmail: actor.currentUserEmail ?? undefined,
          })
          return { categories: s.categories.filter((c) => c.id !== id) }
        }),

      resetCategories: () => {
        const actor = useAdminStore.getState()
        useAdminLogsStore.getState().append({
          action: 'reset',
          entityType: 'category',
          summary: 'Réinitialisation des catégories admin',
          actorUserId: actor.currentUserId ?? undefined,
          actorEmail: actor.currentUserEmail ?? undefined,
        })
        set({ categories: toAdminCategories(defaultCategories) })
      },
    }),
    { name: 'tonomi-admin-categories' }
  )
)

export { slugify }
