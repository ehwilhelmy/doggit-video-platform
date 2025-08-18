"use client"

export const dynamic = 'force-dynamic'

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { X, Check, CreditCard } from "lucide-react"
import Image from "next/image"

function MembershipPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const fromModal = searchParams.get("from") === "modal"
  const videoId = searchParams.get("v")

  const handleSubscribe = () => {
    // Go directly to payment with the same parameters
    router.push(`/payment?from=${fromModal ? 'modal' : 'membership'}&video=${videoId || 'puppy-basics'}`)
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-black">
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
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              UNLOCK EXPERT DOG TRAINING
            </h1>
            <p className="text-xl text-gray-300">
              Join thousands of successful dog owners and start your journey today
            </p>
          </div>

          {/* Features Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl font-semibold text-white mb-8 text-center">WHAT'S INCLUDED</h3>
            
            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="flex items-start gap-4">
                <Check className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white text-lg">Expert Training Videos</h4>
                  <p className="text-gray-400">Complete courses from certified trainers</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white text-lg">Mobile App + Offline Access</h4>
                  <p className="text-gray-400">Train anywhere with offline downloads</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white text-lg">Community Support</h4>
                  <p className="text-gray-400">Connect with 50,000+ dog owners</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white text-lg">Proven Results</h4>
                  <p className="text-gray-400">94% see results within 7 days</p>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="max-w-lg mx-auto p-6 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-3 text-queen-purple mb-2">
                <Check className="h-6 w-6" />
                <span className="font-semibold text-lg">30-Day Money-Back Guarantee</span>
              </div>
              <p className="text-gray-300">
                Try risk-free. Full refund if not satisfied.
              </p>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">CHOOSE YOUR PLAN</h2>
            
            {/* Special Offer */}
            <div className="bg-gradient-to-br from-queen-purple to-jade-purple rounded-xl p-8 shadow-xl border border-purple-500/20">
              <div className="text-white font-semibold text-sm mb-2 tracking-wider">SPECIAL OFFER</div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-white">$1</span>
                <span className="text-purple-100 text-lg">first month</span>
              </div>
              <div className="text-sm text-purple-100 mb-4">Then $10/month • Cancel anytime</div>
              <div className="text-xs text-purple-200">
                Save 90% on your first month
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400">You'll be charged</span>
                <span className="font-bold text-white">$1.00 today</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400">Then</span>
                <span className="text-white">$10.00/month</span>
              </div>
              <div className="text-sm text-gray-500 mt-3 pt-3 border-t border-zinc-800">
                Cancel anytime • 30-day money-back guarantee
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleSubscribe}
              className="w-full bg-queen-purple hover:bg-queen-purple/90 text-white py-4 text-xl font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              Continue to Checkout
            </Button>
          </div>
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