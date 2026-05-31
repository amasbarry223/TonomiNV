'use client'

import { Instagram, Facebook, MessageCircle, Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react'
import { useNavStore, type PageName } from '@/stores/nav-store'
import Logo from '@/components/shared/Logo'
import { categories } from '@/data/categories'

const navLinks: { label: string; page: PageName }[] = [
  { label: 'Accueil',           page: 'home' },
  { label: 'Catalogue',         page: 'catalogue' },
  { label: 'Promotions',        page: 'promotions' },
  { label: 'À Propos',          page: 'about' },
  { label: 'Contact',           page: 'contact' },
  { label: 'Suivre ma commande',page: 'tracking' },
  { label: 'Mon compte',        page: 'account' },
]


const socialLinks = [
  {
    href: 'https://instagram.com/tonomi.accessoires',
    icon: Instagram,
    label: 'Instagram',
    hover: 'hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/30',
  },
  {
    href: 'https://facebook.com/tonomi',
    icon: Facebook,
    label: 'Facebook',
    hover: 'hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30',
  },
  {
    href: 'https://wa.me/22375666853',
    icon: MessageCircle,
    label: 'WhatsApp',
    hover: 'hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30',
  },
]

export default function Footer() {
  const { navigate } = useNavStore()

  return (
    <footer className="bg-gradient-to-b from-[#0f0800] to-[#080400] text-white mt-auto">

      {/* Top gold divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* ── Col 1 : Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo variant="dark-bg" className="h-12 w-auto" />
            <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg text-white/60 italic leading-snug">
              L&apos;élégance africaine,<br />réinventée au Mali.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2.5 mt-6">
              {socialLinks.map(({ href, icon: Icon, label, hover }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/60 transition-all duration-200 ${hover}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Tagline badge */}
            <div className="mt-6 inline-flex items-center gap-2 border border-gold/20 bg-gold/5 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-[family-name:var(--font-dm-sans)] text-xs text-gold/80">
                Bamako, Mali — depuis 2019
              </span>
            </div>
          </div>

          {/* ── Col 2 : Navigation ── */}
          <div>
            <h4 className="font-[family-name:var(--font-dm-sans)] text-[10px] font-semibold text-gold/70 tracking-[0.25em] uppercase mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="group flex items-center gap-1.5 font-[family-name:var(--font-dm-sans)] text-sm text-white/55 hover:text-gold transition-colors duration-150"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-gold" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3 : Catégories ── */}
          <div>
            <h4 className="font-[family-name:var(--font-dm-sans)] text-[10px] font-semibold text-gold/70 tracking-[0.25em] uppercase mb-5">
              Catégories
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate('catalogue', { category: cat.slug })}
                    className="group flex items-center gap-1.5 font-[family-name:var(--font-dm-sans)] text-sm text-white/55 hover:text-gold transition-colors duration-150"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-gold" />
                    {cat.name}
                    <span className="text-[10px] text-white/25 font-[family-name:var(--font-dm-sans)]">
                      ({cat.productCount})
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4 : Contact ── */}
          <div>
            <h4 className="font-[family-name:var(--font-dm-sans)] text-[10px] font-semibold text-gold/70 tracking-[0.25em] uppercase mb-5">
              Nous contacter
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:contact@tonomi.ml"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-white/35 uppercase tracking-wider">Email</p>
                    <p className="font-[family-name:var(--font-dm-sans)] text-sm text-white/60 group-hover:text-gold transition-colors">
                      contact@tonomi.ml
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="tel:+22375666853"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-white/35 uppercase tracking-wider">Téléphone</p>
                    <p className="font-[family-name:var(--font-dm-sans)] text-sm text-white/60 group-hover:text-gold transition-colors">
                      +223 75 66 68 53
                    </p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-white/35 uppercase tracking-wider">Adresse</p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-sm text-white/60">
                    ACI 2000, Hamdallaye<br />Bamako, Mali
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-white/35 uppercase tracking-wider">Horaires</p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-sm text-white/60">
                    Lun – Sam : 9h – 18h
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-[family-name:var(--font-dm-sans)] text-xs text-white/30">
              © {new Date().getFullYear()} <span className="text-white/50">TONOMI Accessoires</span>. Tous droits réservés.
            </p>
            <p className="font-[family-name:var(--font-cormorant)] text-sm text-white/25 italic">
              Fait avec ♥ à Bamako, Mali
            </p>
            <div className="flex items-center gap-4">
              {['Mentions légales', 'Confidentialité', 'CGV'].map((item, i, arr) => (
                <span key={item} className="flex items-center gap-4">
                  <button className="font-[family-name:var(--font-dm-sans)] text-xs text-white/30 hover:text-gold/70 transition-colors">
                    {item}
                  </button>
                  {i < arr.length - 1 && <span className="text-white/15">·</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
