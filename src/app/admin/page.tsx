'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminStore } from '@/stores/admin-store'

export default function AdminRoot() {
  const router = useRouter()
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated)
  useEffect(() => {
    router.replace(isAuthenticated ? '/admin/dashboard' : '/admin/login')
  }, [isAuthenticated, router])
  return null
}
