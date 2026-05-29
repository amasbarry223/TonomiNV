'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Mail, MailOpen, Trash2, Eye, Clock, User } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function AdminContacts() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [markingAllRead, setMarkingAllRead] = useState(false)

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/contacts')
      if (!res.ok) throw new Error('Erreur lors du chargement')
      const data = await res.json()
      setMessages(data)
    } catch {
      toast.error('Erreur lors du chargement des messages')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Filtered messages based on active tab
  const filteredMessages = messages.filter((msg) => {
    if (activeTab === 'unread') return !msg.isRead
    if (activeTab === 'read') return msg.isRead
    return true
  })

  const unreadCount = messages.filter((m) => !m.isRead).length
  const readCount = messages.filter((m) => m.isRead).length

  // Mark a single message as read
  const markAsRead = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/contacts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true }),
        })
        if (!res.ok) throw new Error('Erreur')
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
        )
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, isRead: true } : prev))
        }
        toast.success('Message marqué comme lu')
      } catch {
        toast.error('Erreur lors de la mise à jour')
      }
    },
    [selectedMessage]
  )

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    const unreadIds = messages.filter((m) => !m.isRead).map((m) => m.id)
    if (unreadIds.length === 0) {
      toast.info('Tous les messages sont déjà lus')
      return
    }

    try {
      setMarkingAllRead(true)
      await Promise.all(
        unreadIds.map((id) =>
          fetch(`/api/contacts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isRead: true }),
          })
        )
      )
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })))
      toast.success(`${unreadIds.length} message${unreadIds.length > 1 ? 's' : ''} marqué${unreadIds.length > 1 ? 's' : ''} comme lu${unreadIds.length > 1 ? 's' : ''}`)
    } catch {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setMarkingAllRead(false)
    }
  }, [messages])

  // Open detail dialog and auto-mark as read
  const openDetail = useCallback(
    (msg: ContactMessage) => {
      setSelectedMessage(msg)
      setDetailOpen(true)
      if (!msg.isRead) {
        markAsRead(msg.id)
      }
    },
    [markAsRead]
  )

  // Delete handlers
  const openDeleteDialog = useCallback((id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }, [])

  const handleDelete = useCallback(async () => {
    if (!deletingId) return

    try {
      setDeleting(true)
      const res = await fetch(`/api/contacts/${deletingId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Erreur')

      toast.success('Message supprimé avec succès')
      setDeleteDialogOpen(false)
      setDeletingId(null)
      if (selectedMessage?.id === deletingId) {
        setDetailOpen(false)
        setSelectedMessage(null)
      }
      fetchMessages()
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }, [deletingId, selectedMessage, fetchMessages])

  const getMessageToDelete = () => {
    if (!deletingId) return null
    return messages.find((m) => m.id === deletingId)
  }

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy à HH:mm', { locale: fr })
    } catch {
      return dateStr
    }
  }

  const formatShortDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', { locale: fr })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center">
            <Mail size={20} className="text-caramel" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-text-dark">
              Messages
            </h1>
            <p className="text-sm text-text-mid">
              {messages.length} message{messages.length !== 1 ? 's' : ''} au total
            </p>
          </div>
        </div>

        <Button
          onClick={markAllAsRead}
          disabled={markingAllRead || unreadCount === 0}
          className="btn-gold gap-2 px-6"
        >
          {markingAllRead ? (
            <span className="w-4 h-4 border-2 border-warm-white/30 border-t-warm-white rounded-full animate-spin" />
          ) : (
            <MailOpen size={16} />
          )}
          Marquer tout comme lu
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-beige/50 border border-gold/20 p-1 rounded-xl">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-gold data-[state=active]:text-warm-white rounded-lg px-4 text-text-mid"
          >
            Tous
            <Badge
              variant="outline"
              className="ml-2 h-5 min-w-[20px] flex items-center justify-center text-[10px] border-gold/30 text-text-mid bg-warm-white/80 data-[state=active]>&:bg-gold/30 data-[state=active]>&:text-warm-white data-[state=active]>&:border-warm-white/30"
            >
              {messages.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="data-[state=active]:bg-gold data-[state=active]:text-warm-white rounded-lg px-4 text-text-mid"
          >
            Non lus
            {unreadCount > 0 && (
              <Badge className="ml-2 h-5 min-w-[20px] flex items-center justify-center text-[10px] bg-copper text-warm-white border-0">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="read"
            className="data-[state=active]:bg-gold data-[state=active]:text-warm-white rounded-lg px-4 text-text-mid"
          >
            Lus
            <Badge
              variant="outline"
              className="ml-2 h-5 min-w-[20px] flex items-center justify-center text-[10px] border-gold/30 text-text-mid bg-warm-white/80"
            >
              {readCount}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="glass-card overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-2.5 h-2.5 rounded-full mt-2 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <div className="flex items-center justify-between pt-2">
                      <Skeleton className="h-3 w-28" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMessages.length === 0 && (
        <Card className="glass-card p-12 text-center">
          <Mail size={48} className="mx-auto text-text-mid/40 mb-4" />
          <h3 className="font-serif text-lg text-text-dark mb-2">
            {activeTab === 'unread'
              ? 'Aucun message non lu'
              : activeTab === 'read'
                ? 'Aucun message lu'
                : 'Aucun message'}
          </h3>
          <p className="text-sm text-text-mid">
            {activeTab === 'all'
              ? 'Les nouveaux messages de contact apparaîtront ici.'
              : 'Changez de filtre pour voir d\'autres messages.'}
          </p>
        </Card>
      )}

      {/* Messages List */}
      {!loading && filteredMessages.length > 0 && (
        <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {filteredMessages.map((msg) => (
            <Card
              key={msg.id}
              className={`glass-card overflow-hidden warm-shadow transition-all duration-300 hover:warm-shadow-lg ${
                !msg.isRead ? 'border-gold/40 bg-warm-white' : 'bg-warm-white/60'
              }`}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex gap-3 sm:gap-4">
                  {/* Unread indicator */}
                  <div className="shrink-0 pt-1.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        !msg.isRead ? 'bg-gold' : 'bg-transparent'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Top row: name, email, badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-text-mid shrink-0" />
                          <span
                            className={`text-sm ${
                              !msg.isRead
                                ? 'font-bold text-text-dark'
                                : 'font-medium text-text-dark'
                            }`}
                          >
                            {msg.name}
                          </span>
                        </div>
                        <span className="text-text-mid text-xs truncate max-w-[200px]">
                          {msg.email}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 w-fit text-[10px] ${
                          !msg.isRead
                            ? 'bg-gold/15 text-caramel border-gold/30'
                            : 'bg-beige/50 text-text-mid border-gold/20'
                        }`}
                      >
                        {!msg.isRead ? (
                          <span className="flex items-center gap-1">
                            <Mail size={10} /> Non lu
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <MailOpen size={10} /> Lu
                          </span>
                        )}
                      </Badge>
                    </div>

                    {/* Subject */}
                    <p
                      className={`text-sm leading-snug ${
                        !msg.isRead
                          ? 'font-semibold text-text-dark'
                          : 'text-text-dark'
                      }`}
                    >
                      {msg.subject}
                    </p>

                    {/* Message preview */}
                    <p className="text-xs text-text-mid line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    {/* Bottom row: date + actions */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-text-mid">
                        <Clock size={12} className="shrink-0" />
                        <span className="text-xs">
                          {formatShortDate(msg.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!msg.isRead && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(msg.id)}
                            className="h-8 gap-1.5 border-gold/30 text-text-mid hover:bg-gold/10 hover:text-caramel hover:border-gold/50 text-xs px-3"
                          >
                            <MailOpen size={13} />
                            <span className="hidden sm:inline">Marquer lu</span>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetail(msg)}
                          className="h-8 gap-1.5 border-gold/30 text-text-mid hover:bg-gold/10 hover:text-caramel hover:border-gold/50 text-xs px-3"
                        >
                          <Eye size={13} />
                          <span className="hidden sm:inline">Voir</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(msg.id)}
                          className="h-8 w-8 p-0 border-gold/30 text-text-mid hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Message Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="bg-warm-white border-gold/20 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-text-dark flex items-center gap-2">
              <Mail size={20} className="text-caramel" />
              Détail du message
            </DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4 py-2">
              {/* Sender info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                    <User size={16} className="text-caramel" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-text-dark text-sm">
                      {selectedMessage.name}
                    </p>
                    <p className="text-text-mid text-xs truncate">
                      {selectedMessage.email}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 ml-auto text-[10px] ${
                      !selectedMessage.isRead
                        ? 'bg-gold/15 text-caramel border-gold/30'
                        : 'bg-beige/50 text-text-mid border-gold/20'
                    }`}
                  >
                    {!selectedMessage.isRead ? 'Non lu' : 'Lu'}
                  </Badge>
                </div>
              </div>

              <Separator className="bg-gold/15" />

              {/* Subject */}
              <div>
                <p className="text-xs font-medium text-text-mid uppercase tracking-wider mb-1">
                  Objet
                </p>
                <p className="font-serif text-lg font-semibold text-text-dark leading-snug">
                  {selectedMessage.subject}
                </p>
              </div>

              <Separator className="bg-gold/15" />

              {/* Full message */}
              <div>
                <p className="text-xs font-medium text-text-mid uppercase tracking-wider mb-1">
                  Message
                </p>
                <div className="bg-cream/50 border border-gold/15 rounded-xl p-4">
                  <p className="text-sm text-text-dark leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <Separator className="bg-gold/15" />

              {/* Date */}
              <div className="flex items-center gap-1.5 text-text-mid">
                <Clock size={14} />
                <span className="text-xs">
                  Reçu le {formatDate(selectedMessage.createdAt)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                {!selectedMessage.isRead && (
                  <Button
                    onClick={() => markAsRead(selectedMessage.id)}
                    className="btn-gold gap-2"
                  >
                    <MailOpen size={14} />
                    Marquer comme lu
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    openDeleteDialog(selectedMessage.id)
                    setDetailOpen(false)
                  }}
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                  <Trash2 size={14} />
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-warm-white border-gold/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-text-dark">
              Confirmer la suppression
            </DialogTitle>
          </DialogHeader>

          <p className="text-text-mid py-4">
            Êtes-vous sûr de vouloir supprimer le message de{' '}
            <span className="font-semibold text-text-dark">
              {getMessageToDelete()?.name}
            </span>
            {' '}? Cette action est irréversible.
          </p>

          <div className="flex justify-end gap-2">
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
