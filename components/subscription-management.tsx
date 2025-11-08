"use client"

import { useState, useEffect } from 'react'
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { CreditCard } from "lucide-react"
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'

export function SubscriptionManagement() {
  const { user } = useAuth()
  const [hasStripeCustomer, setHasStripeCustomer] = useState(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    checkSubscriptionType()
  }, [user])
  
  const checkSubscriptionType = async () => {
    if (!user) return

    const supabase = createClient()
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, stripe_subscription_id, status')
      .eq('user_id', user.id)
      .single()

    console.log('🔍 Subscription Management - User:', user.email)
    console.log('🔍 Subscription Management - Subscription data:', subscription)
    console.log('🔍 Subscription Management - Error:', error)
    console.log('🔍 Subscription Management - Has Stripe Customer:', !!subscription?.stripe_customer_id)

    // User has a Stripe customer ID if they paid through Stripe
    setHasStripeCustomer(!!subscription?.stripe_customer_id)
    setLoading(false)
  }
  
  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error Response:', errorData)
        throw new Error(errorData.error || errorData.stripeError || 'Failed to create customer portal session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error opening customer portal:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Unable to open subscription management.\n\nError: ${errorMessage}\n\nPlease contact support@doggit.app if this persists.`)
    }
  }
  
  
  // Don't show anything for admin accounts
  if (user?.email === 'erica@doggit.app' || user?.email === 'thor@doggit.app') {
    return null
  }
  
  if (loading) {
    return null
  }
  
  // Only show subscription management for Stripe customers
  // Manual users don't need unsubscribe option (added for a reason)
  if (!hasStripeCustomer) {
    return null
  }
  
  return (
    <DropdownMenuItem 
      onClick={handleManageSubscription}
      className="text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer"
    >
      <CreditCard className="h-4 w-4 mr-2" />
      Manage Subscription
    </DropdownMenuItem>
  )
}