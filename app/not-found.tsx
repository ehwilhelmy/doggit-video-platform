import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-6xl font-bold text-queen-purple">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-queen-purple hover:bg-queen-purple/90 text-white">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}