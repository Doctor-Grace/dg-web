import { createEvent } from "effector"
import type { IUser } from "./user-state"

export const userEvent = createEvent<Partial<IUser>>()
export const clearUserEvent = createEvent()
