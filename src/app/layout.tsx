import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TONOMI Accessoires — Bijoux & Mode Artisanaux du Mali",
    template: "%s | TONOMI Accessoires",
  },
  description: "Découvrez TONOMI : bijoux artisanaux, sacs en cuir, foulards wax, lunettes et ceintures. Mode premium inspirée du savoir-faire malien. Livraison partout en Afrique de l'Ouest.",
  keywords: [
    "TONOMI", "bijoux Mali", "accessoires africains", "mode Bamako", "artisanat malien",
    "sacs artisanaux", "foulards wax", "bijoux femme", "mode West Africa", "accessoires haut de gamme",
    "Orange Money", "livraison Afrique", "bijoux authentiques",
  ],
  authors: [{ name: "TONOMI Accessoires" }],
  creator: "TONOMI",
  publisher: "TONOMI Accessoires",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    title: "TONOMI Accessoires — Bijoux & Mode Artisanaux du Mali",
    description: "Bijoux, sacs, foulards et accessoires premium. Savoir-faire malien pour la femme moderne.",
    url: "https://tonomi.com",
    siteName: "TONOMI Accessoires",
    locale: "fr_ML",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "TONOMI Accessoires" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TONOMI Accessoires — Bijoux & Mode Artisanaux du Mali",
    description: "Bijoux artisanaux, sacs, foulards et accessoires premium du Mali.",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: "https://tonomi.com" },
  icons: { icon: "/logo.svg", shortcut: "/logo.svg", apple: "/logo.svg" },
  category: "fashion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              "name": "TONOMI Accessoires",
              "description": "Bijoux et accessoires de mode artisanaux du Mali pour la femme moderne",
              "url": "https://tonomi.com",
              "logo": "https://tonomi.com/logo.svg",
              "image": "https://tonomi.com/og-image.jpg",
              "telephone": "+22375666853",
              "email": "contact@tonomi.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "ACI 2000",
                "addressLocality": "Bamako",
                "addressCountry": "ML"
              },
              "geo": { "@type": "GeoCoordinates", "latitude": 12.6392, "longitude": -8.0029 },
              "priceRange": "$$",
              "currenciesAccepted": "XOF",
              "paymentAccepted": "Orange Money, Wave, Mobi Money, Cash",
              "sameAs": [
                "https://instagram.com/tonomi_accessoires",
                "https://facebook.com/tonomi",
                "https://wa.me/22375666853"
              ],
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                  "opens": "08:00",
                  "closes": "20:00"
                }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Collection TONOMI",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Bijoux artisanaux" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Sacs en cuir" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Foulards wax" } }
                ]
              }
            })
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${cormorant.variable} ${dmSans.variable} antialiased bg-cream text-text-dark`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
