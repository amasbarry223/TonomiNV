'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Send,
  Loader2,
  MessageCircle,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { toast } from 'sonner'

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.email('Veuillez entrer un email valide'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Veuillez sélectionner un objet'),
  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(1000, 'Le message ne doit pas dépasser 1000 caractères'),
})

type ContactFormData = z.infer<typeof contactSchema>

// ─── Contact Info Data ────────────────────────────────────────────────────────
const contactInfos = [
  {
    icon: <Mail className="w-6 h-6 text-gold" />,
    title: 'Email',
    value: 'contact@tonomi.ml',
    href: 'mailto:contact@tonomi.ml',
    description: 'Réponse sous 24h',
  },
  {
    icon: <Phone className="w-6 h-6 text-gold" />,
    title: 'Téléphone',
    value: '+223 XX XX XX XX',
    href: 'tel:+223XXXXXXXX',
    description: 'Lun-Sam, 9h-18h',
  },
  {
    icon: <MapPin className="w-6 h-6 text-gold" />,
    title: 'Localisation',
    value: 'Bamako, Mali',
    href: null,
    description: 'Afrique de l\'Ouest',
  },
  {
    icon: <Instagram className="w-6 h-6 text-gold" />,
    title: 'Instagram',
    value: '@tonomi.accessoires',
    href: 'https://instagram.com/tonomi.accessoires',
    description: 'Suivez-nous',
  },
]

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const faqCategories = [
  {
    category: 'Commandes',
    items: [
      {
        question: 'Comment passer une commande ?',
        answer:
          'Parcourez notre catalogue, ajoutez les articles de votre choix au panier, puis procédez au paiement. Vous pouvez aussi nous contacter via WhatsApp pour passer commande directement.',
      },
      {
        question: 'Puis-je modifier ma commande après l\'avoir passée ?',
        answer:
          'Vous pouvez modifier votre commande dans les 2 heures suivant la confirmation en nous contactant par email ou WhatsApp. Après ce délai, la commande est mise en préparation.',
      },
    ],
  },
  {
    category: 'Livraison',
    items: [
      {
        question: 'Quels sont les délais de livraison ?',
        answer:
          'Bamako : 1-2 jours ouvrés. Autres villes du Mali : 3-5 jours ouvrés. Afrique de l\'Ouest : 5-10 jours ouvrés. International : 10-20 jours ouvrés.',
      },
      {
        question: 'Combien coûte la livraison ?',
        answer:
          'La livraison à Bamako est offerte pour les commandes de plus de 20 000 FCFA. Pour les autres destinations, les frais sont calculés en fonction du poids et de la localisation.',
      },
    ],
  },
  {
    category: 'Retours',
    items: [
      {
        question: 'Quelle est votre politique de retour ?',
        answer:
          'Vous disposez de 7 jours après réception pour retourner un article en état neuf. Les articles personnalisés ou portés ne sont pas éligibles au retour. Les frais de retour sont à la charge du client.',
      },
      {
        question: 'Comment demander un échange ?',
        answer:
          'Contactez-nous via email ou WhatsApp dans les 7 jours suivant la réception avec votre numéro de commande. Nous vous guiderons dans la procédure d\'échange.',
      },
    ],
  },
  {
    category: 'Paiement',
    items: [
      {
        question: 'Quels moyens de paiement acceptez-vous ?',
        answer:
          'Nous acceptons Orange Money, MTN Mobile Money, Wave, et le paiement à la livraison à Bamako. Le paiement par carte bancaire sera bientôt disponible.',
      },
      {
        question: 'Le paiement est-il sécurisé ?',
        answer:
          'Oui, toutes les transactions sont sécurisées. Nous utilisons des systèmes de paiement certifiés et ne conservons aucune donnée bancaire sur nos serveurs.',
      },
    ],
  },
]

