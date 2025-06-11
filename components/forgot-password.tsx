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

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const userState = useUnit(userStore)

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    email: false,
  })

  // Efeito para atualizar o loading state baseado no estado do userStore
  useEffect(() => {
    setIsLoading(userState.isLoading)
  }, [userState.isLoading])

  const handleSubmitEmail = (event: React.FormEvent) => {
    event.preventDefault()

    const newErrors = {
      ...errors,
      email: email.trim() === "",
    }

    setErrors(newErrors)

    if (newErrors.email) {
      return
    }

    userUseCase.forgotPassword({
      email: email.trim(),
      onSuccess: () => {
        toast({
          title: t("success"),
          description: t("reset_code_sent"),
        })
        router.push("/login")
      },
      onError: (errorMessage) => {
        // Display the error message directly without trying to translate it
        // Only translate known error keys that are part of our i18n system
        const knownErrorKeys = ["user_not_found", "server_error"]

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
                  <form onSubmit={handleSubmitEmail}>
                    <h2 className="text-2xl font-bold text-primary mb-6 text-center">{t("forgot_password")}</h2>
                    <p className="text-center text-muted-foreground mb-6">{t("enter_email_for_reset")}</p>

                    <div className="flex flex-col gap-4">
                      <div className="grid gap-1">
                        <Label htmlFor="email">Email</Label>
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

                      <Button
                        type="submit"
                        className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={isLoading || !email.trim()}
                      >
                        {isLoading ? t("sending") : t("send_code")}
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
