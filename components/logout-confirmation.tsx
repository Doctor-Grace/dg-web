"use client"

import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LogOut } from "lucide-react"

interface LogoutConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function LogoutConfirmation({ isOpen, onClose, onConfirm }: LogoutConfirmationProps) {
  const { t } = useLanguage()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-destructive" />
            {t("logout_confirmation_title") || "Confirmar Saída"}
          </DialogTitle>
          <DialogDescription>
            {t("logout_confirmation_description") || "Tem certeza que deseja sair do sistema?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            {t("cancel") || "Cancelar"}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("confirm_logout") || "Sim, sair"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
