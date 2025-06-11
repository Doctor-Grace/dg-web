export interface ApiError {
  response?: {
    data?: {
      hasError?: boolean
      error?: string
    }
    status?: number
    statusText?: string
  }
  message?: string
}
