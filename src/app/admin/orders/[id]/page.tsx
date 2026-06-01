'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  useCustomerStore, PAYMENT_INFO, ORDER_STATUS_LABELS,
  type CustomerOrderStatus,
} from '@/stores/customer-store'
import { formatPrice } from '@/lib/product-display'
import { getProductById } from '@/data/products'
import { exportToCSV } from '@/lib/admin-export'
import {
  ArrowLeft, Download, Package, MapPin, CreditCard,
  Clock, CheckCircle, Truck, AlertCircle, ShoppingCart,
  User, Calendar, Hash, Tag,
} from 'lucide-react'
import { toast } from 'sonner'

// ─────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────
const ALL_STATUSES: CustomerOrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled',
]

const STATUS: Record<CustomerOrderStatus, {
  label: string; dot: string; bg: string; text: string; border: string
  lightBg: string; icon: React.ElementType; step: number
}> = {
  pending:    { label: 'En attente',     dot: '#F59E0B', bg: 'bg-yellow-500',  text: 'text-yellow-700',  border: 'border-yellow-300', lightBg: 'bg-yellow-50',  icon: Clock,        step: 0 },
  confirmed:  { label: 'Confirmée',      dot: '#3B82F6', bg: 'bg-blue-500',    text: 'text-blue-700',    border: 'border-blue-300',   lightBg: 'bg-blue-50',    icon: CheckCircle,  step: 1 },
  processing: { label: 'En préparation', dot: '#8B5CF6', bg: 'bg-purple-500',  text: 'text-purple-700',  border: 'border-purple-300', lightBg: 'bg-purple-50',  icon: Package,      step: 2 },
  shipped:    { label: 'Expédiée',       dot: '#6366F1', bg: 'bg-indigo-500',  text: 'text-indigo-700',  border: 'border-indigo-300', lightBg: 'bg-indigo-50',  icon: Truck,        step: 3 },
  delivered:  { label: 'Livrée',         dot: '#10B981', bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-300',lightBg: 'bg-emerald-50', icon: CheckCircle,  step: 4 },
  cancelled:  { label: 'Annulée',        dot: '#EF4444', bg: 'bg-red-500',     text: 'text-red-700',     border: 'border-red-300',    lightBg: 'bg-red-50',     icon: AlertCircle,  step: -1 },
}

const PAYMENT_ICON: Record<string, string> = {
  orange_money: '🟠', wave: '🔵', mobi_money: '🟣', especes: '💵',
}

const PROGRESS_STEPS: CustomerOrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'delivered',
]

