'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Package, CheckCircle, Truck, Home as HomeIcon,
  Clock, XCircle, MessageCircle, ArrowRight, ShoppingBag,
} from 'lucide-react'
import { useCustomerStore, ORDER_STATUS_LABELS, PAYMENT_INFO, type CustomerOrderStatus } from '@/stores/customer-store'
import { useNavStore } from '@/stores/nav-store'
import { formatPrice } from '@/lib/product-display'

const TIMELINE_STEPS: { status: CustomerOrderStatus; label: string; desc: string; icon: typeof Clock }[] = [
  { status: 'pending', label: 'Commande reçue', desc: 'Votre commande a été enregistrée', icon: Clock },
  { status: 'confirmed', label: 'Confirmée', desc: 'Paiement validé · Préparation en cours', icon: CheckCircle },
  { status: 'processing', label: 'En préparation', desc: 'Votre colis est en cours de préparation', icon: Package },
  { status: 'shipped', label: 'Expédiée', desc: 'Votre colis est en route', icon: Truck },
  { status: 'delivered', label: 'Livrée', desc: 'Commande livrée avec succès !', icon: HomeIcon },
]

const STATUS_ORDER: CustomerOrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

function getStepIndex(status: CustomerOrderStatus | string) {
  if (status === 'cancelled') return -1
  return STATUS_ORDER.indexOf(status as CustomerOrderStatus)
}

interface TrackedOrder {
  number: string
  status: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  payment: string
  city: string
  createdAt: string
}

