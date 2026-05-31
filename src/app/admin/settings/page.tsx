'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminStore } from '@/stores/admin-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Store, Phone, Mail, MapPin, Globe, Instagram, Facebook,
  MessageCircle, Truck, Shield, CheckCircle, Eye, EyeOff,
} from 'lucide-react'
import { toast } from 'sonner'

const SECTION = 'font-semibold text-slate-800 text-sm flex items-center gap-2'
const CARD = 'bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4'

export default function SettingsPage() {
  const { logout } = useAdminStore()
  const [saved, setSaved] = useState<string | null>(null)
  const [showPwd, setShowPwd] = useState(false)

  const [store, setStore] = useState({
    name: 'TONOMI Accessoires',
    tagline: "L'élégance africaine, réinventée.",
    description: 'Bijoux et accessoires artisanaux du Mali pour la femme moderne.',
    email: 'contact@tonomi.ml',
    phone: '+223 75 66 68 53',
    address: 'ACI 2000, Hamdallaye, Bamako, Mali',
    website: 'https://tonomi.com',
    instagram: '@tonomi.accessoires',
    facebook: 'tonomi',
    whatsapp: '22375666853',
  })

  const [delivery, setDelivery] = useState({
    freeThreshold: '30000',
    bamakoCost: '2000',
    maliFee: '5000',
    westAfricaFee: '15000',
    deliveryDays: '1-2',
    countryDays: '3-5',
  })

  const [security, setSecurity] = useState({
    currentPwd: '',
    newPwd: '',
    confirmPwd: '',
  })

  const save = (section: string) => {
    setSaved(section)
    toast.success('Paramètres enregistrés !')
    setTimeout(() => setSaved(null), 3000)
  }

  const handlePasswordChange = () => {
    if (security.newPwd !== security.confirmPwd) { toast.error('Les mots de passe ne correspondent pas'); return }
    if (security.newPwd.length < 6) { toast.error('Minimum 6 caractères'); return }
    toast.success('Mot de passe mis à jour !')
    setSecurity({ currentPwd: '', newPwd: '', confirmPwd: '' })
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Paramètres
          </h2>
          <p className="text-sm text-slate-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Configuration générale de la boutique
          </p>
        </div>

        {/* Boutique */}
        <div className={CARD}>
          <h3 className={SECTION} style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <Store className="w-4 h-4 text-[#D4AF6A]" /> Informations boutique
          </h3>
          <Separator />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Nom de la boutique</Label>
              <Input value={store.name} onChange={(e) => setStore((s) => ({ ...s, name: e.target.value }))}
                className="mt-1 rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Tagline</Label>
              <Input value={store.tagline} onChange={(e) => setStore((s) => ({ ...s, tagline: e.target.value }))}
                className="mt-1 rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>Description</Label>
              <Textarea value={store.description} onChange={(e) => setStore((s) => ({ ...s, description: e.target.value }))}
                className="mt-1 rounded-xl resize-none" rows={2} />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => save('store')} className="bg-[#D4AF6A] hover:bg-[#C8956C] text-white border-0 rounded-xl gap-2">
              {saved === 'store' && <CheckCircle className="w-4 h-4" />}
              Enregistrer
            </Button>
          </div>
        </div>

        {/* Contact */}
        <div className={CARD}>
          <h3 className={SECTION} style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <Phone className="w-4 h-4 text-[#D4AF6A]" /> Coordonnées
          </h3>
          <Separator />
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Mail, key: 'email', label: 'Email', type: 'email', ph: 'contact@tonomi.ml' },
              { icon: Phone, key: 'phone', label: 'Téléphone', type: 'tel', ph: '+223 75 66 68 53' },
              { icon: MapPin, key: 'address', label: 'Adresse', type: 'text', ph: 'ACI 2000…', col2: true },
              { icon: Globe, key: 'website', label: 'Site web', type: 'url', ph: 'https://tonomi.com' },
            ].map(({ icon: Icon, key, label, type, ph, col2 }) => (
              <div key={key} className={col2 ? 'sm:col-span-2' : ''}>
                <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>{label}</Label>
                <div className="relative mt-1">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input value={store[key as keyof typeof store]} onChange={(e) => setStore((s) => ({ ...s, [key]: e.target.value }))}
                    type={type} placeholder={ph} className="pl-9 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => save('contact')} className="bg-[#D4AF6A] hover:bg-[#C8956C] text-white border-0 rounded-xl gap-2">
              {saved === 'contact' && <CheckCircle className="w-4 h-4" />}
              Enregistrer
            </Button>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className={CARD}>
          <h3 className={SECTION} style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <Instagram className="w-4 h-4 text-[#D4AF6A]" /> Réseaux sociaux
          </h3>
          <Separator />
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Instagram, key: 'instagram', label: 'Instagram', ph: '@tonomi.accessoires' },
              { icon: Facebook, key: 'facebook', label: 'Facebook', ph: 'tonomi' },
              { icon: MessageCircle, key: 'whatsapp', label: 'WhatsApp (numéro)', ph: '22375666853' },
            ].map(({ icon: Icon, key, label, ph }) => (
              <div key={key}>
                <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>{label}</Label>
                <div className="relative mt-1">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input value={store[key as keyof typeof store]} onChange={(e) => setStore((s) => ({ ...s, [key]: e.target.value }))}
                    placeholder={ph} className="pl-9 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => save('social')} className="bg-[#D4AF6A] hover:bg-[#C8956C] text-white border-0 rounded-xl gap-2">
              {saved === 'social' && <CheckCircle className="w-4 h-4" />}
              Enregistrer
            </Button>
          </div>
        </div>

        {/* Livraison */}
        <div className={CARD}>
          <h3 className={SECTION} style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <Truck className="w-4 h-4 text-[#D4AF6A]" /> Paramètres de livraison
          </h3>
          <Separator />
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { key: 'freeThreshold', label: 'Livraison gratuite dès (FCFA)', ph: '30000' },
              { key: 'bamakoCost', label: 'Frais Bamako (FCFA)', ph: '2000' },
              { key: 'maliFee', label: 'Frais autres villes Mali (FCFA)', ph: '5000' },
              { key: 'westAfricaFee', label: 'Frais Afrique de l\'Ouest (FCFA)', ph: '15000' },
              { key: 'deliveryDays', label: 'Délai Bamako (jours)', ph: '1-2' },
              { key: 'countryDays', label: 'Délai autres villes (jours)', ph: '3-5' },
            ].map(({ key, label, ph }) => (
              <div key={key}>
                <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>{label}</Label>
                <Input value={delivery[key as keyof typeof delivery]}
                  onChange={(e) => setDelivery((d) => ({ ...d, [key]: e.target.value }))}
                  placeholder={ph} className="mt-1 rounded-xl" />
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => save('delivery')} className="bg-[#D4AF6A] hover:bg-[#C8956C] text-white border-0 rounded-xl gap-2">
              {saved === 'delivery' && <CheckCircle className="w-4 h-4" />}
              Enregistrer
            </Button>
          </div>
        </div>

        {/* Sécurité */}
        <div className={CARD}>
          <h3 className={SECTION} style={{ fontFamily: 'var(--font-dm-sans)' }}>
            <Shield className="w-4 h-4 text-[#D4AF6A]" /> Sécurité du compte admin
          </h3>
          <Separator />
          <div className="space-y-4 max-w-sm">
            {[
              { key: 'currentPwd', label: 'Mot de passe actuel' },
              { key: 'newPwd', label: 'Nouveau mot de passe' },
              { key: 'confirmPwd', label: 'Confirmer le nouveau' },
            ].map(({ key, label }) => (
              <div key={key}>
                <Label style={{ fontFamily: 'var(--font-dm-sans)' }}>{label}</Label>
                <div className="relative mt-1">
                  <Input type={showPwd ? 'text' : 'password'}
                    value={security[key as keyof typeof security]}
                    onChange={(e) => setSecurity((s) => ({ ...s, [key]: e.target.value }))}
                    className="pr-10 rounded-xl" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handlePasswordChange} className="bg-[#D4AF6A] hover:bg-[#C8956C] text-white border-0 rounded-xl">
              Changer le mot de passe
            </Button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-3">
          <h3 className="font-semibold text-red-800 text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Zone dangereuse
          </h3>
          <p className="text-xs text-red-600" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Se déconnecter de la session administrateur courante.
          </p>
          <Button variant="outline" onClick={logout}
            className="border-red-300 text-red-600 hover:bg-red-100 hover:border-red-400 rounded-xl">
            Se déconnecter
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
