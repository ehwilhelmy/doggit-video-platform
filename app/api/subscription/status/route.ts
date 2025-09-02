import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ 
        hasSubscription: false,
        status: 'no_user'
      })
    }
    
    // Check subscription status
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (error || !subscription) {
      return NextResponse.json({ 
        hasSubscription: false,
        status: 'no_subscription'
      })
    }
    
    // Check if subscription is active
    const isActive = subscription.status === 'active' || subscription.status === 'trialing'
    const isExpired = subscription.current_period_end && new Date(subscription.current_period_end) < new Date()
    
    return NextResponse.json({
      hasSubscription: isActive && !isExpired,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      subscriptionId: subscription.stripe_subscription_id
    })
    
  } catch (error) {
    console.error('Error checking subscription status:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    )
  }
}