// ─────────────────────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────────────────────
function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colors   = ['bg-[#D4AF6A]', 'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-pink-500', 'bg-indigo-500']
  const color    = colors[name.charCodeAt(0) % colors.length]
  const sz = size === 'lg' ? 'w-16 h-16 text-xl' : size === 'md' ? 'w-12 h-12 text-sm' : 'w-9 h-9 text-xs'
  return (
    <div className={`${sz} ${color} rounded-2xl flex items-center justify-center font-bold text-white shrink-0`}>
      {initials}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router  = useRouter()
  const { orders, updateOrderStatus } = useCustomerStore()

  const order = orders.find(o => o.id === id) ?? null

  const [localStatus, setLocalStatus] = useState<CustomerOrderStatus | null>(null)
  const currentStatus = localStatus ?? order?.status ?? 'pending'
  const sc = STATUS[currentStatus]
  const stepIndex = PROGRESS_STEPS.indexOf(currentStatus)
  const isCancelled = currentStatus === 'cancelled'

  const handleStatusChange = (status: CustomerOrderStatus) => {
    if (!order) return
    setLocalStatus(status)
    updateOrderStatus(order.id, status)
    toast.success(`Statut → ${STATUS[status].label}`)
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-lg font-semibold text-slate-600">Commande introuvable</p>
          <button onClick={() => router.push('/admin/orders')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF6A] hover:bg-[#C8956C] text-white text-sm font-semibold transition-all">
            <ArrowLeft className="w-4 h-4" /> Retour aux commandes
          </button>
        </div>
      </AdminLayout>
    )
  }

  const clientName = `${order.address.firstName} ${order.address.lastName}`
  const totalItems  = order.items.reduce((s, i) => s + i.quantity, 0)

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12">

        {/* ══════ TOPBAR ══════ */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => router.push('/admin/orders')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Retour aux commandes
          </button>
          <button
            onClick={() => { exportToCSV([order], `commande-${order.number}`); toast.success('Export CSV lancé') }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:border-slate-300 transition-colors">
            <Download className="w-4 h-4" /> Exporter
          </button>
        </div>

        {/* ══════ HEADER CARD ══════ */}
        <div className={`relative overflow-hidden rounded-3xl ${sc.lightBg} border ${sc.border} p-8`}>
          {/* Decorative blob */}
          <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full ${sc.bg} opacity-10`} />
          <div className={`absolute -right-4 -bottom-12 w-40 h-40 rounded-full ${sc.bg} opacity-5`} />

          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order identity */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-2xl ${sc.bg} flex items-center justify-center`}>
                  <sc.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-sm font-bold px-4 py-1.5 rounded-full border ${sc.lightBg} ${sc.text} ${sc.border}`}>
                  {sc.label}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                {order.number}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Package className="w-4 h-4 text-slate-400" />
                  {totalItems} article{totalItems > 1 ? 's' : ''}
                </div>
                {order.promoCode && (
                  <div className="flex items-center gap-1.5 text-sm text-emerald-700 font-semibold">
                    <Tag className="w-4 h-4" />
                    {order.promoCode}
                  </div>
                )}
              </div>
            </div>

            {/* Amount + payment */}
            <div className="lg:text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total commande</p>
              <p className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                {formatPrice(order.total)}
              </p>
              <div className="flex lg:justify-end items-center gap-2 mt-2">
                <span className="text-lg">{PAYMENT_ICON[order.payment]}</span>
                <span className="text-sm font-semibold text-slate-700">
                  {PAYMENT_INFO[order.payment]?.label ?? order.payment}
                </span>
              </div>
              {order.discount > 0 && (
                <p className="text-sm text-emerald-600 font-semibold mt-1">
                  Économie : −{formatPrice(order.discount)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ══════ MAIN GRID ══════ */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── LEFT COL (2/3) ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Timeline de progression */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-900 mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                Progression de la commande
              </h2>

              {isCancelled ? (
                <div className="flex items-center gap-4 bg-red-50 border border-red-100 rounded-2xl p-5">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-red-800">Commande annulée</p>
                    <p className="text-xs text-red-600 mt-1">
                      Cette commande a été annulée. Aucun article ne sera expédié.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-0">
                  {PROGRESS_STEPS.map((step, i) => {
                    const s      = STATUS[step]
                    const done   = stepIndex >= i
                    const active = stepIndex === i
                    return (
                      <div key={step} className="flex-1 flex flex-col items-center gap-0">
                        {/* Connector + circle row */}
                        <div className="flex items-center w-full">
                          {/* Left connector */}
                          <div className={`flex-1 h-0.5 transition-all duration-500 ${
                            i === 0 ? 'bg-transparent' : done ? 'bg-[#D4AF6A]' : 'bg-slate-100'
                          }`} />
                          {/* Circle */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                            active
                              ? 'bg-[#D4AF6A] shadow-lg shadow-[#D4AF6A]/40 ring-4 ring-[#D4AF6A]/20 scale-110'
                              : done
                                ? 'bg-[#D4AF6A]'
                                : 'bg-slate-100'
                          }`}>
                            <s.icon className={`w-5 h-5 ${done ? 'text-white' : 'text-slate-400'}`} />
                          </div>
                          {/* Right connector */}
                          <div className={`flex-1 h-0.5 transition-all duration-500 ${
                            i === PROGRESS_STEPS.length - 1 ? 'bg-transparent' : (stepIndex > i) ? 'bg-[#D4AF6A]' : 'bg-slate-100'
                          }`} />
                        </div>
                        {/* Label */}
                        <p className={`text-xs font-semibold text-center mt-2 px-1 leading-tight transition-colors ${
                          active ? 'text-[#D4AF6A]' : done ? 'text-slate-600' : 'text-slate-300'
                        }`}>
                          {s.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Articles */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Articles commandés
                </h2>
                <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {totalItems} article{totalItems > 1 ? 's' : ''}
                </span>
              </div>

              <div className="divide-y divide-slate-50">
                {order.items.map((item, idx) => {
                  const product = getProductById(item.productId)
                  const img     = item.image || product?.images[0]
                  return (
                    <div key={item.id} className="flex items-center gap-5 px-6 py-5 hover:bg-slate-50/60 transition-colors">
                      {/* Rank */}
                      <span className="text-sm font-bold text-slate-300 w-5 text-center shrink-0">
                        {idx + 1}
                      </span>
                      {/* Image */}
                      <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                        {img ? (
                          <img src={img} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-slate-300" />
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-slate-900">{item.name}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {item.color && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full capitalize font-medium">
                              {item.color}
                            </span>
                          )}
                          {item.size && item.size !== 'unique' && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                              Taille {item.size}
                            </span>
                          )}
                          {item.quantity > 1 && (
                            <span className="text-xs bg-[#D4AF6A]/10 text-[#D4AF6A] px-2.5 py-1 rounded-full font-bold">
                              × {item.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-slate-400 mt-0.5">{formatPrice(item.price)} / u.</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-slate-100 bg-slate-50/50">
                <div className="px-6 py-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Sous-total</span>
                    <span className="font-semibold">{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span className="flex items-center gap-2">
                        Réduction
                        {order.promoCode && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            {order.promoCode}
                          </span>
                        )}
                      </span>
                      <span className="font-semibold">−{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Livraison</span>
                    <span className="font-semibold text-emerald-600">
                      {order.shipping === 0 ? 'Gratuite ✓' : formatPrice(order.shipping)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-6 py-4 bg-slate-900 rounded-b-2xl">
                  <span className="text-base font-bold text-white">Total à régler</span>
                  <span className="text-2xl font-bold text-[#D4AF6A]" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COL (1/3) ── */}
          <div className="space-y-5">

            {/* Changer le statut */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
                Statut de la commande
              </h3>
              <div className="space-y-2">
                {ALL_STATUSES.map(st => {
                  const s      = STATUS[st]
                  const active = currentStatus === st
                  return (
                    <button key={st} onClick={() => handleStatusChange(st)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                        active
                          ? `${s.lightBg} ${s.border} ${s.text} shadow-sm`
                          : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200'
                      }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        active ? s.bg : 'bg-slate-100'
                      }`}>
                        <s.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      <span className={`text-sm font-semibold ${active ? s.text : 'text-slate-700'}`}>
                        {s.label}
                      </span>
                      {active && (
                        <CheckCircle className={`w-4 h-4 ml-auto ${s.text}`} />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Client */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-[#D4AF6A]" />
                <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Client
                </h3>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={clientName} size="md" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{clientName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{order.address.email}</p>
                </div>
              </div>
              <div className="space-y-2.5 pt-3 border-t border-slate-50">
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-xs">📞</span>
                  </div>
                  {order.address.phone}
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Hash className="w-3 h-3 text-slate-500" />
                  </div>
                  <span className="font-mono text-xs">{order.id.slice(0, 16)}…</span>
                </div>
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#D4AF6A]" />
                <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Adresse de livraison
                </h3>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-1">
                <p className="text-sm font-bold text-slate-800">{clientName}</p>
                <p className="text-sm text-slate-600">{order.address.address}</p>
                <p className="text-sm text-slate-600">{order.address.city}</p>
                <p className="text-sm font-semibold text-slate-700">{order.address.country}</p>
                {order.address.instructions && (
                  <p className="text-xs text-slate-500 pt-2 border-t border-slate-200 mt-2">
                    📝 {order.address.instructions}
                  </p>
                )}
              </div>
            </div>

            {/* Paiement */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-[#D4AF6A]" />
                <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                  Paiement
                </h3>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{PAYMENT_ICON[order.payment]}</span>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {PAYMENT_INFO[order.payment]?.label ?? order.payment}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {PAYMENT_INFO[order.payment]?.description}
                  </p>
                </div>
              </div>
              {PAYMENT_INFO[order.payment]?.number && (
                <div className="bg-slate-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-slate-400 mb-0.5">Numéro</p>
                  <p className="text-sm font-bold text-slate-800 font-mono">
                    {PAYMENT_INFO[order.payment].number}
                  </p>
                </div>
              )}
              {order.promoCode && (
                <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <p className="text-sm font-bold text-emerald-700">{order.promoCode}</p>
                  <span className="ml-auto text-xs font-semibold text-emerald-600">
                    −{formatPrice(order.discount)}
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
