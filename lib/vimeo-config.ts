// Vimeo video configuration
export const vimeoVideos = {
  // Puppy Basics - Available on Vimeo
  'puppy-basics': {
    id: '1113072634',
    title: 'DOGG!T Puppy Basics',
    duration: 174, // 2:54 in seconds
    // Using static thumbnail since video is private
    thumbnail: `https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/images/1%20Puppy%20Basics.png?v=2`,
    // Alternative: Use Vimeo's i.vimeocdn.com if you know the video ID from their CDN
    // thumbnail: 'https://i.vimeocdn.com/video/[VIDEO_THUMBNAIL_ID]_640x360.jpg',
    description: 'Master foundation puppy training fundamentals with proven techniques rooted in dog psychology.',
    category: 'Puppy Training'
  },
  
  // Potty Training - Available on Vimeo
  'potty-training': {
    id: '1114967907',
    title: 'POTTY TRAINING',
    duration: 134, // 2:14 in seconds - update if different
    thumbnail: `https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/images/2%20Potty%20Training.png`,
    description: 'Essential techniques for successful house training and establishing good bathroom habits.',
    category: 'Training'
  },
  
  // Leash Training - Available on Vimeo
  'leash-training': {
    id: '1114969488',
    title: 'LEASH TRAINING',
    duration: 166, // 2:46 in seconds - update if different
    thumbnail: `https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/images/3%20Leash%20Training.png`,
    description: 'Learn effective leash training techniques for enjoyable walks.',
    category: 'Walking'
  }
  
  // Add more videos here as you upload them to Vimeo
  // Make sure to configure domain restrictions in Vimeo for training.doggit.app
}

export type VideoKey = keyof typeof vimeoVideos