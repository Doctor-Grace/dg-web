import api from "@/clients/api"
import type {
  IUserCreateRequest,
  IUserCreateResponse,
  IChangeEmailRequest,
  IChangeEmailResponse,
  IChangePasswordByTokenRequest,
  IChangePasswordByTokenResponse,
  IChangePasswordRequest,
  IChangePasswordResponse,
  IChangePhoneRequest,
  IChangePhoneResponse,
  IConfirmEmailCodeRequest,
  IConfirmEmailCodeResponse,
  IConfirmSmsCodeRequest,
  IConfirmSmsCodeResponse,
  IForgotPasswordRequest,
  IForgotPasswordResponse,
  ISendActivationEmailRequest,
  ISendActivationEmailResponse,
  ISendActivationSmsRequest,
  ISendActivationSmsResponse,
  IUpdateUserRequest,
  IUpdateUserResponse,
  ProfessionalType,
} from "@/domain/user.domain"

const createUser = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
  phone: string,
  professionalType: ProfessionalType,
  register?: string,
) => {
  const requestData: IUserCreateRequest = {
    data: {
      name,
      email,
      password,
      passwordConfirmation,
      phone,
      professionalType,
      register,
    },
  }

  try {
    const { data } = await api.post<IUserCreateResponse>("api/v1/User/create-user", requestData)

    // Garantir que a resposta tenha uma estrutura válida
    if (!data) {
      return {
        data: { id: "", email: null },
        hasError: true,
        error: "error_creating_user",
      }
    }

    return data
  } catch (error: any) {
    // Check if the error response contains a structured error message
    if (error.response?.data?.hasError && error.response?.data?.error) {
      return {
        data: { id: "", email: null },
        hasError: true,
        error: error.response.data.error,
      }
    }

    // Fallback to generic error message
    return {
      data: { id: "", email: null },
      hasError: true,
      error: "server_error",
    }
  }
}

const changeEmail = async (userId: string, email: string) => {
  const requestData: IChangeEmailRequest = {
    data: {
      userId,
      email,
    },
  }

  try {
    const { data } = await api.patch<IChangeEmailResponse>("api/v1/User/change-email", requestData)
    return data
  } catch (error: any) {
    // Check if the error response contains a structured error message
    if (error.response?.data?.hasError && error.response?.data?.error) {
      return {
        data: { userId: "" },
        hasError: true,
        error: error.response.data.error,
      }
    }

    // Fallback to generic error message
    return {
      data: { userId: "" },
      hasError: true,
      error: "server_error",
    }
  }
}

const changePasswordByToken = async (email: string, token: string, password: string, passwordConfirmation: string) => {
  const requestData: IChangePasswordByTokenRequest = {
    data: {
      email,
      token,
      password,
      passwordConfirmation,
    },
  }

  try {
    const { data } = await api.patch<IChangePasswordByTokenResponse>(
      "api/v1/User/change-password-by-token",
      requestData,
    )
    return data
  } catch (error: any) {
    // Check if the error response contains a structured error message
    if (error.response?.data?.hasError && error.response?.data?.error) {
      return {
        data: { email: null },
        hasError: true,
        error: error.response.data.error,
      }
    }

    // Fallback to generic error message
    return {
      data: { email: null },
      hasError: true,
      error: "server_error",
    }
  }
}

const changePassword = async (
  userId: string,
  currentPassword: string,
  password: string,
  passwordConfirmation: string,
) => {
  const requestData: IChangePasswordRequest = {
    data: {
      userId,
      currentPassword,
      password,
      passwordConfirmation,
    },
  }

  try {
    const { data } = await api.patch<IChangePasswordResponse>("api/v1/User/change-password", requestData)
    return data
  } catch (error: any) {
    // Check if the error response contains a structured error message
    if (error.response?.data?.hasError && error.response?.data?.error) {
      return {
        data: { email: null },
        hasError: true,
        error: error.response.data.error,
      }
    }

    // Fallback to generic error message
    return {
      data: { email: null },
      hasError: true,
      error: "server_error",
    }
  }
}

const changePhone = async (userId: string, phone: string) => {
  const requestData: IChangePhoneRequest = {
    data: {
      userId,
      phone,
    },
  }

  try {
    const { data } = await api.patch<IChangePhoneResponse>("api/v1/User/change-phone", requestData)
    return data
  } catch (error: any) {
    // Check if the error response contains a structured error message
    if (error.response?.data?.hasError && error.response?.data?.error) {
      return {
        data: { userId: "" },
        hasError: true,
        error: error.response.data.error,
      }
    }

    // Fallback to generic error message
    return {
      data: { userId: "" },
      hasError: true,
      error: "server_error",
    }
  }
}

