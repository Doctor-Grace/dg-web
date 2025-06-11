export enum ProfessionalType {
  Medic = "Medic",
  Nurse = "Nurse",
  NursingTechnician = "NursingTechnician",
  Student = "Student",
}

// User Create
export interface IUserCreateRequest {
  data: {
    name: string
    email: string
    password?: string
    passwordConfirmation: string
    register?: string
    phone: string
    professionalType: ProfessionalType
  }
}

export interface IUserCreateResponse {
  data: {
    email: string | null
    id: string
  }
  hasError: boolean
  error: string | null
}

// Change Email
export interface IChangeEmailRequest {
  data: {
    userId: string
    email: string
  }
}

export interface IChangeEmailResponse {
  data: {
    userId: string
  }
  hasError: boolean
  error: string | null
}

// Change Password By Token
export interface IChangePasswordByTokenRequest {
  data: {
    email: string
    token: string
    password: string
    passwordConfirmation: string
  }
}

export interface IChangePasswordByTokenResponse {
  data: {
    email: string | null
  }
  hasError: boolean
  error: string | null
}

// Change Password
export interface IChangePasswordRequest {
  data: {
    userId: string
    currentPassword: string
    password: string
    passwordConfirmation: string
  }
}

export interface IChangePasswordResponse {
  data: {
    email: string | null
  }
  hasError: boolean
  error: string | null
}

// Change Phone
export interface IChangePhoneRequest {
  data: {
    userId: string
    phone: string
  }
}

export interface IChangePhoneResponse {
  data: {
    userId: string
  }
  hasError: boolean
  error: string | null
}

// Confirm Email Code
export interface IConfirmEmailCodeRequest {
  data: {
    userId: string
    code: string
  }
}

export interface IConfirmEmailCodeResponse {
  data: {
    userId: string
    confirmedAt: string
  }
  hasError: boolean
  error: string | null
}

// Confirm SMS Code
export interface IConfirmSmsCodeRequest {
  data: {
    userId: string
    code: string
  }
}

export interface IConfirmSmsCodeResponse {
  data: {
    userId: string
    confirmedAt: string
  }
  hasError: boolean
  error: string | null
}

// Forgot Password
export interface IForgotPasswordRequest {
  data: {
    email: string
  }
}

export interface IForgotPasswordResponse {
  data: {
    email: string | null
  }
  hasError: boolean
  error: string | null
}

// Send Activation Email
export interface ISendActivationEmailRequest {
  data: {
    userId: string
    isChangeEmail?: boolean
  }
}

export interface ISendActivationEmailResponse {
  data: {
    userId: string
    sentAt: string
  }
  hasError: boolean
  error: string | null
}

// Send Activation SMS
export interface ISendActivationSmsRequest {
  data: {
    userId: string
    isChangePhone?: boolean
  }
}

export interface ISendActivationSmsResponse {
  data: {
    userId: string
    sentAt: string
  }
  hasError: boolean
  error: string | null
}

// Update User
export interface IUpdateUserRequest {
  data: {
    userId: string
    name: string
    register?: string
    professionalType: ProfessionalType
  }
}

export interface IUpdateUserResponse {
  data: {
    userId: string
    name: string | null
    register: string | null
    professionalType: ProfessionalType
  }
  hasError: boolean
  error: string | null
}
