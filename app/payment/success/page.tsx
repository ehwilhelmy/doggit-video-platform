"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { Check, Lock, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signUp, user, refreshSubscriptionStatus } = useAuth()

  const emailFromUrl = searchParams.get("email") || ""
  const sessionId = searchParams.get("session_id") || ""
  const isDemoMode = searchParams.get("demo") === "true"

  // Track if we've already started linking to prevent duplicate calls
  const [hasStartedLinking, setHasStartedLinking] = useState(false)

  // Check if user is already authenticated
  useEffect(() => {
    const handleAuthenticatedUser = async () => {
      if (!user || hasStartedLinking) return

      // User is logged in with a session_id - they just completed checkout
      if (sessionId) {
        console.log('User already authenticated after checkout, linking subscription...')
        setHasStartedLinking(true)
        setIsLinkingSubscription(true)

        try {
          console.log('🔗 Calling link-subscription with sessionId:', sessionId)
          const linkResponse = await fetch('/api/stripe/link-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          })

          const linkData = await linkResponse.json()
          console.log('📦 Link-subscription response:', linkData)

          if (linkResponse.ok) {
            console.log('✅ Subscription linked successfully:', linkData)
            // Set payment completed flag so auth context can find it
            localStorage.setItem('paymentCompleted', 'true')

            // Refresh subscription status in auth context
            console.log('🔄 Refreshing subscription status...')
            await refreshSubscriptionStatus()
          } else {
            console.error('❌ Failed to link subscription:', linkResponse.status, linkData)
            alert(`Failed to link subscription: ${linkData.error || 'Unknown error'}. Check console for details.`)
          }
        } catch (error) {
          console.error('❌ Error linking subscription:', error)
          alert('Error linking subscription. Check console for details.')
        }

        // Redirect to dashboard with a flag indicating payment was just completed
        setTimeout(() => {
          router.push('/dashboard?payment_complete=true')
        }, 1500)
        return
      }

      // User is logged in without session_id - shouldn't be on this page
      if (!sessionId) {
        console.log('User already authenticated with no checkout session, redirecting to dashboard')
        router.push('/dashboard')
      }
    }

    handleAuthenticatedUser()
  }, [user, router, sessionId, hasStartedLinking, refreshSubscriptionStatus])
  
  const [formData, setFormData] = useState({
    email: emailFromUrl,
    firstName: "",
    lastName: "",
    pupName: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isLinkingSubscription, setIsLinkingSubscription] = useState(false)
  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    pupName: "",
    password: "",
    confirmPassword: ""
  })
  
  // Set loading false after initial auth check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAuth(false)
    }, 1500) // Give it 1.5 seconds to check auth
    
    return () => clearTimeout(timer)
  }, [])
  
  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++
    return strength
  }
  
  const passwordStrength = getPasswordStrength(formData.password)
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"]
  
  const validateForm = () => {
    const newErrors = {
      email: "",
      firstName: "",
      lastName: "",
      pupName: "",
      password: "",
      confirmPassword: ""
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Please enter your first name"
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Please enter your last name"
    }
    
    if (!formData.pupName.trim()) {
      newErrors.pupName = "Please enter your pup's name"
    }
    
    if (!formData.password) {
      newErrors.password = "Please create a password"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }
    
    setErrors(newErrors)
    return !newErrors.email && !newErrors.firstName && !newErrors.lastName && !newErrors.pupName && !newErrors.password && !newErrors.confirmPassword
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsCreatingAccount(true)
    
    try {
      // Create user in Supabase with metadata
      const { data, error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        pup_name: formData.pupName,
        subscription_status: 'active',
        subscription_start: new Date().toISOString()
      })
      
      if (error) {
        console.error('Supabase signup error:', error)
        setErrors({ ...errors, password: error.message || "Failed to create account. Please try again." })
        setIsCreatingAccount(false)
        return
      }
      
      if (data.user) {
        console.log('User created successfully:', data.user.id)
        console.log('Welcome email would be sent to:', formData.email)

        // If user was created but needs email confirmation, handle it
        if (!data.session) {
          console.log('No session after signup - user needs email confirmation')

          // For now, proceed with localStorage auth until email is confirmed
          // In a production app, you might want to show an email confirmation screen
          console.log('User will need to confirm email to get full Supabase session')
        } else {
          console.log('User signed up and session created successfully')
        }

        // Link the Stripe subscription to the user's account
        if (sessionId) {
          try {
            console.log('🔗 Linking Stripe subscription to user account...')
            const linkResponse = await fetch('/api/stripe/link-subscription', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId })
            })

            if (linkResponse.ok) {
              const linkData = await linkResponse.json()
              console.log('✅ Successfully linked subscription:', linkData)

              // Refresh subscription status in auth context
              console.log('🔄 Refreshing subscription status...')
              await refreshSubscriptionStatus()
            } else {
              const errorData = await linkResponse.json()
              console.error('❌ Failed to link subscription:', errorData)
              // Continue anyway - user can still access the platform
            }
          } catch (linkError) {
            console.error('❌ Error linking subscription:', linkError)
            // Continue anyway - webhook might have already handled it
          }
        }

        // Store additional data in localStorage for backwards compatibility (will be cleaned up by auth context)
        const accountData = {
          email: formData.email,
          pupName: formData.pupName,
          subscriptionStatus: 'active',
          subscriptionStart: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          userId: data.user.id
        }

        localStorage.setItem('accountData', JSON.stringify(accountData))
        localStorage.setItem('pupName', formData.pupName)
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('subscriptionActive', 'true')
        localStorage.setItem('paymentCompleted', 'true')
        localStorage.setItem('isAuthenticated', 'true')

        // Redirect to dashboard with payment complete flag
        setTimeout(() => {
          router.push(`/dashboard?payment_complete=true&email=${encodeURIComponent(formData.email)}&pup=${encodeURIComponent(formData.pupName)}`)
        }, 500)
      }
      
    } catch (error) {
      console.error('Error creating account:', error)
      setErrors({ ...errors, password: "Failed to create account. Please try again." })
      setIsCreatingAccount(false)
    }
  }
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  // Show loading while checking authentication or linking subscription
  if (isCheckingAuth || isLinkingSubscription) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">
            {isLinkingSubscription ? 'Setting up your subscription...' : 'Verifying your account...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 h-2">
        <div className="h-full bg-gradient-to-r from-queen-purple to-jade-purple" style={{ width: '100%' }}></div>
      </div>
      
      {/* Success Banner */}
      <div className="bg-green-50 border border-green-200 text-green-800 py-3 px-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-3 w-3 text-green-600" />
          </div>
          <span className="font-medium">Payment Successful!</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header with Logo and Title */}
          <div className="text-center mb-12">
            {/* DOGGIT Logo Mark */}
            <div className="w-20 h-20 mx-auto mb-6">
              <Image
                src="/doggit-logo-mark.svg"
                alt="DOGGIT Logo"
                width={80}
                height={73}
                className="brightness-0 invert opacity-90"
              />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Almost Done! 
            </h1>
            <p className="text-xl text-gray-300">
              Let's Secure Your Account
            </p>
          </div>
          
          {/* Account Setup Form */}
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-300 text-sm">Your email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                className={`mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 ${
                  errors.email ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-300 text-sm">
                  First name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Enter your first name"
                  className={`mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 ${
                    errors.firstName ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="lastName" className="text-gray-300 text-sm">
                  Last name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Enter your last name"
                  className={`mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 ${
                    errors.lastName ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            {/* Pup's Name */}
            <div>
              <Label htmlFor="pupName" className="text-gray-300 text-sm">
                Your pup's name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="pupName"
                type="text"
                value={formData.pupName}
                onChange={(e) => handleInputChange("pupName", e.target.value)}
                placeholder="e.g., Bella, Max, Charlie"
                className={`mt-1 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 ${
                  errors.pupName ? 'border-red-500' : ''
                }`}
                required
              />
              {errors.pupName && (
                <p className="text-red-400 text-xs mt-1">{errors.pupName}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-gray-300 text-sm">
                Choose a password <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="At least 8 characters"
                  className={`mt-1 pr-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          index < passwordStrength
                            ? strengthColors[passwordStrength - 1]
                            : "bg-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    Password strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : "Too short"}
                  </p>
                </div>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300 text-sm">
                Confirm password <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Re-enter your password"
                  className={`mt-1 pr-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500 ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* Stay Logged In */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="stayLoggedIn"
                defaultChecked
                className="rounded border-zinc-700 bg-zinc-800 text-queen-purple focus:ring-queen-purple"
              />
              <Label htmlFor="stayLoggedIn" className="text-gray-400 text-sm">
                Keep me logged in for 30 days
              </Label>
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isCreatingAccount}
              className="w-full bg-queen-purple hover:bg-queen-purple/90 text-white py-3 text-lg font-semibold rounded-xl transform transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              {isCreatingAccount ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating your account...
                </div>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Start Training
                </>
              )}
            </Button>
          </form>
          
          {/* Security Note */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Your information is secure and encrypted
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}