const confirmEmailCode = async (userId: string, code: string) => {
  const requestData: IConfirmEmailCodeRequest = {
    data: {
      userId,
      code,
    },
  }

  try {
    const { data } = await api.post<IConfirmEmailCodeResponse>("api/v1/User/confirm-email", requestData)
    return data
  } catch (error: any) {
    // Check if the error response contains a structured error message
    if (error.response?.data?.hasError && error.response?.data?.error) {
      return {
        data: {
          userId: "",
          confirmedAt: "",
        },
        hasError: true,
        error: error.response.data.error,
      }
    }

    // Fallback to generic error message
    return {
      data: {
        userId: "",
        confirmedAt: "",
      },
      hasError: true,
      error: "server_error",
    }
  }
}

const confirmSmsCode = async (userId: string, code: string) => {
  const requestData: IConfirmSmsCodeRequest = {
    data: {
      userId,
      code,
    },
  }

  try {
    const { data } = await api.post<IConfirmSmsCodeResponse>("api/v1/User/confirm-sms", requestData)
    return data
  } catch (error: any) {
    // Check if the error response contains a structured error message
    if (error.response?.data?.hasError && error.response?.data?.error) {
      return {
        data: {
          userId: "",
          confirmedAt: "",
        },
        hasError: true,
        error: error.response.data.error,
      }
    }

    // Fallback to generic error message
    return {
      data: {
        userId: "",
        confirmedAt: "",
      },
      hasError: true,
      error: "server_error",
    }
  }
}

const forgotPassword = async (email: string) => {
  const requestData: IForgotPasswordRequest = {
    data: {
      email,
    },
  }

  try {
    const { data } = await api.post<IForgotPasswordResponse>("api/v1/User/forgot-password", requestData)
    return data
  } catch (error: any) {
    // Check if the error response contains a structured error message
    if (error.response?.data?.hasError && error.response?.data?.error) {
      return {
        data: { email: null },
        hasError: true,
        error: error.response.data.error,
      }
    }

    // Fallback to generic error message
    return {
      data: { email: null },
      hasError: true,
      error: "server_error",
    }
  }
}

const sendActivationEmail = async (userId: string, isChangeEmail?: boolean) => {
  const requestData: ISendActivationEmailRequest = {
    data: {
      userId,
      isChangeEmail,
    },
  }

  try {
    const { data } = await api.post<ISendActivationEmailResponse>("api/v1/User/send-activation-email", requestData)
    return data
  } catch (error: any) {
    // Check if the error response contains a structured error message
    if (error.response?.data?.hasError && error.response?.data?.error) {
      return {
        data: {
          userId: "",
          sentAt: "",
        },
        hasError: true,
        error: error.response.data.error,
      }
    }

    // Fallback to generic error message
    return {
      data: {
        userId: "",
        sentAt: "",
      },
      hasError: true,
      error: "server_error",
    }
  }
}

const sendActivationSms = async (userId: string, isChangePhone?: boolean) => {
  const requestData: ISendActivationSmsRequest = {
    data: {
      userId,
      isChangePhone,
    },
  }

  try {
    const { data } = await api.post<ISendActivationSmsResponse>("api/v1/User/send-activation-sms", requestData)
    return data
  } catch (error: any) {
    // Check if the error response contains a structured error message
    if (error.response?.data?.hasError && error.response?.data?.error) {
      return {
        data: {
          userId: "",
          sentAt: "",
        },
        hasError: true,
        error: error.response.data.error,
      }
    }

    // Fallback to generic error message
    return {
      data: {
        userId: "",
        sentAt: "",
      },
      hasError: true,
      error: "server_error",
    }
  }
}

const updateUser = async (userId: string, name: string, professionalType: ProfessionalType, register?: string) => {
  const requestData: IUpdateUserRequest = {
    data: {
      userId,
      name,
      professionalType,
      register,
    },
  }

  try {
    const { data } = await api.put<IUpdateUserResponse>("api/v1/User/update-user", requestData)
    return data
  } catch (error: any) {
    // Check if the error response contains a structured error message
    if (error.response?.data?.hasError && error.response?.data?.error) {
      return {
        data: {
          userId: "",
          name: null,
          register: null,
          professionalType: professionalType,
        },
        hasError: true,
        error: error.response.data.error,
      }
    }

    // Fallback to generic error message
    return {
      data: {
        userId: "",
        name: null,
        register: null,
        professionalType: professionalType,
      },
      hasError: true,
      error: "server_error",
    }
  }
}

export const UserService = {
  createUser,
  changeEmail,
  changePasswordByToken,
  changePassword,
  changePhone,
  confirmEmailCode,
  confirmSmsCode,
  forgotPassword,
  sendActivationEmail,
  sendActivationSms,
  updateUser,
}
