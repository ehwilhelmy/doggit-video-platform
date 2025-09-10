"use client"

export const dynamic = 'force-dynamic'

import { useState, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { CheckCircle, CreditCard, User, Lock } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { AccountCreationStep } from "@/components/account-creation-step"
import { CheckoutHeader } from "@/components/checkout-header"

function MembershipPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showAccountCreation, setShowAccountCreation] = useState(false)
  
  const fromModal = searchParams.get("from") === "modal"
  const videoId = searchParams.get("v")

  // Check if user just logged in and redirect to checkout
  useEffect(() => {
    const checkoutPending = localStorage.getItem('checkout_pending')
    if (user && checkoutPending === 'true') {
      localStorage.removeItem('checkout_pending')
      handleStripeCheckout()
    }
  }, [user])

  // Redirect logged-in users to dashboard if they shouldn't be here
  useEffect(() => {
    if (user && !localStorage.getItem('checkout_pending') && !fromModal) {
      router.push('/dashboard')
    }
  }, [user, fromModal, router])

  const handleStripeCheckout = async () => {
    setIsLoading(true)
    try {
      // Call our Stripe checkout API
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_default',
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/membership`
        })
      })
      
      const data = await response.json()
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        console.error('No Stripe URL returned:', data)
        // Show error message instead of falling back
        alert('Payment system is currently unavailable. Please try again later.')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!user) {
      // Show account creation step
      setShowAccountCreation(true)
    } else {
      // User is logged in, proceed to Stripe
      handleStripeCheckout()
    }
  }

  // Determine current step
  const getCurrentStep = () => {
    if (showAccountCreation && !user) return 'account'
    if (isLoading) return 'payment'
    if (user) return 'payment' // User is logged in, ready for payment
    return 'membership'
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Clean Header with Stepper */}
      <CheckoutHeader 
        currentStep={getCurrentStep()} 
        onClose={() => router.push('/')}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Only show header when not in account creation */}
          {!showAccountCreation && (
            <div className="text-center mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Choose Your Membership
              </h1>
              <p className="text-lg text-gray-400">
                Expert dog training from world-class instructors
              </p>
            </div>
          )}

          {/* Show account creation or pricing based on state */}
          {showAccountCreation && !user ? (
            <div className="max-w-md mx-auto">
              <AccountCreationStep 
                onSuccess={handleStripeCheckout} 
                onBack={() => setShowAccountCreation(false)}
              />
            </div>
          ) : (
          <div className="grid lg:grid-cols-2 gap-16 mb-16 items-start">
            {/* Left Column - Pricing */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 shadow-xl">
                <div className="text-center mb-6">
                  <div className="inline-block bg-gradient-to-r from-queen-purple to-jade-purple text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    SPECIAL OFFER - SAVE 90%
                  </div>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-white">$1</span>
                    <span className="text-gray-400 text-lg">first month</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Then $10/month • Cancel anytime
                  </div>
                </div>
                
                {/* Divider */}
                <div className="border-t border-zinc-800 my-6"></div>
                
                {/* Pricing Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Today's charge</span>
                    <span className="font-bold text-white">$1.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Starting month 2</span>
                    <span className="text-white">$10.00/month</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleSubscribe}
                disabled={isLoading || authLoading}
                className="w-full bg-queen-purple hover:bg-queen-purple/90 text-white py-4 text-xl font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? (
                  'Loading...'
                ) : isLoading ? (
                  'Redirecting to checkout...'
                ) : !user ? (
                  <>
                    <User className="mr-2 h-5 w-5" />
                    Create Account & Subscribe
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Continue to Payment
                  </>
                )}
              </Button>

              {/* Security Note */}
              {!user && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Lock className="h-4 w-4" />
                  <span>Secure checkout powered by Stripe</span>
                </div>
              )}
            </div>

            {/* Right Column - What's Included */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-8">WHAT'S INCLUDED</h3>
              
              {/* Features List */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white text-lg font-medium">Expert Training Videos</span>
                    <p className="text-gray-400 text-sm mt-1">Access our complete library of professional dog training courses.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white text-lg font-medium">New Content Released Monthly</span>
                    <p className="text-gray-400 text-sm mt-1">Fresh content added regularly to expand your training knowledge.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white text-lg font-medium">Community Support</span>
                    <p className="text-gray-400 text-sm mt-1">Learn alongside other dog owners with guidance from our expert trainers. Plus live chat & AI training support.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white text-lg font-medium">30-Day Money-Back Guarantee</span>
                    <p className="text-gray-400 text-sm mt-1">Try risk-free. Not satisfied? Get a full refund within 30 days.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MembershipPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-500 rounded-full animate-spin" />
      </div>
    }>
      <MembershipPageContent />
    </Suspense>
  )
}