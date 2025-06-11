"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authUseCase } from "@/useCases/auth.useCase"
import { useUnit } from "effector-react"
import authStore from "@/store/auth/auth-store"
import userStore from "@/store/user/user-store"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const authState = useUnit(authStore)
  const userState = useUnit(userStore)
  const [isChecking, setIsChecking] = useState(true)

  // Verificar autenticação e acesso à aplicação
  useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true)

      // Rotas públicas que não precisam de verificação de autenticação
      const publicRoutes = ["/login", "/register", "/forgot-password", "/forgot-password-by-url", "/404"]
      const isForgotPasswordByUrl = pathname?.startsWith("/forgot-password-by-url/")
      const isRootPath = pathname === "/"

      // Handle root path based on authentication
      if (isRootPath) {
        const isAuthenticated = authUseCase.checkAuth()
        if (isAuthenticated) {
          router.push("/dashboard")
        } else {
          router.push("/login")
        }
        setIsChecking(false)
        return
      }

      // Se estiver em uma rota pública ou na rota de redefinição de senha com token, não verificar autenticação
      if (publicRoutes.includes(pathname || "") || isForgotPasswordByUrl) {
        setIsChecking(false)
        return
      }

      // Verificar se o usuário está autenticado
      const isAuthenticated = authUseCase.checkAuth()

      if (!isAuthenticated) {
        // Se não estiver autenticado e não estiver em uma rota pública ou na rota de redefinição de senha, redirecionar para o login
        if (!publicRoutes.includes(pathname || "") && !isForgotPasswordByUrl) {
          router.push("/login")
        }
        setIsChecking(false)
        return
      }

      // Se estiver autenticado e não estiver em uma rota pública ou de verificação, verificar o acesso à aplicação
      if (pathname !== "/verification" && !publicRoutes.includes(pathname || "") && !isForgotPasswordByUrl) {
        await authUseCase.canUseApplication()
      }

      // Estamos autenticados, não verificamos mais se pode usar a aplicação
      setIsChecking(false)
    }

    checkAccess()
  }, [pathname, router])

  // Removida a validação de rotas inválidas conforme solicitado

  // Mostrar um indicador de carregamento enquanto verifica o acesso
  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
