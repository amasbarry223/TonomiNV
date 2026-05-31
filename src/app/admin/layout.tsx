import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TONOMI Admin',
  description: 'Back-office TONOMI Accessoires',
  robots: 'noindex,nofollow',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
