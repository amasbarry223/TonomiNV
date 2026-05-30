'use client'

import { useAdminStore, type AdminPage } from '@/stores/admin-store'
import { useNavStore } from '@/stores/nav-store'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Tag,
  Zap,
  Mail,
  Users,
  Settings,
  Store,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  collapsed: boolean
  isMobile: boolean
}

const navItems: { page: AdminPage; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={20} /> },
  { page: 'products', label: 'Produits', icon: <Package size={20} /> },
  { page: 'categories', label: 'Catégories', icon: <FolderOpen size={20} /> },
  { page: 'orders', label: 'Commandes', icon: <ShoppingCart size={20} /> },
  { page: 'promos', label: 'Codes Promo', icon: <Tag size={20} /> },
  { page: 'flash-sales', label: 'Ventes Flash', icon: <Zap size={20} /> },
  { page: 'contacts', label: 'Messages', icon: <Mail size={20} /> },
  { page: 'newsletter', label: 'Newsletter', icon: <Users size={20} /> },
  { page: 'settings', label: 'Paramètres', icon: <Settings size={20} /> },
]

export default function AdminSidebar({ collapsed, isMobile }: AdminSidebarProps) {
  const { currentPage, navigate, toggleSidebar } = useAdminStore()
  const { goHome } = useNavStore()

  return (
    <aside
      className={cn(
        'h-full bg-warm-white border-r border-gold/20 flex flex-col transition-all duration-300 overflow-hidden',
        collapsed && !isMobile ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo / Brand */}
      <div className="h-16 flex items-center px-4 border-b border-gold/10">
        <button
          onClick={goHome}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-tonomi-accent flex items-center justify-center flex-shrink-0">
            <Store size={16} className="text-warm-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-serif text-lg font-bold text-text-dark whitespace-nowrap">
                TONOMI
              </h1>
              <p className="text-[10px] text-text-mid -mt-1 whitespace-nowrap">Back-Office</p>
            </div>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.page}>
              <button
                onClick={() => {
                  navigate(item.page)
                  if (isMobile) toggleSidebar()
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  currentPage === item.page
                    ? 'bg-gold/15 text-caramel'
                    : 'text-text-mid hover:bg-beige/60 hover:text-text-dark'
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
                {currentPage === item.page && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <div className="p-3 border-t border-gold/10">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-text-mid hover:bg-beige/60 hover:text-text-dark transition-colors text-sm"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span>Réduire</span>}
          </button>
        </div>
      )}

      {/* Back to store */}
      <div className="p-3 border-t border-gold/10">
        <button
          onClick={goHome}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-text-mid hover:bg-beige/60 hover:text-text-dark transition-colors text-sm"
        >
          <Store size={16} />
          {!collapsed && <span>Voir la boutique</span>}
        </button>
      </div>
    </aside>
  )
}
