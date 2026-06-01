'use client'

import { useMemo, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminStore } from '@/stores/admin-store'
import { useCustomerStore } from '@/stores/customer-store'
import { seedCustomers, seedOrders } from '@/data/seed'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAdminPresenceStore } from '@/stores/admin-presence-store'
import { useAdminUsersStore, type AdminUser, type AdminUserRole } from '@/stores/admin-users-store'
import { useAdminLogsStore, type LogAction, type LogEntityType } from '@/stores/admin-logs-store'
import { exportToCSV } from '@/lib/admin-export'
import { useAdminAnnouncementStore } from '@/stores/admin-announcement-store'
import {
  Store,
  Phone,
  Mail,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  MessageCircle,
  Truck,
  Shield,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  Settings2,
  Globe2,
  Users as UsersIcon,
  Plus,
  Trash2,
  ScrollText,
  Download,
  RotateCcw,
  Search,
  Truck as TruckIcon,
  Tag as TagIcon,
  Globe as GlobeIcon,
  RefreshCw as RefreshIcon,
  Gem as GemIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const PANEL =
  'bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-5 min-h-full flex flex-col w-full'
const SECTION = 'text-sm font-bold text-slate-800 flex items-center gap-2'
const SAVE_BTN =
  'bg-[#D4AF6A] hover:bg-[#C8956C] text-white border-0 rounded-xl gap-2 h-9 px-4 text-sm font-semibold'

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-xs font-semibold text-slate-600">{label}</Label>
      {children}
    </div>
  )
}

function IconInput({
  icon: Icon,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  icon: React.ElementType
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 h-10 rounded-xl border-slate-200"
      />
    </div>
  )
}

