'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Veuillez entrer une adresse email valide')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setIsLoading(false)
        setIsSubmitted(true)
        toast.success('Merci ! Vous êtes inscrit(e) à la newsletter TONOMI.', {
          description: 'Votre code de -10% arrive bientôt !',
        })
        setEmail('')
      } else {
        const data = await res.json()
        setIsLoading(false)
        if (res.status === 409) {
          toast.error('Cet email est déjà inscrit à la newsletter.')
        } else {
          toast.error(data.error || 'Erreur lors de l\'inscription')
        }
      }
    } catch {
      setIsLoading(false)
      toast.error('Erreur de connexion. Veuillez réessayer.')
    }
  }

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-gold/10 via-beige/50 to-gold/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-1.5 mb-4"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-gold tracking-wider uppercase">
              Offre exclusive
            </span>
          </motion.div>

          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark">
            Restez élégante
          </h2>
          <p className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl text-text-mid mt-2 italic">
            –10% sur votre première commande
          </p>
          <p className="font-[family-name:var(--font-dm-sans)] text-text-mid mt-3 max-w-md mx-auto text-sm">
            Recevez nos nouveautés, offres exclusives et conseils mode directement dans votre boîte mail.
          </p>

          {/* Form */}
          {!isSubmitted ? (
            <motion.form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-mid/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="w-full h-12 pl-11 pr-4 rounded-[50px] border border-gold/30 bg-white font-[family-name:var(--font-dm-sans)] text-sm text-text-dark placeholder:text-text-mid/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                  disabled={isLoading}
                />
              </div>
              <motion.button
                type="submit"
                className="btn-gold px-6 py-3 text-sm whitespace-nowrap flex items-center justify-center gap-2"
                disabled={isLoading}
                whileTap={{ scale: 0.97 }}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "S'inscrire"
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              className="mt-8 flex items-center justify-center gap-2 text-gold"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-[family-name:var(--font-dm-sans)] text-sm font-medium">
                Merci ! Vérifiez votre email pour le code promo.
              </span>
            </motion.div>
          )}

          <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-text-mid/60 mt-4">
            En vous inscrivant, vous acceptez de recevoir nos communications. Désinscription possible à tout moment.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
