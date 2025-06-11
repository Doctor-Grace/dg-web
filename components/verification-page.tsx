"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUnit } from "effector-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import { Loader2, Mail, Phone } from "lucide-react"
import userStore from "@/store/user/user-store"
import { userUseCase } from "@/useCases/user.useCase"
import { PageTransition } from "@/components/page-transition"
import { authUseCase } from "@/useCases/auth.useCase"

export function VerificationPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const userState = useUnit(userStore)

  const [emailCode, setEmailCode] = useState("")
  const [phoneCode, setPhoneCode] = useState("")
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false)
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false)
  const [isSendingPhoneCode, setIsSendingPhoneCode] = useState(false)
  const [activeTab, setActiveTab] = useState<string | null>(null)

  useEffect(() => {
    authUseCase.canUseApplication()

    // Definir a aba ativa com base no que precisa ser verificado
    if (!userState.emailConfirmed) {
      setActiveTab("email")
    } else if (!userState.phoneConfirmed) {
      setActiveTab("phone")
    } else {
      // Se ambos estiverem verificados, redirecionar para o dashboard
      router.push("/dashboard")
    }
  }, [userState.emailConfirmed, userState.phoneConfirmed, router])

  const handleSendEmailCode = async () => {
    if (!userState.id) {
      toast({
        title: t("error"),
        description: t("user_not_found"),
        variant: "destructive",
      })
      return
    }

    setIsSendingEmailCode(true)

    const knownErrorKeys = ["send_email_error", "server_error"]

    await userUseCase.sendActivationEmail({
      userId: userState.id,
      onSuccess: () => {
        toast({
          title: t("success"),
          description: t("activation_email_sent"),
        })
      },
      onError: (errorMessage) => {
        // Display the error message directly without trying to translate it
        // Only translate known error keys that are part of our i18n system

        const errorText = knownErrorKeys.includes(errorMessage) ? t(errorMessage) : errorMessage

        toast({
          title: t("error"),
          description: errorText,
          variant: "destructive",
        })
      },
    })

    setIsSendingEmailCode(false)
  }

  const handleSendPhoneCode = async () => {
    if (!userState.id) {
      toast({
        title: t("error"),
        description: t("user_not_found"),
        variant: "destructive",
      })
      return
    }

    setIsSendingPhoneCode(true)

    const knownErrorKeys = ["send_sms_error", "server_error"]

    await userUseCase.sendActivationSms({
      userId: userState.id,
      onSuccess: () => {
        toast({
          title: t("success"),
          description: t("activation_sms_sent"),
        })
      },
      onError: (errorMessage) => {
        // Display the error message directly without trying to translate it
        // Only translate known error keys = ["send_sms_error", "server_error"]

        const errorText = knownErrorKeys.includes(errorMessage) ? t(errorMessage) : errorMessage

        toast({
          title: t("error"),
          description: errorText,
          variant: "destructive",
        })
      },
    })

    setIsSendingPhoneCode(false)
  }

  const handleVerifyEmail = async () => {
    if (!userState.id || !emailCode.trim()) {
      toast({
        title: t("error"),
        description: !emailCode.trim() ? t("required_field") : t("user_not_found"),
        variant: "destructive",
      })
      return
    }

    setIsVerifyingEmail(true)

    const knownErrorKeys = ["invalid_verification_code", "server_error"]

    await userUseCase.confirmEmailCode({
      userId: userState.id,
      code: emailCode,
      onSuccess: () => {
        toast({
          title: t("success"),
          description: t("email_verified"),
        })

        // Verificar se ambos estão confirmados para redirecionar
        if (userState.phoneConfirmed) {
          router.push("/dashboard")
        } else {
          setActiveTab("phone")
        }
      },
      onError: (errorMessage) => {
        // Display the error message directly without trying to translate it
        // Only translate known error keys that are part of our i18n system

        const errorText = knownErrorKeys.includes(errorMessage) ? t(errorMessage) : errorMessage

        toast({
          title: t("error"),
          description: errorText,
          variant: "destructive",
        })
      },
    })

    setIsVerifyingEmail(false)
  }

  const handleVerifyPhone = async () => {
    if (!userState.id || !phoneCode.trim()) {
      toast({
        title: t("error"),
        description: !phoneCode.trim() ? t("required_field") : t("user_not_found"),
        variant: "destructive",
      })
      return
    }

    setIsVerifyingPhone(true)

    const knownErrorKeys = ["invalid_verification_code", "server_error"]

    await userUseCase.confirmSmsCode({
      userId: userState.id,
      code: phoneCode,
      onSuccess: () => {
        toast({
          title: t("success"),
          description: t("sms_verified"),
        })

        // Verificar se ambos estão confirmados para redirecionar
        if (userState.emailConfirmed) {
          router.push("/dashboard")
        } else {
          setActiveTab("email")
        }
      },
      onError: (errorMessage) => {
        // Display the error message directly without trying to translate it
        // Only translate known error keys that are part of our i18n system

        const errorText = knownErrorKeys.includes(errorMessage) ? t(errorMessage) : errorMessage

        toast({
          title: t("error"),
          description: errorText,
          variant: "destructive",
        })
      },
    })

    setIsVerifyingPhone(false)
  }

  // Função para transformar o texto em maiúsculas
  const handleEmailCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailCode(e.target.value.toUpperCase())
  }

  const handlePhoneCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneCode(e.target.value.toUpperCase())
  }

  // Se não houver nada para verificar, redirecionar para o dashboard
  if (userState.emailConfirmed && userState.phoneConfirmed) {
    return null
  }

  // Se apenas o email precisa ser verificado
  if (!userState.emailConfirmed && userState.phoneConfirmed) {
    return (
      <PageTransition>
        <div className="w-full max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-primary mb-6 text-center">{t("email_verification")}</h2>
              <div className="space-y-4">
                <div className="text-center py-2 text-muted-foreground">{t("email_verification_instructions")}</div>

                <div className="space-y-2">
                  <Label htmlFor="email-code">{t("verification_code")}</Label>
                  <Input
                    id="email-code"
                    value={emailCode}
                    onChange={handleEmailCodeChange}
                    maxLength={9}
                    className="uppercase"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={handleSendEmailCode} disabled={isSendingEmailCode}>
                    {isSendingEmailCode ? <Loader2 className="h-4 w-4 animate-spin" /> : t("send_code")}
                  </Button>

                  <Button
                    onClick={handleVerifyEmail}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isVerifyingEmail || !emailCode.trim()}
                  >
                    {isVerifyingEmail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("verifying")}
                      </>
                    ) : (
                      t("verify_email")
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    )
  }

  // Se apenas o telefone precisa ser verificado
  if (userState.emailConfirmed && !userState.phoneConfirmed) {
    return (
      <PageTransition>
        <div className="w-full max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-primary mb-6 text-center">{t("sms_verification")}</h2>
              <div className="space-y-4">
                <div className="text-center py-2 text-muted-foreground">{t("sms_verification_instructions")}</div>

                <div className="space-y-2">
                  <Label htmlFor="phone-code">{t("verification_code")}</Label>
                  <Input
                    id="phone-code"
                    value={phoneCode}
                    onChange={handlePhoneCodeChange}
                    maxLength={9}
                    className="uppercase"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={handleSendPhoneCode} disabled={isSendingPhoneCode}>
                    {isSendingPhoneCode ? <Loader2 className="h-4 w-4 animate-spin" /> : t("send_code")}
                  </Button>

                  <Button
                    onClick={handleVerifyPhone}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isVerifyingPhone || !phoneCode.trim()}
                  >
                    {isVerifyingPhone ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("verifying")}
                      </>
                    ) : (
                      t("verify_sms")
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    )
  }

  // Se ambos precisam ser verificados, mostrar as abas
  return (
    <PageTransition>
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">{t("verification_required")}</h2>

            <Tabs value={activeTab || "email"} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">
                  <Mail className="mr-2 h-4 w-4" />
                  {t("email_verification")}
                </TabsTrigger>
                <TabsTrigger value="phone">
                  <Phone className="mr-2 h-4 w-4" />
                  {t("sms_verification")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <div className="text-center py-2 text-muted-foreground">{t("email_verification_instructions")}</div>

                <div className="space-y-2">
                  <Label htmlFor="email-code">{t("verification_code")}</Label>
                  <Input
                    id="email-code"
                    value={emailCode}
                    onChange={handleEmailCodeChange}
                    maxLength={9}
                    className="uppercase"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={handleSendEmailCode} disabled={isSendingEmailCode}>
                    {isSendingEmailCode ? <Loader2 className="h-4 w-4 animate-spin" /> : t("send_code")}
                  </Button>

                  <Button
                    onClick={handleVerifyEmail}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isVerifyingEmail || !emailCode.trim()}
                  >
                    {isVerifyingEmail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("verifying")}
                      </>
                    ) : (
                      t("verify_email")
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                <div className="text-center py-2 text-muted-foreground">{t("sms_verification_instructions")}</div>

                <div className="space-y-2">
                  <Label htmlFor="phone-code">{t("verification_code")}</Label>
                  <Input
                    id="phone-code"
                    value={phoneCode}
                    onChange={handlePhoneCodeChange}
                    maxLength={9}
                    className="uppercase"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={handleSendPhoneCode} disabled={isSendingPhoneCode}>
                    {isSendingPhoneCode ? <Loader2 className="h-4 w-4 animate-spin" /> : t("send_code")}
                  </Button>

                  <Button
                    onClick={handleVerifyPhone}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isVerifyingPhone || !phoneCode.trim()}
                  >
                    {isVerifyingPhone ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("verifying")}
                      </>
                    ) : (
                      t("verify_sms")
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  )
}

export default VerificationPage
