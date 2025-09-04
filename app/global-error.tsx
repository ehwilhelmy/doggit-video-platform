'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-4 p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Something went wrong!
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              A critical error occurred. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}