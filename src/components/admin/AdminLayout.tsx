'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAdminStore } from '@/stores/admin-store'
import { useNavStore } from '@/stores/nav-store'
import AdminDashboard from './AdminDashboard'
import AdminProducts from './AdminProducts'
import AdminCategories from './AdminCategories'
import AdminOrders from './AdminOrders'
import AdminPromos from './AdminPromos'
import AdminFlashSales from './AdminFlashSales'
import AdminContacts from './AdminContacts'
import AdminNewsletter from './AdminNewsletter'
import AdminSettings from './AdminSettings'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminLayout() {
  const { currentPage, sidebarOpen, toggleSidebar } = useAdminStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />
      case 'products':
        return <AdminProducts />
      case 'categories':
        return <AdminCategories />
      case 'orders':
        return <AdminOrders />
      case 'promos':
        return <AdminPromos />
      case 'flash-sales':
        return <AdminFlashSales />
      case 'contacts':
        return <AdminContacts />
      case 'newsletter':
        return <AdminNewsletter />
      case 'settings':
        return <AdminSettings />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar overlay on mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-text-dark/30 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16'
        }`}
      >
        <AdminSidebar collapsed={!sidebarOpen} isMobile={isMobile} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
