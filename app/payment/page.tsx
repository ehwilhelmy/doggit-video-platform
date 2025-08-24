"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { X, CreditCard, Lock } from "lucide-react"
import Image from "next/image"

function PaymentPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const fromDemo = searchParams.get("from") === "demo"
  const fromModal = searchParams.get("from") === "modal"
  const videoId = searchParams.get("video")
  const [isDemoMode, setIsDemoMode] = useState(fromDemo)
  
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: ""
  })

  // Check demo mode after component mounts (client-side only)
  useEffect(() => {
    const demoModeFromStorage = typeof window !== 'undefined' ? localStorage.getItem("demoMode") === "true" : false
    const isDemo = fromDemo || demoModeFromStorage
    setIsDemoMode(isDemo)
    
    if (isDemo) {
      setFormData({
        email: "demo@doggit.app",
        cardNumber: "4242 4242 4242 4242",
        expiryDate: "12/28",
        cvv: "123",
        nameOnCard: "Demo User"
      })
    }
  }, [fromDemo])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    if (isDemoMode) {
      // Demo flow - simulate successful payment
      localStorage.setItem("paymentCompleted", "true")
      localStorage.setItem("demoMode", "true")
      // Redirect to success page for account setup
      router.push(`/payment/success?email=${encodeURIComponent(formData.email)}&demo=true`)
    } else {
      // Real payment flow - would integrate with Stripe here
      // After successful Stripe payment, redirect to success page
      router.push(`/payment/success?email=${encodeURIComponent(formData.email)}`)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 h-2">
        <div className="h-full bg-gradient-to-r from-queen-purple to-jade-purple" style={{ width: '66%' }}></div>
      </div>

      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" variant="white" />
            <button
              onClick={handleBack}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-queen-purple to-jade-purple text-white py-3 px-6 text-center">
          <span className="font-semibold text-sm">🎬 DEMO MODE</span>
          <span className="ml-2 text-sm">Complete demo payment to continue</span>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
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
            
            <h1 className="text-4xl font-bold text-white mb-4">
              COMPLETE YOUR SUBSCRIPTION
            </h1>
            <p className="text-xl text-gray-300">
              {isDemoMode ? "Demo payment for DOGGIT subscription" : "Secure payment with Stripe"}
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column - Payment Form */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6">PAYMENT DETAILS</h2>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-sm space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-gray-300 font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-2 h-12 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber" className="text-gray-300 font-medium">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="mt-2 h-12 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate" className="text-gray-300 font-medium">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        placeholder="MM/YY"
                        className="mt-2 h-12 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-gray-300 font-medium">CVV</Label>
                      <Input
                        id="cvv"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                        placeholder="123"
                        className="mt-2 h-12 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="nameOnCard" className="text-gray-300 font-medium">Name on Card</Label>
                    <Input
                      id="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                      className="mt-2 h-12 bg-zinc-800 border-zinc-700 text-white placeholder-gray-500"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-queen-purple hover:bg-queen-purple/90 text-white py-4 text-xl font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:hover:scale-100"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isDemoMode ? "Processing Demo Payment..." : "Processing Payment..."}
                    </div>
                  ) : (
                    <>
                      <Lock className="h-6 w-6 mr-2" />
                      {isDemoMode ? "Complete Demo Payment" : "Complete Payment"}
                    </>
                  )}
                </Button>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Lock className="h-4 w-4" />
                  <span>Secure payment powered by Stripe</span>
                </div>
              </form>
            </div>

            {/* Right Column - Order Review */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white mb-6">
                ORDER SUMMARY
              </h3>

              {/* Subscription Details */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-queen-purple/20 to-jade-purple/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                    <Image
                      src="/doggit-logo-mark.svg"
                      alt="DOGGIT Logo"
                      width={32}
                      height={32}
                      className="brightness-0 invert"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">DOGGIT MONTHLY</h4>
                    <p className="text-gray-400">Expert dog training platform</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-400">First month (Special offer)</span>
                    <span className="font-semibold text-white">$1.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Regular price after</span>
                    <span className="text-white">$10.00/month</span>
                  </div>
                  <div className="border-t border-zinc-800 pt-4">
                    <div className="flex justify-between">
                      <span className="font-bold text-white text-xl">Total today</span>
                      <span className="font-bold text-2xl text-white">$1.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
                <h4 className="font-semibold text-white mb-4 text-lg">WHAT'S INCLUDED</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-queen-purple rounded-full"></div>
                    <span className="text-gray-300">Puppy Basics (3 videos)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-queen-purple rounded-full"></div>
                    <span className="text-gray-300">Fresh Content Monthly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-queen-purple rounded-full"></div>
                    <span className="text-gray-300">Dog Psychology for Dogs of All Ages</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-queen-purple rounded-full"></div>
                    <span className="text-gray-300">Engagement to Inspire Future Content</span>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center gap-3 text-queen-purple mb-2">
                  <Lock className="h-6 w-6" />
                  <span className="font-semibold text-lg">PROTECTED PURCHASE</span>
                </div>
                <p className="text-gray-300">
                  Cancel anytime • Secure checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-500 rounded-full animate-spin" />
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  )
}