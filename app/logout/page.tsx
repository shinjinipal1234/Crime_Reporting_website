"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()
  useEffect(() => {
    // Call the logout API route
    fetch("/api/auth/logout", { method: "POST" })
      .then(() => {
        router.replace("/login")
      })
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
    </div>
  )
}
