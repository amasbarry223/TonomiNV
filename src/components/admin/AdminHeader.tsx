'use client'

import { useAdminStore } from '@/stores/admin-store'
import { useRouter } from 'next/navigation'
import { Menu, Bell, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'

export default function AdminHeader() {
  const { toggleSidebar } = useAdminStore()
  const router = useRouter()

  const goHome = () => router.push('/')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch('/api/contacts?isRead=false')
        if (res.ok) {
          const data = await res.json()
          setUnreadCount(data.length || 0)
        }
      } catch {
        // ignore
      }
    }
    fetchUnread()
  }, [])

  return (
    <header className="h-16 bg-warm-white border-b border-gold/10 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-text-mid hover:text-text-dark hover:bg-beige/60"
        >
          <Menu size={20} />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-text-mid hover:text-text-dark hover:bg-beige/60"
          onClick={() => useAdminStore.getState().navigate('contacts')}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-caramel text-warm-white text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </Button>

        <div className="h-8 w-px bg-gold/20" />

        <button
          onClick={goHome}
          className="flex items-center gap-2 text-sm text-text-mid hover:text-caramel transition-colors"
        >
          <Store size={16} />
          <span className="hidden sm:inline">Boutique</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-tonomi-accent flex items-center justify-center text-warm-white text-xs font-bold">
          A
        </div>
      </div>
    </header>
  )
}
