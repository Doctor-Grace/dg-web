"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { useAuthStore } from "@/store/auth/auth-store"

interface AppLinkProps {
  href: string
  children: ReactNode
  className?: string
  activeClassName?: string
  prefetch?: boolean
  onClick?: () => void
}

export function AppLink({
  href,
  children,
  className = "",
  activeClassName = "text-primary font-medium",
  prefetch = false,
  onClick,
}: AppLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname?.startsWith(`${href}/`)
  const { isAuthenticated } = useAuthStore()

  // Verificar se o link requer autenticação
  const requiresAuth = href.startsWith("/dashboard")

  // Se o link requer autenticação e o usuário não está autenticado,
  // redirecionar para a página de login
  const finalHref = requiresAuth && !isAuthenticated ? "/login" : href

  return (
    <Link href={finalHref} className={cn(className, isActive && activeClassName)} prefetch={prefetch} onClick={onClick}>
      {children}
    </Link>
  )
}
