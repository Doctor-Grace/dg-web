"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/hooks/use-language"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { userUseCase } from "@/useCases/user.useCase"
import { useUnit } from "effector-react"
import userStore from "@/store/user/user-store"
import { PageTransition } from "@/components/page-transition"
import { Eye, EyeOff } from "lucide-react"

interface ResetPasswordPageProps {
  token: string
}

export default function ResetPasswordPage({ token }: ResetPasswordPageProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const userState = useUnit(userStore)

  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({
    email: false,
    newPassword: false,
    confirmPassword: false,
    passwordMatch: false,
  })

  // Efeito para atualizar o loading state baseado no estado do userStore
  useEffect(() => {
    setIsLoading(userState.isLoading)
  }, [userState.isLoading])

  const handleResetPassword = (event: React.FormEvent) => {
    event.preventDefault()

    const newErrors = {
      ...errors,
      email: email.trim() === "",
      newPassword: newPassword.trim().length < 6,
      confirmPassword: confirmPassword.trim() === "",
      passwordMatch: newPassword.trim() !== confirmPassword.trim(),
    }

    setErrors(newErrors)

    if (newErrors.email || newErrors.newPassword || newErrors.confirmPassword || newErrors.passwordMatch) {
      return
    }

    userUseCase.changePasswordByToken({
      email: email.trim(),
      token,
      password: newPassword.trim(),
      passwordConfirmation: confirmPassword.trim(),
      onSuccess: () => {
        toast({
          title: t("success"),
          description: t("password_reset_success"),
        })
        router.push("/login")
      },
      onError: (errorMessage) => {
        // Display the error message directly without trying to translate it
        // Only translate known error keys that are part of our i18n system
        const knownErrorKeys = ["invalid_token", "server_error"]

        const errorText = knownErrorKeys.includes(errorMessage) ? t(errorMessage) : errorMessage

        toast({
          title: t("error_title"),
          description: errorText,
          variant: "destructive",
        })
      },
    })
  }

  return (
    <PageTransition>
      <div
        className="overflow-hidden flex w-full min-h-screen items-center justify-center transition-all duration-300"
        style={{
          backgroundImage: `url("/images/doctor_login_bg.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="fixed top-4 right-4 flex gap-2">
            <ModeToggle />
            <LanguageToggle />
          </div>
          <div className="w-full max-w-md">
            <div className={cn("flex flex-col gap-6")}>
              <Card>
                <CardContent className="pt-6 overflow-hidden">
                  <form onSubmit={handleResetPassword}>
                    <h2 className="text-2xl font-bold text-primary mb-6 text-center">{t("reset_password")}</h2>
                    <p className="text-center text-muted-foreground mb-6">{t("fill_fields_to_reset")}</p>

                    <div className="flex flex-col gap-4">
                      <div className="grid gap-1">
                        <Label htmlFor="email">{t("confirm_email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (e.target.value.trim() !== "") {
                              setErrors((prev) => ({ ...prev, email: false }))
                            }
                          }}
                          className={errors.email ? "border-red-500" : ""}
                          maxLength={100}
                        />
                        {errors.email && <p className="text-red-500 text-[10px]">{t("required_field")}</p>}
                      </div>

                      <div className="grid gap-1">
                        <Label htmlFor="newPassword">{t("new_password")}</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value)
                              if (e.target.value.trim().length >= 6) {
                                setErrors((prev) => ({ ...prev, newPassword: false }))
                              }
                              if (e.target.value === confirmPassword) {
                                setErrors((prev) => ({ ...prev, passwordMatch: false }))
                              }
                            }}
                            className={errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
                            maxLength={20}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <Eye className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span className="sr-only">{showNewPassword ? t("hide_password") : t("show_password")}</span>
                          </button>
                        </div>
                        {errors.newPassword && <p className="text-red-500 text-[10px]">{t("password_min_length")}</p>}
                      </div>

                      <div className="grid gap-1">
                        <Label htmlFor="confirmPassword">{t("confirm_password")}</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value)
                              if (e.target.value === newPassword) {
                                setErrors((prev) => ({ ...prev, confirmPassword: false, passwordMatch: false }))
                              }
                            }}
                            className={
                              errors.confirmPassword || errors.passwordMatch ? "border-red-500 pr-10" : "pr-10"
                            }
                            maxLength={20}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <Eye className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span className="sr-only">
                              {showConfirmPassword ? t("hide_password") : t("show_password")}
                            </span>
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-[10px]">{t("required_field")}</p>}
                        {!errors.confirmPassword && errors.passwordMatch && (
                          <p className="text-red-500 text-[10px]">{t("passwords_dont_match")}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={
                          isLoading ||
                          !email.trim() ||
                          !newPassword.trim() ||
                          !confirmPassword.trim() ||
                          newPassword.trim() !== confirmPassword.trim()
                        }
                      >
                        {isLoading ? t("resetting") : t("reset_password")}
                      </Button>

                      <div className="text-center text-sm mt-4">
                        <Link href="/login" className="underline underline-offset-4">
                          {t("back_to_login")}
                        </Link>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
