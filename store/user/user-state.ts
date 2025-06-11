import type { ProfessionalType } from "@/domain/user.domain"

export interface IUser {
  id: string | null
  name: string | null
  email: string | null
  phone: string | null
  register: string | null
  professionalType: ProfessionalType | null
  emailConfirmed: boolean
  phoneConfirmed: boolean
  isLoading: boolean
}

export const userInitialState: IUser = {
  id: null,
  name: null,
  email: null,
  phone: null,
  register: null,
  professionalType: null,
  emailConfirmed: false,
  phoneConfirmed: false,
  isLoading: false,
}
