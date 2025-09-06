#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

async function runSubscriptionScript() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Read and execute the SQL script
    const sqlScript = fs.readFileSync(path.join(__dirname, 'auto-assign-subscriptions.sql'), 'utf8')
    
    // Split the script into individual statements (simple split on semicolon)
    const statements = sqlScript
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`[${new Date().toISOString()}] Running auto-assign subscriptions script...`)

    for (const statement of statements) {
      if (statement.toLowerCase().includes('select')) {
        // For SELECT statements, use the query method
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement })
        if (error) {
          console.error('Error executing query:', error)
        } else {
          console.log('Query result:', data)
        }
      }
    }

    // Run the main subscription assignment logic
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        created_at,
        subscriptions!left (user_id)
      `)
      .is('subscriptions.user_id', null)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours

    if (error) {
      console.error('Error finding users without subscriptions:', error)
      return
    }

    if (data && data.length > 0) {
      console.log(`Found ${data.length} users without subscriptions`)

      // Create subscriptions for these users
      const subscriptionsToCreate = data.map(profile => ({
        user_id: profile.id,
        status: 'active'
      }))

      const { data: insertedSubs, error: insertError } = await supabase
        .from('subscriptions')
        .insert(subscriptionsToCreate)
        .select()

      if (insertError) {
        console.error('Error creating subscriptions:', insertError)
      } else {
        console.log(`Successfully created ${insertedSubs?.length || 0} subscriptions`)
      }
    } else {
      console.log('No users found without subscriptions')
    }

  } catch (error) {
    console.error('Script error:', error)
    process.exit(1)
  }
}

runSubscriptionScript()