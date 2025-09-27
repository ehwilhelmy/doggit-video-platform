"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, CreditCard, Play, Star } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { LogoMark } from "@/components/logo-mark"

export default function AccountPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Redirect non-logged in users to membership page
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/membership')
    }
  }, [user, authLoading, router])

  const handleStripeCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_default',
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/account`
        })
      })
      
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No Stripe URL returned:', data)
        alert('Payment system is currently unavailable. Please try again later.')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-queen-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogoMark size="sm" variant="white" />
              <span className="text-white text-xl font-bold">DOGGIT</span>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Welcome to DOGGIT, {user.user_metadata?.full_name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-lg text-gray-400">
              Your account is ready. Complete your subscription to start training {user.user_metadata?.puppy_name || 'your pup'}.
            </p>
          </div>

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
                onClick={handleStripeCheckout}
                disabled={isLoading}
                className="w-full bg-queen-purple hover:bg-queen-purple/90 text-white py-4 text-xl font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  'Redirecting to checkout...'
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Complete Your Subscription
                  </>
                )}
              </Button>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>4.9/5 rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Play className="h-4 w-4" />
                  <span>50+ videos</span>
                </div>
              </div>
            </div>

            {/* Right Column - What You're Getting */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-8">START TRAINING TODAY</h3>
              
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
                    <span className="text-white text-lg font-medium">Personalized for {user.user_metadata?.puppy_name || 'Your Pup'}</span>
                    <p className="text-gray-400 text-sm mt-1">Training plans customized for your dog's specific needs and behavior.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white text-lg font-medium">Community Support</span>
                    <p className="text-gray-400 text-sm mt-1">Learn alongside other dog owners with guidance from our expert trainers.</p>
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

              {/* Social Proof */}
              <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">4.9/5 from 10,000+ dog owners</span>
                </div>
                <p className="text-sm text-gray-300 italic">
                  "My dog went from destructive to obedient in just 2 weeks. The training videos are incredibly effective!"
                </p>
                <p className="text-xs text-gray-500 mt-2">- Sarah M., Golden Retriever owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}