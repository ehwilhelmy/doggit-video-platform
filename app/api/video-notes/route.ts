import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const videoId = searchParams.get('videoId')
  const userId = searchParams.get('userId')

  if (!videoId || !userId) {
    return NextResponse.json({ error: 'Video ID and User ID required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('video_notes')
      .select('notes')
      .eq('user_id', userId)
      .eq('video_id', videoId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching notes:', error)
      return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
    }

    return NextResponse.json({ notes: data?.notes || '' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { videoId, userId, notes } = body

    if (!videoId || !userId) {
      return NextResponse.json({ error: 'Video ID and User ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('video_notes')
      .upsert({
        user_id: userId,
        video_id: videoId,
        notes: notes || ''
      })
      .select()

    if (error) {
      console.error('Error saving notes:', error)
      return NextResponse.json({ error: 'Failed to save notes' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}