export default function SettingsPage() {
  const { logout } = useAdminStore()
  const { loadDemoData } = useCustomerStore()
  const {
    presence,
    updatePresence,
    addStat,
    updateStat,
    deleteStat,
    addCountry,
    updateCountry,
    deleteCountry,
    resetPresence,
  } = useAdminPresenceStore()
  const { users, addUser, updateUser, deleteUser, resetUsers } = useAdminUsersStore()
  const { events: logEvents, clear: clearLogs } = useAdminLogsStore()
  const { banner, updateBanner, addItem: addBannerItem, updateItem: updateBannerItem, deleteItem: deleteBannerItem, resetBanner } =
    useAdminAnnouncementStore()
  const [saved, setSaved] = useState<string | null>(null)
  const [showPwd, setShowPwd] = useState(false)
  const [userDraft, setUserDraft] = useState<{
    name: string
    email: string
    password: string
    role: AdminUserRole
  }>({ name: '', email: '', password: '', role: 'staff' })
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [logsQ, setLogsQ] = useState('')
  const [logsAction, setLogsAction] = useState<LogAction | 'all'>('all')
  const [logsEntity, setLogsEntity] = useState<LogEntityType | 'all'>('all')
  const [confirmClearLogs, setConfirmClearLogs] = useState(false)

  const [store, setStore] = useState({
    name: 'TONOMI Accessoires',
    tagline: "L'élégance africaine, réinventée.",
    description:
      'Bijoux et accessoires artisanaux du Mali pour la femme moderne.',
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
    toast.success('Paramètres enregistrés')
    setTimeout(() => setSaved(null), 2500)
  }

  const handlePasswordChange = () => {
    if (security.newPwd !== security.confirmPwd) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    if (security.newPwd.length < 6) {
      toast.error('Minimum 6 caractères')
      return
    }
    toast.success('Mot de passe mis à jour')
    setSecurity({ currentPwd: '', newPwd: '', confirmPwd: '' })
  }

  const tabItems = [
    { value: 'store', label: 'Boutique', icon: Store },
    { value: 'contact', label: 'Contact', icon: Phone },
    { value: 'social', label: 'Réseaux', icon: Instagram },
    { value: 'delivery', label: 'Livraison', icon: Truck },
    { value: 'banner', label: 'Bannière', icon: TruckIcon },
    { value: 'presence', label: 'Présence', icon: Globe2 },
    { value: 'users', label: 'Utilisateurs', icon: UsersIcon },
    { value: 'logs', label: 'Logs', icon: ScrollText },
    { value: 'security', label: 'Sécurité', icon: Shield },
    { value: 'system', label: 'Système', icon: Settings2 },
  ] as const

  const filteredLogs = useMemo(() => {
    const q = logsQ.trim().toLowerCase()
    return logEvents.filter((e) => {
      if (logsAction !== 'all' && e.action !== logsAction) return false
      if (logsEntity !== 'all' && e.entityType !== logsEntity) return false
      if (!q) return true
      return (
        e.summary.toLowerCase().includes(q) ||
        (e.actorEmail ?? '').toLowerCase().includes(q) ||
        (e.entityId ?? '').toLowerCase().includes(q)
      )
    })
  }, [logEvents, logsQ, logsAction, logsEntity])

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full min-h-[calc(100dvh-7.5rem)]">
        <div className="shrink-0">
          <h1
            className="text-2xl font-bold text-slate-900"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Paramètres
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Configuration de la boutique et du compte administrateur
          </p>
        </div>

        <Tabs defaultValue="store" className="flex flex-col flex-1 min-h-0 gap-4 w-full">
          <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm shrink-0">
            {tabItems.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 data-[state=active]:bg-[#D4AF6A] data-[state=active]:text-white data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-[#C8956C]/30"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 min-h-0 w-full">
          <TabsContent value="store" className="mt-0 outline-none min-h-full h-full">
            <div className={PANEL}>
              <h2 className={SECTION}>
                <Store className="w-4 h-4 text-[#D4AF6A]" />
                Identité de la boutique
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nom de la boutique" className="sm:col-span-2">
                  <Input
                    value={store.name}
                    onChange={(e) => setStore((s) => ({ ...s, name: e.target.value }))}
                    className="h-10 rounded-xl"
                  />
                </Field>
                <Field label="Tagline" className="sm:col-span-2">
                  <Input
                    value={store.tagline}
                    onChange={(e) => setStore((s) => ({ ...s, tagline: e.target.value }))}
                    className="h-10 rounded-xl"
                  />
                </Field>
                <Field label="Description" className="sm:col-span-2">
                  <Textarea
                    value={store.description}
                    onChange={(e) =>
                      setStore((s) => ({ ...s, description: e.target.value }))
                    }
                    rows={3}
                    className="rounded-xl resize-none"
                  />
                </Field>
              </div>
              <div className="flex justify-end pt-1 mt-auto">
                <Button onClick={() => save('store')} className={SAVE_BTN}>
                  {saved === 'store' && <CheckCircle className="w-4 h-4" />}
                  Enregistrer
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-0 outline-none min-h-full h-full">
            <div className={PANEL}>
              <h2 className={SECTION}>
                <Phone className="w-4 h-4 text-[#D4AF6A]" />
                Coordonnées
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email">
                  <IconInput
                    icon={Mail}
                    type="email"
                    value={store.email}
                    onChange={(v) => setStore((s) => ({ ...s, email: v }))}
                    placeholder="contact@tonomi.ml"
                  />
                </Field>
                <Field label="Téléphone">
                  <IconInput
                    icon={Phone}
                    type="tel"
                    value={store.phone}
                    onChange={(v) => setStore((s) => ({ ...s, phone: v }))}
                  />
                </Field>
                <Field label="Adresse" className="sm:col-span-2">
                  <IconInput
                    icon={MapPin}
                    value={store.address}
                    onChange={(v) => setStore((s) => ({ ...s, address: v }))}
                  />
                </Field>
                <Field label="Site web" className="sm:col-span-2">
                  <IconInput
                    icon={Globe}
                    type="url"
                    value={store.website}
                    onChange={(v) => setStore((s) => ({ ...s, website: v }))}
                  />
                </Field>
              </div>
              <div className="flex justify-end pt-1 mt-auto">
                <Button onClick={() => save('contact')} className={SAVE_BTN}>
                  {saved === 'contact' && <CheckCircle className="w-4 h-4" />}
                  Enregistrer
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-0 outline-none min-h-full h-full">
            <div className={PANEL}>
              <h2 className={SECTION}>
                <Instagram className="w-4 h-4 text-[#D4AF6A]" />
                Réseaux sociaux
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Instagram">
                  <IconInput
                    icon={Instagram}
                    value={store.instagram}
                    onChange={(v) => setStore((s) => ({ ...s, instagram: v }))}
                    placeholder="@tonomi.accessoires"
                  />
                </Field>
                <Field label="Facebook">
                  <IconInput
                    icon={Facebook}
                    value={store.facebook}
                    onChange={(v) => setStore((s) => ({ ...s, facebook: v }))}
                  />
                </Field>
                <Field label="WhatsApp (numéro)" className="sm:col-span-2">
                  <IconInput
                    icon={MessageCircle}
                    value={store.whatsapp}
                    onChange={(v) => setStore((s) => ({ ...s, whatsapp: v }))}
                    placeholder="22375666853"
                  />
                </Field>
              </div>
              <div className="flex justify-end pt-1 mt-auto">
                <Button onClick={() => save('social')} className={SAVE_BTN}>
                  {saved === 'social' && <CheckCircle className="w-4 h-4" />}
                  Enregistrer
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="mt-0 outline-none min-h-full h-full">
            <div className={PANEL}>
              <h2 className={SECTION}>
                <Truck className="w-4 h-4 text-[#D4AF6A]" />
                Livraison
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    key: 'freeThreshold',
                    label: 'Gratuite dès (FCFA)',
                    ph: '30000',
                  },
                  { key: 'bamakoCost', label: 'Frais Bamako (FCFA)', ph: '2000' },
                  { key: 'maliFee', label: 'Autres villes Mali (FCFA)', ph: '5000' },
                  {
                    key: 'westAfricaFee',
                    label: 'Afrique de l\'Ouest (FCFA)',
                    ph: '15000',
                  },
                  { key: 'deliveryDays', label: 'Délai Bamako (jours)', ph: '1-2' },
                  {
                    key: 'countryDays',
                    label: 'Délai autres villes (jours)',
                    ph: '3-5',
                  },
                ].map(({ key, label, ph }) => (
                  <Field key={key} label={label}>
                    <Input
                      value={delivery[key as keyof typeof delivery]}
                      onChange={(e) =>
                        setDelivery((d) => ({ ...d, [key]: e.target.value }))
                      }
                      placeholder={ph}
                      className="h-10 rounded-xl"
                    />
                  </Field>
                ))}
              </div>
              <div className="flex justify-end pt-1 mt-auto">
                <Button onClick={() => save('delivery')} className={SAVE_BTN}>
                  {saved === 'delivery' && <CheckCircle className="w-4 h-4" />}
                  Enregistrer
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="banner" className="mt-0 outline-none min-h-full h-full">
            <div className={PANEL}>
              <h2 className={SECTION}>
                <TruckIcon className="w-4 h-4 text-[#D4AF6A]" />
                Bannière défilante
              </h2>
              <p className="text-sm text-slate-500 -mt-2">
                Messages affichés en haut du site (marquee). Une ligne = un message.
              </p>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Afficher la bannière">
                    <select
                      value={banner.enabled ? '1' : '0'}
                      onChange={(e) => updateBanner({ enabled: e.target.value === '1' })}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="1">Oui</option>
                      <option value="0">Non</option>
                    </select>
                  </Field>
                  <Field label="Fermable par l’utilisateur">
                    <select
                      value={banner.dismissible ? '1' : '0'}
                      onChange={(e) => updateBanner({ dismissible: e.target.value === '1' })}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="1">Oui</option>
                      <option value="0">Non</option>
                    </select>
                  </Field>
                  <Field label="Clé stockage (localStorage)" className="sm:col-span-2">
                    <Input
                      value={banner.storageKey}
                      onChange={(e) => updateBanner({ storageKey: e.target.value })}
                      className="h-10 rounded-xl font-mono"
                      placeholder="tonomi-bar-v4"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Change cette clé si tu veux ré-afficher la bannière à tous les visiteurs (reset global).
                    </p>
                  </Field>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800">Messages</p>
                    <button
                      type="button"
                      onClick={addBannerItem}
                      className="text-sm font-semibold text-[#D4AF6A] hover:text-[#C8956C] flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Ajouter
                    </button>
                  </div>

                  <div className="space-y-3">
                    {banner.items.map((it) => (
                      <div key={it.id} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Field label="Actif">
                            <select
                              value={it.isActive ? '1' : '0'}
                              onChange={(e) => updateBannerItem(it.id, { isActive: e.target.value === '1' })}
                              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                            >
                              <option value="1">Oui</option>
                              <option value="0">Non</option>
                            </select>
                          </Field>
                          <Field label="Action au clic">
                            <select
                              value={it.action}
                              onChange={(e) => updateBannerItem(it.id, { action: e.target.value as any })}
                              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                            >
                              <option value="none">Aucune</option>
                              <option value="promotions">Promotions</option>
                              <option value="catalogue">Catalogue</option>
                              <option value="contact">Contact</option>
                            </select>
                          </Field>
                          <Field label="Icône">
                            <select
                              value={it.iconKey}
                              onChange={(e) => updateBannerItem(it.id, { iconKey: e.target.value as any })}
                              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                            >
                              <option value="truck">Livraison</option>
                              <option value="tag">Promo</option>
                              <option value="globe">Région</option>
                              <option value="refresh">Retours</option>
                              <option value="gem">Qualité</option>
                            </select>
                          </Field>
                          <Field label="Texte" className="sm:col-span-2">
                            <Input
                              value={it.text}
                              onChange={(e) => updateBannerItem(it.id, { text: e.target.value })}
                              className="h-10 rounded-xl"
                              placeholder="Ex: Livraison gratuite dès 30 000 FCFA…"
                            />
                          </Field>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            {it.iconKey === 'truck' && <TruckIcon className="w-4 h-4" />}
                            {it.iconKey === 'tag' && <TagIcon className="w-4 h-4" />}
                            {it.iconKey === 'globe' && <GlobeIcon className="w-4 h-4" />}
                            {it.iconKey === 'refresh' && <RefreshIcon className="w-4 h-4" />}
                            {it.iconKey === 'gem' && <GemIcon className="w-4 h-4" />}
                            <span className="font-mono">{it.id}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteBannerItem(it.id)}
                            className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5"
                          >
                            <Trash2 className="w-4 h-4" /> Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1 mt-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetBanner()
                    toast.success('Bannière réinitialisée')
                  }}
                  className="rounded-xl"
                >
                  Réinitialiser
                </Button>
                <Button onClick={() => save('banner')} className={SAVE_BTN}>
                  {saved === 'banner' && <CheckCircle className="w-4 h-4" />}
                  Enregistrer
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presence" className="mt-0 outline-none min-h-full h-full">
            <div className={PANEL}>
              <h2 className={SECTION}>
                <Globe2 className="w-4 h-4 text-[#D4AF6A]" />
                Là où TONOMI rayonne
              </h2>

              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Afficher la section">
                    <select
                      value={presence.enabled ? '1' : '0'}
                      onChange={(e) => updatePresence({ enabled: e.target.value === '1' })}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="1">Oui</option>
                      <option value="0">Non</option>
                    </select>
                  </Field>
                  <Field label="Kicker (petit titre)">
                    <Input
                      value={presence.headerKicker}
                      onChange={(e) => updatePresence({ headerKicker: e.target.value })}
                      className="h-10 rounded-xl"
                    />
                  </Field>
                  <Field label="Titre (préfixe)">
                    <Input
                      value={presence.titlePrefix}
                      onChange={(e) => updatePresence({ titlePrefix: e.target.value })}
                      className="h-10 rounded-xl"
                    />
                  </Field>
                  <Field label="Titre (marque)">
                    <Input
                      value={presence.titleBrand}
                      onChange={(e) => updatePresence({ titleBrand: e.target.value })}
                      className="h-10 rounded-xl"
                    />
                  </Field>
                  <Field label="Titre (suffixe)">
                    <Input
                      value={presence.titleSuffix}
                      onChange={(e) => updatePresence({ titleSuffix: e.target.value })}
                      className="h-10 rounded-xl"
                    />
                  </Field>
                  <Field label="Sous-titre" className="sm:col-span-2">
                    <Textarea
                      value={presence.subtitle}
                      onChange={(e) => updatePresence({ subtitle: e.target.value })}
                      rows={3}
                      className="rounded-xl resize-none"
                    />
                  </Field>
                </div>

                {/* Stats */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <UsersIcon className="w-4 h-4 text-slate-500" /> Statistiques
                    </p>
                    <button
                      type="button"
                      onClick={addStat}
                      className="text-sm font-semibold text-[#D4AF6A] hover:text-[#C8956C] flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Ajouter
                    </button>
                  </div>
                  <div className="space-y-3">
                    {presence.stats.map((st) => (
                      <div key={st.id} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Field label="Icône">
                            <select
                              value={st.iconKey}
                              onChange={(e) => updateStat(st.id, { iconKey: e.target.value as any })}
                              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                            >
                              <option value="globe">Globe</option>
                              <option value="truck">Livraison</option>
                              <option value="users">Clientes</option>
                            </select>
                          </Field>
                          <Field label="Valeur">
                            <Input
                              value={st.value}
                              onChange={(e) => updateStat(st.id, { value: e.target.value })}
                              className="h-10 rounded-xl"
                            />
                          </Field>
                          <Field label="Label">
                            <Input
                              value={st.label}
                              onChange={(e) => updateStat(st.id, { label: e.target.value })}
                              className="h-10 rounded-xl"
                            />
                          </Field>
                          <Field label="Description">
                            <Input
                              value={st.description}
                              onChange={(e) => updateStat(st.id, { description: e.target.value })}
                              className="h-10 rounded-xl"
                            />
                          </Field>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => deleteStat(st.id)}
                            className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5"
                          >
                            <Trash2 className="w-4 h-4" /> Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Countries */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800">Pays</p>
                    <button
                      type="button"
                      onClick={addCountry}
                      className="text-sm font-semibold text-[#D4AF6A] hover:text-[#C8956C] flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Ajouter
                    </button>
                  </div>
                  <div className="space-y-3">
                    {presence.countries.map((c) => (
                      <div key={c.id} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Field label="ID (ISO numeric)">
                            <Input
                              value={c.id}
                              onChange={(e) => {
                                const id = e.target.value
                                if (!id) return
                                // ID is the key: keep as-is to avoid breaking map. If you need to change it, delete/re-add.
                              }}
                              className="h-10 rounded-xl font-mono"
                              disabled
                            />
                          </Field>
                          <Field label="Nom">
                            <Input value={c.name} onChange={(e) => updateCountry(c.id, { name: e.target.value })} className="h-10 rounded-xl" />
                          </Field>
                          <Field label="Capitale">
                            <Input value={c.capital} onChange={(e) => updateCountry(c.id, { capital: e.target.value })} className="h-10 rounded-xl" />
                          </Field>
                          <Field label="Code drapeau (ex: ml)">
                            <Input value={c.flagCode} onChange={(e) => updateCountry(c.id, { flagCode: e.target.value })} className="h-10 rounded-xl font-mono" />
                          </Field>
                          <Field label="Présence depuis">
                            <Input value={c.since} onChange={(e) => updateCountry(c.id, { since: e.target.value })} className="h-10 rounded-xl" />
                          </Field>
                          <Field label="Statut">
                            <select
                              value={c.status}
                              onChange={(e) => updateCountry(c.id, { status: e.target.value as any })}
                              className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                            >
                              <option value="actif">Actif</option>
                              <option value="en développement">En développement</option>
                            </select>
                          </Field>
                          <Field label="Clientes">
                            <Input value={c.clients} onChange={(e) => updateCountry(c.id, { clients: e.target.value })} className="h-10 rounded-xl" />
                          </Field>
                          <Field label="Coordonnées (lon, lat)">
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                value={String(c.coordinates[0])}
                                onChange={(e) => {
                                  const v = Number(e.target.value)
                                  updateCountry(c.id, { coordinates: [v, c.coordinates[1]] })
                                }}
                                className="h-10 rounded-xl font-mono"
                                placeholder="-7.99"
                              />
                              <Input
                                value={String(c.coordinates[1])}
                                onChange={(e) => {
                                  const v = Number(e.target.value)
                                  updateCountry(c.id, { coordinates: [c.coordinates[0], v] })
                                }}
                                className="h-10 rounded-xl font-mono"
                                placeholder="12.65"
                              />
                            </div>
                          </Field>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => deleteCountry(c.id)}
                            className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5"
                          >
                            <Trash2 className="w-4 h-4" /> Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1 mt-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetPresence()
                    toast.success('Présence réinitialisée')
                  }}
                  className="rounded-xl"
                >
                  Réinitialiser
                </Button>
                <Button onClick={() => save('presence')} className={SAVE_BTN}>
                  {saved === 'presence' && <CheckCircle className="w-4 h-4" />}
                  Enregistrer
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-0 outline-none min-h-full h-full">
            <div className={PANEL}>
              <h2 className={SECTION}>
                <UsersIcon className="w-4 h-4 text-[#D4AF6A]" />
                Utilisateurs back-office
              </h2>

              <div className="space-y-6">
                {/* Add / edit */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-4">
                  <p className="text-sm font-bold text-slate-800">
                    {editingUser ? `Modifier — ${editingUser.email}` : 'Ajouter un utilisateur'}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Nom">
                      <Input
                        value={userDraft.name}
                        onChange={(e) => setUserDraft((d) => ({ ...d, name: e.target.value }))}
                        className="h-10 rounded-xl"
                        placeholder="Ex: Mariam"
                      />
                    </Field>
                    <Field label="Email">
                      <Input
                        value={userDraft.email}
                        onChange={(e) => setUserDraft((d) => ({ ...d, email: e.target.value }))}
                        className="h-10 rounded-xl"
                        placeholder="mariam@tonomi.com"
                        type="email"
                      />
                    </Field>
                    <Field label="Rôle">
                      <select
                        value={userDraft.role}
                        onChange={(e) => setUserDraft((d) => ({ ...d, role: e.target.value as AdminUserRole }))}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                      >
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                      </select>
                    </Field>
                    <Field label="Mot de passe">
                      <Input
                        value={userDraft.password}
                        onChange={(e) => setUserDraft((d) => ({ ...d, password: e.target.value }))}
                        className="h-10 rounded-xl"
                        placeholder="••••••••"
                        type="password"
                      />
                    </Field>
                  </div>

                  <div className="flex justify-end gap-2">
                    {editingUser && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingUser(null)
                          setUserDraft({ name: '', email: '', password: '', role: 'staff' })
                        }}
                        className="rounded-xl"
                      >
                        Annuler
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        const name = userDraft.name.trim()
                        const email = userDraft.email.trim().toLowerCase()
                        const password = userDraft.password
                        if (!name || !email || !password) {
                          toast.error('Nom, email et mot de passe sont obligatoires')
                          return
                        }
                        if (editingUser) {
                          updateUser(editingUser.id, { name, email, password, role: userDraft.role })
                          toast.success('Utilisateur mis à jour')
                        } else {
                          addUser({ name, email, password, role: userDraft.role, isActive: true })
                          toast.success('Utilisateur ajouté')
                        }
                        setEditingUser(null)
                        setUserDraft({ name: '', email: '', password: '', role: 'staff' })
                      }}
                      className={SAVE_BTN}
                    >
                      {editingUser ? 'Enregistrer' : 'Ajouter'}
                    </Button>
                  </div>
                </div>

                {/* List */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {users.length} utilisateur{users.length > 1 ? 's' : ''}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        resetUsers()
                        toast.success('Utilisateurs réinitialisés')
                      }}
                      className="text-xs font-semibold text-[#D4AF6A] hover:text-[#C8956C]"
                    >
                      Réinitialiser
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {users.map((u) => (
                      <div key={u.id} className="px-6 py-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {u.name}{' '}
                            <span className="text-xs font-semibold text-slate-400">({u.role})</span>
                          </p>
                          <p className="text-xs text-slate-500 truncate">{u.email}</p>
                          {u.lastLoginAt && (
                            <p className="text-[11px] text-slate-400 mt-1">
                              Dernière connexion: {new Date(u.lastLoginAt).toLocaleString('fr-FR')}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => updateUser(u.id, { isActive: !u.isActive })}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                            u.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}
                        >
                          {u.isActive ? 'Actif' : 'Inactif'}
                        </button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingUser(u)
                            setUserDraft({
                              name: u.name,
                              email: u.email,
                              password: u.password,
                              role: u.role,
                            })
                          }}
                          className="rounded-xl"
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (u.role === 'owner') {
                              toast.error('Impossible de supprimer un owner')
                              return
                            }
                            deleteUser(u.id)
                            toast.success('Utilisateur supprimé')
                          }}
                          className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="mt-0 outline-none min-h-full h-full">
            <div className={PANEL}>
              <h2 className={SECTION}>
                <ScrollText className="w-4 h-4 text-[#D4AF6A]" />
                Logs
              </h2>
              <p className="text-sm text-slate-500 -mt-2">
                Traçabilité des actions admin (auth, CRUD, changements de statut).
              </p>

              {/* Filters */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={logsQ}
                    onChange={(e) => setLogsQ(e.target.value)}
                    placeholder="Rechercher (email, message, id)…"
                    className="h-11 rounded-xl pl-11"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-600">Action</p>
                    <select
                      value={logsAction}
                      onChange={(e) => setLogsAction(e.target.value as any)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      {[
                        'all',
                        'login_success',
                        'login_failed',
                        'logout',
                        'create',
                        'update',
                        'delete',
                        'toggle',
                        'status_change',
                        'reset',
                      ].map((a) => (
                        <option key={a} value={a}>
                          {a === 'all' ? 'Toutes' : a}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-600">Entité</p>
                    <select
                      value={logsEntity}
                      onChange={(e) => setLogsEntity(e.target.value as any)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      {['all', 'auth', 'product', 'category', 'review', 'order', 'settings'].map((t) => (
                        <option key={t} value={t}>
                          {t === 'all' ? 'Toutes' : t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {(logsQ || logsAction !== 'all' || logsEntity !== 'all') && (
                  <button
                    onClick={() => {
                      setLogsQ('')
                      setLogsAction('all')
                      setLogsEntity('all')
                    }}
                    className="flex items-center gap-1.5 text-xs text-[#D4AF6A] hover:text-[#C8956C] font-semibold transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser filtres
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    exportToCSV(filteredLogs as unknown as Array<Record<string, unknown>>, 'tonomi-logs')
                    toast.success('Export CSV lancé')
                  }}
                  className="rounded-xl"
                >
                  <Download className="w-4 h-4" />
                  Exporter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConfirmClearLogs(true)}
                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Vider
                </Button>
              </div>

              {/* List */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {filteredLogs.length} événement{filteredLogs.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="divide-y divide-slate-50">
                  {filteredLogs.map((e) => (
                    <div key={e.id} className="px-6 py-4 flex items-start gap-4">
                      <div className="shrink-0">
                        <p className="text-xs font-semibold text-slate-500">
                          {new Date(e.at).toLocaleString('fr-FR')}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-1">{e.id}</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900">{e.summary}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          <span className="font-mono">{e.entityType}</span>
                          {e.entityId ? <span className="font-mono"> · {e.entityId}</span> : null}
                          <span className="font-mono"> · {e.action}</span>
                          {e.actorEmail ? <span className="font-mono"> · {e.actorEmail}</span> : null}
                        </p>
                        {e.metadata && (
                          <pre className="mt-2 text-[11px] bg-slate-50 border border-slate-100 rounded-xl p-3 overflow-x-auto">
                            {JSON.stringify(e.metadata, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredLogs.length === 0 && (
                    <div className="px-6 py-10 text-center text-sm text-slate-500">
                      Aucun log pour ces filtres.
                    </div>
                  )}
                </div>
              </div>

              <Dialog open={confirmClearLogs} onOpenChange={(o) => !o && setConfirmClearLogs(false)}>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="text-red-600" style={{ fontFamily: 'var(--font-playfair)' }}>
                      Vider les logs
                    </DialogTitle>
                    <DialogDescription>Cette action est irréversible.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-700">Supprimer tous les logs enregistrés ?</p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setConfirmClearLogs(false)} className="flex-1 rounded-xl">
                        Annuler
                      </Button>
                      <Button
                        onClick={() => {
                          clearLogs()
                          toast.success('Logs vidés')
                          setConfirmClearLogs(false)
                        }}
                        className="flex-1 rounded-xl bg-red-600 hover:bg-red-700"
                      >
                        Vider
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-0 outline-none min-h-full h-full">
            <div className={PANEL}>
              <h2 className={SECTION}>
                <Shield className="w-4 h-4 text-[#D4AF6A]" />
                Compte administrateur
              </h2>
              <div className="space-y-4 max-w-md">
                {[
                  { key: 'currentPwd', label: 'Mot de passe actuel' },
                  { key: 'newPwd', label: 'Nouveau mot de passe' },
                  { key: 'confirmPwd', label: 'Confirmation' },
                ].map(({ key, label }) => (
                  <Field key={key} label={label}>
                    <div className="relative">
                      <Input
                        type={showPwd ? 'text' : 'password'}
                        value={security[key as keyof typeof security]}
                        onChange={(e) =>
                          setSecurity((s) => ({ ...s, [key]: e.target.value }))
                        }
                        className="pr-10 h-10 rounded-xl"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPwd ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </Field>
                ))}
              </div>
              <div className="flex justify-end pt-1 mt-auto">
                <Button onClick={handlePasswordChange} className={SAVE_BTN}>
                  Changer le mot de passe
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system" className="mt-0 outline-none min-h-full h-full">
            <div className="flex flex-col gap-4 min-h-full">
              <div className="rounded-2xl border border-[#D4AF6A]/25 bg-[#D4AF6A]/5 p-6 sm:p-8 space-y-4 flex-1">
              <h2 className={SECTION}>
                <Sparkles className="w-4 h-4 text-[#D4AF6A]" />
                Données de démonstration
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Charge 3 clients et 25 commandes sur 90 jours pour tester le
                dashboard. Les données clients/commandes existantes sont remplacées.
              </p>
              <Button
                onClick={() => {
                  loadDemoData(seedCustomers, seedOrders)
                  toast.success('Données démo chargées — 25 commandes, 3 clientes')
                }}
                className={SAVE_BTN}
              >
                <Sparkles className="w-4 h-4" />
                Charger les données démo
              </Button>
              </div>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8 space-y-3">
                <h2 className="text-sm font-bold text-red-800">Zone sensible</h2>
                <p className="text-sm text-red-700/90">
                  Déconnexion de la session administrateur en cours.
                </p>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="rounded-xl border-red-300 text-red-600 hover:bg-red-100"
                >
                  Se déconnecter
                </Button>
              </div>
            </div>
          </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
