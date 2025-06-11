import axios from "axios"
import { HostService } from "@/services/host.service"
import authStore from "@/store/auth/auth-store"
import { removeAuthToken } from "@/utils/auth-cookies" // Corrigido o caminho de importação
import type { ApiError } from "@/domain/api.domain"

// Atualizar a configuração do cliente Axios para usar um timeout de 5 minutos
const api = axios.create({
  baseURL: HostService.getApiHost(),
  timeout: 300000, // 5 minutos em milissegundos
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(async (config) => {
  const { token } = authStore.getState()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: ApiError) => {
    // Se receber um 401 (Unauthorized), podemos limpar o token
    if (error.response && error.response.status === 401) {
      // Usar removeAuthToken em vez de localStorage
      removeAuthToken()
    }

    // If the error has a structured response, pass it through
    if (error.response?.data) {
      return Promise.reject(error)
    }

    // For network errors or other unexpected errors, create a structured error response
    const genericError: ApiError = {
      response: {
        data: {
          data: null,
          hasError: true,
          error: "server_error",
        },
      },
    }

    return Promise.reject(error.request ? error : genericError)
  },
)

export default api
