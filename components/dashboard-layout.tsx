"use client"
import type { ReactNode } from "react"
import { useState, useEffect, memo } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { SettingsToggle } from "@/components/settings-toggle"
import { Button } from "@/components/ui/button"
import { LogoutConfirmation } from "@/components/logout-confirmation"
import {
  Home,
  FileImage,
  LogOut,
  ArrowLeft,
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useLanguage } from "@/hooks/use-language"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { VerificationAlert } from "@/components/verification-alert"
import { authUseCase } from "@/useCases/auth.useCase"
import { routesMapper } from "@/utils/routes-mapper"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import Link from "next/link"
import { PageTransition } from "@/components/page-transition"
import { RecentAnalyses } from "@/components/recent-analyses"

interface DashboardLayoutProps {
  children: ReactNode
}

// Componente de sidebar memorizado para evitar re-renderizações desnecessárias
const Sidebar = memo(function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLanguage()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [textVisible, setTextVisible] = useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)

  const activePath = pathname || routesMapper.dashboard

  // Modificar a verificação para incluir rotas de chat com GUID
  const isAnalysisPage = activePath === routesMapper.analysis
  const isChatPage = activePath === routesMapper.chat || activePath.startsWith(`${routesMapper.chat}/`)
  const isAnamnesisPage = activePath === routesMapper.anamnesis
  const isVerificationPage = activePath === routesMapper.verification

  // Check if there's a saved state for the menu
  useEffect(() => {
    // Check if there's a saved state for the menu
    const savedState = localStorage.getItem("menu-collapsed")
    if (savedState) {
      const collapsed = savedState === "true"
      setIsCollapsed(collapsed)
      setTextVisible(!collapsed)
    } else {
      setTextVisible(true)
    }

    // Adicionar um pequeno atraso para garantir que a transição ocorra após o DOM ser atualizado
    const handleResize = () => {
      // Forçar um re-render do componente quando a janela for redimensionada
      setIsCollapsed((prev) => {
        localStorage.setItem("menu-collapsed", String(prev))
        return prev
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Save the state when it changes
  const toggleCollapsed = () => {
    const newState = !isCollapsed

    if (newState) {
      // Estamos fechando o menu, esconder o texto imediatamente
      setTextVisible(false)
      setIsCollapsed(true)
    } else {
      // Estamos abrindo o menu
      setIsCollapsed(false)
      // Aguardar a animação de abertura terminar completamente antes de mostrar o texto
      // A animação tem duração de 0.2s (200ms), então esperamos um pouco mais para garantir
      setTimeout(() => {
        setTextVisible(true)
      }, 250) // Aumentamos para 250ms para garantir que a animação esteja concluída
    }

    // Use requestAnimationFrame para garantir animação suave
    requestAnimationFrame(() => {
      localStorage.setItem("menu-collapsed", String(newState))
    })
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutConfirmation(false)
    authUseCase.logout()
    router.push(routesMapper.login)
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false)
  }

  const handleMenuItemClick = (path: string) => {
    if (pathname !== path) {
      // Use a small timeout to prevent the menu from toggling when navigating
      setTimeout(() => {
        router.push(path)
      }, 10)
    }
  }

  return (
    <>
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
      <motion.aside
        className={cn(
          "hidden border-r bg-background md:block transition-all overflow-hidden h-screen",
          isCollapsed ? "w-16" : "w-64",
        )}
        initial={false}
        animate={{
          width: isCollapsed ? "4rem" : "16rem",
          transition: { duration: 0.2, ease: [0.3, 0.1, 0.3, 1] },
        }}
      >
        <div className="flex h-full max-h-screen flex-col gap-2 p-4">
          <div className={cn("border-b pb-4", isCollapsed && "items-center")}>
            {isCollapsed ? (
              <div className="flex flex-col items-center">
                <motion.div
                  className="flex items-center justify-center cursor-pointer mt-6"
                  onClick={() => router.push(routesMapper.dashboard)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <FileImage className="h-6 w-6 text-primary" />
                </motion.div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleCollapsed}
                  className="h-8 w-8 p-0 mt-4 flex items-center justify-center"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  className="flex items-center justify-between px-3 py-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: textVisible ? 1 : 0 }}
                  transition={{ duration: 0.15 }} // Reduzimos para tornar a transição mais rápida quando o texto aparece
                >
                  <motion.div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => router.push(routesMapper.dashboard)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileImage className="h-6 w-6 text-primary" />
                    {textVisible && <span className="text-primary font-semibold">Doctor Grace</span>}
                  </motion.div>
                  <Button variant="ghost" size="sm" onClick={toggleCollapsed} className="h-8 w-8 p-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          <div className="flex-1">
            <VerificationAlert isCollapsed={isCollapsed} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: 0.05 }}>
              {isAnalysisPage || isVerificationPage ? (
                <nav className="grid gap-1 py-4">
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center justify-start gap-3 rounded-lg py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors",
                        isCollapsed ? "px-2 justify-center" : "px-3",
                      )}
                      onClick={() => router.push(routesMapper.dashboard)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      {!isCollapsed && textVisible && t("back")}
                    </Button>
                  </motion.div>
                  {isAnalysisPage && (
                    <div className="mt-4">
                      <RecentAnalyses isAnalysisPage={true} />
                    </div>
                  )}
                </nav>
              ) : isChatPage ? (
                <nav className="grid gap-1 py-4">
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center justify-start gap-3 rounded-lg py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors",
                        isCollapsed ? "px-2 justify-center" : "px-3",
                      )}
                      onClick={() => router.push(routesMapper.dashboard)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      {!isCollapsed && textVisible && t("back")}
                    </Button>
                  </motion.div>
                  {!isCollapsed && textVisible && (
                    <div className="mt-4 px-3">
                      <h3 className="text-sm font-medium text-primary mb-2">{t("recent_chats")}</h3>
                      <div className="space-y-3">
                        <motion.div
                          className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                          whileHover={{ x: 5, color: "#2A5B64" }}
                          onClick={() => router.push(`${routesMapper.chat}/abc123`)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Paciente João Silva (Hoje)</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                          whileHover={{ x: 5, color: "#2A5B64" }}
                          onClick={() => router.push(`${routesMapper.chat}/def456`)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Paciente Maria Oliveira (Hoje)</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                          whileHover={{ x: 5, color: "#2A5B64" }}
                          onClick={() => router.push(`${routesMapper.chat}/ghi789`)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Paciente Carlos Santos (Ontem)</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                          whileHover={{ x: 5, color: "#2A5B64" }}
                          onClick={() => router.push(`${routesMapper.chat}/jkl012`)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Paciente Ana Pereira (25/03)</span>
                        </motion.div>
                      </div>
                    </div>
                  )}
                </nav>
              ) : isAnamnesisPage ? (
                <nav className="grid gap-1 py-4">
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center justify-start gap-3 rounded-lg py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors",
                        isCollapsed ? "px-2 justify-center" : "px-3",
                      )}
                      onClick={() => router.push(routesMapper.dashboard)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      {!isCollapsed && textVisible && t("back")}
                    </Button>
                  </motion.div>
                  {!isCollapsed && textVisible && (
                    <div className="mt-4 px-3">
                      <h3 className="text-sm font-medium text-primary mb-2">{t("recent_analyses")}</h3>
                      <div className="space-y-3">
                        <motion.div
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                          whileHover={{ x: 5, color: "#2A5B64" }}
                        >
                          <FileText className="h-4 w-4" />
                          <span>Paciente João Silva (Hoje)</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                          whileHover={{ x: 5, color: "#2A5B64" }}
                        >
                          <FileText className="h-4 w-4" />
                          <span>Paciente Maria Oliveira (Hoje)</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                          whileHover={{ x: 5, color: "#2A5B64" }}
                        >
                          <FileText className="h-4 w-4" />
                          <span>Paciente Carlos Santos (Ontem)</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                          whileHover={{ x: 5, color: "#2A5B64" }}
                        >
                          <FileText className="h-4 w-4" />
                          <span>Paciente Ana Pereira (25/03)</span>
                        </motion.div>
                      </div>
                    </div>
                  )}
                </nav>
              ) : (
                <nav className="grid gap-1 py-4">
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center justify-start gap-3 rounded-lg py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors",
                        isCollapsed ? "px-2 justify-center" : "px-3",
                      )}
                      onClick={() => handleMenuItemClick(routesMapper.dashboard)}
                    >
                      <Home className="h-5 w-5" />
                      {!isCollapsed && textVisible && t("home")}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center justify-start gap-3 rounded-lg py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors",
                        isCollapsed ? "px-2 justify-center" : "px-3",
                      )}
                      onClick={() => handleMenuItemClick(routesMapper.analysis)}
                    >
                      <FileImage className="h-5 w-5" />
                      {!isCollapsed && textVisible && t("exam_analysis")}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center justify-start gap-3 rounded-lg py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors",
                        isCollapsed ? "px-2 justify-center" : "px-3",
                      )}
                      onClick={() => handleMenuItemClick(routesMapper.chat)}
                    >
                      <MessageSquare className="h-5 w-5" />
                      {!isCollapsed && textVisible && t("chat")}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center justify-start gap-3 rounded-lg py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors",
                        isCollapsed ? "px-2 justify-center" : "px-3",
                      )}
                      onClick={() => handleMenuItemClick(routesMapper.anamnesis)}
                    >
                      <FileText className="h-5 w-5" />
                      {!isCollapsed && textVisible && t("anamnesis_report")}
                    </Button>
                  </motion.div>
                </nav>
              )}
            </motion.div>
          </div>
          <div className="border-t pt-4">
            <motion.div
              className={cn("flex items-center px-3 py-2", isCollapsed ? "justify-center px-0" : "justify-between")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {!isCollapsed && textVisible && (
                <div className="flex gap-2">
                  <ModeToggle />
                  <LanguageToggle />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <SettingsToggle />
                  </motion.div>
                </div>
              )}
              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleLogoutClick}
                    className={cn(isCollapsed && "w-10 h-10 p-0")}
                  >
                    <LogOut className={cn("h-4 w-4")} />
                    <span className="sr-only">{t("logout")}</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.aside>
    </>
  )
})

