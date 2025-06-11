"use client"

import type React from "react"

import { useState } from "react"
import { useUnit } from "effector-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import userStore from "@/store/user/user-store"
import { userUseCase } from "@/useCases/user.useCase"
import { Loader2, Eye, EyeOff } from "lucide-react"

export function EditPasswordForm() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const userState = useUnit(userStore)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
    passwordMatch: false,
  })

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

    // Validate form
    const newErrors = {
      currentPassword: currentPassword.trim() === "",
      newPassword: newPassword.trim().length < 6,
      confirmPassword: confirmPassword.trim() === "",
      passwordMatch: newPassword !== confirmPassword,
    }

    setErrors(newErrors)

    if (Object.values(newErrors).some(Boolean)) {
      return
    }

    setIsLoading(true)

    await userUseCase.changePassword({
      userId: userState.id,
      currentPassword: currentPassword.trim(),
      password: newPassword.trim(),
      passwordConfirmation: confirmPassword.trim(),
      onSuccess: () => {
        toast({
          title: t("success"),
          description: t("password_changed"),
        })
        // Reset form
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
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
        <Label htmlFor="current-password">{t("current_password")}</Label>
        <div className="relative">
          <Input
            id="current-password"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value)
              if (e.target.value.trim() !== "") {
                setErrors((prev) => ({ ...prev, currentPassword: false }))
              }
            }}
            required
            disabled={isLoading}
            className={errors.currentPassword ? "border-red-500 pr-10" : "pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
          >
            {showCurrentPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">{showCurrentPassword ? t("hide_password") : t("show_password")}</span>
          </button>
        </div>
        {errors.currentPassword && <p className="text-red-500 text-[10px]">{t("required_field")}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="new-password">{t("new_password")}</Label>
        <div className="relative">
          <Input
            id="new-password"
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
            required
            disabled={isLoading}
            className={errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
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

      <div className="grid gap-2">
        <Label htmlFor="confirm-password">{t("confirm_password")}</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (e.target.value.trim() !== "") {
                setErrors((prev) => ({ ...prev, confirmPassword: false }))
              }
              if (e.target.value === newPassword) {
                setErrors((prev) => ({ ...prev, passwordMatch: false }))
              }
            }}
            required
            disabled={isLoading}
            className={errors.confirmPassword || errors.passwordMatch ? "border-red-500 pr-10" : "pr-10"}
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
            <span className="sr-only">{showConfirmPassword ? t("hide_password") : t("show_password")}</span>
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-[10px]">{t("required_field")}</p>}
        {!errors.confirmPassword && errors.passwordMatch && (
          <p className="text-red-500 text-[10px]">{t("passwords_dont_match")}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={
            isLoading ||
            !currentPassword.trim() ||
            !newPassword.trim() ||
            !confirmPassword.trim() ||
            newPassword !== confirmPassword
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("saving")}...
            </>
          ) : (
            t("change_password")
          )}
        </Button>
      </div>
    </form>
  )
}
