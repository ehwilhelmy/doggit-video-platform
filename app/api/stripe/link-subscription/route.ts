import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-07-30.basil'
  })
}

/**
 * Link a Stripe subscription to a user account after signup
 * Called from the payment success page after user creates their account
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const stripe = getStripe()
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    console.log('🔗 Linking subscription for user:', user.id)

    // Get the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session.subscription) {
      return NextResponse.json(
        { error: 'No subscription found in session' },
        { status: 404 }
      )
    }

    // Get the subscription details
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    console.log('📝 Retrieved subscription:', subscription.id)

    // Check if subscription already exists for this user
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Check metadata for promotional pricing info
    const isPromotional = session.metadata?.schedule_type === 'promotional'

    const subscriptionData = {
      user_id: user.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      stripe_price_id: subscription.items.data[0].price.id,
      status: subscription.status as any,
      billing_interval: subscription.items.data[0].price.recurring?.interval as any,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      is_promotional: isPromotional || false
    }

    let result
    if (existingSub) {
      console.log('Updating existing subscription')
      result = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('user_id', user.id)
        .select()
    } else {
      console.log('Creating new subscription')
      result = await supabase
        .from('subscriptions')
        .insert(subscriptionData)
        .select()
    }

    if (result.error) {
      console.error('❌ Error saving subscription:', result.error)
      return NextResponse.json(
        { error: 'Failed to save subscription', details: result.error },
        { status: 500 }
      )
    }

    console.log('✅ Successfully linked subscription to user:', user.id)

    return NextResponse.json({
      success: true,
      subscription: result.data?.[0]
    })

  } catch (error) {
    console.error('Error linking subscription:', error)
    return NextResponse.json(
      { error: 'Failed to link subscription' },
      { status: 500 }
    )
  }
}
