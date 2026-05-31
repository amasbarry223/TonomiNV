'use client'

import { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { promoCodes as staticCodes, flashSales as staticFlash, type PromoCode, type FlashSale } from '@/data/promos'
import { products } from '@/data/products'
import { formatPrice } from '@/lib/product-display'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Search, Plus, Pencil, Trash2, Tag, Zap, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function PromotionsPage() {
  const [tab, setTab] = useState('codes')
  const [search, setSearch] = useState('')
  const [editCode, setEditCode] = useState<PromoCode | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const filteredCodes = useMemo(() =>
    staticCodes.filter((c) => !search || c.code.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    toast.success(`Code ${code} copié !`)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
              Promotions
            </h2>
            <p className="text-sm text-slate-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Codes promo et ventes flash
            </p>
          </div>
          <Button onClick={() => setShowAdd(true)}
            className="bg-[#D4AF6A] hover:bg-[#C8956C] text-white border-0 gap-2 rounded-xl">
            <Plus className="w-4 h-4" /> Nouveau code
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-slate-100 rounded-xl p-1 h-auto">
            <TabsTrigger value="codes" className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
              <Tag className="w-3.5 h-3.5" /> Codes promo ({staticCodes.length})
            </TabsTrigger>
            <TabsTrigger value="flash" className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2">
              <Zap className="w-3.5 h-3.5" /> Ventes flash ({staticFlash.length})
            </TabsTrigger>
          </TabsList>

          {/* Codes Promo */}
          <TabsContent value="codes">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un code…" className="pl-9 bg-white border-slate-200 rounded-xl" />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Remise</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Min. commande</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Utilisations</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredCodes.map((code) => (
                      <tr key={code.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                              {code.code}
                            </code>
                            <button onClick={() => copyCode(code.code)}
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-[#D4AF6A]/10 flex items-center justify-center text-slate-400 hover:text-[#D4AF6A] transition-colors opacity-0 group-hover:opacity-100">
                              {copied === code.code ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-[#D4AF6A]">
                            {code.type === 'percentage' ? `−${code.discount}%` : `−${formatPrice(code.discount)}`}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-slate-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                            {code.minPurchase ? formatPrice(code.minPurchase) : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-slate-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                            Illimité
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            Actif
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEditCode(code)}
                              className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Ventes Flash */}
          <TabsContent value="flash">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produit</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Remise</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expire</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {staticFlash.map((sale) => {
                    const product = products.find((p) => p.id === sale.productId)
                    const expireDate = new Date(sale.endsAt)
                    const isExpired = expireDate < new Date()
                    return (
                      <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-slate-800" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                            {product?.name ?? sale.productId}
                          </p>
                          <p className="text-[10px] text-slate-400">{product?.category}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-orange-500">−{sale.discount}%</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#D4AF6A] rounded-full"
                                style={{ width: `${(sale.stockLeft / sale.totalStock) * 100}%` }} />
                            </div>
                            <span className="text-xs text-slate-600">{sale.stockLeft}/{sale.totalStock}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                            {expireDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isExpired ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {isExpired ? 'Expirée' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit modal */}
      <Dialog open={showAdd || !!editCode} onOpenChange={(o) => { if (!o) { setShowAdd(false); setEditCode(null) } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-playfair)' }}>
              {editCode ? 'Modifier le code' : 'Nouveau code promo'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Code</Label>
              <Input defaultValue={editCode?.code} className="mt-1 rounded-xl font-mono uppercase" placeholder="SOLDES20" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Type</Label>
                <select className="mt-1 w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/30"
                  defaultValue={editCode?.type ?? 'percent'} style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  <option value="percent">Pourcentage (%)</option>
                  <option value="fixed">Montant fixe (FCFA)</option>
                </select>
              </div>
              <div>
                <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Valeur</Label>
                <Input defaultValue={editCode?.discount} className="mt-1 rounded-xl" type="number" placeholder="20" />
              </div>
            </div>
            <div>
              <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Commande minimum (FCFA)</Label>
              <Input defaultValue={editCode?.minPurchase} className="mt-1 rounded-xl" type="number" placeholder="10000" />
            </div>
            <div>
              <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Utilisations max (laisser vide = illimité)</Label>
              <Input className="mt-1 rounded-xl" type="number" placeholder="100" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setShowAdd(false); setEditCode(null) }}>Annuler</Button>
            <Button className="bg-[#D4AF6A] hover:bg-[#C8956C] text-white border-0"
              onClick={() => { setShowAdd(false); setEditCode(null); toast.success('Code enregistré !') }}>
              {editCode ? 'Enregistrer' : 'Créer le code'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
