"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, User, Heart, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogoMark } from "@/components/logo-mark"

interface CustomerInfoStepProps {
  onSuccess?: (customerData: {
    firstName: string
    lastName: string
    email: string
    puppyName: string
  }) => void
  onBack?: () => void
}

export function CustomerInfoStep({ onSuccess, onBack }: CustomerInfoStepProps) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    puppyName: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.puppyName.trim()) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (!formData.email.includes('@')) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      // Pass data to parent for Stripe checkout
      onSuccess?.(formData)
    } catch (err: any) {
      setError(err.message || "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 shadow-xl">
      {/* DOGGIT Mark at top */}
      <div className="flex justify-center mb-6">
        <LogoMark size="lg" variant="white" />
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-2">
        Almost there!
      </h2>
      <p className="text-gray-400 text-center mb-8">
        We just need a few details before you start training.
      </p>

      {/* Info Collection Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-400 text-sm">
              First name
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-queen-purple"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lastName" className="text-gray-400 text-sm">
              Last name
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-queen-purple"
              />
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="email" className="text-gray-400 text-sm">
            Your email address
          </Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-queen-purple"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="puppyName" className="text-gray-400 text-sm">
            Your pup's name
          </Label>
          <div className="relative mt-1">
            <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="puppyName"
              name="puppyName"
              type="text"
              placeholder="Enter your pup's name"
              value={formData.puppyName}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-queen-purple"
            />
          </div>
        </div>

        {error && (
          <Alert className="bg-red-950 border-red-900">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 mt-4">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-queen-purple hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-queen-purple hover:underline">
            Privacy Policy
          </a>
          . You'll create your password after payment.
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-queen-purple hover:bg-queen-purple/90 text-white py-3 text-lg font-semibold rounded-xl"
        >
          {isLoading ? 'Processing...' : 'Continue to Payment'}
        </Button>
      </form>

      {/* Back to membership button at bottom */}
      {onBack && (
        <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
          <button
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to membership
          </button>
        </div>
      )}
    </div>
  )
}