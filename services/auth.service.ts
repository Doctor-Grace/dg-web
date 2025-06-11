import api from "@/clients/api"
import type { IAuthLoginRequest, IAuthLoginResponse, ICanUseApplicationResponse } from "@/domain/auth.domain"

// Verificar se o endpoint está correto
const login = async (email: string, password: string) => {
  const requestData: IAuthLoginRequest = {
    data: {
      email,
      password,
    },
  }

  try {
    const { data } = await api.post<IAuthLoginResponse>("api/v1/Authentication/login", requestData)
    return data
  } catch (error: any) {
    // Check if the error response contains a structured error message
    if (error.response?.data?.hasError && error.response?.data?.error) {
      return {
        data: {
          name: null,
          email: null,
          token: null,
        },
        hasError: true,
        error: error.response.data.error,
      }
    }

    // Fallback to generic error message
    return {
      data: {
        name: null,
        email: null,
        token: null,
      },
      hasError: true,
      error: "server_error",
    }
  }
}

const canUseApplication = async () => {
  try {
    const { data } = await api.post<ICanUseApplicationResponse>("api/v1/User/can-use-application")
    return data
  } catch (error: any) {
    // Check if the error response contains a structured error message
    if (error.response?.data?.hasError && error.response?.data?.error) {
      return {
        data: {
          blockedByPhoneValidation: false,
          blockedByEmailValidation: false,
        },
        hasError: true,
        error: error.response.data.error,
      }
    }

    // Fallback to generic error message
    return {
      data: {
        blockedByPhoneValidation: false,
        blockedByEmailValidation: false,
      },
      hasError: true,
      error: "server_error",
    }
  }
}

export const AuthService = {
  login,
  canUseApplication,
}
