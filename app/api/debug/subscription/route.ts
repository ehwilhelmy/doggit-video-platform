import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Debug endpoint to test subscription creation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, customerId, subscriptionId } = body
    
    console.log('🔍 Debug: Testing subscription creation')
    console.log('🔍 Debug: Input data:', { userId, customerId, subscriptionId })
    
    // Create Supabase client with service role key (same as webhook)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Test data
    const testSubscriptionData = {
      user_id: userId || 'test-user-123',
      stripe_subscription_id: subscriptionId || 'sub_test123',
      stripe_customer_id: customerId || 'cus_test123',
      stripe_price_id: 'price_test123',
      status: 'active',
      billing_interval: 'month',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancel_at_period_end: false,
      is_promotional: false
    }
    
    console.log('🔍 Debug: Attempting to insert:', testSubscriptionData)
    
    // Try to insert test subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(testSubscriptionData)
      .select()
    
    if (error) {
      console.error('🔍 Debug: Database error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
        data: testSubscriptionData
      }, { status: 400 })
    }
    
    console.log('🔍 Debug: Successfully created test subscription:', data)
    
    return NextResponse.json({
      success: true,
      message: 'Test subscription created successfully',
      data: data,
      input: testSubscriptionData
    })
    
  } catch (error) {
    console.error('🔍 Debug: Unexpected error:', error)
    console.error('🔍 Debug: Error message:', error.message)
    console.error('🔍 Debug: Error stack:', error.stack)
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    }, { status: 500 })
  }
}

// Test database connection
export async function GET() {
  try {
    // Create Supabase client with service role key (same as webhook)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Test basic database connection
    const { data: tables, error } = await supabase
      .from('subscriptions')
      .select('count')
      .limit(1)
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: error
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Connection test failed',
      details: error
    }, { status: 500 })
  }
}