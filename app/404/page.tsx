"use client"

import { Frown } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"

export default function NotFound() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <div
      className="min-h-screen flex flex-grow items-center justify-center"
      style={{
        backgroundImage: `url("/images/doctor_login_bg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="rounded-lg bg-card p-14 text-center shadow-xl border">
        <Frown className="m-auto h-14 w-14 pb-4 text-primary" />
        <h1 className="mb-4 text-4xl font-bold text-primary">404</h1>
        <p className="text-muted-foreground">{t("page_not_found")}</p>
        <Button
          className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => {
            router.push("/login")
          }}
        >
          {t("return")}
        </Button>
      </div>
    </div>
  )
}
