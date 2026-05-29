'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Settings,
  Store,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Coins,
  Save,
} from 'lucide-react'
import { toast } from 'sonner'

interface SettingsMap {
  [key: string]: string
}

const SETTINGS_CONFIG = {
  store_name: { label: 'Nom de la boutique', icon: Store, group: 'info' },
  store_email: { label: 'Email de contact', icon: Mail, group: 'info' },
  store_phone: { label: 'Téléphone', icon: Phone, group: 'info' },
  store_address: { label: 'Adresse', icon: MapPin, group: 'info' },
  whatsapp_number: { label: 'Numéro WhatsApp', icon: MessageCircle, group: 'social' },
  instagram_url: { label: 'URL Instagram', icon: Instagram, group: 'social' },
  currency: { label: 'Devise', icon: Coins, group: 'currency' },
} as const

type SettingKey = keyof typeof SETTINGS_CONFIG

const DEFAULT_VALUES: SettingsMap = {
  store_name: 'TONOMI ACCESSOIRES',
  store_email: 'contact@tonomi.com',
  store_phone: '+225 00 00 00 00',
  store_address: 'Abidjan, Côte d\'Ivoire',
  whatsapp_number: '+225 00 00 00 00',
  instagram_url: 'https://instagram.com/tonomi.accessoires',
  currency: 'FCFA',
}

const GROUPS = [
  {
    key: 'info',
    title: 'Informations boutique',
    description: 'Les informations de base de votre boutique',
  },
  {
    key: 'social',
    title: 'Réseaux sociaux',
    description: 'Vos liens vers les réseaux sociaux',
  },
  {
    key: 'currency',
    title: 'Devise',
    description: 'La devise utilisée pour les prix',
  },
] as const

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsMap>({})
  const [form, setForm] = useState<SettingsMap>(DEFAULT_VALUES)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/settings')
      if (!res.ok) throw new Error('Erreur lors du chargement')
      const data: SettingsMap = await res.json()
      setSettings(data)
      // Merge with defaults so form always has all fields
      setForm({ ...DEFAULT_VALUES, ...data })
    } catch {
      toast.error('Erreur lors du chargement des paramètres')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleInputChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = useCallback(async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde')
      }

      const updatedSettings: SettingsMap = await res.json()
      setSettings(updatedSettings)
      setForm({ ...DEFAULT_VALUES, ...updatedSettings })
      toast.success('Paramètres enregistrés avec succès')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
      )
    } finally {
      setSaving(false)
    }
  }, [form])

  const getSettingsForGroup = (groupKey: string) => {
    return Object.entries(SETTINGS_CONFIG)
      .filter(([, config]) => config.group === groupKey)
      .map(([key, config]) => ({
        key,
        label: config.label,
        Icon: config.icon,
      }))
  }

  const hasChanges = Object.keys(form).some(
    (key) => form[key] !== (settings[key] ?? DEFAULT_VALUES[key])
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
            <Settings size={20} className="text-caramel" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-text-dark">
              Paramètres du site
            </h1>
            <p className="text-sm text-text-mid">
              Gérez les paramètres de votre boutique
            </p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="btn-gold gap-2 px-6"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-warm-white/30 border-t-warm-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Enregistrer
        </Button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, gi) => (
            <Card key={gi} className="glass-card p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="space-y-4 pt-2">
                  {Array.from({ length: gi === 0 ? 4 : gi === 1 ? 2 : 1 }).map((_, fi) => (
                    <div key={fi} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Settings Form */}
      {!loading && (
        <div className="space-y-6">
          {GROUPS.map((group, gi) => (
            <Card key={group.key} className="glass-card warm-shadow">
              <CardContent className="p-6">
                {/* Group Header */}
                <div className="mb-6">
                  <h2 className="font-serif text-lg font-semibold text-text-dark">
                    {group.title}
                  </h2>
                  <p className="text-sm text-text-mid mt-1">
                    {group.description}
                  </p>
                </div>

                {/* Settings Fields */}
                <div className="space-y-5">
                  {getSettingsForGroup(group.key).map(({ key, label, Icon }, fi) => (
                    <div key={key}>
                      {fi > 0 && <Separator className="bg-gold/10 mb-5" />}
                      <div className="space-y-2">
                        <Label
                          htmlFor={key}
                          className="text-text-dark text-sm font-medium flex items-center gap-2"
                        >
                          <Icon size={15} className="text-caramel" />
                          {label}
                        </Label>
                        <Input
                          id={key}
                          value={form[key] ?? ''}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          placeholder={DEFAULT_VALUES[key] || ''}
                          className="border-gold/20 focus:border-gold focus:ring-gold/20 bg-cream/30"
                        />
                        {settings[key] && settings[key] !== form[key] && (
                          <p className="text-[11px] text-caramel flex items-center gap-1">
                            • Modifié — valeur actuelle : <span className="font-medium">{settings[key]}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Save Button (bottom) */}
          <Card className="glass-card p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-text-mid">
                {hasChanges
                  ? 'Vous avez des modifications non enregistrées.'
                  : 'Tous les paramètres sont à jour.'}
              </p>
              <Button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="btn-gold gap-2 px-8 w-full sm:w-auto"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-warm-white/30 border-t-warm-white rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Enregistrer les paramètres
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
