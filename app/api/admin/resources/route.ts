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

export async function GET(request: NextRequest) {
  try {
    const supabase = getAdminClient()

    // Get all resources, ordered by published_date descending
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('published_date', { ascending: false })

    if (error) {
      console.error('Error fetching resources:', error)
      return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
    }

    return NextResponse.json({ success: true, resources: data })
  } catch (error) {
    console.error('Error in admin resources GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
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
    const { title, description, image_url, url, published_date, tags, is_published } = body

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 })
    }

    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from('resources')
      .insert({
        title,
        description,
        image_url,
        url,
        published_date: published_date || new Date().toISOString().split('T')[0],
        tags: tags || [],
        is_published: is_published !== undefined ? is_published : true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating resource:', error)
      return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
    }

    return NextResponse.json({ success: true, resource: data })
  } catch (error) {
    console.error('Error in admin resources POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
