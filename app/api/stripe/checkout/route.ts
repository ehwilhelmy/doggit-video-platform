import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
})

export async function POST(request: NextRequest) {
  try {
    // Add debugging
    console.log('Stripe checkout API called')
    
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not found')
      return NextResponse.json(
        { error: 'Stripe configuration missing' },
        { status: 500 }
      )
    }
    
    const body = await request.json()
    const { priceId, successUrl, cancelUrl } = body
    console.log('Request body:', { priceId, successUrl, cancelUrl })
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
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
    
    // Default price - create product and price if needed
    let finalPriceId = priceId
    
    if (!finalPriceId || finalPriceId === 'price_default') {
      // Create or retrieve default product and price
      const products = await stripe.products.list({ limit: 10 })
      let product = products.data.find(p => p.name === 'DOGGIT Training Subscription')
      
      if (!product) {
        product = await stripe.products.create({
          name: 'DOGGIT Training Subscription',
          description: 'Monthly subscription to DOGGIT dog training platform'
        })
      }
      
      const prices = await stripe.prices.list({ 
        product: product.id,
        limit: 10 
      })
      let price = prices.data.find(p => 
        p.recurring?.interval === 'month' && 
        p.unit_amount === 999 // $9.99
      )
      
      if (!price) {
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: 999, // $9.99 in cents
          currency: 'usd',
          recurring: {
            interval: 'month'
          }
        })
      }
      
      finalPriceId = price.id
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
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