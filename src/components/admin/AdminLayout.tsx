'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAdminStore } from '@/stores/admin-store'
import Logo from '@/components/shared/Logo'
import NotificationCenter from '@/components/admin/NotificationCenter'
import GlobalSearch from '@/components/admin/GlobalSearch'
import { useHydrated } from '@/lib/use-hydrated'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  Image, LogOut, Menu, X, ChevronRight, Bell, Settings,
  ExternalLink, Layers, Star,
} from 'lucide-react'

const NAV = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord', group: 'main' },
  { href: '/admin/products', icon: Package, label: 'Produits', group: 'store' },
  { href: '/admin/categories', icon: Layers, label: 'Catégories', group: 'store' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Commandes', group: 'store' },
  { href: '/admin/customers', icon: Users, label: 'Clients', group: 'store' },
  { href: '/admin/reviews', icon: Star, label: 'Avis produits', group: 'store' },
  { href: '/admin/promotions', icon: Tag, label: 'Promotions', group: 'store' },
  { href: '/admin/content', icon: Image, label: 'Contenu Hero', group: 'config' },
  { href: '/admin/settings', icon: Settings, label: 'Paramètres', group: 'config' },
]

const GROUPS = [
  { key: 'main', label: 'Vue d\'ensemble' },
  { key: 'store', label: 'Boutique' },
  { key: 'config', label: 'Configuration' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAdminStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const hydrated = useHydrated()

  useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace('/admin/login')
  }, [hydrated, isAuthenticated, router])

  if (!hydrated || !isAuthenticated) return null

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  const currentPage = NAV.find((n) => n.href === pathname)?.label ?? 'Admin'

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="relative border-b border-slate-800 px-3 py-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute right-3 top-3 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex w-full items-center justify-center">
            <Logo
              variant="dark-bg"
              className="h-24 w-auto max-w-[216px] object-contain drop-shadow-[0_2px_16px_rgba(212,175,106,0.3)]"
            />
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
          {GROUPS.map((group) => {
            const items = NAV.filter((n) => n.group === group.key)
            return (
              <div key={group.key}>
                <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest px-3 mb-1.5">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {items.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href
                    return (
                      <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                          active
                            ? 'bg-[#D4AF6A]/15 text-[#D4AF6A] border border-[#D4AF6A]/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}>
                        <Icon className="w-4 h-4 shrink-0" />
                        <span style={{ fontFamily: 'var(--font-dm-sans)' }}>{label}</span>
                        {active && <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF6A]/60" />}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-slate-800 space-y-1">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <ExternalLink className="w-4 h-4" />
            Voir le site
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
            style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-900 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1 text-xs text-slate-400" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                <span>Admin</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#D4AF6A]">{currentPage}</span>
              </div>
            </div>
          </div>

          {/* Global search */}
          <GlobalSearch />

          <div className="flex items-center gap-2 shrink-0">
            <NotificationCenter />
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF6A] to-[#C8956C] flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">AD</span>
              </div>
              <span className="text-xs font-medium text-slate-700 hidden sm:block" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
