"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUnit } from "effector-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import userStore from "@/store/user/user-store"
import { userUseCase } from "@/useCases/user.useCase"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { routesMapper } from "@/utils/routes-mapper"
import { PhoneInput, countryCodes } from "@/components/phone-input"

export function EditPhoneForm() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const userState = useUnit(userStore)

  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+55")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({ phone: false })

  useEffect(() => {
    // Initialize country code if available
    if (userState.phone) {
      const phone = userState.phone
      const countryCodeObj = countryCodes.find((c) => phone.startsWith(c.code.replace("+", "")))
      if (countryCodeObj) {
        setCountryCode(countryCodeObj.code)
      }
    }
  }, [userState])

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

    // Validate phone
    if (phone.trim().length < 8) {
      setError({ phone: true })
      return
    }

    setIsLoading(true)

    // Format phone with country code
    const formattedPhone = `${countryCode.replace("+", "")}${phone.trim()}`

    await userUseCase.changePhone({
      userId: userState.id,
      phone: formattedPhone,
      onSuccess: () => {
        toast({
          title: t("success"),
          description: t("phone_updated_success"),
        })

        // Redirect to verification page since phone needs to be verified again
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
        <Label htmlFor="phone">{t("phone_number")}</Label>
        <PhoneInput
          id="phone"
          value={phone}
          onChange={(value) => {
            setPhone(value)
            if (value.trim().length >= 8) {
              setError({ phone: false })
            }
          }}
          countryCode={countryCode}
          onCountryCodeChange={setCountryCode}
          error={error.phone}
          errorMessage={t("phone_min_length")}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading || !phone.trim()}>
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
