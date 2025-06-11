export interface IAuthLoginRequest {
  data: {
    email: string
    password: string
  }
}

export interface IAuthLoginResponse {
  data: {
    name: string | null
    email: string | null
    token: string | null
  }
  hasError: boolean
  error: string | null
}

export interface ICanUseApplicationResponse {
  data: {
    blockedByPhoneValidation: boolean
    blockedByEmailValidation: boolean
  }
  hasError: boolean
  error: string | null
}
