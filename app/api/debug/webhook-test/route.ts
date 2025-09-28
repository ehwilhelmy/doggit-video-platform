import { NextRequest, NextResponse } from 'next/server'

// Simulate a Stripe webhook payload for testing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body
    
    if (!userId) {
      return NextResponse.json({
        error: 'userId is required'
      }, { status: 400 })
    }
    
    // Simulate a checkout.session.completed webhook payload
    const mockWebhookPayload = {
      id: 'evt_test_webhook',
      object: 'event',
      api_version: '2025-07-30.basil',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: 'cs_test_' + Math.random().toString(36).substr(2, 9),
          object: 'checkout.session',
          mode: 'subscription',
          status: 'complete',
          client_reference_id: userId,
          metadata: {
            supabase_user_id: userId,
            schedule_type: 'promotional',
            first_price: 'price_test_1dollar',
            recurring_price: 'price_test_10dollar'
          },
          subscription: 'sub_test_' + Math.random().toString(36).substr(2, 9),
          customer: 'cus_test_' + Math.random().toString(36).substr(2, 9),
          customer_details: {
            email: 'test@example.com'
          }
        }
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: 'req_test',
        idempotency_key: null
      },
      type: 'checkout.session.completed'
    }
    
    console.log('🧪 Simulating webhook call with payload:', JSON.stringify(mockWebhookPayload, null, 2))
    
    // Call our actual webhook endpoint
    const webhookResponse = await fetch(`${request.url.replace('/api/debug/webhook-test', '/api/stripe/webhook')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Skip signature verification for testing
        'x-test-webhook': 'true'
      },
      body: JSON.stringify(mockWebhookPayload)
    })
    
    const webhookResult = await webhookResponse.text()
    
    return NextResponse.json({
      success: true,
      message: 'Webhook simulation completed',
      mockPayload: mockWebhookPayload,
      webhookResponse: {
        status: webhookResponse.status,
        body: webhookResult
      }
    })
    
  } catch (error) {
    console.error('🧪 Webhook simulation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Webhook simulation failed',
      details: error.message
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Webhook test simulator - POST with userId to simulate a successful payment',
    usage: 'POST { "userId": "your-user-id-here" }'
  })
}