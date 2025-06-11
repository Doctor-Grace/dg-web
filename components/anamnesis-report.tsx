"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import { useFeatureAccess } from "@/hooks/use-feature-access"

export function AnamnesisReport() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const { checkAccess, isVerified, isChecking } = useFeatureAccess()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isChecking || !isVerified) {
      checkAccess()
      return
    }

    setIsLoading(true)

    // Simular processamento
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: t("anamnesis_generated"),
        description: t("anamnesis_success"),
      })
    }, 2000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{t("anamnesis_report")}</CardTitle>
          <CardDescription>{t("anamnesis_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">{t("basic_info")}</TabsTrigger>
              <TabsTrigger value="symptoms">{t("symptoms")}</TabsTrigger>
              <TabsTrigger value="history">{t("medical_history")}</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-name">{t("patient_name")}</Label>
                  <Input id="patient-name" placeholder={t("enter_patient_name")} disabled={isChecking || !isVerified} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-age">{t("patient_age")}</Label>
                  <Input
                    id="patient-age"
                    type="number"
                    placeholder={t("enter_patient_age")}
                    disabled={isChecking || !isVerified}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-gender">{t("patient_gender")}</Label>
                  <Select disabled={isChecking || !isVerified}>
                    <SelectTrigger id="patient-gender">
                      <SelectValue placeholder={t("select_gender")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t("male")}</SelectItem>
                      <SelectItem value="female">{t("female")}</SelectItem>
                      <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultation-date">{t("consultation_date")}</Label>
                  <Input id="consultation-date" type="date" disabled={isChecking || !isVerified} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="symptoms" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="main-complaint">{t("main_complaint")}</Label>
                <Textarea
                  id="main-complaint"
                  placeholder={t("describe_main_complaint")}
                  className="min-h-[100px]"
                  disabled={isChecking || !isVerified}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symptoms-duration">{t("symptoms_duration")}</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="symptoms-duration"
                    type="number"
                    placeholder={t("duration")}
                    disabled={isChecking || !isVerified}
                  />
                  <Select disabled={isChecking || !isVerified}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("unit")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">{t("hours")}</SelectItem>
                      <SelectItem value="days">{t("days")}</SelectItem>
                      <SelectItem value="weeks">{t("weeks")}</SelectItem>
                      <SelectItem value="months">{t("months")}</SelectItem>
                      <SelectItem value="years">{t("years")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="associated-symptoms">{t("associated_symptoms")}</Label>
                <Textarea
                  id="associated-symptoms"
                  placeholder={t("describe_associated_symptoms")}
                  className="min-h-[100px]"
                  disabled={isChecking || !isVerified}
                />
              </div>
            </TabsContent>
            <TabsContent value="history" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="medical-history">{t("previous_medical_history")}</Label>
                <Textarea
                  id="medical-history"
                  placeholder={t("describe_medical_history")}
                  className="min-h-[100px]"
                  disabled={isChecking || !isVerified}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">{t("current_medications")}</Label>
                <Textarea
                  id="medications"
                  placeholder={t("list_current_medications")}
                  className="min-h-[100px]"
                  disabled={isChecking || !isVerified}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">{t("allergies")}</Label>
                <Textarea
                  id="allergies"
                  placeholder={t("list_allergies")}
                  className="min-h-[100px]"
                  disabled={isChecking || !isVerified}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="family-history">{t("family_history")}</Label>
                <Textarea
                  id="family-history"
                  placeholder={t("describe_family_history")}
                  className="min-h-[100px]"
                  disabled={isChecking || !isVerified}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const tabs = ["basic", "symptoms", "history"]
              const currentIndex = tabs.indexOf(activeTab)
              const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length
              setActiveTab(tabs[prevIndex])
            }}
            disabled={activeTab === "basic" || isChecking || !isVerified}
          >
            {t("previous")}
          </Button>
          <Button
            type={activeTab === "history" ? "submit" : "button"}
            onClick={() => {
              if (activeTab !== "history") {
                const tabs = ["basic", "symptoms", "history"]
                const currentIndex = tabs.indexOf(activeTab)
                const nextIndex = (currentIndex + 1) % tabs.length
                setActiveTab(tabs[nextIndex])
              }
            }}
            disabled={isLoading || isChecking || !isVerified}
          >
            {activeTab === "history" ? (
              isLoading ? (
                <>
                  <Skeleton className="h-4 w-4 rounded-full mr-2" />
                  {t("generating")}...
                </>
              ) : (
                t("generate_report")
              )
            ) : (
              t("next")
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
