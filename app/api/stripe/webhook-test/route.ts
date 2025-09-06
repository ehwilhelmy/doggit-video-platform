import { NextRequest, NextResponse } from 'next/server'

// Simple test endpoint to verify webhook connectivity
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headers = Object.fromEntries(request.headers.entries())
    
    console.log('🧪 Webhook Test Received:', new Date().toISOString())
    console.log('🧪 Headers:', JSON.stringify(headers, null, 2))
    console.log('🧪 Body length:', body.length)
    console.log('🧪 Stripe-Signature present:', !!headers['stripe-signature'])
    
    return NextResponse.json({ 
      success: true,
      message: 'Webhook test endpoint working',
      timestamp: new Date().toISOString(),
      hasStripeSignature: !!headers['stripe-signature'],
      bodyLength: body.length
    })
  } catch (error) {
    console.error('🧪 Webhook test error:', error)
    return NextResponse.json(
      { error: 'Webhook test failed', details: error },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Webhook test endpoint is running',
    timestamp: new Date().toISOString()
  })
}