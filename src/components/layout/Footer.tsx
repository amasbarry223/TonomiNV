'use client'

import { Instagram, Facebook, MessageCircle, CreditCard, Smartphone, Mail, Phone, MapPin } from 'lucide-react'
import { useNavStore, type PageName } from '@/stores/nav-store'

const navLinks: { label: string; page: PageName }[] = [
  { label: 'Accueil', page: 'home' },
  { label: 'Catalogue', page: 'catalogue' },
  { label: 'Promotions', page: 'promotions' },
  { label: 'À Propos', page: 'about' },
  { label: 'Contact', page: 'contact' },
]

const categories = ['Bijoux', 'Sacs', 'Foulards', 'Lunettes', 'Ceintures']

export default function Footer() {
  const { navigate } = useNavStore()

  return (
    <footer className="bg-beige/80 pt-16 pb-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-gold tracking-wider">
              TONOMI
            </h3>
            <p className="mt-3 font-[family-name:var(--font-cormorant)] text-lg text-text-mid italic">
              L&apos;élégance à la Mali
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://instagram.com/tonomi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-warm-white shadow-sm hover:shadow-md hover:scale-110 transition-all text-caramel"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/tonomi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-warm-white shadow-sm hover:shadow-md hover:scale-110 transition-all text-caramel"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/223XXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-warm-white shadow-sm hover:shadow-md hover:scale-110 transition-all text-caramel"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-text-dark mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid hover:text-gold transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-text-dark mb-4">
              Catégories
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => navigate('catalogue', { category: cat.toLowerCase() })}
                    className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid hover:text-gold transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-text-dark mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a
                  href="mailto:contact@tonomi.ml"
                  className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid hover:text-gold transition-colors"
                >
                  contact@tonomi.ml
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a
                  href="tel:+22300000000"
                  className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid hover:text-gold transition-colors"
                >
                  +223 00 000 000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="font-[family-name:var(--font-dm-sans)] text-sm text-text-mid">
                  Bamako, Mali
                </span>
              </li>
            </ul>

            {/* Payment Icons */}
            <div className="mt-6">
              <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid mb-3">
                Moyens de paiement
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-7 rounded bg-warm-white shadow-sm" title="Visa">
                  <CreditCard className="w-4 h-4 text-caramel" />
                </div>
                <div className="flex items-center justify-center w-10 h-7 rounded bg-warm-white shadow-sm" title="Mastercard">
                  <CreditCard className="w-4 h-4 text-caramel" />
                </div>
                <div className="flex items-center justify-center w-10 h-7 rounded bg-warm-white shadow-sm" title="Orange Money">
                  <Smartphone className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex items-center justify-center w-10 h-7 rounded bg-warm-white shadow-sm" title="Wave">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gold/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid">
              © {new Date().getFullYear()} TONOMI Accessoires. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <button className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid hover:text-gold transition-colors">
                Mentions légales
              </button>
              <span className="text-gold/30">|</span>
              <button className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid hover:text-gold transition-colors">
                Politique de confidentialité
              </button>
              <span className="text-gold/30">|</span>
              <button className="font-[family-name:var(--font-dm-sans)] text-xs text-text-mid hover:text-gold transition-colors">
                CGV
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
