import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    console.log('URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Service key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    console.log('URL value:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      })
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    // Try a simple query
    const { data, error, count } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({
        success: false,
        error: 'Query failed',
        details: error,
        message: error.message,
        hint: error.hint,
        code: error.code
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      subscriptionCount: count || 0
    })
    
  } catch (error: any) {
    console.error('Connection error:', error)
    return NextResponse.json({
      success: false,
      error: 'Connection failed',
      message: error?.message || 'Unknown error',
      stack: error?.stack
    })
  }
}