export default function TrackingPage() {
  const [input, setInput] = useState('')
  const [searched, setSearched] = useState(false)
  const [result, setResult] = useState<TrackedOrder | null>(null)
  const [loading, setLoading] = useState(false)
  const { orders: customerOrders } = useCustomerStore()
  const { goHome, goCatalog } = useNavStore()

  const handleSearch = async () => {
    if (!input.trim()) return
    setLoading(true)
    setSearched(false)
    await new Promise((r) => setTimeout(r, 700))

    const query = input.trim().toUpperCase()

    // Search customer orders
    const customerOrder = customerOrders.find(
      (o) => o.number.toUpperCase() === query
    )
    if (customerOrder) {
      setResult({
        number: customerOrder.number,
        status: customerOrder.status,
        items: customerOrder.items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        total: customerOrder.total,
        payment: PAYMENT_INFO[customerOrder.payment].label,
        city: customerOrder.address.city,
        createdAt: customerOrder.createdAt,
      })
      setLoading(false)
      setSearched(true)
      return
    }

    setResult(null)
    setLoading(false)
    setSearched(true)
  }

  const currentIdx = result ? getStepIndex(result.status as CustomerOrderStatus) : -1
  const isCancelled = result?.status === 'cancelled'

  return (
    <div className="min-h-screen bg-cream pt-28 pb-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#D4AF6A]/10 rounded-2xl mb-4">
            <Package size={26} className="text-[#D4AF6A]" />
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
            Suivre ma commande
          </h1>
          <p className="font-[family-name:var(--font-dm-sans)] text-stone-500 mt-3 text-sm leading-relaxed">
            Entrez votre numéro de commande (format : CMD-2026-XXXX)<br />
            reçu dans votre email de confirmation.
          </p>
        </motion.div>

        {/* Search box */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="CMD-2026-1001"
              className="w-full bg-white border border-[#D4AF6A]/20 rounded-2xl pl-11 pr-4 py-4 text-sm font-[family-name:var(--font-dm-sans)] font-mono focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30 focus:border-[#D4AF6A] transition-all shadow-sm"
            />
          </div>
          <motion.button
            onClick={handleSearch}
            disabled={loading || !input.trim()}
            className="btn-gold px-6 rounded-2xl text-sm font-semibold border-0 disabled:opacity-60 shrink-0 font-[family-name:var(--font-dm-sans)] flex items-center gap-2"
            whileTap={{ scale: 0.97 }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Rechercher <ArrowRight size={15} /></>
            )}
          </motion.button>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {searched && !result && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
                <XCircle size={28} className="text-red-400" />
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1a1a1a] mb-2">
                Commande introuvable
              </h3>
              <p className="font-[family-name:var(--font-dm-sans)] text-stone-500 text-sm mb-5 leading-relaxed">
                Le numéro <strong className="font-mono text-[#1a1a1a]">{input}</strong> ne correspond à aucune commande.
                Vérifiez votre email de confirmation ou contactez-nous.
              </p>
              <a
                href={`https://wa.me/22375666853?text=Bonjour TONOMI, je cherche ma commande ${input}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bc5b] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors font-[family-name:var(--font-dm-sans)]"
              >
                <MessageCircle size={16} />
                Contacter le support WhatsApp
              </a>
            </motion.div>
          )}

          {searched && result && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="space-y-4"
            >
              {/* Order header */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono font-bold text-xl text-[#1a1a1a]">{result.number}</p>
                    <p className="font-[family-name:var(--font-dm-sans)] text-xs text-stone-400 mt-1">
                      {new Date(result.createdAt).toLocaleDateString('fr-FR', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold font-[family-name:var(--font-dm-sans)] ${
                    isCancelled
                      ? 'bg-red-100 text-red-700'
                      : result.status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-[#D4AF6A]/10 text-[#D4AF6A]'
                  }`}>
                    {ORDER_STATUS_LABELS[result.status as CustomerOrderStatus] ?? result.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center bg-stone-50 rounded-xl p-3">
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-stone-400 uppercase tracking-wide">Total</p>
                    <p className="font-[family-name:var(--font-playfair)] font-bold text-[#D4AF6A] mt-0.5">{formatPrice(result.total)}</p>
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-stone-400 uppercase tracking-wide">Paiement</p>
                    <p className="font-[family-name:var(--font-dm-sans)] font-medium text-[#1a1a1a] text-xs mt-0.5">{result.payment}</p>
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-stone-400 uppercase tracking-wide">Destination</p>
                    <p className="font-[family-name:var(--font-dm-sans)] font-medium text-[#1a1a1a] text-xs mt-0.5">{result.city}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {!isCancelled && (
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                  <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-[#1a1a1a] mb-6">
                    Suivi de livraison
                  </h3>
                  <div className="space-y-0">
                    {TIMELINE_STEPS.map((step, i) => {
                      const done = i <= currentIdx
                      const active = i === currentIdx
                      const isLast = i === TIMELINE_STEPS.length - 1
                      return (
                        <div key={step.status} className="flex gap-4">
                          {/* Line + circle */}
                          <div className="flex flex-col items-center">
                            <motion.div
                              initial={active ? { scale: 0.5 } : {}}
                              animate={active ? { scale: [1, 1.15, 1] } : {}}
                              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                              className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                                done
                                  ? 'bg-[#D4AF6A] border-[#D4AF6A]'
                                  : 'bg-white border-stone-200'
                              }`}
                            >
                              <step.icon
                                size={16}
                                className={done ? 'text-white' : 'text-stone-300'}
                              />
                            </motion.div>
                            {!isLast && (
                              <div className="w-0.5 flex-1 my-1 min-h-[24px]">
                                <motion.div
                                  className="w-full bg-[#D4AF6A] rounded-full origin-top"
                                  initial={{ scaleY: 0 }}
                                  animate={{ scaleY: done && i < currentIdx ? 1 : 0 }}
                                  transition={{ duration: 0.4, delay: i * 0.1 }}
                                  style={{ height: '100%' }}
                                />
                                {!(done && i < currentIdx) && (
                                  <div className="w-full h-full bg-stone-200 rounded-full" />
                                )}
                              </div>
                            )}
                          </div>
                          {/* Content */}
                          <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                            <p className={`font-[family-name:var(--font-dm-sans)] text-sm font-semibold ${done ? 'text-[#1a1a1a]' : 'text-stone-400'}`}>
                              {step.label}
                              {active && (
                                <span className="ml-2 text-[10px] font-normal bg-[#D4AF6A]/15 text-[#D4AF6A] px-2 py-0.5 rounded-full">
                                  En cours
                                </span>
                              )}
                            </p>
                            <p className={`font-[family-name:var(--font-dm-sans)] text-xs mt-0.5 ${done ? 'text-stone-400' : 'text-stone-300'}`}>
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {isCancelled && (
                <div className="bg-red-50 rounded-2xl border border-red-100 p-5 text-center">
                  <XCircle size={32} className="text-red-400 mx-auto mb-2" />
                  <p className="font-[family-name:var(--font-dm-sans)] text-red-700 font-medium text-sm">
                    Cette commande a été annulée.
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-red-500 text-xs mt-1">
                    Contactez-nous pour plus d'informations.
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
                <h3 className="font-[family-name:var(--font-dm-sans)] font-semibold text-stone-700 text-sm mb-3">
                  Articles commandés
                </h3>
                <div className="space-y-2">
                  {result.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                        <ShoppingBag size={15} className="text-stone-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-[#1a1a1a] truncate">
                          {item.name}
                          {item.quantity > 1 && (
                            <span className="text-stone-400 font-normal"> × {item.quantity}</span>
                          )}
                        </p>
                      </div>
                      <span className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-stone-700 shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/22375666853?text=Bonjour TONOMI, j'ai une question sur ma commande ${result.number}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bc5b] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors font-[family-name:var(--font-dm-sans)]"
                >
                  <MessageCircle size={16} />
                  Aide via WhatsApp
                </a>
                <button
                  onClick={() => goCatalog()}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#D4AF6A]/30 hover:bg-[#D4AF6A]/5 text-[#1a1a1a] font-semibold text-sm px-5 py-3 rounded-xl transition-colors font-[family-name:var(--font-dm-sans)]"
                >
                  Continuer mes achats
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No search yet — demo hint */}
        {!searched && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="font-[family-name:var(--font-dm-sans)] text-stone-400 text-xs mb-3">
              Pour tester, essayez un numéro de démonstration :
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['CMD-2026-1001', 'CMD-2026-1005', 'CMD-2026-1010'].map((demo) => (
                <button
                  key={demo}
                  onClick={() => { setInput(demo); }}
                  className="font-mono text-xs bg-stone-100 hover:bg-[#D4AF6A]/10 hover:text-[#D4AF6A] text-stone-500 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {demo}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
