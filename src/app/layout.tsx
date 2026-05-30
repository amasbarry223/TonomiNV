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
  title: "TONOMI Accessoires — Accessoires de Mode Haut de Gamme",
  description: "Découvrez la collection TONOMI : bijoux, sacs, foulards, lunettes et ceintures élégants. Accessoires de mode premium pour femmes urbaines et actives.",
  keywords: ["TONOMI", "accessoires", "mode", "bijoux", "sacs", "foulards", "lunettes", "ceintures", "Mali", "Afrique"],
  authors: [{ name: "TONOMI Accessoires" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "TONOMI Accessoires — Accessoires de Mode Haut de Gamme",
    description: "Découvrez la collection TONOMI : bijoux, sacs, foulards, lunettes et ceintures élégants.",
    url: "https://tonomi.accessoires",
    siteName: "TONOMI Accessoires",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
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
