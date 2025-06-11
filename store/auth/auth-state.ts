export interface IAuth {
  token: string | null
  name: string | null
  email: string | null
  isLoading: boolean
}

export const authInitialState: IAuth = {
  token: null,
  name: null,
  email: null,
  isLoading: false,
}
