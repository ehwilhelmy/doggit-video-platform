"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Mail, Lock, Eye, EyeOff, AlertCircle, Heart, User, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogoMark } from "@/components/logo-mark"

interface AccountCreationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AccountCreationModal({ open, onOpenChange, onSuccess }: AccountCreationModalProps) {
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    puppyName: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

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
      // Set checkout pending flag before signup to prevent dashboard redirect
      localStorage.setItem('checkout_pending', 'true')
      
      const { error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        puppy_name: formData.puppyName
      })
      
      if (error) {
        // Remove the flag if signup failed
        localStorage.removeItem('checkout_pending')
        setError(error.message)
        setIsLoading(false)
      } else {
        setIsSuccess(true)
        // Brief delay to ensure auth state settles, then proceed
        setTimeout(() => {
          onOpenChange(false)
          onSuccess?.()
        }, 300)
      }
    } catch (err: any) {
      // Remove the flag if there was an error
      localStorage.removeItem('checkout_pending')
      setError(err.message || "An error occurred")
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setFormData({ email: "", password: "", firstName: "", lastName: "", puppyName: "" })
    setError(null)
    setIsSuccess(false)
    setIsLoading(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetModal()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-zinc-900 border-zinc-800 p-0">
        <div className="p-8">
          {/* Success State */}
          {isSuccess && (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Account Created!</h3>
              <p className="text-gray-400 mb-4">Redirecting to payment...</p>
              <Loader2 className="h-6 w-6 text-queen-purple animate-spin mx-auto" />
            </div>
          )}

          {/* Form State */}
          {!isSuccess && (
            <>
              {/* DOGGIT Mark at top */}
              <div className="flex justify-center mb-6">
                <LogoMark size="md" variant="white" />
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-400 text-center mb-6">
                Join thousands of dog owners and start training today.
              </p>

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
                    Email address
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
                      placeholder="Create a password"
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
                  By creating an account, you agree to our{' '}
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
                  className="w-full bg-queen-purple hover:bg-queen-purple/90 text-white py-3 text-lg font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {isLoading ? 'Creating Account...' : 'Create Account & Continue'}
                </Button>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}