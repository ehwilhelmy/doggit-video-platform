"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      
      // Check URL for auth type (recovery for password reset)
      const urlParams = new URLSearchParams(window.location.search)
      const type = urlParams.get('type')
      
      if (type === 'recovery') {
        // This is a password reset callback
        const { error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Recovery callback error:', error)
          router.push('/auth?error=recovery_error&message=' + encodeURIComponent(error.message))
        } else {
          // Redirect to password reset page
          router.push('/auth/reset-password')
        }
      } else {
        // Regular auth callback
        const { error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/auth?error=callback_error')
        } else {
          router.push('/dashboard')
        }
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white">Completing authentication...</p>
      </div>
    </div>
  )
}