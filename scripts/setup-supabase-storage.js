// Setup Supabase Storage for Videos
// Run this script to create a storage bucket and get video URLs

import { createClient } from '@supabase/supabase-js'

// You'll need to add these to your .env.local file:
// NEXT_PUBLIC_SUPABASE_URL=your-project-url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Add to .env.local:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-project-url')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupStorage() {
  try {
    // 1. Create a public bucket for videos
    const { data: bucket, error: bucketError } = await supabase
      .storage
      .createBucket('videos', {
        public: true,
        fileSizeLimit: 500000000, // 500MB max file size
      })

    if (bucketError && !bucketError.message.includes('already exists')) {
      throw bucketError
    }

    console.log('✅ Storage bucket ready: videos')

    // 2. Example: Upload a video (you'd do this in your admin panel)
    // const { data, error } = await supabase.storage
    //   .from('videos')
    //   .upload('puppy-basics.mp4', videoFile, {
    //     contentType: 'video/mp4',
    //     cacheControl: '3600',
    //   })

    // 3. Get public URL for a video
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl('puppy-basics.mp4')

    console.log('\n📹 Video URL format:')
    console.log(`${supabaseUrl}/storage/v1/object/public/videos/your-video.mp4`)
    
    console.log('\n✨ Next steps:')
    console.log('1. Upload your videos to Supabase Storage dashboard')
    console.log('2. Update video URLs in your code to use Supabase URLs')
    console.log('3. Videos will stream directly with no CORS issues!')

  } catch (error) {
    console.error('Error setting up storage:', error)
  }
}

setupStorage()