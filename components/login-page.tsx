"use client"

import type React from "react"
import { useState } from "react"
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
import { PageTransition } from "@/components/page-transition"
import { motion } from "framer-motion"
import { authUseCase } from "@/useCases/auth.useCase"
import { routesMapper } from "@/utils/routes-mapper"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({ email: false, password: false })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    setIsLoading(true)
    event.preventDefault()

    const newErrors = {
      email: email.trim() === "",
      password: password.trim() === "",
    }

    setErrors(newErrors)

    if (newErrors.email || newErrors.password) {
      setIsLoading(false)
      return
    }

    try {
      // Use the auth use case for login
      await authUseCase.login({
        email: email.trim(),
        password: password.trim(),
        onSuccess: () => {
          router.push(routesMapper.dashboard)
        },
        onError: (errorMessage) => {
          // Display the error message directly without trying to translate it
          // Only translate known error keys that are part of our i18n system
          const knownErrorKeys = [
            "invalid_credentials",
            "server_error",
            "user_not_found",
            "error_checking_application_access",
          ]

          const errorText = knownErrorKeys.includes(errorMessage) ? t(errorMessage) : errorMessage

          toast({
            title: t("error_title"),
            description: errorText,
            variant: "destructive",
          })
          setIsLoading(false)
        },
      })
    } catch (error) {
      toast({
        title: t("error_title"),
        description: t("server_error"),
        variant: "destructive",
      })
      setIsLoading(false)
    }
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
          <div className="w-full max-w-sm">
            <motion.div
              className={cn("flex flex-col gap-6")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Card>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6 mt-6">
                      <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-primary">Doctor Grace</h1>
                        <p className="text-sm text-muted-foreground">Plataforma de análise médica</p>
                      </div>

                      <div className="grid gap-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (e.target.value.trim() !== "") {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                email: false,
                              }))
                            }
                          }}
                          className={errors.email ? "border-red-500" : ""}
                          maxLength={100}
                        />
                        {errors.email && <p className="text-red-500 text-[10px]">{t("required_field")}</p>}
                      </div>

                      <div className="grid gap-1">
                        <div className="flex items-center">
                          <Label htmlFor="password">{t("password")}</Label>
                          <Link href={routesMapper.forgotPassword} className="ml-auto inline-block text-sm">
                            {t("forgot_password")}
                          </Link>
                        </div>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            maxLength={30}
                            onChange={(e) => {
                              setPassword(e.target.value)
                              if (e.target.value.trim() !== "") {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  password: false,
                                }))
                              }
                            }}
                            className={cn(errors.password ? "border-red-500" : "", "pr-10")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <Eye className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span className="sr-only">{showPassword ? t("hide_password") : t("show_password")}</span>
                          </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-[10px]">{t("required_field")}</p>}
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={isLoading || !email.trim() || !password.trim()}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("loading")}
                          </>
                        ) : (
                          t("login")
                        )}
                      </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                      {t("no_account")}{" "}
                      <Link href={routesMapper.register} className="underline underline-offset-4">
                        {t("sign_up")}
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
