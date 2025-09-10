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
  console.log('🚀 Webhook endpoint called at:', new Date().toISOString())
  console.log('Headers:', Object.fromEntries(request.headers.entries()))
  
  try {
    const stripe = getStripe()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    
    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }
    
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!
    
    console.log('🎯 Webhook received:', new Date().toISOString())
    
    let event: Stripe.Event
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('✅ Webhook signature verified, event type:', event.type)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    console.log('📝 Processing event:', event.type, 'Event ID:', event.id)
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Get the subscription
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )
        
        // Check if this is a promotional subscription that needs a schedule
        const isPromotional = session.metadata?.schedule_type === 'promotional'
        const firstPriceId = session.metadata?.first_price
        const recurringPriceId = session.metadata?.recurring_price
        
        // If promotional, create a subscription schedule to change price after first month
        if (isPromotional && recurringPriceId) {
          try {
            // Create subscription schedule
            await stripe.subscriptionSchedules.create({
              from_subscription: subscription.id,
              phases: [
                {
                  // First phase: Current subscription at $1 for 1 month (already active)
                  items: [{ 
                    price: firstPriceId || subscription.items.data[0].price.id,
                    quantity: 1 
                  }],
                  iterations: 1, // Only 1 billing cycle at $1
                  start_date: subscription.current_period_start,
                  end_date: subscription.current_period_end
                },
                {
                  // Second phase: $10/month indefinitely
                  items: [{ 
                    price: recurringPriceId,
                    quantity: 1 
                  }],
                  start_date: subscription.current_period_end
                }
              ]
            })
            console.log('Created subscription schedule for promotional pricing')
          } catch (scheduleError) {
            console.error('Error creating subscription schedule:', scheduleError)
            // Continue anyway - subscription is still valid even if schedule fails
          }
        }
        
        // Update user's subscription in database
        const userId = session.client_reference_id || session.metadata?.supabase_user_id
        
        console.log('Webhook: Processing checkout.session.completed')
        console.log('Webhook: User ID:', userId)
        console.log('Webhook: Session ID:', session.id)
        console.log('Webhook: Customer ID:', subscription.customer)
        console.log('Webhook: Subscription Status:', subscription.status)
        
        if (userId) {
          // First check if subscription already exists
          const { data: existingSub } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single()

          const subscriptionData = {
            user_id: userId,
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

          let data, error
          
          if (existingSub) {
            // Update existing subscription with Stripe data
            console.log('Webhook: Updating existing subscription with Stripe data')
            const result = await supabase
              .from('subscriptions')
              .update(subscriptionData)
              .eq('user_id', userId)
              .select()
            data = result.data
            error = result.error
          } else {
            // Create new subscription
            console.log('Webhook: Creating new subscription')
            const result = await supabase
              .from('subscriptions')
              .insert(subscriptionData)
              .select()
            data = result.data
            error = result.error
          }
          
          if (error) {
            console.error('❌ Webhook: Error creating subscription:', error)
            console.error('❌ Webhook: Error details:', JSON.stringify(error, null, 2))
            console.error('❌ Webhook: Attempted data:', JSON.stringify(subscriptionData, null, 2))
            // Return error response to Stripe so it retries
            return NextResponse.json(
              { error: 'Failed to save subscription', details: error },
              { status: 500 }
            )
          } else {
            console.log('✅ Webhook: Successfully created/updated subscription for user:', userId)
            console.log('✅ Webhook: Subscription data:', data)
            console.log('✅ Webhook: Stripe customer ID saved:', subscriptionData.stripe_customer_id)
          }
        } else {
          console.error('Webhook: No userId found in session')
          console.error('Webhook: Session data:', {
            client_reference_id: session.client_reference_id,
            metadata: session.metadata,
            customer: session.customer
          })
        }
        break
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Find user by stripe_customer_id in subscriptions table
        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', subscription.customer as string)
          .single()
        
        if (existingSubscription) {
          if (event.type === 'customer.subscription.deleted') {
            // Mark subscription as canceled
            await supabase
              .from('subscriptions')
              .update({
                status: 'canceled',
                canceled_at: new Date().toISOString()
              })
              .eq('stripe_subscription_id', subscription.id)
          } else {
            // Update subscription status
            await supabase
              .from('subscriptions')
              .update({
                status: subscription.status as any,
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end,
                canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null
              })
              .eq('stripe_subscription_id', subscription.id)
          }
        }
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        // Find user by stripe_customer_id in subscriptions table
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', invoice.customer as string)
          .single()
        
        if (subscription) {
          // Update subscription status to past_due
          await supabase
            .from('subscriptions')
            .update({
              status: 'past_due'
            })
            .eq('stripe_customer_id', invoice.customer as string)
        }
        break
      }
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}