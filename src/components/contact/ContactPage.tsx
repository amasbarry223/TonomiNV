'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Clock,
  Navigation,
  ExternalLink,
  Globe,
  HeadphonesIcon,
  ShoppingBag,
  Truck,
  RotateCcw,
  CreditCard,
  Plus,
  Minus,
  HelpCircle,
} from 'lucide-react'
import { ProductImage } from '@/components/ui/product-image'
import { getProductImagePaths } from '@/data/product-image-map'

const CONTACT_HEADER_IMAGE = getProductImagePaths('prod-005', 'bijoux', 1)[0]
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
    value: '+223 75 66 68 53',
    href: 'tel:+22375666853',
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
    icon: ShoppingBag,
    color: 'text-gold bg-gold/10',
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
    icon: Truck,
    color: 'text-caramel bg-caramel/10',
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
    icon: RotateCcw,
    color: 'text-copper bg-copper/10',
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
    icon: CreditCard,
    color: 'text-blush bg-blush/10',
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

// ─── FAQ Section ─────────────────────────────────────────────────────────────
function FAQSection() {
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].category)
  const [openItem, setOpenItem] = useState<string | null>(null)

  const current = faqCategories.find((c) => c.category === activeCategory)!
  const totalQuestions = faqCategories.reduce((acc, c) => acc + c.items.length, 0)

  return (
    <section className="py-16 sm:py-24 bg-warm-white overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-[family-name:var(--font-dm-sans)] text-sm tracking-[0.3em] uppercase text-gold font-semibold">
            Besoin d&apos;aide ?
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark mt-3">
            Questions <span className="text-gold-gradient">Fréquentes</span>
          </h2>
          <p className="font-[family-name:var(--font-dm-sans)] text-text-mid mt-3 max-w-lg mx-auto">
            {totalQuestions} réponses à vos questions les plus courantes
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/40" />
          </div>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {faqCategories.map((cat) => {
            const Icon = cat.icon
            const isActive = cat.category === activeCategory
            return (
              <button
                key={cat.category}
                onClick={() => { setActiveCategory(cat.category); setOpenItem(null) }}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-[family-name:var(--font-dm-sans)] text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gold text-white shadow-lg shadow-gold/25'
                    : 'bg-white border border-gold/20 text-text-mid hover:border-gold/50 hover:text-gold'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.category}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gold/10 text-gold'
                }`}>
                  {cat.items.length}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Questions */}
        <motion.div
          key={activeCategory}
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {current.items.map((item, i) => {
            const key = `${activeCategory}-${i}`
            const isOpen = openItem === key
            const Icon = current.icon

            return (
              <motion.div
                key={key}
                className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? 'border-gold/40 bg-white shadow-md shadow-gold/8'
                    : 'border-gold/10 bg-white hover:border-gold/30'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
              >
                <button
                  className="w-full flex items-center gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenItem(isOpen ? null : key)}
                >
                  {/* Number */}
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-[family-name:var(--font-dm-sans)] transition-colors ${
                    isOpen ? 'bg-gold text-white' : 'bg-gold/10 text-gold'
                  }`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Question */}
                  <span className={`flex-1 font-[family-name:var(--font-dm-sans)] text-sm font-semibold transition-colors ${
                    isOpen ? 'text-gold' : 'text-text-dark'
                  }`}>
                    {item.question}
                  </span>

                  {/* Toggle icon */}
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isOpen ? 'bg-gold/10 text-gold rotate-0' : 'bg-cream text-text-mid'
                  }`}>
                    {isOpen
                      ? <Minus className="w-3.5 h-3.5" />
                      : <Plus className="w-3.5 h-3.5" />
                    }
                  </span>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-start gap-4 px-6 pb-5">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${current.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid leading-relaxed pt-1">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA bottom */}
        <motion.div
          className="mt-12 rounded-3xl bg-gradient-to-br from-gold/8 via-cream to-caramel/8 border border-gold/20 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6 text-gold" />
          </div>
          <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-text-dark">
            Vous n&apos;avez pas trouvé votre réponse ?
          </h3>
          <p className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid mt-2 max-w-sm mx-auto">
            Notre équipe répond en moins de 24h par email, ou en quelques minutes sur WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <a
              href="mailto:contact@tonomi.ml"
              className="inline-flex items-center gap-2 btn-gold px-6 py-2.5 text-sm"
            >
              <Mail className="w-4 h-4" /> Envoyer un email
            </a>
            <a
              href="https://wa.me/22375666853"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-[family-name:var(--font-dm-sans)] text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Main Contact Page ────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-12 sm:pt-44 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <ProductImage
            src={CONTACT_HEADER_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/75" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-white/15 text-gold border border-white/20 backdrop-blur-sm px-5 py-2 rounded-full mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <HeadphonesIcon className="w-4 h-4" />
              <span className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold tracking-wide uppercase">
                Parlons ensemble
              </span>
            </motion.div>

            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Contactez-<span className="text-gold-gradient">nous</span>
            </h1>

            <motion.p
              className="mt-4 font-[family-name:var(--font-dm-sans)] text-lg sm:text-xl text-gold font-semibold tracking-[0.15em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Service client • Commandes • Support
            </motion.p>

            <motion.p
              className="mt-4 font-[family-name:var(--font-dm-sans)] text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Une question, une suggestion ou juste envie de discuter ? Notre équipe est à votre écoute, chaque jour.
            </motion.p>
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
                  href="https://wa.me/22375666853"
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
      <FAQSection />

      {/* ── Map Section ── */}
      <section className="py-12 sm:py-20 bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Header row */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <span className="font-[family-name:var(--font-dm-sans)] text-sm tracking-[0.3em] uppercase text-gold font-semibold">
                Notre adresse
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-text-dark mt-2">
                Nous <span className="text-gold-gradient">Trouver</span>
              </h2>
            </div>
            <a
              href="https://www.google.com/maps/search/Bamako+Mali"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gold/30 text-gold hover:bg-gold hover:text-white font-[family-name:var(--font-dm-sans)] text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200 self-start sm:self-auto"
            >
              <ExternalLink className="w-4 h-4" />
              Ouvrir dans Maps
            </a>
          </motion.div>

          {/* Map + floating card */}
          <motion.div
            className="relative rounded-3xl overflow-hidden warm-shadow-lg"
            style={{ height: '520px' }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Google Maps iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252099.90397278476!2d-8.197259050000001!3d12.6391965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe51d0f0a02acb29%3A0x48de7b47b45d70c!2sBamako%2C%20Mali!5e0!3m2!1sfr!2sfr!4v1706000000000!5m2!1sfr!2sfr"
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TONOMI — Bamako, Mali"
            />

            {/* Subtle warm tint overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/10 via-transparent to-transparent" />

            {/* Floating info card */}
            <motion.div
              className="absolute top-5 left-5 bottom-5 w-72 hidden lg:flex flex-col"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 flex flex-col h-full p-6">
                {/* Brand header */}
                <div className="flex items-center gap-3 pb-5 border-b border-gold/15">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold to-caramel flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white fill-white/30" />
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-text-mid uppercase tracking-[0.2em]">
                      Boutique
                    </p>
                    <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-text-dark leading-tight">
                      TONOMI
                    </p>
                  </div>
                </div>

                {/* Info rows */}
                <div className="flex-1 py-5 space-y-4">
                  {[
                    {
                      icon: <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />,
                      label: 'Adresse',
                      value: 'ACI 2000, Hamdallaye\nBamako, Mali',
                    },
                    {
                      icon: <Clock className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />,
                      label: 'Horaires',
                      value: 'Lun – Sam : 9h00 – 18h00\nDimanche : Sur rendez-vous',
                    },
                    {
                      icon: <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />,
                      label: 'Téléphone',
                      value: '+223 75 66 68 53',
                      href: 'tel:+22375666853',
                    },
                    {
                      icon: <Mail className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />,
                      label: 'Email',
                      value: 'contact@tonomi.ml',
                      href: 'mailto:contact@tonomi.ml',
                    },
                    {
                      icon: <Globe className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />,
                      label: 'Zone',
                      value: 'Afrique de l\'Ouest\nLivraison dans 11 pays',
                    },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-3">
                      {row.icon}
                      <div className="min-w-0">
                        <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-text-mid uppercase tracking-wider">
                          {row.label}
                        </p>
                        {row.href ? (
                          <a
                            href={row.href}
                            className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-text-dark hover:text-gold transition-colors leading-snug"
                          >
                            {row.value}
                          </a>
                        ) : (
                          <p className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-text-dark leading-snug whitespace-pre-line">
                            {row.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="pt-4 border-t border-gold/15 space-y-2">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Bamako+Mali"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 btn-gold py-2.5 text-xs rounded-xl"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Obtenir l&apos;itinéraire
                  </a>
                  <a
                    href="https://wa.me/22375666853"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 text-xs rounded-xl font-[family-name:var(--font-dm-sans)] font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp Business
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Mobile: pin badge centered on map */}
            <div className="lg:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-gold/20">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gold to-caramel flex items-center justify-center">
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <span className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark">
                Bamako, Mali
              </span>
            </div>
          </motion.div>

          {/* Mobile info strip */}
          <div className="lg:hidden mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: <Clock className="w-4 h-4 text-gold" />, label: 'Horaires', value: 'Lun–Sam 9h–18h' },
              { icon: <Phone className="w-4 h-4 text-gold" />, label: 'Téléphone', value: '+223 75 66 68 53', href: 'tel:+22375666853' },
            ].map((item) => (
              <div key={item.label} className="glass-card p-4 flex items-center gap-3 warm-shadow">
                <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-text-mid uppercase tracking-wider">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark hover:text-gold transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Bamako+Mali"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-4 flex items-center gap-3 warm-shadow hover:border-gold/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Navigation className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-text-mid uppercase tracking-wider">Itinéraire</p>
                <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-gold">Google Maps →</p>
              </div>
            </a>

            <a
              href="https://wa.me/22375666853"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-4 flex items-center gap-3 warm-shadow bg-green-50/60 hover:bg-green-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-green-700 uppercase tracking-wider">WhatsApp</p>
                <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-green-800">Écrire maintenant →</p>
              </div>
            </a>
          </div>

          {/* Bottom stats strip — desktop */}
          <motion.div
            className="hidden lg:grid grid-cols-3 gap-4 mt-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {[
              { icon: <MapPin className="w-4 h-4 text-gold" />, label: 'Localisation', value: 'ACI 2000, Hamdallaye — Bamako' },
              { icon: <Clock className="w-4 h-4 text-gold" />, label: 'Horaires d\'ouverture', value: 'Lundi au Samedi · 9h00 – 18h00' },
              { icon: <MessageCircle className="w-4 h-4 text-green-500" />, label: 'Support WhatsApp', value: 'Disponible 7j/7 · Réponse rapide' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card px-5 py-4 flex items-center gap-3 warm-shadow">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-text-mid uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-text-dark">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
