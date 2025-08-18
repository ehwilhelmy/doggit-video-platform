"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function AuthCodeError() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Authentication Error</h1>
          <p className="text-muted-foreground">
            Something went wrong during the authentication process. This might be due to an expired or invalid link.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/')}
            className="w-full"
          >
            Return to Home
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push('/auth')}
            className="w-full"
          >
            Try Again
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          If you continue to experience issues, please contact support.
        </p>
      </div>
    </div>
  )
}