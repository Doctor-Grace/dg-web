"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUnit } from "effector-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import userStore from "@/store/user/user-store"
import { userUseCase } from "@/useCases/user.useCase"
import { Loader2 } from "lucide-react"
import type { ProfessionalType } from "@/domain/user.domain"

export function EditProfileForm() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const userState = useUnit(userStore)

  const [name, setName] = useState("")
  const [register, setRegister] = useState("")
  const [professionalType, setProfessionalType] = useState<ProfessionalType>("Medic")
  const [isStudent, setIsStudent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Initialize form with user data
    if (userState.name) setName(userState.name)
    if (userState.register) setRegister(userState.register)
    if (userState.professionalType) {
      setProfessionalType(userState.professionalType)
      setIsStudent(userState.professionalType === "Student")
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

    setIsLoading(true)

    await userUseCase.updateUser({
      userId: userState.id,
      name: name.trim(),
      professionalType,
      register: isStudent ? undefined : register.trim(),
      onSuccess: () => {
        toast({
          title: t("success"),
          description: t("profile_updated_success"),
        })
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

  // Validação para o campo de registro profissional
  const validateRegister = (value: string) => {
    // Permitir apenas números e letras, sem caracteres especiais
    return /^[a-zA-Z0-9]*$/.test(value)
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Aplicar a validação e atualizar o estado apenas se for válido
    if (validateRegister(value)) {
      setRegister(value)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="professional-type">{t("professional_type")}</Label>
        <Select
          value={professionalType}
          onValueChange={(value) => {
            setProfessionalType(value as ProfessionalType)
            setIsStudent(value === "Student")
          }}
          disabled={isLoading}
        >
          <SelectTrigger id="professional-type">
            <SelectValue placeholder={t("select_professional_type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Medic">{t("medic")}</SelectItem>
            <SelectItem value="Nurse">{t("nurse")}</SelectItem>
            <SelectItem value="NursingTechnician">{t("nursing_technician")}</SelectItem>
            <SelectItem value="Student">{t("student")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isStudent && (
        <div className="grid gap-2">
          <Label htmlFor="register">{t("professional_register")}</Label>
          <Input
            id="register"
            value={register}
            onChange={handleRegisterChange}
            required={!isStudent}
            disabled={isLoading}
            maxLength={20}
            pattern="[a-zA-Z0-9]+"
            title={t("register_validation_message")}
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading || !name.trim() || (!isStudent && !register.trim())}>
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
