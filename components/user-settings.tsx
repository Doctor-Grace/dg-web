"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { EditProfileForm } from "@/components/edit-profile-form"
import { EditEmailForm } from "@/components/edit-email-form"
import { EditPhoneForm } from "@/components/edit-phone-form"
import { EditPasswordForm } from "@/components/edit-password-form"
import { PageTransition } from "@/components/page-transition"

export function UserSettings() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">{t("user_settings")}</h1>
          <p className="text-muted-foreground">{t("manage_your_account_settings")}</p>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">{t("edit_profile")}</TabsTrigger>
            <TabsTrigger value="email">{t("change_email")}</TabsTrigger>
            <TabsTrigger value="phone">{t("change_phone")}</TabsTrigger>
            <TabsTrigger value="password">{t("change_password")}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("edit_profile")}</CardTitle>
                <CardDescription>{t("update_your_profile_information")}</CardDescription>
              </CardHeader>
              <CardContent>
                <EditProfileForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("change_email")}</CardTitle>
                <CardDescription>{t("update_your_email_address")}</CardDescription>
              </CardHeader>
              <CardContent>
                <EditEmailForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phone" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("change_phone")}</CardTitle>
                <CardDescription>{t("update_your_phone_number")}</CardDescription>
              </CardHeader>
              <CardContent>
                <EditPhoneForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("change_password")}</CardTitle>
                <CardDescription>{t("update_your_password")}</CardDescription>
              </CardHeader>
              <CardContent>
                <EditPasswordForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
