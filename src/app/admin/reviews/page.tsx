'use client'

import { useMemo, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminReviewsStore, type ReviewStatus } from '@/stores/admin-reviews-store'
import { useAdminProductsStore } from '@/stores/admin-products-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { CheckCircle, EyeOff, RotateCcw, Search, Trash2 } from 'lucide-react'

const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: 'En attente',
  approved: 'Approuvé',
  hidden: 'Masqué',
}

const STATUS_CLS: Record<ReviewStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  hidden: 'bg-slate-50 text-slate-500 border-slate-200',
}

export default function AdminReviewsPage() {
  const { reviews, updateReview, deleteReview, resetReviews } = useAdminReviewsStore()
  const products = useAdminProductsStore((s) => s.products)

  const [q, setQ] = useState('')
  const [status, setStatus] = useState<ReviewStatus | 'all'>('all')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const productNameById = useMemo(() => {
    const map = new Map<string, string>()
    for (const p of products) map.set(p.id, p.name)
    return map
  }, [products])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return [...reviews]
      .filter((r) => (status === 'all' ? true : r.status === status))
      .filter((r) => {
        if (!query) return true
        const productName = productNameById.get(r.productId) ?? r.productId
        return (
          r.author.toLowerCase().includes(query) ||
          r.comment.toLowerCase().includes(query) ||
          productName.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [reviews, q, status, productNameById])

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Avis produits
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Modération simple des avis (approuver / masquer / supprimer).
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              resetReviews()
              toast.success('Avis réinitialisés')
            }}
            className="rounded-xl"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher (produit, auteur, texte)…"
              className="h-11 rounded-xl pl-11"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'pending', 'approved', 'hidden'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  status === s
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {s === 'all' ? 'Tous' : STATUS_LABEL[s]}
              </button>
            ))}
            {(q || status !== 'all') && (
              <button
                onClick={() => {
                  setQ('')
                  setStatus('all')
                }}
                className="ml-auto flex items-center gap-1.5 text-xs text-[#D4AF6A] hover:text-[#C8956C] font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser filtres
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {filtered.length} avis
            </p>
          </div>

          <div className="divide-y divide-slate-50">
            {filtered.map((r) => {
              const productName = productNameById.get(r.productId) ?? r.productId
              return (
                <div key={r.id} className="px-5 py-4 flex items-start gap-4">
                  <div className="shrink-0">
                    <span className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_CLS[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {productName}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {r.author}{r.location ? ` · ${r.location}` : ''} · {r.rating}/5
                    </p>
                    <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                      {r.comment}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        updateReview(r.id, { status: 'approved' })
                        toast.success('Avis approuvé')
                      }}
                      className="rounded-xl justify-start"
                      disabled={r.status === 'approved'}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approuver
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        updateReview(r.id, { status: 'hidden' })
                        toast.success('Avis masqué')
                      }}
                      className="rounded-xl justify-start"
                      disabled={r.status === 'hidden'}
                    >
                      <EyeOff className="w-4 h-4" />
                      Masquer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteTarget(r.id)}
                      className="rounded-xl justify-start border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-red-600" style={{ fontFamily: 'var(--font-playfair)' }}>
                Supprimer l’avis
              </DialogTitle>
              <DialogDescription>Cette action est irréversible.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-slate-700">Supprimer définitivement cet avis ?</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDeleteTarget(null)} className="flex-1 rounded-xl">
                  Annuler
                </Button>
                <Button
                  onClick={() => {
                    if (!deleteTarget) return
                    deleteReview(deleteTarget)
                    toast.success('Avis supprimé')
                    setDeleteTarget(null)
                  }}
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

