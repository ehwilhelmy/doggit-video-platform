import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('User authentication error:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User authenticated:', user.id)

    // Get the user's subscription from the database - try without status filter first
    let { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, status')
      .eq('user_id', user.id)
      .single()

    console.log('Subscription query result:', { subscription, subError })

    // If no subscription found, try to find any subscription for this user
    if (subError && subError.code === 'PGRST116') {
      console.log('No subscription found, checking all subscriptions for user')
      const { data: allSubs, error: allSubsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
      
      console.log('All subscriptions for user:', { allSubs, allSubsError })
      
      if (!allSubs || allSubs.length === 0) {
        // Check if user has subscription status in their profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        console.log('User profile:', profile)
        
        // If user doesn't have a subscription record but should have one
        // (this handles legacy users who signed up before proper webhook setup)
        // Create a basic customer record in Stripe for them
        try {
          const customer = await stripe.customers.create({
            email: user.email!,
            name: profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : undefined,
            metadata: {
              supabase_user_id: user.id
            }
          })
          
          console.log('Created Stripe customer:', customer.id)
          
          // Create a basic subscription record (this will allow them to access the portal to subscribe)
          const { data: newSub, error: createSubError } = await supabase
            .from('subscriptions')
            .insert({
              user_id: user.id,
              stripe_customer_id: customer.id,
              status: 'incomplete'
            })
            .select('stripe_customer_id')
            .single()
          
          if (createSubError) {
            console.error('Error creating subscription record:', createSubError)
            return NextResponse.json({ 
              error: 'Unable to access subscription management. Please contact support.' 
            }, { status: 500 })
          }
          
          subscription = newSub
          
        } catch (stripeError) {
          console.error('Error creating Stripe customer:', stripeError)
          return NextResponse.json({ 
            error: 'Unable to access subscription management. Please contact support.' 
          }, { status: 500 })
        }
      } else {
        // Use the first subscription found
        subscription = allSubs[0]
      }
    }

    if (!subscription?.stripe_customer_id) {
      console.error('No stripe_customer_id found in subscription:', subscription)
      return NextResponse.json({ 
        error: 'Subscription found but no Stripe customer ID. Please contact support.' 
      }, { status: 404 })
    }

    console.log('Creating portal session for customer:', subscription.stripe_customer_id)

    // Create Stripe customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://training.doggit.app'}/dashboard`,
    })

    console.log('Portal session created successfully')

    return NextResponse.json({ 
      url: portalSession.url 
    })

  } catch (error) {
    console.error('Error creating customer portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create customer portal session. Please try again.' },
      { status: 500 }
    )
  }
}