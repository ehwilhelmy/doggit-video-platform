import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// Initialize Stripe only when needed
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-07-30.basil'
  })
}

export async function POST(request: NextRequest) {
  try {
    // Add debugging - webhook-testing branch
    console.log('Stripe checkout API called - webhook-testing branch')
    
    // Debug headers and cookies
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))
    
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
    
    const stripe = getStripe()
    const supabase = await createClient()
    
    console.log('Creating supabase client...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('Auth result:', { 
      user: user ? { id: user.id, email: user.email } : 'null', 
      authError: authError ? authError.message : 'none' 
    })
    
    if (!user) {
      console.error('No authenticated user found:', authError)
      console.log('TEMPORARY: Proceeding without user authentication for webhook-testing')
      // For testing: create checkout without user but log the issue
      // In production, this should require authentication
    }
    
    if (user) {
      console.log('Authenticated user:', { id: user.id, email: user.email })
    }
    
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
        console.log('Found existing Stripe customer:', customerId)
      } else {
        // Create new Stripe customer
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabase_user_id: user.id
          }
        })
        customerId = customer.id
        console.log('Created new Stripe customer:', customerId)
      }
    } else {
      // Create anonymous customer for testing
      const customer = await stripe.customers.create({
        metadata: {
          test_user: 'anonymous_checkout'
        }
      })
      customerId = customer.id
      console.log('Created anonymous Stripe customer for testing:', customerId)
    }
    
    // Get or create product
    const products = await stripe.products.list({ limit: 10 })
    let product = products.data.find(p => p.name === 'DOGGIT Training Subscription')
    
    if (!product) {
      product = await stripe.products.create({
        name: 'DOGGIT Training Subscription',
        description: 'Monthly subscription to DOGGIT dog training platform'
      })
    }
    
    // Get or create the two price points
    const prices = await stripe.prices.list({ 
      product: product.id,
      limit: 20 
    })
    
    // Find or create $1 price
    let price1Dollar = prices.data.find(p => 
      p.recurring?.interval === 'month' && 
      p.unit_amount === 100 // $1.00
    )
    
    if (!price1Dollar) {
      price1Dollar = await stripe.prices.create({
        product: product.id,
        unit_amount: 100, // $1.00 in cents
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        nickname: 'First Month Special'
      })
    }
    
    // Find or create $10 price
    let price10Dollar = prices.data.find(p => 
      p.recurring?.interval === 'month' && 
      p.unit_amount === 1000 // $10.00
    )
    
    if (!price10Dollar) {
      price10Dollar = await stripe.prices.create({
        product: product.id,
        unit_amount: 1000, // $10.00 in cents
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        nickname: 'Regular Monthly'
      })
    }
    
    // Create checkout session with subscription schedule
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: price1Dollar.id, // Start with $1 price
          quantity: 1
        }
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/membership`,
      customer: customerId,
      client_reference_id: user?.id || 'anonymous_test',
      metadata: {
        supabase_user_id: user?.id || 'anonymous_test',
        schedule_type: 'promotional', // Mark this as promotional pricing
        first_price: price1Dollar.id,
        recurring_price: price10Dollar.id
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user?.id || 'anonymous_test',
          promotional: 'true',
          first_price: price1Dollar.id,
          recurring_price: price10Dollar.id
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