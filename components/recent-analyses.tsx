
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { ExamService } from "@/services/exam.service";
import type { ExamHistoryItem } from "@/domain/exam.domain";
import { Clock, ChevronRight } from "lucide-react";

interface RecentAnalysesProps {
  isAnalysisPage?: boolean;
}

export function RecentAnalyses({ isAnalysisPage = false }: RecentAnalysesProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [examHistory, setExamHistory] = useState<ExamHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (isAnalysisPage) {
      loadExamHistory();
    }
  }, [isAnalysisPage, currentPage]);

  const loadExamHistory = async () => {
    try {
      setIsLoading(true);
      const response = await ExamService.getExamHistory(currentPage, 10);
      setExamHistory(response.data.exams);
      setTotalPages(response.data.pager.totalPages);
    } catch (error) {
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de análises.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExamClick = (examId: string) => {
    router.push(`/dashboard/analise/${examId}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!isAnalysisPage) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Análises Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        ) : examHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma análise encontrada
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {examHistory.map((exam) => (
                <div
                  key={exam.id}
                  onClick={() => handleExamClick(exam.id)}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{exam.examTypeDescription}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(exam.createdAt)}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
