"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { routesMapper } from "@/utils/routes-mapper"

export function SettingsToggle() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <Button variant="outline" size="icon" onClick={() => router.push(routesMapper.userSettings)}>
      <Settings className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">{t("settings")}</span>
    </Button>
  )
}
