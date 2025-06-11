"use client"

import { useRouter } from "next/navigation"
import { useUnit } from "effector-react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import userStore from "@/store/user/user-store"
import { useEffect, useState } from "react"
import { authUseCase } from "@/useCases/auth.useCase"
import { routesMapper } from "@/utils/routes-mapper"

export function useFeatureAccess() {
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()
  const userState = useUnit(userStore)
  const [isVerified, setIsVerified] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Verificar o status de validação quando o hook é montado
  useEffect(() => {
    const checkValidationStatus = async () => {
      setIsChecking(true)
      await authUseCase.canUseApplication({
        onBlocked: () => setIsVerified(false),
        onSuccess: () => setIsVerified(true),
      })
      setIsChecking(false)
    }

    checkValidationStatus()
  }, [])

  // Também atualizar com base no estado atual do usuário
  useEffect(() => {
    const hasFullAccess = userState.emailConfirmed && userState.phoneConfirmed
    setIsVerified(hasFullAccess)
  }, [userState.emailConfirmed, userState.phoneConfirmed])

  const checkAccess = () => {
    // Se ainda estiver verificando, não permitir acesso
    // mas também não mostrar nenhum aviso
    if (isChecking) {
      return false
    }

    // Verificar se o usuário confirmou tanto o email quanto o telefone
    if (!isVerified) {
      toast({
        title: t("feature_restricted"),
        description: t("verification_needed_to_use"),
        variant: "destructive",
      })

      // Redirecionar para a página de verificação
      router.push(routesMapper.verification)
      return false
    }

    return true
  }

  return { checkAccess, isVerified, isChecking }
}
