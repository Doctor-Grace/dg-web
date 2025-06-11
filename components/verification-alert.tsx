"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUnit } from "effector-react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/hooks/use-language"
import userStore from "@/store/user/user-store"
import { authUseCase } from "@/useCases/auth.useCase"
import { routesMapper } from "@/utils/routes-mapper"
import { motion } from "framer-motion"

interface VerificationAlertProps {
  isCollapsed?: boolean
}

export function VerificationAlert({ isCollapsed = false }: VerificationAlertProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const userState = useUnit(userStore)
  const [isVisible, setIsVisible] = useState(false)

  // Verificar o status de validação quando o componente é montado
  useEffect(() => {
    const checkValidationStatus = async () => {
      await authUseCase.canUseApplication({
        onBlocked: () => setIsVisible(true),
        onSuccess: () => setIsVisible(false),
      })
    }

    checkValidationStatus()
  }, [])

  // Também atualizar a visibilidade com base no estado atual do usuário
  useEffect(() => {
    const needsVerification = !userState.emailConfirmed || !userState.phoneConfirmed
    setIsVisible(needsVerification)
  }, [userState.emailConfirmed, userState.phoneConfirmed])

  if (!isVisible) {
    return null
  }

  // Se o menu estiver colapsado, mostrar apenas o ícone
  if (isCollapsed) {
    return (
      <motion.div
        className="flex justify-center items-center my-4 cursor-pointer"
        onClick={() => router.push(routesMapper.verification)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <AlertCircle className="h-5 w-5 text-amber-500" />
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Alert variant="warning" className="mb-4 mx-2">
        <AlertTitle>{t("verification_required")}</AlertTitle>
        <AlertDescription className="text-xs">
          {!userState.emailConfirmed && !userState.phoneConfirmed
            ? t("email_and_phone_verification_required")
            : !userState.emailConfirmed
              ? t("email_verification_required")
              : t("phone_verification_required")}
        </AlertDescription>
        <div className="flex justify-center w-full mt-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-background text-xs w-full border-amber-500 dark:bg-amber-500/20 dark:text-amber-500 dark:border-amber-500/50 hover:bg-background hover:text-amber-600 hover:border-amber-500 dark:hover:bg-amber-500/20 dark:hover:text-amber-500 dark:hover:border-amber-500/50"
            onClick={() => router.push(routesMapper.verification)}
          >
            {t("verify_now")}
          </Button>
        </div>
      </Alert>
    </motion.div>
  )
}
