"use client"

import type React from "react"
import type { ProfessionalType } from "@/domain/user.domain"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/hooks/use-language"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { userUseCase } from "@/useCases/user.useCase"
import { authUseCase } from "@/useCases/auth.useCase"
import { PageTransition } from "@/components/page-transition"
import { PhoneInput } from "@/components/phone-input"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { routesMapper } from "@/utils/routes-mapper"

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+55")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [register, setRegister] = useState("")
  const [professionalType, setProfessionalType] = useState<ProfessionalType>("Medic")
  const [isStudent, setIsStudent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    register: false,
  })

  useEffect(() => {
    // Limpar erros quando o usuário altera o tipo profissional
    if (isStudent) {
      setErrors((prev) => ({ ...prev, register: false }))
    }
  }, [isStudent])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const newErrors = {
      name: name.trim().length < 2 || name.trim().length > 100,
      email: !validateEmail(email.trim()),
      phone: phone.trim().length < 8,
      password: password.trim().length < 6 || password.trim().length > 20,
      confirmPassword: password.trim() !== confirmPassword.trim(),
      register: !isStudent && (register.trim().length < 9 || register.trim().length > 15),
    }

    setErrors(newErrors)

    if (Object.values(newErrors).some((error) => error)) {
      return
    }

    setIsLoading(true)

    // Preparar o registro sem zeros à esquerda
    const formattedRegister = isStudent ? "" : register.trim()
    // Remover o "+" do código do país
    const formattedPhone = `${countryCode.replace("+", "")}${phone.trim()}`

    try {
      await userUseCase.createUser({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        passwordConfirmation: confirmPassword.trim(),
        phone: formattedPhone,
        professionalType,
        register: formattedRegister,
        onSuccess: async (userId) => {
          toast({
            title: t("success"),
            description: t("registration_success"),
          })

          // Após o cadastro bem-sucedido, fazer login automático
          try {
            await authUseCase.login({
              email: email.trim(),
              password: password.trim(),
              onSuccess: () => {
                // Redirecionar para a home da aplicação
                router.push(routesMapper.dashboard)
              },
              onError: (errorMessage) => {
                // Se o login falhar, redirecionar para a tela de login
                toast({
                  title: t("warning"),
                  description: t("auto_login_failed"),
                  variant: "warning",
                })
                router.push(routesMapper.login)
              },
              translate: t,
            })
          } catch (error) {
            // Em caso de erro, redirecionar para a tela de login
            router.push(routesMapper.login)
          }
        },
        onError: (errorMessage) => {
          // Display the error message directly without trying to translate it
          // Only translate known error keys that are part of our i18n system
          const knownErrorKeys = ["error_creating_user", "server_error"]

          const errorText = knownErrorKeys.includes(errorMessage) ? t(errorMessage) : errorMessage

          toast({
            title: t("error_title"),
            description: errorText,
            variant: "destructive",
          })
        },
      })
    } finally {
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
          <div className="w-full max-w-md">
            <div className={cn("flex flex-col gap-6")}>
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold text-primary mb-6 text-center">{t("create_account")}</h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-1">
                      <Label htmlFor="name">{t("name")}</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          if (e.target.value.trim().length >= 2 && e.target.value.trim().length <= 100) {
                            setErrors((prev) => ({ ...prev, name: false }))
                          }
                        }}
                        className={errors.name ? "border-red-500" : ""}
                        maxLength={100}
                      />
                      {errors.name && <p className="text-red-500 text-[10px]">{t("name_min_length")}</p>}
                    </div>

                    <div className="grid gap-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (validateEmail(e.target.value)) {
                            setErrors((prev) => ({ ...prev, email: false }))
                          }
                        }}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-[10px] mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {t("invalid_email")}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-1">
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <PhoneInput
                        id="phone"
                        value={phone}
                        onChange={(value) => {
                          setPhone(value)
                          if (value.trim().length >= 8) {
                            setErrors((prev) => ({ ...prev, phone: false }))
                          }
                        }}
                        countryCode={countryCode}
                        onCountryCodeChange={setCountryCode}
                        error={errors.phone}
                        errorMessage={t("required_field")}
                      />
                    </div>

                    <div className="grid gap-1">
                      <Label htmlFor="password">{t("password")}</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            if (e.target.value.trim().length >= 6 && e.target.value.trim().length <= 20) {
                              setErrors((prev) => ({ ...prev, password: false }))
                            }
                            if (e.target.value === confirmPassword) {
                              setErrors((prev) => ({ ...prev, confirmPassword: false }))
                            }
                          }}
                          className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                          maxLength={20}
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
                      {errors.password && <p className="text-red-500 text-[10px]">{t("password_min_length")}</p>}
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
                            if (e.target.value === password) {
                              setErrors((prev) => ({ ...prev, confirmPassword: false }))
                            }
                          }}
                          className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
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
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-[10px]">{t("passwords_dont_match")}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 py-2">
                      <Checkbox
                        id="isStudent"
                        checked={isStudent}
                        onCheckedChange={(checked) => {
                          setIsStudent(checked === true)
                          if (checked) {
                            setProfessionalType("Student")
                          } else {
                            setProfessionalType("Medic")
                          }
                        }}
                      />
                      <Label htmlFor="isStudent" className="text-sm font-normal">
                        {t("student_checkbox")}
                      </Label>
                    </div>

                    {!isStudent && (
                      <>
                        <div className="grid gap-1">
                          <Label htmlFor="professionalType">{t("professional_type")}</Label>
                          <Select
                            value={professionalType}
                            onValueChange={(value) => setProfessionalType(value as ProfessionalType)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("select_professional_type")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Medic">{t("medic")}</SelectItem>
                              <SelectItem value="Nurse">{t("nurse")}</SelectItem>
                              <SelectItem value="NursingTechnician">{t("nursing_technician")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-1">
                          <Label htmlFor="register">{t("professional_register")}</Label>
                          <Input
                            id="register"
                            type="text"
                            value={register}
                            onChange={(e) => {
                              setRegister(e.target.value)
                              if (e.target.value.trim().length >= 4 && e.target.value.trim().length <= 15) {
                                setErrors((prev) => ({ ...prev, register: false }))
                              }
                            }}
                            className={errors.register ? "border-red-500" : ""}
                            maxLength={15}
                          />
                          {errors.register && <p className="text-red-500 text-[10px]">{t("register_min_length")}</p>}
                        </div>
                      </>
                    )}

                    <Button
                      type="submit"
                      className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={
                        isLoading ||
                        !name.trim() ||
                        !email.trim() ||
                        !phone.trim() ||
                        !password.trim() ||
                        !confirmPassword.trim() ||
                        (!isStudent && !register.trim())
                      }
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("processing")}
                        </>
                      ) : (
                        t("register")
                      )}
                    </Button>

                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        {t("already_have_account")}{" "}
                        <Link href={routesMapper.login} className="text-primary hover:underline">
                          {t("login")}
                        </Link>
                      </p>
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