// Componente de sidebar mobile memorizado
const MobileSidebar = memo(function MobileSidebar() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLanguage()
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)

  // Modificar a verificação para incluir rotas de chat com GUID
  const isAnalysisPage = pathname === routesMapper.analysis
  const isChatPage = pathname === routesMapper.chat || pathname.startsWith(`${routesMapper.chat}/`)
  const isAnamnesisPage = pathname === routesMapper.anamnesis
  const isVerificationPage = pathname === routesMapper.verification

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutConfirmation(false)
    authUseCase.logout()
    router.push(routesMapper.login)
  }

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false)
  }

  if (!isMobile) {
    return null
  }

  return (
    <>
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
      <div className="fixed top-0 left-0 z-50 p-4 bg-background/80 backdrop-blur-sm rounded-br-lg">
        <Sheet>
          <SheetTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </motion.div>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-background">
            <div className="flex h-full max-h-screen flex-col gap-2 p-4">
              <div className="flex items-center gap-2 px-3 py-4 border-b">
                <FileImage className="h-6 w-6 text-primary" />
                <span className="text-primary font-semibold">Doctor Grace</span>
              </div>
              <div className="flex-1">
                <VerificationAlert isCollapsed={false} />
                {isAnalysisPage || isVerificationPage ? (
                  <nav className="grid gap-1 py-4">
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(routesMapper.dashboard)
                      }}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      {t("back")}
                    </Button>
                    {isAnalysisPage && (
                      <div className="mt-4">
                        <RecentAnalyses isAnalysisPage={true} />
                      </div>
                    )}
                  </nav>
                ) : isChatPage ? (
                  <nav className="grid gap-1 py-4">
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(routesMapper.dashboard)
                      }}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      {t("back")}
                    </Button>
                    <div className="mt-4 px-3">
                      <h3 className="text-sm font-medium text-primary mb-2">{t("recent_chats")}</h3>
                      <div className="space-y-3">
                        <div
                          className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                          onClick={() => router.push(`${routesMapper.chat}/abc123`)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Paciente João Silva (Hoje)</span>
                        </div>
                        <div
                          className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                          onClick={() => router.push(`${routesMapper.chat}/def456`)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Paciente Maria Oliveira (Hoje)</span>
                        </div>
                        <div
                          className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                          onClick={() => router.push(`${routesMapper.chat}/ghi789`)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Paciente Carlos Santos (Ontem)</span>
                        </div>
                        <div
                          className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
                          onClick={() => router.push(`${routesMapper.chat}/jkl012`)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Paciente Ana Pereira (25/03)</span>
                        </div>
                      </div>
                    </div>
                  </nav>
                ) : isAnamnesisPage ? (
                  <nav className="grid gap-1 py-4">
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(routesMapper.dashboard)
                      }}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      {t("back")}
                    </Button>
                    <div className="mt-4 px-3">
                      <h3 className="text-sm font-medium text-primary mb-2">{t("recent_analyses")}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>Paciente João Silva (Hoje)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>Paciente Maria Oliveira (Hoje)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>Paciente Carlos Santos (Ontem)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>Paciente Ana Pereira (25/03)</span>
                        </div>
                      </div>
                    </div>
                  </nav>
                ) : (
                  <nav className="grid gap-1 py-4">
                    <Link
                      href={routesMapper.dashboard}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      <Home className="h-5 w-5" />
                      {t("home")}
                    </Link>
                    <Link
                      href={routesMapper.analysis}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      <FileImage className="h-5 w-5" />
                      {t("exam_analysis")}
                    </Link>
                    <Link
                      href={routesMapper.chat}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      <MessageSquare className="h-5 w-5" />
                      {t("chat")}
                    </Link>
                    <Link
                      href={routesMapper.anamnesis}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      <FileText className="h-5 w-4" />
                      {t("anamnesis_report")}
                    </Link>
                  </nav>
                )}
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex gap-2">
                    <ModeToggle />
                    <LanguageToggle />
                  </div>
                  <div className="flex gap-2">
                    <SettingsToggle />
                    <Button variant="outline" size="icon" onClick={handleLogoutClick}>
                      <LogOut className="h-4 w-4" />
                      <span className="sr-only">{t("logout")}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
})

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen medical-bg">
      <Sidebar />
      <MobileSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <motion.div
            className="mx-auto max-w-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="rounded-lg border bg-card p-6 shadow-sm"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            >
              <PageTransition>{children}</PageTransition>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}