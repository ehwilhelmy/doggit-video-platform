// Vimeo video configuration
export const vimeoVideos = {
  // Puppy Basics - Available on Vimeo
  'puppy-basics': {
    id: '1113072634',
    title: 'DOGG!T Puppy Basics',
    duration: 174, // 2:54 in seconds
    // Using static thumbnail since video is private
    thumbnail: `https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/images/1%20Puppy%20Basics.png`,
    // Alternative: Use Vimeo's i.vimeocdn.com if you know the video ID from their CDN
    // thumbnail: 'https://i.vimeocdn.com/video/[VIDEO_THUMBNAIL_ID]_640x360.jpg',
    description: 'Master foundation puppy training fundamentals with proven techniques rooted in dog psychology.',
    category: 'Puppy Training'
  }
  
  // Add more videos here as you upload them to Vimeo
  // Make sure to configure domain restrictions in Vimeo for training.doggit.app
}

export type VideoKey = keyof typeof vimeoVideos