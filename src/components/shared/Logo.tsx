'use client'

import { useState } from 'react'

interface LogoProps {
  variant?: 'default' | 'dark-bg'
  className?: string
}

export default function Logo({ variant = 'default', className = 'h-10 sm:h-12 w-auto' }: LogoProps) {
  const [failed, setFailed] = useState(false)

  if (variant === 'dark-bg') {
    return failed ? (
      <span className="font-bold tracking-[0.25em] text-amber-400 text-xl">TONOMI</span>
    ) : (
      <img
        src="/logo.png"
        alt="TONOMI Accessoires"
        className={className}
        draggable={false}
        onError={() => setFailed(true)}
      />
    )
  }

  return failed ? (
    <span className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold tracking-wider text-black">
      TONOMI
    </span>
  ) : (
    <img
      src="/logo.png"
      alt="TONOMI Accessoires"
      className={className}
      draggable={false}
      onError={() => setFailed(true)}
    />
  )
}
