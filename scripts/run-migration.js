// This script runs the video ratings migration in Supabase
// Run with: node scripts/run-migration.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('Running video ratings migration...')
  
  const migrationSQL = `
    -- Create video_ratings table
    CREATE TABLE IF NOT EXISTS public.video_ratings (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      video_id TEXT NOT NULL,
      video_title TEXT,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      feedback TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      
      -- Ensure one rating per user per video
      UNIQUE(user_id, video_id)
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_video_ratings_user_id ON public.video_ratings(user_id);
    CREATE INDEX IF NOT EXISTS idx_video_ratings_video_id ON public.video_ratings(video_id);
    CREATE INDEX IF NOT EXISTS idx_video_ratings_created_at ON public.video_ratings(created_at DESC);

    -- Enable Row Level Security
    ALTER TABLE public.video_ratings ENABLE ROW LEVEL SECURITY;

    -- Create policies
    -- Users can view all ratings (for aggregate stats)
    CREATE POLICY "Anyone can view ratings" ON public.video_ratings
      FOR SELECT USING (true);

    -- Users can create their own ratings
    CREATE POLICY "Users can create own ratings" ON public.video_ratings
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    -- Users can update their own ratings
    CREATE POLICY "Users can update own ratings" ON public.video_ratings
      FOR UPDATE USING (auth.uid() = user_id);

    -- Users can delete their own ratings
    CREATE POLICY "Users can delete own ratings" ON public.video_ratings
      FOR DELETE USING (auth.uid() = user_id);
  `

  try {
    // Note: Direct SQL execution requires using the Supabase Dashboard SQL Editor
    // or the Supabase CLI. This is a placeholder to show the migration.
    console.log('Migration SQL prepared. Please run this in your Supabase Dashboard:')
    console.log('\n' + migrationSQL)
    console.log('\nAlso create the function for rating stats:')
    console.log(`
CREATE OR REPLACE FUNCTION get_video_rating_stats(p_video_id TEXT)
RETURNS TABLE (
  average_rating NUMERIC,
  total_ratings INTEGER,
  rating_distribution JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(rating)::numeric, 1) as average_rating,
    COUNT(*)::integer as total_ratings,
    jsonb_build_object(
      '5', COUNT(*) FILTER (WHERE rating = 5),
      '4', COUNT(*) FILTER (WHERE rating = 4),
      '3', COUNT(*) FILTER (WHERE rating = 3),
      '2', COUNT(*) FILTER (WHERE rating = 2),
      '1', COUNT(*) FILTER (WHERE rating = 1)
    ) as rating_distribution
  FROM public.video_ratings
  WHERE video_id = p_video_id;
END;
$$ LANGUAGE plpgsql;
    `)
    
  } catch (error) {
    console.error('Error preparing migration:', error)
  }
}

runMigration()