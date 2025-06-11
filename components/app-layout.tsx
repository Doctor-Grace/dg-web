"use client"

import type React from "react"

import { usePathname, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useEffect } from "react"

// Atualizar a verificação de rotas públicas para incluir a rota de redefinição de senha com token
const publicRoutes = ["/login", "/register", "/forgot-password", "/404"]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Client-side route validation
  useEffect(() => {
    if (pathname === "/") {
      router.push("/login")
    }
  }, [pathname, router])

  // Verificar se a rota atual é uma rota pública ou a rota de redefinição de senha com token
  const isPublicRoute =
    publicRoutes.some((route) => pathname === route || pathname?.startsWith(route + "/")) ||
    pathname?.startsWith("/forgot-password-by-url/")

  // Se for uma rota pública, renderizar apenas o conteúdo
  if (isPublicRoute) {
    return <>{children}</>
  }

  // Se não for uma rota pública, renderizar com o layout do dashboard
  return <DashboardLayout>{children}</DashboardLayout>
}
