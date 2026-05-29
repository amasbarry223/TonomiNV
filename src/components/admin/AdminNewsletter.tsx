'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Users, Search, Copy, Trash2, Mail, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Subscriber {
  id: string
  email: string
  createdAt: string
}

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/newsletter')
      if (!res.ok) throw new Error('Erreur lors du chargement')
      const data = await res.json()
      setSubscribers(data)
    } catch {
      toast.error('Erreur lors du chargement des abonnés')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  const filteredSubscribers = useMemo(() => {
    if (!search.trim()) return subscribers
    const q = search.toLowerCase().trim()
    return subscribers.filter((s) => s.email.toLowerCase().includes(q))
  }, [subscribers, search])

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  const openDeleteDialog = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = useCallback(async () => {
    if (!deletingId) return

    try {
      setDeleting(true)
      const res = await fetch(`/api/newsletter/${deletingId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Erreur lors de la suppression')
      }

      toast.success('Abonné supprimé avec succès')
      setDeleteDialogOpen(false)
      setDeletingId(null)
      fetchSubscribers()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erreur lors de la suppression'
      )
    } finally {
      setDeleting(false)
    }
  }, [deletingId, fetchSubscribers])

  const getSubscriberToDelete = () => {
    if (!deletingId) return null
    return subscribers.find((s) => s.id === deletingId)
  }

  const handleExportCSV = useCallback(async () => {
    if (subscribers.length === 0) {
      toast.error('Aucun abonné à exporter')
      return
    }

    const emails = subscribers.map((s) => s.email).join('\n')

    try {
      await navigator.clipboard.writeText(emails)
      setCopied(true)
      toast.success(`${subscribers.length} email(s) copié(s) dans le presse-papiers`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: create a textarea to copy
      const textarea = document.createElement('textarea')
      textarea.value = emails
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      toast.success(`${subscribers.length} email(s) copié(s) dans le presse-papiers`)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [subscribers])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
            <Users size={20} className="text-caramel" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-text-dark">
              Abonnés Newsletter
            </h1>
            <p className="text-sm text-text-mid">
              {subscribers.length} abonné{subscribers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <Button
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="btn-gold gap-2 px-6"
        >
          {copied ? (
            <>
              <CheckCircle2 size={16} />
              Copié !
            </>
          ) : (
            <>
              <Copy size={16} />
              Exporter les emails
            </>
          )}
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="glass-card p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-mid/60" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par email..."
            className="pl-10 border-gold/20 focus:border-gold focus:ring-gold/20 bg-cream/30"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-mid/60 hover:text-text-mid transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        {search && (
          <p className="text-xs text-text-mid mt-2">
            {filteredSubscribers.length} résultat{filteredSubscribers.length !== 1 ? 's' : ''} pour &laquo; {search} &raquo;
          </p>
        )}
      </Card>

      {/* Loading Skeleton */}
      {loading && (
        <Card className="glass-card overflow-hidden">
          <div className="p-4">
            <div className="space-y-4">
              {/* Header skeleton */}
              <div className="flex gap-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              {/* Row skeletons */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!loading && subscribers.length === 0 && (
        <Card className="glass-card p-12 text-center">
          <Mail size={48} className="mx-auto text-text-mid/40 mb-4" />
          <h3 className="font-serif text-lg text-text-dark mb-2">
            Aucun abonné
          </h3>
          <p className="text-sm text-text-mid mb-6">
            Les visiteurs qui s&apos;inscrivent à la newsletter apparaîtront ici.
          </p>
        </Card>
      )}

      {/* No results after search */}
      {!loading && subscribers.length > 0 && filteredSubscribers.length === 0 && (
        <Card className="glass-card p-12 text-center">
          <Search size={48} className="mx-auto text-text-mid/40 mb-4" />
          <h3 className="font-serif text-lg text-text-dark mb-2">
            Aucun résultat
          </h3>
          <p className="text-sm text-text-mid">
            Aucun abonné ne correspond à votre recherche.
          </p>
        </Card>
      )}

      {/* Subscribers Table */}
      {!loading && filteredSubscribers.length > 0 && (
        <Card className="glass-card overflow-hidden warm-shadow">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gold/15 hover:bg-transparent">
                  <TableHead className="text-text-mid font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="text-text-mid font-semibold">
                    Date d&apos;inscription
                  </TableHead>
                  <TableHead className="text-text-mid font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.map((subscriber) => (
                  <TableRow
                    key={subscriber.id}
                    className="border-b border-gold/10 hover:bg-cream/40 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                          <Mail size={14} className="text-caramel" />
                        </div>
                        <span className="text-text-dark text-sm font-medium">
                          {subscriber.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-text-mid text-sm">
                        {formatDate(subscriber.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(subscriber.id)}
                        className="gap-1.5 border-gold/30 text-text-mid hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      >
                        <Trash2 size={14} />
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gold/10">
            {filteredSubscribers.map((subscriber) => (
              <div key={subscriber.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={15} className="text-caramel" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-dark text-sm font-medium truncate">
                      {subscriber.email}
                    </p>
                    <p className="text-text-mid text-xs">
                      {formatDate(subscriber.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(subscriber.id)}
                    className="gap-1 border-gold/30 text-text-mid hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer with count */}
          <Separator className="bg-gold/15" />
          <div className="p-3 flex items-center justify-between">
            <Badge variant="outline" className="border-gold/20 text-text-mid text-xs">
              {filteredSubscribers.length} abonné{filteredSubscribers.length !== 1 ? 's' : ''}
              {search && ' (filtrés)'}
            </Badge>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-warm-white border-gold/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-text-dark">
              Confirmer la suppression
            </DialogTitle>
          </DialogHeader>

          <p className="text-text-mid py-4">
            Êtes-vous sûr de vouloir supprimer l&apos;abonné{' '}
            <span className="font-semibold text-text-dark">
              {getSubscriberToDelete()?.email}
            </span>
            {' '}de la newsletter ? Cette action est irréversible.
          </p>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gold/30 text-text-mid hover:bg-beige/60"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              variant="destructive"
              className="gap-2"
            >
              {deleting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
