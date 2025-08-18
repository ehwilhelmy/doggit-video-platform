import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin
  
  // For demo purposes, just redirect to dashboard
  // In production, this would handle OAuth callbacks
  return NextResponse.redirect(`${origin}/dashboard`)
}