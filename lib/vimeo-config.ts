// Vimeo video configuration
export const vimeoVideos = {
  // Puppy Basics - Available on Vimeo
  'puppy-basics': {
    id: '1113072634',
    title: 'DOGG!T Puppy Basics',
    duration: 174, // 2:54 in seconds
    thumbnail: 'https://i.vimeocdn.com/video/1113072634_295x166.webp',
    description: 'Master foundation puppy training fundamentals with proven techniques rooted in dog psychology.',
    category: 'Puppy Training'
  }
  
  // Add more videos here as you upload them to Vimeo
  // Make sure to configure domain restrictions in Vimeo for training.doggit.app
}

export type VideoKey = keyof typeof vimeoVideos