import api from "@/clients/api"
import type {
  GetUrlForUploadResponse,
  ExamAnalysisRequest,
  ExamAnalysisResponse,
  FileDestinationType,
  TokenConsumptionType,
} from "@/domain/exam.domain"

export class ExamService {
  static async uploadFile(
    fileDestinationType: FileDestinationType,
    fileName: string,
  ): Promise<GetUrlForUploadResponse> {
    try {
      console.log("Fazendo upload do arquivo:", fileName, "Tipo:", fileDestinationType)

      const response = await api.get<GetUrlForUploadResponse>(
        `/api/v1/FileControl/get-upload-url/${fileDestinationType}/${encodeURIComponent(fileName)}`,
      )

      // Validar se a resposta contém os dados necessários
      if (!response.data) {
        throw new Error("Resposta inválida do servidor")
      }

      if (response.data.hasError) {
        throw new Error(response.data.error || "Erro ao fazer upload do arquivo")
      }

      if (!response.data.data?.fileId) {
        throw new Error("FileId não fornecido pelo servidor")
      }

      console.log("Upload concluído. FileId:", response.data.data.fileId)
      return response.data
    } catch (error) {
      console.error("Erro no upload do arquivo:", error)
      throw error
    }
  }

  static async analyzeExam(
    imageIds: string[],
    consumptionType: TokenConsumptionType,
    userId: string,
    reasonForRequestingExam: string,
  ): Promise<ExamAnalysisResponse> {
    try {
      const requestPayload: ExamAnalysisRequest = {
        data: {
          consumptionType,
          imageIds,
          reasonForRequestingExam,
          userId,
        },
      }

      console.log("Enviando requisição de análise:", requestPayload)

      const response = await api.post<ExamAnalysisResponse>("/api/v1/Exams/exam-analysis", requestPayload)

      if (!response.data) {
        throw new Error("Resposta inválida do servidor")
      }

      if (response.data.hasError) {
        throw new Error(response.data.error || "Erro na análise dos exames")
      }

      return response.data
    } catch (error) {
      console.error("Erro na análise de exames:", error)
      throw error
    }
  }
}
