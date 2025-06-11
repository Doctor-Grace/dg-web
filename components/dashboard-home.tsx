"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileImage, MessageSquare, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { useUnit } from "effector-react"
import userStore from "@/store/user/user-store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { routesMapper } from "@/utils/routes-mapper"

export function DashboardHome() {
  const { t } = useLanguage()
  const userState = useUnit(userStore)

  // Verificar se o usuário confirmou email e telefone
  const needsVerification = false

  return (
    <div className="space-y-6">
      <div className="md:mt-0 mt-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">{t("home")}</h1>
        <p className="text-muted-foreground">{t("welcome")}</p>
      </div>

      {false && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("verification_required")}</AlertTitle>
          <AlertDescription>
            {!userState.emailConfirmed && !userState.phoneConfirmed
              ? t("email_and_phone_verification_required")
              : !userState.emailConfirmed
                ? t("email_verification_required")
                : t("phone_verification_required")}
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 bg-background"
            onClick={() => (window.location.href = routesMapper.verification)}
          >
            {t("verify_now")}
          </Button>
        </Alert>
      )}

      <h2 className="text-xl font-semibold mt-8 text-primary">{t("tools")}</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("exam_analysis")}</CardTitle>
            <FileImage className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-sm text-muted-foreground">{t("exam_analysis_desc_simple")}</div>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href={routesMapper.analysis}>{t("analyze_exams")}</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:border-primary/50 transition-colors flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("chat")}</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-sm text-muted-foreground">{t("ai_chat_desc")}</div>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href={routesMapper.chat}>{t("start_chat")}</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:border-primary/50 transition-colors flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("anamnesis_report")}</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="text-sm text-muted-foreground">{t("anamnesis_report_desc")}</div>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href={routesMapper.anamnesis}>{t("create_report")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
