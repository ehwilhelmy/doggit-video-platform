"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Eye, EyeOff, AlertCircle, Heart, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogoMark } from "@/components/logo-mark"

interface AccountCreationStepProps {
  onSuccess?: () => void
  onBack?: () => void
}

export function AccountCreationStep({ onSuccess, onBack }: AccountCreationStepProps) {
  const { signUp, signIn } = useAuth()
  const [isSignUp, setIsSignUp] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    puppyName: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

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

    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.name,
          puppy_name: formData.puppyName
        })
        if (error) {
          setError(error.message)
        } else {
          setIsRedirecting(true)
          // Set a flag that we're in checkout process
          localStorage.setItem('checkout_pending', 'true')
          // Small delay for smoother transition
          setTimeout(() => {
            onSuccess?.()
          }, 500)
        }
      } else {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          setError(error.message)
        } else {
          setIsRedirecting(true)
          // Set a flag that we're in checkout process
          localStorage.setItem('checkout_pending', 'true')
          // Small delay for smoother transition
          setTimeout(() => {
            onSuccess?.()
          }, 500)
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 shadow-xl relative">
      {/* Success/Redirect Overlay */}
      {isRedirecting && (
        <div className="absolute inset-0 bg-zinc-900/95 rounded-xl flex flex-col items-center justify-center z-50">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Account Created!</h3>
          <p className="text-gray-400 mb-4">Redirecting to payment...</p>
          <Loader2 className="h-6 w-6 text-queen-purple animate-spin" />
        </div>
      )}

      {/* DOGGIT Mark at top */}
      <div className="flex justify-center mb-6">
        <LogoMark size="lg" variant="white" />
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-2">
        Your classes are waiting
      </h2>
      <p className="text-gray-400 text-center mb-8">
        Create an account to get started. You're only one step away.
      </p>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <>
            <div>
              <Label htmlFor="name" className="text-gray-400 text-sm">
                Your name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required={isSignUp}
                disabled={isLoading}
                className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-queen-purple"
              />
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
                  required={isSignUp}
                  disabled={isLoading}
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-queen-purple"
                />
              </div>
            </div>
          </>
        )}

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
              placeholder="Your email address"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-queen-purple"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="text-gray-400 text-sm">
            Password
          </Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="pl-10 pr-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 focus:border-queen-purple"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
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
          By clicking "{isSignUp ? 'Continue With Email' : 'Sign In'}", you agree to our{' '}
          <a href="/terms" className="text-queen-purple hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-queen-purple hover:underline">
            Privacy Policy
          </a>
          .
        </div>

        <Button
          type="submit"
          disabled={isLoading || isRedirecting}
          className="w-full bg-queen-purple hover:bg-queen-purple/90 text-white py-3 text-lg font-semibold rounded-xl flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          {isLoading ? 'Creating Account...' : isSignUp ? 'Continue With Email' : 'Sign In'}
        </Button>

        <div className="text-center text-sm text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-queen-purple hover:underline font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </form>

      {/* Back to pricing button at bottom */}
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