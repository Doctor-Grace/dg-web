import type { ProfessionalType } from "@/domain/user.domain"
import { UserService } from "@/services/user.service"
import { userEvent } from "@/store/user/user-events"
import userStore from "@/store/user/user-store"
import { handleErrorMessage } from "@/utils/error-handler"

// Create User
type CreateUserParams = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  phone: string
  professionalType: ProfessionalType
  register?: string
  onSuccess: (userId: string) => void
  onError: (errorMessage: string) => void
  translate?: (key: string) => string
}

const createUser = async ({
  name,
  email,
  password,
  passwordConfirmation,
  phone,
  professionalType,
  register,
  onSuccess,
  onError,
  translate,
}: CreateUserParams) => {
  const userState = userStore.getState()

  if (userState.isLoading) return

  userEvent({ isLoading: true })

  try {
    const response = await UserService.createUser(
      name,
      email,
      password,
      passwordConfirmation,
      phone,
      professionalType,
      register,
    )

    if (response.hasError || !response.data) {
      // Use the error handler to process the error message
      const errorText = translate
        ? handleErrorMessage(response.error || "error_creating_user", translate)
        : response.error || "error_creating_user"

      onError(errorText)
      return
    }

    // Verificar se response.data.id existe antes de usá-lo
    const userId = response.data.id || ""

    userEvent({
      id: userId,
      email: response.data.email || email,
      name,
      phone,
      register,
      professionalType,
      isLoading: false,
    })

    onSuccess(userId)
  } catch (error: any) {
    // Use the error handler to process the error message
    const errorText = translate
      ? handleErrorMessage(error.response?.data?.error || "server_error", translate)
      : error.response?.data?.error || "server_error"

    onError(errorText)
  } finally {
    userEvent({ isLoading: false })
  }
}

// Confirm Email Code
type ConfirmEmailCodeParams = {
  userId: string
  code: string
  onSuccess: () => void
  onError: (errorMessage: string) => void
  translate?: (key: string) => string
}

const confirmEmailCode = async ({ userId, code, onSuccess, onError, translate }: ConfirmEmailCodeParams) => {
  const userState = userStore.getState()

  if (userState.isLoading) return

  userEvent({ isLoading: true })

  try {
    const response = await UserService.confirmEmailCode(userId, code)

    if (response.hasError) {
      // Use the error handler to process the error message
      const errorText = translate
        ? handleErrorMessage(response.error || "invalid_verification_code", translate)
        : response.error || "invalid_verification_code"

      onError(errorText)
      return
    }

    userEvent({
      emailConfirmed: true,
      isLoading: false,
    })

    onSuccess()
  } catch (error: any) {
    // Use the error handler to process the error message
    const errorText = translate
      ? handleErrorMessage(error.response?.data?.error || "server_error", translate)
      : error.response?.data?.error || "server_error"

    onError(errorText)
  } finally {
    userEvent({ isLoading: false })
  }
}

// Confirm SMS Code
type ConfirmSmsCodeParams = {
  userId: string
  code: string
  onSuccess: () => void
  onError: (errorMessage: string) => void
  translate?: (key: string) => string
}

const confirmSmsCode = async ({ userId, code, onSuccess, onError, translate }: ConfirmSmsCodeParams) => {
  const userState = userStore.getState()

  if (userState.isLoading) return

  userEvent({ isLoading: true })

  try {
    const response = await UserService.confirmSmsCode(userId, code)

    if (response.hasError) {
      // Use the error handler to process the error message
      const errorText = translate
        ? handleErrorMessage(response.error || "invalid_verification_code", translate)
        : response.error || "invalid_verification_code"

      onError(errorText)
      return
    }

    userEvent({
      phoneConfirmed: true,
      isLoading: false,
    })

    onSuccess()
  } catch (error: any) {
    // Use the error handler to process the error message
    const errorText = translate
      ? handleErrorMessage(error.response?.data?.error || "server_error", translate)
      : error.response?.data?.error || "server_error"

    onError(errorText)
  } finally {
    userEvent({ isLoading: false })
  }
}

// Forgot Password
type ForgotPasswordParams = {
  email: string
  onSuccess: () => void
  onError: (errorMessage: string) => void
  translate?: (key: string) => string
}

