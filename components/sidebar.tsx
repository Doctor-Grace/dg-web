"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "./mode-toggle"
import { LanguageToggle } from "./language-toggle"
import { SettingsToggle } from "./settings-toggle"
import { AppLink } from "./app-link"
import { useLanguage } from "@/hooks/use-language"
import { useAuthStore } from "@/store/auth/auth-store"
import { clearAuthCookies } from "@/utils/auth-cookies"
import { useRouter } from "next/navigation"
import { Home, Menu, MessageSquare, FileText, ImageIcon, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    clearAuthCookies()
    router.push("/login")
  }

  const navItems = [
    {
      title: t.sidebar.home,
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      requiresAuth: true,
    },
    {
      title: t.sidebar.chat,
      href: "/dashboard/chat",
      icon: <MessageSquare className="h-5 w-5" />,
      requiresAuth: true,
    },
    {
      title: t.sidebar.anamnesis,
      href: "/dashboard/anamnesis",
      icon: <FileText className="h-5 w-5" />,
      requiresAuth: true,
    },
    {
      title: t.sidebar.analysis,
      href: "/dashboard/analise",
      icon: <ImageIcon className="h-5 w-5" />,
      requiresAuth: true,
    },
  ]

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <ScrollArea className="h-[calc(100vh-8rem)] pb-10">
            <div className="flex flex-col gap-4 py-4">
              {navItems.map(
                (item) =>
                  (!item.requiresAuth || isAuthenticated) && (
                    <AppLink
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      {item.icon}
                      {item.title}
                    </AppLink>
                  ),
              )}
            </div>
          </ScrollArea>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <ModeToggle />
              <LanguageToggle />
              <SettingsToggle />
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-primary"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">{t.sidebar.logout}</span>
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className={cn("hidden md:flex md:flex-col h-screen border-r", className)}>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-2 p-4">
            {navItems.map(
              (item) =>
                (!item.requiresAuth || isAuthenticated) && (
                  <AppLink
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent"
                  >
                    {item.icon}
                    {item.title}
                  </AppLink>
                ),
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex flex-col gap-2">
            <ModeToggle />
            <LanguageToggle />
            <SettingsToggle />
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-primary"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">{t.sidebar.logout}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}