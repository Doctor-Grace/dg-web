import { AuthService } from "@/services/auth.service"
import { authEvent, clearAuthEvent } from "@/store/auth/auth-events"
import authStore from "@/store/auth/auth-store"
import { clearUserEvent } from "@/store/user/user-events"
import { userEvent } from "@/store/user/user-events"
import { setAuthToken, getAuthToken, removeAuthToken } from "@/utils/auth-cookies"
import { handleErrorMessage } from "@/utils/error-handler"

// Importar a função de decodificação do token
import { decodeJwt } from "@/utils/jwt-decode"

type LoginParams = {
  email: string
  password: string
  onSuccess: () => void
  onError: (errorMessage: string) => void
  translate?: (key: string) => string
}

const login = async ({ email, password, onSuccess, onError, translate }: LoginParams) => {
  const authState = authStore.getState()

  if (authState.isLoading) return

  authEvent({ isLoading: true })

  try {
    const response = await AuthService.login(email, password)

    if (response.hasError || !response.data.token) {
      // Use the error handler to process the error message
      const errorText = translate
        ? handleErrorMessage(response.error || "invalid_credentials", translate)
        : response.error || "invalid_credentials"

      onError(errorText)
      return
    }

    // Store token in secure cookie instead of localStorage
    setAuthToken(response.data.token)

    // Decodificar o token para extrair o ID do usuário
    const decodedToken = decodeJwt(response.data.token)
    const userId = decodedToken?.nameid || null

    // Update auth state
    authEvent({
      token: response.data.token,
      name: response.data.name,
      email: response.data.email,
      isLoading: false,
    })

    // Atualizar o estado do usuário com o ID
    userEvent({
      id: userId,
      email: response.data.email,
      name: response.data.name,
    })

    // Verificar se o usuário pode usar a aplicação
    canUseApplication({
      onBlocked: (blockedByEmail, blockedByPhone) => {
        userEvent({
          emailConfirmed: !blockedByEmail,
          phoneConfirmed: !blockedByPhone,
        })
      },
      onError: () => {
        // Silenciar erro
      },
    })

    onSuccess()
  } catch (error: any) {
    // Use the error handler to process the error message
    const errorText = translate
      ? handleErrorMessage(error.response?.data?.error || "server_error", translate)
      : error.response?.data?.error || "server_error"

    onError(errorText)
  } finally {
    authEvent({ isLoading: false })
  }
}

const logout = () => {
  // Remove token from cookie
  removeAuthToken()
  clearAuthEvent()
  clearUserEvent()
}

// Check if user is authenticated by retrieving token from cookie
const checkAuth = () => {
  const token = getAuthToken()

  if (token) {
    // Decodificar o token para extrair o ID do usuário
    const decodedToken = decodeJwt(token)
    const userId = decodedToken?.nameid || null

    // Atualizar o estado de autenticação
    authEvent({ token })

    // Atualizar o estado do usuário com o ID
    if (userId) {
      userEvent({
        id: userId,
        // Podemos também extrair o email do token se estiver disponível
        email: decodedToken?.email || null,
      })
    }

    return true
  }

  return false
}

type CanUseApplicationParams = {
  onBlocked?: (blockedByEmail: boolean, blockedByPhone: boolean) => void
  onSuccess?: () => void
  onError?: (errorMessage: string) => void
  translate?: (key: string) => string
}

const canUseApplication = async ({ onBlocked, onSuccess, onError, translate }: CanUseApplicationParams = {}) => {
  // Check if user is authenticated first
  const token = getAuthToken()
  if (!token) {
    // If no token, don't call the API
    onError?.(translate ? translate("user_not_authenticated") : "user_not_authenticated")
    return false
  }

  try {
    const response = await AuthService.canUseApplication()

    if (response.hasError) {
      // Use the error handler to process the error message
      const errorText = translate
        ? handleErrorMessage(response.error || "error_checking_application_access", translate)
        : response.error || "error_checking_application_access"

      onError?.(errorText)
      return false
    }

    const { blockedByEmailValidation, blockedByPhoneValidation } = response.data

    // Atualizar o estado do usuário
    userEvent({
      emailConfirmed: !blockedByEmailValidation,
      phoneConfirmed: !blockedByPhoneValidation,
    })

    if (blockedByEmailValidation || blockedByPhoneValidation) {
      onBlocked?.(blockedByEmailValidation, blockedByPhoneValidation)
      return true // O usuário pode acessar, mas com restrições
    }

    onSuccess?.()
    return true
  } catch (error: any) {
    // Use the error handler to process the error message
    const errorText = translate
      ? handleErrorMessage(error.response?.data?.error || "server_error", translate)
      : error.response?.data?.error || "server_error"

    onError?.(errorText)
    return false
  }
}

export const authUseCase = {
  login,
  logout,
  checkAuth,
  canUseApplication,
}
