'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminStore } from '@/stores/admin-store'
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import Logo from '@/components/shared/Logo'

export default function AdminLogin() {
  const router = useRouter()
  const login = useAdminStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const result = login(email, password)
    setLoading(false)
    if (result.success) {
      router.push('/admin/dashboard')
    } else {
      setError(result.error ?? 'Erreur inconnue')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background décor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#D4AF6A]/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#D4AF6A]/3 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Top gold bar */}
          <div className="h-1 bg-gradient-to-r from-[#D4AF6A] via-[#E8C547] to-[#C8956C]" />

          <div className="p-8 sm:p-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <Logo
                variant="dark-bg"
                className="h-28 sm:h-32 w-auto max-w-[340px] object-contain mb-5 drop-shadow-[0_2px_16px_rgba(212,175,106,0.3)]"
              />
              <div className="flex items-center gap-1.5 bg-[#D4AF6A]/10 border border-[#D4AF6A]/20 rounded-full px-3 py-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF6A]" />
                <span className="text-[10px] text-[#D4AF6A] font-semibold uppercase tracking-widest">
                  Back-Office Admin
                </span>
              </div>
            </div>

            <h1 className="text-xl font-bold text-white text-center mb-1"
              style={{ fontFamily: 'var(--font-playfair)' }}>
              Connexion administrateur
            </h1>
            <p className="text-sm text-slate-500 text-center mb-8"
              style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Accès réservé à l&apos;équipe TONOMI
            </p>

            <form onSubmit={handle} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@tonomi.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#D4AF6A]/50 focus:ring-1 focus:ring-[#D4AF6A]/30 transition-colors"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
                  style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#D4AF6A]/50 focus:ring-1 focus:ring-[#D4AF6A]/30 transition-colors"
                    style={{ fontFamily: 'var(--font-dm-sans)' }}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <span className="text-sm text-red-400" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    {error}
                  </span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF6A] to-[#C8956C] hover:from-[#C8956C] hover:to-[#D4AF6A] text-white font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-[#D4AF6A]/20"
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                {loading ? 'Connexion...' : 'Accéder au dashboard'}
              </button>
            </form>

            <p className="text-center text-xs text-slate-700 mt-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              TONOMI Back-Office · Accès sécurisé
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
