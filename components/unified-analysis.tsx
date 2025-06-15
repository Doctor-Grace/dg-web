"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useFeatureAccess } from "@/hooks/use-feature-access";
import { useUserStore } from "@/hooks/use-user-store";
import { ExamService } from "@/services/exam.service";
import {
  examTypeToDestination,
  examTypeToConsumption,
} from "@/domain/exam.domain";
import { cn } from "@/lib/utils";
import { Loader2, Upload, X } from "lucide-react";

export function UnifiedAnalysis() {
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { checkAccess, isVerified, isChecking } = useFeatureAccess();
  const user = useUserStore();
  const [examType, setExamType] = useState<string>("");
  const [reasonForRequestingExam, setReasonForRequestingExam] =
    useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  // Verificar acesso ao carregar o componente
  useEffect(() => {
    checkAccess();
  }, []);

  const handleExamTypeChange = (value: string) => {
    setExamType(value);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isVerified) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (isChecking || !isVerified) {
      checkAccess();
      return;
    }

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isChecking || !isVerified) {
      checkAccess();
      return;
    }

    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (selectedFiles: File[]) => {
    // Filtrar apenas imagens
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    // Permitir múltiplas imagens agora que o endpoint suporta
    if (imageFiles.length > 10) {
      toast({
        title: t("too_many_images"),
        description: "Máximo de 10 imagens por análise",
        variant: "destructive",
      });
      return;
    }

    setFiles(imageFiles);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (isChecking || !isVerified) {
      checkAccess();
      return;
    }

    if (!examType) {
      toast({
        title: t("missing_exam_type"),
        description: t("select_exam_type"),
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: t("missing_images"),
        description: t("upload_at_least_one_image"),
        variant: "destructive",
      });
      return;
    }

    if (!reasonForRequestingExam.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo da solicitação do exame",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Usuário não identificado. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const fileDestinationType = examTypeToDestination[examType];
      const consumptionType = examTypeToConsumption[examType];

      if (!fileDestinationType || !consumptionType) {
        throw new Error(`Tipo de exame não suportado: ${examType}`);
      }

      // Etapa 1: Upload dos arquivos
      setCurrentStep(t("uploading_files"));
      const imageIds: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progressPerFile = 60 / files.length;
        const currentProgress = i * progressPerFile;

        setUploadProgress(currentProgress);
        console.log(
          `Fazendo upload do arquivo ${i + 1}/${files.length}: ${file.name}`
        );

        const uploadResponse = await ExamService.uploadFile(
          fileDestinationType,
          file.name,
          file
        );
        imageIds.push(uploadResponse.data.fileId);

        console.log(
          `Upload ${i + 1} concluído. FileId:`,
          uploadResponse.data.fileId
        );
      }

      // Etapa 2: Análise do exame
      setCurrentStep(t("analyzing_exams"));
      setUploadProgress(80);

      const analysisResponse = await ExamService.analyzeExam(
        imageIds,
        consumptionType,
        user.id,
        reasonForRequestingExam.trim()
      );

      console.log("Análise concluída:", analysisResponse);

      setUploadProgress(100);
      setCurrentStep(t("analysis_complete"));

      toast({
        title: t("analysis_complete"),
        description: t("analysis_success"),
      });

      // Redirecionar para a página de resultados
      router.push(`/dashboard/analise/${analysisResponse.data.id}`);
    } catch (error) {
      console.error("Erro na análise:", error);

      let errorMessage = t("unknown_error");
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: t("analysis_error"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
      setCurrentStep("");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("exam_analysis")}</CardTitle>
        <CardDescription>{t("select_exam_type_and_upload")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="exam-type" className="text-sm font-medium">
            {t("exam_type")}
          </label>
          <Select
            value={examType}
            onValueChange={handleExamTypeChange}
            disabled={isChecking || !isVerified || isLoading}
          >
            <SelectTrigger id="exam-type" className="w-full">
              <SelectValue placeholder={t("select_exam_type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xray">{t("xray")}</SelectItem>
              <SelectItem value="mri">{t("mri")}</SelectItem>
              <SelectItem value="ct">{t("tomography")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="reason" className="text-sm font-medium">
            Motivo da solicitação do exame *
          </label>
          <Textarea
            id="reason"
            placeholder="Descreva o motivo da solicitação do exame (ex: dor abdominal, suspeita de fratura, etc.)"
            value={reasonForRequestingExam}
            onChange={(e) => setReasonForRequestingExam(e.target.value)}
            disabled={isChecking || !isVerified || isLoading}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Carregar imagens (máximo 10)
          </label>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20 hover:border-primary/50",
              !isVerified || isLoading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer",
              "relative"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() =>
              !isVerified || isLoading
                ? checkAccess()
                : document.getElementById("file-upload")?.click()
            }
          >
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isChecking || !isVerified || isLoading}
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t("drag_drop_or")}{" "}
                <span className="text-primary font-medium">{t("browse")}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {t("supported_formats")}
              </p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Imagens selecionadas ({files.length})
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={`Uploaded ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                    disabled={isChecking || !isVerified || isLoading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{currentStep}</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading || isChecking || !isVerified}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {currentStep || t("processing")}...
            </>
          ) : (
            t("analyze_images")
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
