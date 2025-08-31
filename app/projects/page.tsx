"use client"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProjectsPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to contracts page since projects are managed there
    router.push("/contracts")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to contracts...</p>
      </div>
    </div>
  )
}
