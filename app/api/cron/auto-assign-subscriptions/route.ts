import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    console.log(`[${new Date().toISOString()}] Running auto-assign subscriptions cron...`)

    const supabase = await createClient()

    // Find users with profiles but no subscriptions (last 24 hours)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        created_at
      `)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    if (!profiles || profiles.length === 0) {
      console.log('No recent profiles found')
      return NextResponse.json({ message: 'No recent profiles found', created: 0 })
    }

    // Check which ones don't have subscriptions
    const { data: existingSubs } = await supabase
      .from('subscriptions')
      .select('user_id')
      .in('user_id', profiles.map(p => p.id))

    const existingUserIds = new Set(existingSubs?.map(s => s.user_id) || [])
    const usersWithoutSubs = profiles.filter(p => !existingUserIds.has(p.id))

    if (usersWithoutSubs.length === 0) {
      console.log('All recent users already have subscriptions')
      return NextResponse.json({ message: 'All users have subscriptions', created: 0 })
    }

    // Create subscriptions for users without them
    const subscriptionsToCreate = usersWithoutSubs.map(profile => ({
      user_id: profile.id,
      status: 'active' as const
    }))

    const { data: createdSubs, error: insertError } = await supabase
      .from('subscriptions')
      .insert(subscriptionsToCreate)
      .select()

    if (insertError) {
      console.error('Error creating subscriptions:', insertError)
      return NextResponse.json({ error: 'Failed to create subscriptions' }, { status: 500 })
    }

    console.log(`Successfully created ${createdSubs?.length || 0} subscriptions`)

    return NextResponse.json({ 
      message: 'Auto-assign completed successfully',
      created: createdSubs?.length || 0
    })

  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}