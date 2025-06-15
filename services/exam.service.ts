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
    file: File,
  ): Promise<GetUrlForUploadResponse> {
    try {
      console.log("Fazendo upload do arquivo:", fileName, "Tipo:", fileDestinationType)

      // Passo 1: Obter URL de upload
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

      if (!response.data.data?.fileId || !response.data.data?.url) {
        throw new Error("FileId ou URL de upload não fornecidos pelo servidor")
      }

      // Passo 2: Upload do arquivo para S3
      console.log("Enviando arquivo para S3...")
      const uploadResponse = await fetch(response.data.data.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error(`Erro no upload para S3: ${uploadResponse.status} ${uploadResponse.statusText}`)
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
