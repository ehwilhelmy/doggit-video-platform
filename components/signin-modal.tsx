"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { X, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"

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

interface SignInModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToSignUp?: () => void
}

export function SignInModal({ open, onOpenChange, onSwitchToSignUp }: SignInModalProps) {
  const { signIn, signInWithProvider } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Sign in with Supabase
      const { error } = await signIn(formData.email, formData.password)
      
      if (error) {
        console.log('Signin error:', error)
        
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ submit: "Invalid email or password" })
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ submit: "Please check your email and confirm your account first" })
        } else {
          setErrors({ submit: error.message })
        }
        return
      }
      
      console.log('Signin successful, redirecting...')
      
      // Close modal and redirect to dashboard
      onOpenChange(false)
      
      // Use window.location for reliable redirect after auth
      setTimeout(() => {
        console.log('Redirecting to dashboard...')
        window.location.href = "/dashboard"
      }, 500)
      
    } catch (error) {
      setErrors({ submit: "Something went wrong. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialAuth = async (provider: "google" | "facebook") => {
    setIsLoading(true)
    setErrors({})
    
    try {
      // Sign in with OAuth provider
      const { error } = await signInWithProvider(provider)
      
      if (error) {
        console.log(`${provider} OAuth error:`, error)
        setErrors({ submit: `Failed to sign in with ${provider}. Please try again.` })
        return
      }
      
      console.log(`${provider} OAuth initiated, user will be redirected...`)
      
      // Close modal - user will be redirected by OAuth flow
      onOpenChange(false)
      
    } catch (error) {
      console.log(`${provider} OAuth error:`, error)
      setErrors({ submit: `Failed to sign in with ${provider}. Please try again.` })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false)
      setShowForgotPassword(false)
      alert("Password reset link sent to your email!")
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-jade-purple to-queen-purple p-6">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          
          <div className="text-center text-white">
            <Logo size="md" variant="white" />
            <h2 className="text-2xl font-bold mt-4">
              {showForgotPassword ? "Reset Password" : "Welcome Back"}
            </h2>
            {showForgotPassword && (
              <p className="text-sm opacity-90 mt-2">
                Enter your email to receive a reset link
              </p>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {showForgotPassword ? (
            // Forgot Password Form
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label htmlFor="reset-email" className="text-gray-700 dark:text-gray-300">
                  Email address
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reset-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-jade-purple hover:bg-jade-purple/90"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-sm text-jade-purple hover:underline"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            // Sign In Form
            <>
              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Email address
                  </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-jade-purple focus:ring-jade-purple"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Remember me
                  </span>
                </label>
                
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-jade-purple hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-800 text-sm">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-jade-purple hover:bg-jade-purple/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
            </>
          )}

          {/* Sign Up Link */}
          {!showForgotPassword && (
            <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    onOpenChange(false)
                    onSwitchToSignUp?.()
                  }}
                  className="text-jade-purple font-medium hover:underline"
                >
                  Sign up for free
                </button>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}