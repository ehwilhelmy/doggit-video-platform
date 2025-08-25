import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = createClient()
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=callback_error`)
    }
    
    // Successful authentication - redirect to dashboard
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
  }
  
  // No code parameter - redirect to auth page
  return NextResponse.redirect(`${requestUrl.origin}/auth`)
}