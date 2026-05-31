'use client'

import { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useCustomerStore } from '@/stores/customer-store'
import { formatPrice } from '@/lib/product-display'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Search, Users, ShoppingCart, MapPin, Phone, Mail } from 'lucide-react'

export default function CustomersPage() {
  const { current, orders, savedAddresses } = useCustomerStore()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(false)

  // Build a customer list from current user + order history
  const customers = useMemo(() => {
    if (!current) return []
    const totalSpent = orders.reduce((s, o) => s + o.total, 0)
    return [{ ...current, orderCount: orders.length, totalSpent, savedAddresses }]
  }, [current, orders, savedAddresses])

  const filtered = customers.filter((c) =>
    !search ||
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Clients
          </h2>
          <p className="text-sm text-slate-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            {customers.length} client{customers.length !== 1 ? 's' : ''} enregistré{customers.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client…" className="pl-9 bg-white border-slate-200 rounded-xl" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Téléphone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Commandes</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total dépensé</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Membre depuis</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF6A] to-[#C8956C] flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-white">
                          {c.firstName[0]}{c.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">{c.phone || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{c.orderCount}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-[#D4AF6A]" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {c.orderCount > 0 ? formatPrice(c.totalSpent) : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(true)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 hover:underline transition-opacity"
                      style={{ fontFamily: 'var(--font-dm-sans)' }}>
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Users className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>Aucun client trouvé</p>
              {customers.length === 0 && (
                <p className="text-xs text-slate-300 mt-1">Créez un compte client depuis le storefront</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {current && (
        <Dialog open={selected} onOpenChange={setSelected}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'var(--font-playfair)' }}>
                {current.firstName} {current.lastName}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-1">
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF6A] to-[#C8956C] flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white">{current.firstName[0]}{current.lastName[0]}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-900">{current.firstName} {current.lastName}</p>
                  <p className="text-xs text-slate-500">{current.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Mail, label: 'Email', value: current.email },
                  { icon: Phone, label: 'Téléphone', value: current.phone || '—' },
                  { icon: ShoppingCart, label: 'Commandes', value: String(orders.length) },
                  { icon: MapPin, label: 'Adresses', value: String(savedAddresses.length) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-[#D4AF6A]" />
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelected(false)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  )
}
