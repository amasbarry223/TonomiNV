'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'

export default function WhatsAppButton() {
  const [labelVisible, setLabelVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Dismissible tooltip bubble */}
      <AnimatePresence>
        {labelVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white text-[#1a1a1a] rounded-2xl shadow-xl border border-stone-100 px-4 py-3 mr-1 max-w-[200px]"
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-stone-200 hover:bg-stone-300 rounded-full flex items-center justify-center transition-colors"
              aria-label="Fermer"
            >
              <X size={10} className="text-stone-600" />
            </button>
            <p className="font-[family-name:var(--font-dm-sans)] text-xs font-semibold leading-tight">
              Besoin d'aide ?
            </p>
            <p className="font-[family-name:var(--font-dm-sans)] text-[11px] text-stone-500 mt-0.5 leading-tight">
              On répond en moins de 5 min !
            </p>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-6 w-4 h-2 overflow-hidden">
              <div className="w-3 h-3 bg-white border-r border-b border-stone-100 transform rotate-45 ml-0.5 -mt-1.5 shadow-sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href="https://wa.me/22375666853"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl pr-4 pl-3.5 h-14 cursor-pointer"
        onHoverStart={() => setLabelVisible(true)}
        onHoverEnd={() => setLabelVisible(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Contacter via WhatsApp"
      >
        {/* Pulse ring */}
        <span className="relative flex h-7 w-7 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40" />
          <span className="relative flex h-7 w-7 items-center justify-center">
            <MessageCircle className="w-6 h-6 fill-white text-white" />
          </span>
        </span>
        <span className="font-[family-name:var(--font-dm-sans)] text-sm font-semibold whitespace-nowrap">
          WhatsApp
        </span>
      </motion.a>
    </div>
  )
}
