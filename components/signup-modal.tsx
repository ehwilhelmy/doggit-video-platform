"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Eye, EyeOff } from "lucide-react"

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

interface SignUpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTrainingGoals?: string[]
  onSwitchToSignIn?: () => void
}

export function SignUpModal({ open, onOpenChange, selectedTrainingGoals = [], onSwitchToSignIn }: SignUpModalProps) {
  const { signUp, signInWithProvider } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false
  })

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.password.trim()) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      // Sign up with Supabase
      const { data, error } = await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        trainingGoals: selectedTrainingGoals,
        createdAt: new Date().toISOString()
      })
      
      if (error) {
        console.log('Signup error:', error)
        
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          setErrors({ email: "An account with this email already exists" })
        } else if (error.message.includes('Password')) {
          setErrors({ password: error.message })
        } else {
          setErrors({ submit: error.message })
        }
        return
      }
      
      // Check if user needs email confirmation
      if (data?.user && !data.session) {
        console.log('Email confirmation required')
        setErrors({ 
          submit: "Please check your email and click the confirmation link to complete your signup, then return here to sign in." 
        })
        return
      }
      
      // If we have a session, user is automatically logged in
      if (data?.session) {
        console.log('Signup successful with session, redirecting...')
        
        // Clear any previous subscription data to ensure fresh experience
        localStorage.removeItem("subscriptionActive")
        localStorage.removeItem("paymentCompleted")
        localStorage.removeItem("selectedVideo")
        
        // Close modal and redirect to dashboard
        onOpenChange(false)
        
        // Use window.location for reliable redirect after auth
        setTimeout(() => {
          console.log('Redirecting to dashboard...')
          window.location.href = "/dashboard"
        }, 500)
      }
      
    } catch (error) {
      setErrors({ submit: "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSocialSignUp = async (provider: "google" | "facebook") => {
    setIsSubmitting(true)
    setErrors({})
    
    try {
      // Sign in with OAuth provider
      const { error } = await signInWithProvider(provider)
      
      if (error) {
        console.log(`${provider} OAuth error:`, error)
        setErrors({ submit: `Failed to sign up with ${provider}. Please try again.` })
        return
      }
      
      console.log(`${provider} OAuth initiated, user will be redirected...`)
      
      // Clear any previous subscription data
      localStorage.removeItem("subscriptionActive")
      localStorage.removeItem("paymentCompleted") 
      localStorage.removeItem("selectedVideo")
      
      // Close modal - user will be redirected by OAuth flow
      onOpenChange(false)
      
    } catch (error) {
      console.log(`${provider} OAuth error:`, error)
      setErrors({ submit: `Failed to sign up with ${provider}. Please try again.` })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none h-screen w-screen p-0 m-0 rounded-none border-none">
        <div className="relative h-full w-full flex">
          {/* Left side - Form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white dark:bg-gray-900">
            <div className="max-w-md mx-auto w-full">
              <DialogHeader className="text-left mb-8">
                <button
                  onClick={() => onOpenChange(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-10"
                >
                  <X className="h-6 w-6" />
                </button>
                
                <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Start Your Dog Training Journey
                </DialogTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Join thousands of dog owners transforming their relationships with their pets.
                </p>
                
                {selectedTrainingGoals.length > 0 && (
                  <div className="mt-4 p-4 bg-jade-purple/10 rounded-lg">
                    <p className="text-sm text-jade-purple font-medium mb-2">Your selected training goals:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrainingGoals.map((goal, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-jade-purple/20 text-jade-purple text-xs rounded-full"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </DialogHeader>

              {/* Social Auth Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-3 py-3 transition-all duration-200 hover:shadow-md"
                  onClick={() => handleSocialSignUp("google")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  <span>{isSubmitting ? "Signing up..." : "Sign up with Google"}</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-3 py-3 transition-all duration-200 hover:shadow-md"
                  onClick={() => handleSocialSignUp("facebook")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  ) : (
                    <FacebookIcon />
                  )}
                  <span>{isSubmitting ? "Signing up..." : "Sign up with Facebook"}</span>
                </Button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">
                    Or sign up with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value })
                        if (errors.firstName) setErrors({ ...errors, firstName: "" })
                      }}
                      className={errors.firstName ? "border-red-500 focus:border-red-500" : ""}
                      disabled={isSubmitting}
                      required
                    />
                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value })
                        if (errors.lastName) setErrors({ ...errors, lastName: "" })
                      }}
                      className={errors.lastName ? "border-red-500 focus:border-red-500" : ""}
                      disabled={isSubmitting}
                      required
                    />
                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({ ...errors, email: "" })
                    }}
                    className={errors.email ? "border-red-500 focus:border-red-500" : ""}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password (min 6 characters)"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value })
                        if (errors.password) setErrors({ ...errors, password: "" })
                      }}
                      className={errors.password ? "border-red-500 focus:border-red-500" : ""}
                      disabled={isSubmitting}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => {
                        setFormData({ ...formData, agreeToTerms: !!checked })
                        if (errors.agreeToTerms) setErrors({ ...errors, agreeToTerms: "" })
                      }}
                      disabled={isSubmitting}
                      required
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <a href="#" className="text-jade-purple hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-jade-purple hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                  {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-800 text-sm">{errors.submit}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-jade-purple text-white hover:bg-jade-purple/90 h-12 text-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account & Start Learning"
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false)
                      onSwitchToSignIn?.()
                    }}
                    className="text-jade-purple hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            </div>
          </div>

          {/* Right side - Image (hidden on mobile) */}
          <div className="hidden lg:block lg:w-1/2 relative">
            <img
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80&auto=format&fit=crop"
              alt="Happy dog with trainer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}