export enum FileDestinationType {
  XrayExamination = "XrayExamination",
  TomographyExamination = "TomographyExamination",
  MagneticResonanceExamination = "MagneticResonanceExamination",
}

export enum TokenConsumptionType {
  XrayExaminationAnalysis = "XrayExaminationAnalysis",
  TomographyExaminationAnalysis = "TomographyExaminationAnalysis",
  MagneticResonanceExaminationAnalysis = "MagneticResonanceExaminationAnalysis",
}

export interface GetUrlForUploadOutModel {
  fileId: string
  url: string
}

export interface GetUrlForUploadResponse {
  data: GetUrlForUploadOutModel
  hasError: boolean
  error?: string
}

export interface ExamAnalysisRequestData {
  consumptionType: TokenConsumptionType
  imageIds: string[]
  reasonForRequestingExam: string
  userId: string
}

export interface ExamAnalysisRequest {
  data: ExamAnalysisRequestData
}

export interface ExamAnalysisOutModel {
  id: string
  examType: string
  analysisResult: string
  confidence: number
  findings: string[]
  recommendations: string[]
  createdAt: string
  fileUrls: string[]
}

export interface ExamAnalysisResponse {
  data: ExamAnalysisOutModel
  hasError: boolean
  error?: string
}

export const examTypeToDestination: Record<string, FileDestinationType> = {
  xray: FileDestinationType.XrayExamination,
  ct: FileDestinationType.TomographyExamination,
  mri: FileDestinationType.MagneticResonanceExamination,
}

// Mapeamento de tipos de exame para TokenConsumptionType
export const examTypeToConsumption: Record<string, TokenConsumptionType> = {
  xray: TokenConsumptionType.XrayExaminationAnalysis,
  ct: TokenConsumptionType.TomographyExaminationAnalysis,
  mri: TokenConsumptionType.MagneticResonanceExaminationAnalysis,
}
