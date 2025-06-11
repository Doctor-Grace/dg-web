"use client"

import { Frown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { useLanguage } from "@/hooks/use-language"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Inicializar o hook de idioma
  const { t } = useLanguage()

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-grow items-center justify-center medical-bg">
            <div className="rounded-lg bg-card p-14 text-center shadow-xl border">
              <Frown className="m-auto h-14 w-14 pb-4 text-primary" />
              <h1 className="mb-4 text-4xl font-bold text-primary">{t("error")}</h1>
              <p className="text-muted-foreground mb-4">{t("unexpected_error")}</p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => reset()}>
                {t("try_again")}
              </Button>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
