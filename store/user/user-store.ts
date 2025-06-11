import { createStore } from "effector"
import { userEvent, clearUserEvent } from "./user-events"
import { type IUser, userInitialState } from "./user-state"

const userStore = createStore<IUser>(userInitialState)
  .on(userEvent, (state, payload) => ({
    ...state,
    ...payload,
  }))
  .reset(clearUserEvent)

export default userStore
