import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/hooks/use-language"
import { Toaster } from "@/components/toaster"
import { AuthGuard } from "@/components/auth-guard"
import { AppLayout } from "@/components/app-layout"
import "./globals.css"

// Configuração da fonte Inter
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata = {
  title: "Doctor Grace - Análise de Imagens Médicas",
  description: "Plataforma avançada de análise de imagens médicas para profissionais de saúde",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AuthGuard>
              <AppLayout>{children}</AppLayout>
            </AuthGuard>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
