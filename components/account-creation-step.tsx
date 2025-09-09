"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// SVG icons for Google and Facebook
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

interface AccountCreationStepProps {
  onSuccess?: () => void
}

export function AccountCreationStep({ onSuccess }: AccountCreationStepProps) {
  const { signUp, signIn, signInWithProvider } = useAuth()
  const [isSignUp, setIsSignUp] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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

    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.name
        })
        if (error) {
          setError(error.message)
        } else {
          onSuccess?.()
        }
      } else {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          setError(error.message)
        } else {
          onSuccess?.()
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await signInWithProvider(provider)
      if (error) {
        setError(error.message)
      } else {
        onSuccess?.()
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 shadow-xl">
      {/* Header with avatar icons */}
      <div className="flex justify-center mb-6">
        <div className="flex -space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-queen-purple to-jade-purple border-2 border-zinc-900 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white text-center mb-2">
        Your classes are waiting
      </h2>
      <p className="text-gray-400 text-center mb-8">
        Create an account to get started. You're only one step away.
      </p>

      {/* Social Login Buttons */}
      <div className="space-y-3 mb-6">
        <Button
          type="button"
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 rounded-xl flex items-center justify-center gap-3"
        >
          <GoogleIcon />
          Sign {isSignUp ? 'Up' : 'In'} With Google
        </Button>
        
        <Button
          type="button"
          onClick={() => handleSocialLogin('facebook')}
          disabled={isLoading}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 rounded-xl flex items-center justify-center gap-3"
        >
          <FacebookIcon />
          Sign {isSignUp ? 'Up' : 'In'} With Facebook
        </Button>
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-zinc-900 text-gray-500">or</span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
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
          disabled={isLoading}
          className="w-full bg-queen-purple hover:bg-queen-purple/90 text-white py-3 text-lg font-semibold rounded-xl"
        >
          {isLoading ? 'Processing...' : isSignUp ? 'Continue With Email' : 'Sign In'}
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
    </div>
  )
}