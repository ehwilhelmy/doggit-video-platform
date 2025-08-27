import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const body = await request.json()
    const { priceId, successUrl, cancelUrl } = body
    
    // Create or retrieve Stripe customer
    let customerId: string | undefined
    
    if (user) {
      // Check if user already has a Stripe customer ID in subscriptions
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .single()
      
      if (subscription?.stripe_customer_id) {
        customerId = subscription.stripe_customer_id
      } else {
        // Create new Stripe customer
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabase_user_id: user.id
          }
        })
        customerId = customer.id
      }
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId || 'price_1QoSpvAtFqZr1zSUpXzgOGmS', // Default to monthly price
          quantity: 1
        }
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/membership`,
      customer: customerId,
      client_reference_id: user?.id,
      metadata: {
        supabase_user_id: user?.id || ''
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user?.id || ''
        }
      },
      allow_promotion_codes: true
    })
    
    return NextResponse.json({ url: session.url })
    
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}