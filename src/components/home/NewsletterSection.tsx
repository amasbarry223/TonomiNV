'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle, Sparkles, MessageCircle, Bell, X, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [whatsappDismissed, setWhatsappDismissed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Veuillez entrer une adresse email valide')
      return
    }
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    setIsLoading(false)
    setIsSubmitted(true)
    setShowWhatsApp(true)
    toast.success('Inscription confirmée !', {
      description: 'Votre code -10% BIENVENUE10 est actif.',
    })
    setEmail('')
  }

  const handleWhatsAppJoin = () => {
    const msg = encodeURIComponent(
      'Bonjour TONOMI ! 👋 Je souhaite recevoir vos nouveautés et offres exclusives sur WhatsApp. Merci !'
    )
    window.open(`https://wa.me/22375666853?text=${msg}`, '_blank')
    setWhatsappDismissed(true)
    toast.success('Parfait ! On se retrouve sur WhatsApp.', { icon: '💬' })
  }

  return (
    <section className="aurora-warm relative overflow-hidden py-20 sm:py-28">

      {/* Ambient gold orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/4 w-80 h-80 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(212,175,106,0.4) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 right-1/4 w-64 h-64 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(184,115,51,0.5) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-0 w-48 h-48 rounded-full opacity-15 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, rgba(212,175,106,0.3) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF6A]/30 bg-[#D4AF6A]/10 px-4 py-1.5 mb-6 backdrop-blur-sm"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF6A]" />
            <span className="font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-[#D4AF6A] tracking-wider uppercase">
              Offre exclusive
            </span>
          </motion.div>

          {/* Heading */}
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Restez élégante
          </h2>
          <p className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl text-[#D4AF6A] mt-2 italic">
            −10% sur votre première commande
          </p>
          <p className="font-[family-name:var(--font-dm-sans)] text-white/55 mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Nouveautés, offres exclusives et conseils style directement dans votre boîte mail.
          </p>

          {/* Glass form card */}
          <div className="mt-8 glass-dark rounded-2xl p-6 sm:p-8 border border-white/[0.12]">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Votre adresse email"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/15 bg-white/10 text-white placeholder-white/35 font-[family-name:var(--font-dm-sans)] text-sm focus:border-[#D4AF6A]/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF6A]/20 transition-all backdrop-blur-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="btn-gold px-6 py-3 text-sm whitespace-nowrap flex items-center justify-center gap-2 border-0"
                    disabled={isLoading}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>S&apos;inscrire <ArrowRight size={14} /></>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-2 text-[#D4AF6A]">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-white">
                      Inscription confirmée ! Code{' '}
                      <strong className="font-mono text-[#D4AF6A]">BIENVENUE10</strong> actif.
                    </span>
                  </div>

                  <AnimatePresence>
                    {showWhatsApp && !whatsappDismissed && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="relative rounded-xl border border-[#25D366]/25 bg-[#25D366]/10 p-4 text-left"
                      >
                        <button
                          onClick={() => setWhatsappDismissed(true)}
                          className="absolute top-3 right-3 text-white/30 hover:text-white/60 transition-colors"
                          aria-label="Fermer"
                        >
                          <X size={14} />
                        </button>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 flex items-center justify-center shrink-0">
                            <MessageCircle size={18} className="text-[#25D366]" />
                          </div>
                          <div>
                            <p className="font-[family-name:var(--font-dm-sans)] text-sm font-bold text-white">
                              Aussi sur WhatsApp ?
                            </p>
                            <p className="font-[family-name:var(--font-dm-sans)] text-xs text-white/50 mt-0.5 leading-relaxed">
                              Offres flash et nouveautés directement dans vos messages. Réponse en moins de 5 min !
                            </p>
                            <div className="flex gap-2 mt-3">
                              <motion.button
                                onClick={handleWhatsAppJoin}
                                className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bc5b] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors font-[family-name:var(--font-dm-sans)]"
                                whileTap={{ scale: 0.97 }}
                              >
                                <MessageCircle size={13} />
                                Rejoindre
                              </motion.button>
                              <button
                                onClick={() => setWhatsappDismissed(true)}
                                className="text-xs text-white/40 hover:text-white/70 px-3 py-2 font-[family-name:var(--font-dm-sans)] transition-colors"
                              >
                                Plus tard
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Social proof */}
          {!isSubmitted && (
            <motion.div
              className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 text-white/40">
                <Bell className="w-3.5 h-3.5" />
                <span className="font-[family-name:var(--font-dm-sans)] text-xs">500+ abonnées</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
              <div className="flex items-center gap-2 text-white/40">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <button
                  onClick={handleWhatsAppJoin}
                  className="font-[family-name:var(--font-dm-sans)] text-xs hover:text-[#25D366] transition-colors cursor-pointer"
                >
                  Rejoindre notre groupe WhatsApp →
                </button>
              </div>
            </motion.div>
          )}

          <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-white/25 mt-4">
            Désinscription à tout moment. Pas de spam.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
