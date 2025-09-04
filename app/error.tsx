'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Something went wrong!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          We encountered an error while loading this page. Please try again.
        </p>
        <Button
          onClick={() => reset()}
          className="bg-queen-purple hover:bg-queen-purple/90 text-white"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}