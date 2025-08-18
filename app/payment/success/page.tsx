"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { Check, Lock, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const email = searchParams.get("email") || ""
  const isDemoMode = searchParams.get("demo") === "true"
  
  const [formData, setFormData] = useState({
    pupName: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [errors, setErrors] = useState({
    pupName: "",
    password: "",
    confirmPassword: ""
  })
  
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
      pupName: "",
      password: "",
      confirmPassword: ""
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
    return !newErrors.pupName && !newErrors.password && !newErrors.confirmPassword
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsCreatingAccount(true)
    
    try {
      // Simulate account creation delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, store account info in localStorage
      // In production, this would integrate with your auth service
      const accountData = {
        email: email,
        pupName: formData.pupName,
        subscriptionStatus: 'active',
        subscriptionStart: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
      
      // Store account data
      localStorage.setItem('accountData', JSON.stringify(accountData))
      localStorage.setItem('pupName', formData.pupName)
      localStorage.setItem('userEmail', email)
      localStorage.setItem('subscriptionActive', 'true')
      localStorage.setItem('paymentCompleted', 'true')
      localStorage.setItem('isAuthenticated', 'true')
      
      // In production, this would trigger an email service
      console.log('Welcome email would be sent to:', email)
      
      // Redirect to web version of onboarding goals
      setTimeout(() => {
        router.push(`/onboarding/goals-web?email=${encodeURIComponent(email)}&pup=${encodeURIComponent(formData.pupName)}`)
      }, 500)
      
    } catch (error) {
      console.error('Error:', error)
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Success Checkmark Animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-fade-in">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-400">
            Let's set up your DOGGIT account
          </p>
        </div>
        
        {/* Account Setup Form */}
        <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
          <div className="text-center mb-6">
            <Image
              src="/doggit-logo-mark.svg"
              alt="DOGGIT Logo"
              width={60}
              height={55}
              className="brightness-0 invert opacity-90 mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-white">
              Almost done! Let's secure your account
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email (read-only) */}
            <div>
              <Label htmlFor="email" className="text-gray-300 text-sm">Your email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                className="mt-1 bg-zinc-800/50 border-zinc-700 text-gray-400 cursor-not-allowed"
                disabled
                readOnly
              />
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