const forgotPassword = async ({ email, onSuccess, onError, translate }: ForgotPasswordParams) => {
  const userState = userStore.getState()

  if (userState.isLoading) return

  userEvent({ isLoading: true })

  try {
    const response = await UserService.forgotPassword(email)

    if (response.hasError) {
      // Use the error handler to process the error message
      const errorText = translate
        ? handleErrorMessage(response.error || "user_not_found", translate)
        : response.error || "user_not_found"

      onError(errorText)
      return
    }

    onSuccess()
  } catch (error: any) {
    // Use the error handler to process the error message
    const errorText = translate
      ? handleErrorMessage(error.response?.data?.error || "server_error", translate)
      : error.response?.data?.error || "server_error"

    onError(errorText)
  } finally {
    userEvent({ isLoading: false })
  }
}

// Change Password By Token
type ChangePasswordByTokenParams = {
  email: string
  token: string
  password: string
  passwordConfirmation: string
  onSuccess: () => void
  onError: (errorMessage: string) => void
  translate?: (key: string) => string
}

const changePasswordByToken = async ({
  email,
  token,
  password,
  passwordConfirmation,
  onSuccess,
  onError,
  translate,
}: ChangePasswordByTokenParams) => {
  const userState = userStore.getState()

  if (userState.isLoading) return

  userEvent({ isLoading: true })

  try {
    const response = await UserService.changePasswordByToken(email, token, password, passwordConfirmation)

    if (response.hasError) {
      // Use the error handler to process the error message
      const errorText = translate
        ? handleErrorMessage(response.error || "invalid_token", translate)
        : response.error || "invalid_token"

      onError(errorText)
      return
    }

    onSuccess()
  } catch (error: any) {
    // Use the error handler to process the error message
    const errorText = translate
      ? handleErrorMessage(error.response?.data?.error || "server_error", translate)
      : error.response?.data?.error || "server_error"

    onError(errorText)
  } finally {
    userEvent({ isLoading: false })
  }
}

// Change Password
type ChangePasswordParams = {
  userId: string
  currentPassword: string
  password: string
  passwordConfirmation: string
  onSuccess: () => void
  onError: (errorMessage: string) => void
  translate?: (key: string) => string
}

const changePassword = async ({
  userId,
  currentPassword,
  password,
  passwordConfirmation,
  onSuccess,
  onError,
  translate,
}: ChangePasswordParams) => {
  const userState = userStore.getState()

  if (userState.isLoading) return

  userEvent({ isLoading: true })

  try {
    const response = await UserService.changePassword(userId, currentPassword, password, passwordConfirmation)

    if (response.hasError) {
      // Use the error handler to process the error message
      const errorText = translate
        ? handleErrorMessage(response.error || "invalid_current_password", translate)
        : response.error || "invalid_current_password"

      onError(errorText)
      return
    }

    onSuccess()
  } catch (error: any) {
    // Use the error handler to process the error message
    const errorText = translate
      ? handleErrorMessage(error.response?.data?.error || "server_error", translate)
      : error.response?.data?.error || "server_error"

    onError(errorText)
  } finally {
    userEvent({ isLoading: false })
  }
}

// Update User
type UpdateUserParams = {
  userId: string
  name: string
  professionalType: ProfessionalType
  register?: string
  onSuccess: () => void
  onError: (errorMessage: string) => void
  translate?: (key: string) => string
}

const updateUser = async ({
  userId,
  name,
  professionalType,
  register,
  onSuccess,
  onError,
  translate,
}: UpdateUserParams) => {
  const userState = userStore.getState()

  if (userState.isLoading) return

  userEvent({ isLoading: true })

  try {
    const response = await UserService.updateUser(userId, name, professionalType, register)

    if (response.hasError) {
      // Use the error handler to process the error message
      const errorText = translate
        ? handleErrorMessage(response.error || "update_user_error", translate)
        : response.error || "update_user_error"

      onError(errorText)
      return
    }

    userEvent({
      name: response.data.name,
      register: response.data.register,
      professionalType: response.data.professionalType,
      isLoading: false,
    })

    onSuccess()
  } catch (error: any) {
    // Use the error handler to process the error message
    const errorText = translate
      ? handleErrorMessage(error.response?.data?.error || "server_error", translate)
      : error.response?.data?.error || "server_error"

    onError(errorText)
  } finally {
    userEvent({ isLoading: false })
  }
}

// Change Email
type ChangeEmailParams = {
  userId: string
  email: string
  onSuccess: () => void
  onError: (errorMessage: string) => void
  translate?: (key: string) => string
}

