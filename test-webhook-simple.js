// Simple test to verify the webhook endpoint is reachable
// You can test this by doing: curl -X POST https://training.doggit.app/api/stripe/webhook

export async function POST(request) {
  console.log('🧪 SIMPLE WEBHOOK TEST - Received request')
  console.log('🧪 Headers:', Object.fromEntries(request.headers.entries()))
  console.log('🧪 Time:', new Date().toISOString())
  
  try {
    const body = await request.text()
    console.log('🧪 Body length:', body.length)
    
    return new Response('Webhook test successful', { status: 200 })
  } catch (error) {
    console.error('🧪 Test error:', error)
    return new Response('Webhook test failed', { status: 500 })
  }
}