import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for admin operations
function getAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

async function verifyAdmin(token: string) {
  const supabase = getAdminClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return { isAdmin: false, user: null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return { isAdmin: profile?.role === 'admin', user }
}

// PUT - Update video
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { isAdmin } = await verifyAdmin(token)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      instructor,
      category,
      level,
      vimeo_id,
      thumbnail_url,
      duration,
      is_featured
    } = body

    if (!title) {
      return NextResponse.json({ error: 'Missing required field: title' }, { status: 400 })
    }

    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from('videos')
      .update({
        title,
        description: description || '',
        instructor: instructor || 'DOGGIT Trainer',
        category: category || 'General',
        level: level || 'Beginner',
        vimeo_id,
        thumbnail_url: thumbnail_url || '',
        duration: duration || '0:00',
        is_featured: is_featured || false
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating video:', error)
      return NextResponse.json({ error: 'Failed to update video' }, { status: 500 })
    }

    return NextResponse.json({ success: true, video: data })

  } catch (error) {
    console.error('Error in update video API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
