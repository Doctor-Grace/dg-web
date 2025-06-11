import { createEvent } from "effector"
import type { IAuth } from "./auth-state"

export const authEvent = createEvent<Partial<IAuth>>()
export const clearAuthEvent = createEvent()
