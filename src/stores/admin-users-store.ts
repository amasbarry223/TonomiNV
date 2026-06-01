import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AdminUserRole = 'owner' | 'admin' | 'staff'

export type AdminUser = {
  id: string
  name: string
  email: string
  password: string
  role: AdminUserRole
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
}

const DEFAULT_USERS: AdminUser[] = [
  {
    id: 'admin-001',
    name: 'Super Admin',
    email: 'admin@tonomi.com',
    password: 'tonomi2024',
    role: 'owner',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
]

interface AdminUsersStore {
  users: AdminUser[]
  addUser: (data: Omit<AdminUser, 'id' | 'createdAt' | 'lastLoginAt'>) => void
  updateUser: (id: string, data: Partial<Omit<AdminUser, 'id' | 'createdAt'>>) => void
  deleteUser: (id: string) => void
  setLastLogin: (id: string, at: string) => void
  resetUsers: () => void
}

export const useAdminUsersStore = create<AdminUsersStore>()(
  persist(
    (set) => ({
      users: DEFAULT_USERS,

      addUser: (data) =>
        set((s) => ({
          users: [
            {
              id: `admin-${Date.now()}`,
              createdAt: new Date().toISOString(),
              ...data,
            },
            ...s.users,
          ],
        })),

      updateUser: (id, data) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
        })),

      deleteUser: (id) =>
        set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      setLastLogin: (id, at) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, lastLoginAt: at } : u)),
        })),

      resetUsers: () => set({ users: DEFAULT_USERS }),
    }),
    { name: 'tonomi-admin-users' }
  )
)

export { DEFAULT_USERS }

