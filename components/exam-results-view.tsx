"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/hooks/use-language"
import type { ExamAnalysisOutModel } from "@/domain/exam.domain"
import { ArrowLeft, Download, Eye, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExamResultsViewProps {
  examId: string
}

export function ExamResultsView({ examId }: ExamResultsViewProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [examData, setExamData] = useState<ExamAnalysisOutModel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    loadExamResults()
  }, [examId])

  const loadExamResults = async () => {
    try {
      setIsLoading(true)
      // Aqui você implementaria um endpoint para buscar os resultados por ID
      // Por enquanto, vamos simular os dados
      setTimeout(() => {
        setExamData({
          id: examId,
          examType: "xray",
          analysisResult:
            "Análise completa realizada com sucesso. Estruturas ósseas preservadas, sem sinais de fraturas ou lesões aparentes.",
          confidence: 0.92,
          findings: [
            "Estruturas ósseas íntegras",
            "Articulações preservadas",
            "Sem sinais de inflamação",
            "Densidade óssea normal",
          ],
          recommendations: [
            "Manter acompanhamento de rotina",
            "Exercícios de fortalecimento recomendados",
            "Retorno em 6 meses se sintomas persistirem",
          ],
          createdAt: new Date().toISOString(),
          fileUrls: [
            "/placeholder.svg?height=400&width=400&text=Raio-X+1",
            "/placeholder.svg?height=400&width=400&text=Raio-X+2",
          ],
        })
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Erro ao carregar resultados:", error)
      toast({
        title: t("error_loading_results"),
        description: t("try_again_later"),
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const getExamTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      xray: t("xray"),
      mri: t("mri"),
      ct: t("tomography"),
    }
    return labels[type] || type
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500"
    if (confidence >= 0.6) return "bg-yellow-500"
    return "bg-red-500"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!examData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">{t("exam_not_found")}</p>
            <Button onClick={() => router.back()} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("go_back")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t("exam_results")}</h1>
            <p className="text-muted-foreground">
              {getExamTypeLabel(examData.examType)} • {formatDate(examData.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t("download_report")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Imagens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {t("exam_images")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={examData.fileUrls[selectedImageIndex] || "/placeholder.svg"}
                alt={`Exam image ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            {examData.fileUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {examData.fileUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors",
                      selectedImageIndex === index ? "border-primary" : "border-muted",
                    )}
                  >
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="space-y-6">
          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t("analysis_summary")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{getExamTypeLabel(examData.examType)}</Badge>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", getConfidenceColor(examData.confidence))} />
                  <span className="text-sm text-muted-foreground">
                    {t("confidence")}: {Math.round(examData.confidence * 100)}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{examData.analysisResult}</p>
            </CardContent>
          </Card>

          {/* Achados */}
          <Card>
            <CardHeader>
              <CardTitle>{t("findings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {examData.findings.map((finding, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm">{finding}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recomendações */}
          <Card>
            <CardHeader>
              <CardTitle>{t("recommendations")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {examData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
