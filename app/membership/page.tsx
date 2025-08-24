"use client"

export const dynamic = 'force-dynamic'

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { X, CheckCircle, CreditCard } from "lucide-react"
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
      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 h-2">
        <div className="h-full bg-gradient-to-r from-queen-purple to-jade-purple" style={{ width: '33%' }}></div>
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

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
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

          {/* Two Column Layout for Desktop */}
          <div className="grid lg:grid-cols-2 gap-16 mb-16 items-start">
            {/* Left Column - Pricing */}
            <div className="space-y-6">
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
                  Cancel anytime
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

            {/* Right Column - What's Included */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-8">WHAT'S INCLUDED</h3>
              
              {/* Features List */}
              <div className="space-y-5">
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
                    <span className="text-white text-lg font-medium">Expert Puppy Training Videos</span>
                    <p className="text-gray-400 text-sm mt-1">Complete courses to set the foundational success with your pup.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white text-lg font-medium">Expert Behavioral Training Videos</span>
                    <p className="text-gray-400 text-sm mt-1">Understand and connect with your dog.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white text-lg font-medium">Proven Results</span>
                    <p className="text-gray-400 text-sm mt-1">Backed by behavioral psychology, our method sets the standard for success.</p>
                  </div>
                </div>
              </div>
            </div>
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