const changeEmail = async ({ userId, email, onSuccess, onError, translate }: ChangeEmailParams) => {
  const userState = userStore.getState()

  if (userState.isLoading) return

  userEvent({ isLoading: true })

  try {
    const response = await UserService.changeEmail(userId, email)

    if (response.hasError) {
      // Use the error handler to process the error message
      const errorText = translate
        ? handleErrorMessage(response.error || "change_email_error", translate)
        : response.error || "change_email_error"

      onError(errorText)
      return
    }

    userEvent({
      email,
      emailConfirmed: false,
      isLoading: false,
    })

    onSuccess()
  } catch (error: any) {
    // Use the error handler to process the error message
    const errorText = translate
      ? handleErrorMessage(error.response?.data?.error || "server_error", translate)
      : error.response?.data?.error || "server_error"

    onError(errorText)
  } finally {
    userEvent({ isLoading: false })
  }
}

// Change Phone
type ChangePhoneParams = {
  userId: string
  phone: string
  onSuccess: () => void
  onError: (errorMessage: string) => void
  translate?: (key: string) => string
}

const changePhone = async ({ userId, phone, onSuccess, onError, translate }: ChangePhoneParams) => {
  const userState = userStore.getState()

  if (userState.isLoading) return

  userEvent({ isLoading: true })

  try {
    const response = await UserService.changePhone(userId, phone)

    if (response.hasError) {
      // Use the error handler to process the error message
      const errorText = translate
        ? handleErrorMessage(response.error || "change_phone_error", translate)
        : response.error || "change_phone_error"

      onError(errorText)
      return
    }

    userEvent({
      phone,
      phoneConfirmed: false,
      isLoading: false,
    })

    onSuccess()
  } catch (error: any) {
    // Use the error handler to process the error message
    const errorText = translate
      ? handleErrorMessage(error.response?.data?.error || "server_error", translate)
      : error.response?.data?.error || "server_error"

    onError(errorText)
  } finally {
    userEvent({ isLoading: false })
  }
}

// Send Activation Email
type SendActivationEmailParams = {
  userId: string
  isChangeEmail?: boolean
  onSuccess: () => void
  onError: (errorMessage: string) => void
  translate?: (key: string) => string
}

const sendActivationEmail = async ({
  userId,
  isChangeEmail,
  onSuccess,
  onError,
  translate,
}: SendActivationEmailParams) => {
  const userState = userStore.getState()

  if (userState.isLoading) return

  userEvent({ isLoading: true })

  try {
    const response = await UserService.sendActivationEmail(userId, isChangeEmail)

    if (response.hasError) {
      // Use the error handler to process the error message
      const errorText = translate
        ? handleErrorMessage(response.error || "send_email_error", translate)
        : response.error || "send_email_error"

      onError(errorText)
      return
    }

    onSuccess()
  } catch (error: any) {
    // Use the error handler to process the error message
    const errorText = translate
      ? handleErrorMessage(error.response?.data?.error || "server_error", translate)
      : error.response?.data?.error || "server_error"

    onError(errorText)
  } finally {
    userEvent({ isLoading: false })
  }
}

// Send Activation SMS
type SendActivationSmsParams = {
  userId: string
  isChangePhone?: boolean
  onSuccess: () => void
  onError: (errorMessage: string) => void
  translate?: (key: string) => string
}

const sendActivationSms = async ({ userId, isChangePhone, onSuccess, onError, translate }: SendActivationSmsParams) => {
  const userState = userStore.getState()

  if (userState.isLoading) return

  userEvent({ isLoading: true })

  try {
    const response = await UserService.sendActivationSms(userId, isChangePhone)

    if (response.hasError) {
      // Use the error handler to process the error message
      const errorText = translate
        ? handleErrorMessage(response.error || "send_sms_error", translate)
        : response.error || "send_sms_error"

      onError(errorText)
      return
    }

    onSuccess()
  } catch (error: any) {
    // Use the error handler to process the error message
    const errorText = translate
      ? handleErrorMessage(error.response?.data?.error || "server_error", translate)
      : error.response?.data?.error || "server_error"

    onError(errorText)
  } finally {
    userEvent({ isLoading: false })
  }
}

export const userUseCase = {
  createUser,
  confirmEmailCode,
  confirmSmsCode,
  forgotPassword,
  changePasswordByToken,
  changePassword,
  updateUser,
  changeEmail,
  changePhone,
  sendActivationEmail,
  sendActivationSms,
}
