import axios from "axios"
import { HostService } from "@/services/host.service"
import authStore from "@/store/auth/auth-store"
import { removeAuthToken } from "@/utils/auth-cookies"
import type { ApiError } from "@/domain/api.domain"
const api = axios.create({
  baseURL: HostService.getApiHost(),
  timeout: 300000,
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
    if (error.response && error.response.status === 401) {
      removeAuthToken()
    }

    if (error.response?.data) {
      return Promise.reject(error)
    }
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
