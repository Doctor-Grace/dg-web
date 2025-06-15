import api from "@/clients/api";
import type {
  GetUrlForUploadResponse,
  ExamAnalysisRequest,
  ExamAnalysisResponse,
  ExamHistoryResponse,
  FileDestinationType,
  TokenConsumptionType,
} from "@/domain/exam.domain";

export class ExamService {
  static async uploadFile(
    fileDestinationType: FileDestinationType,
    fileName: string,
    file: File
  ): Promise<GetUrlForUploadResponse> {
    try {
      const response = await api.get<GetUrlForUploadResponse>(
        `/api/v1/FileControl/get-upload-url/${fileDestinationType}/${encodeURIComponent(
          fileName
        )}`
      );

      if (!response.data) {
        throw new Error("Resposta inválida do servidor");
      }

      if (response.data.hasError) {
        throw new Error(
          response.data.error || "Erro ao fazer upload do arquivo"
        );
      }

      if (!response.data.data?.fileId || !response.data.data?.url) {
        throw new Error("FileId ou URL de upload não fornecidos pelo servidor");
      }

      const arrayBuffer = await file.arrayBuffer();
      const uploadResponse = await fetch(response.data.data.url, {
        method: "PUT",
        body: arrayBuffer,
      });

      if (!uploadResponse.ok) {
        throw new Error(
          `Erro no upload para S3: ${uploadResponse.status} ${uploadResponse.statusText}`
        );
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async analyzeExam(
    imageIds: string[],
    consumptionType: TokenConsumptionType,
    userId: string,
    reasonForRequestingExam: string
  ): Promise<ExamAnalysisResponse> {
    try {
      const requestPayload: ExamAnalysisRequest = {
        data: {
          consumptionType,
          imageIds,
          reasonForRequestingExam,
          userId,
        },
      };

      const response = await api.post<ExamAnalysisResponse>(
        "/api/v1/Exams/exam-analysis",
        requestPayload
      );

      if (!response.data) {
        throw new Error("Resposta inválida do servidor");
      }

      if (response.data.hasError) {
        throw new Error(response.data.error || "Erro na análise dos exames");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getExamHistory(page: number = 0, pageSize: number = 10): Promise<ExamHistoryResponse> {
    try {
      const response = await api.get<ExamHistoryResponse>(
        `/api/v1/Exams/history?page=${page}&pageSize=${pageSize}`
      );

      if (!response.data) {
        throw new Error("Resposta inválida do servidor");
      }

      if (response.data.hasError) {
        throw new Error(response.data.error || "Erro ao buscar histórico de exames");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
