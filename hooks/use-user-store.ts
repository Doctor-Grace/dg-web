"use client"

import { useUnit } from "effector-react"
import userStore from "@/store/user/user-store"

export function useUserStore() {
  return useUnit(userStore)
}
