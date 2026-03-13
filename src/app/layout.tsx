import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "FeedSyncs - Sistema de Feedback para Gestores",
  description: "Plataforma de avaliação e feedback para gestores da franquia O Boticário",
  keywords: ["feedback", "gestores", "avaliação", "O Boticário"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