// ─── Contact Form Component ───────────────────────────────────────────────────
function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [charCount, setCharCount] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  })

  const messageRegister = register('message')

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length)
    messageRegister.onChange(e)
  }

  const onSubmit = (data: ContactFormData) => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setCharCount(0)
      toast.success('Message envoyé avec succès ! Nous vous répondrons sous 24h.')
      reset()
    }, 400)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="font-[family-name:var(--font-dm-sans)] text-sm text-text-dark font-medium">
          Nom complet <span className="text-caramel">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Votre nom"
          className="bg-cream/50 border-gold/20 focus:border-gold focus:ring-gold/20 h-11 font-[family-name:var(--font-dm-sans)] rounded-xl"
          {...register('name')}
        />
        {errors.name && (
          <p className="font-[family-name:var(--font-dm-sans)] text-xs text-red-500 mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="font-[family-name:var(--font-dm-sans)] text-sm text-text-dark font-medium">
          Email <span className="text-caramel">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          className="bg-cream/50 border-gold/20 focus:border-gold focus:ring-gold/20 h-11 font-[family-name:var(--font-dm-sans)] rounded-xl"
          {...register('email')}
        />
        {errors.email && (
          <p className="font-[family-name:var(--font-dm-sans)] text-xs text-red-500 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone" className="font-[family-name:var(--font-dm-sans)] text-sm text-text-dark font-medium">
          Téléphone
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+223 XX XX XX XX"
          className="bg-cream/50 border-gold/20 focus:border-gold focus:ring-gold/20 h-11 font-[family-name:var(--font-dm-sans)] rounded-xl"
          {...register('phone')}
        />
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <Label className="font-[family-name:var(--font-dm-sans)] text-sm text-text-dark font-medium">
          Objet <span className="text-caramel">*</span>
        </Label>
        <Select onValueChange={(val) => setValue('subject', val, { shouldValidate: true })}>
          <SelectTrigger className="bg-cream/50 border-gold/20 focus:border-gold h-11 font-[family-name:var(--font-dm-sans)] rounded-xl w-full">
            <SelectValue placeholder="Sélectionnez un objet" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="commande" className="font-[family-name:var(--font-dm-sans)]">
              Commande
            </SelectItem>
            <SelectItem value="livraison" className="font-[family-name:var(--font-dm-sans)]">
              Livraison
            </SelectItem>
            <SelectItem value="retour" className="font-[family-name:var(--font-dm-sans)]">
              Retour
            </SelectItem>
            <SelectItem value="autre" className="font-[family-name:var(--font-dm-sans)]">
              Autre
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.subject && (
          <p className="font-[family-name:var(--font-dm-sans)] text-xs text-red-500 mt-1">
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="message" className="font-[family-name:var(--font-dm-sans)] text-sm text-text-dark font-medium">
          Message <span className="text-caramel">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Décrivez votre demande..."
          rows={5}
          maxLength={1000}
          className="bg-cream/50 border-gold/20 focus:border-gold focus:ring-gold/20 font-[family-name:var(--font-dm-sans)] rounded-xl resize-none"
          {...messageRegister}
          onChange={handleMessageChange}
        />
        <div className="flex justify-between items-center">
          {errors.message && (
            <p className="font-[family-name:var(--font-dm-sans)] text-xs text-red-500">
              {errors.message.message}
            </p>
          )}
          <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid ml-auto">
            {charCount}/1000
          </p>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full btn-gold h-12 text-sm"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" /> Envoyer le message
          </>
        )}
      </Button>
    </form>
  )
}

// ─── Main Contact Page ────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <section className="relative pt-24 pb-10 sm:pt-32 sm:pb-14 overflow-hidden">
        <div className="absolute inset-0 particles-bg" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="font-[family-name:var(--font-dm-sans)] text-sm tracking-[0.3em] uppercase text-gold font-semibold">
              Parlons ensemble
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-text-dark mt-3">
              Contactez-<span className="text-gold-gradient">nous</span>
            </h1>
            <p className="font-[family-name:var(--font-dm-sans)] text-text-mid mt-4 max-w-md mx-auto">
              Une question, une suggestion ou juste envie de discuter ? Nous sommes à votre écoute.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Form + Infos ── */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form */}
            <motion.div
              className="lg:col-span-3 glass-card p-6 sm:p-8 warm-shadow"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-text-dark mb-6">
                Envoyez-nous un message
              </h2>
              <ContactForm />
            </motion.div>

            {/* Contact Infos */}
            <motion.div
              className="lg:col-span-2 space-y-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-text-dark mb-6">
                Nos Coordonnées
              </h2>

              {contactInfos.map((info, i) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  {info.href ? (
                    <a
                      href={info.href}
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="glass-card p-4 flex items-start gap-4 warm-shadow block hover:scale-[1.02] hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-gold/10 flex items-center justify-center">
                        {info.icon}
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid uppercase tracking-wider">
                          {info.title}
                        </p>
                        <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark mt-0.5">
                          {info.value}
                        </p>
                        <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid/70 mt-0.5">
                          {info.description}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="glass-card p-4 flex items-start gap-4 warm-shadow">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-gold/10 flex items-center justify-center">
                        {info.icon}
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid uppercase tracking-wider">
                          {info.title}
                        </p>
                        <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark mt-0.5">
                          {info.value}
                        </p>
                        <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid/70 mt-0.5">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* WhatsApp CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <a
                  href="https://wa.me/223XXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-4 flex items-center gap-4 bg-green-50/60 border-green-200/40 warm-shadow hover:scale-[1.02] hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-green-800">
                      WhatsApp Business
                    </p>
                    <p className="font-[family-name:var(--font-dm-sans)] text-xs text-green-600/80 mt-0.5">
                      Écrivez-nous directement
                    </p>
                  </div>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-12 sm:py-16 bg-warm-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-[family-name:var(--font-dm-sans)] text-sm tracking-[0.3em] uppercase text-gold font-semibold">
              Besoin d&apos;aide ?
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark mt-3">
              Questions Fréquentes
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqCategories.map((cat, catIndex) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: catIndex * 0.1 }}
              >
                <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-gold mb-3 flex items-center gap-2">
                  <ChevronDown className="w-4 h-4" />
                  {cat.category}
                </h3>
                <Accordion type="single" collapsible className="glass-card warm-shadow px-4">
                  {cat.items.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`${cat.category}-${i}`}
                      className="border-gold/10"
                    >
                      <AccordionTrigger className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-text-dark hover:text-gold hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Map Placeholder ── */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-[family-name:var(--font-dm-sans)] text-sm tracking-[0.3em] uppercase text-gold font-semibold">
              Notre adresse
            </span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark mt-3">
              Nous Trouver
            </h2>
          </motion.div>

          <motion.div
            className="relative rounded-3xl overflow-hidden warm-shadow-lg aspect-[21/9] bg-gradient-to-br from-beige via-gold/5 to-caramel/10"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative map-like pattern */}
            <div className="absolute inset-0 opacity-[0.04]">
              <svg className="w-full h-full" viewBox="0 0 800 400" fill="none">
                <line x1="0" y1="100" x2="800" y2="100" stroke="#D4AF6A" strokeWidth="1" />
                <line x1="0" y1="200" x2="800" y2="200" stroke="#D4AF6A" strokeWidth="1" />
                <line x1="0" y1="300" x2="800" y2="300" stroke="#D4AF6A" strokeWidth="1" />
                <line x1="200" y1="0" x2="200" y2="400" stroke="#D4AF6A" strokeWidth="1" />
                <line x1="400" y1="0" x2="400" y2="400" stroke="#D4AF6A" strokeWidth="1" />
                <line x1="600" y1="0" x2="600" y2="400" stroke="#D4AF6A" strokeWidth="1" />
                <circle cx="400" cy="200" r="40" stroke="#D4AF6A" strokeWidth="1" />
                <circle cx="400" cy="200" r="80" stroke="#D4AF6A" strokeWidth="0.5" />
                <circle cx="400" cy="200" r="120" stroke="#D4AF6A" strokeWidth="0.3" />
              </svg>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gold/20 flex items-center justify-center mb-3">
                  <MapPin className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-text-dark">
                  Bamako, Mali
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-1">
                  Afrique de l&apos;Ouest
                </p>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gold/5 rounded-full" />
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-caramel/5 rounded-full" />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
