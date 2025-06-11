"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUnit } from "effector-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import userStore from "@/store/user/user-store"
import { userUseCase } from "@/useCases/user.useCase"
import { Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { routesMapper } from "@/utils/routes-mapper"

export function EditEmailForm() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const userState = useUnit(userStore)

  const [currentEmail, setCurrentEmail] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({ email: false })

  useEffect(() => {
    // Initialize form with user data
    if (userState.email) setCurrentEmail(userState.email)
  }, [userState])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userState.id) {
      toast({
        title: t("error"),
        description: t("user_not_found"),
        variant: "destructive",
      })
      return
    }

    // Validate email
    if (!validateEmail(newEmail)) {
      setError({ email: true })
      return
    }

    setIsLoading(true)

    await userUseCase.changeEmail({
      userId: userState.id,
      email: newEmail.trim(),
      onSuccess: () => {
        toast({
          title: t("success"),
          description: t("email_updated_success"),
        })

        // Redirect to verification page since email needs to be verified again
        toast({
          title: t("verification_required"),
          description: t("verification_required_after_update"),
        })

        router.push(routesMapper.verification)
      },
      onError: (errorMessage) => {
        toast({
          title: t("error_title"),
          description: errorMessage,
          variant: "destructive",
        })
      },
      translate: t,
    })

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="current-email">{t("current_email")}</Label>
        <Input id="current-email" value={currentEmail} disabled readOnly />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="new-email">{t("new_email")}</Label>
        <Input
          id="new-email"
          type="email"
          value={newEmail}
          onChange={(e) => {
            setNewEmail(e.target.value)
            if (validateEmail(e.target.value)) {
              setError({ email: false })
            }
          }}
          required
          disabled={isLoading}
          className={error.email ? "border-red-500" : ""}
        />
        {error.email && (
          <p className="text-red-500 text-[10px] mt-1 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {t("invalid_email")}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading || !newEmail.trim() || newEmail === currentEmail}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("saving")}...
            </>
          ) : (
            t("save_changes")
          )}
        </Button>
      </div>
    </form>
  )
}
