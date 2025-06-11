import { createStore } from "effector"
import { useStore } from "effector-react"
import { authEvent, clearAuthEvent } from "./auth-events"
import { type IAuth, authInitialState } from "./auth-state"

const authStore = createStore<IAuth>(authInitialState)
  .on(authEvent, (state, payload) => ({
    ...state,
    ...payload,
  }))
  .reset(clearAuthEvent)

// Adicionando o hook useAuthStore para uso em componentes React
export const useAuthStore = () => useStore(authStore)

export default authStore
