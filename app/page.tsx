"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authUseCase } from "@/useCases/auth.useCase"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = authUseCase.checkAuth()

    // Redirect based on authentication status
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  // Show nothing while redirecting
  return null
}
