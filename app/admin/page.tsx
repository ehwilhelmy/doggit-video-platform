"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to simple admin page (which doesn't use Supabase)
    router.push('/admin/simple')
  }, [router])
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-jade-purple/30 border-t-jade-purple rounded-full animate-spin" />
    </div>
  )
}