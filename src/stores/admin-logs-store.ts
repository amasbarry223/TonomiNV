import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LogEntityType =
  | 'auth'
  | 'product'
  | 'category'
  | 'review'
  | 'order'
  | 'settings'

export type LogAction =
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'toggle'
  | 'status_change'
  | 'reset'

export type LogEvent = {
  id: string
  at: string
  actorUserId?: string
  actorEmail?: string
  action: LogAction
  entityType: LogEntityType
  entityId?: string
  summary: string
  metadata?: Record<string, unknown>
}

interface AdminLogsStore {
  events: LogEvent[]
  append: (event: Omit<LogEvent, 'id' | 'at'> & { at?: string }) => void
  clear: () => void
  reset: () => void
}

export const useAdminLogsStore = create<AdminLogsStore>()(
  persist(
    (set) => ({
      events: [],

      append: (event) =>
        set((s) => ({
          events: [
            {
              id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              at: event.at ?? new Date().toISOString(),
              ...event,
            },
            ...s.events,
          ].slice(0, 2000),
        })),

      clear: () => set({ events: [] }),
      reset: () => set({ events: [] }),
    }),
    { name: 'tonomi-admin-logs' }
  )
)

