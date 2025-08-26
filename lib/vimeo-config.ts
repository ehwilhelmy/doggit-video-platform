// Vimeo video configuration
export const vimeoVideos = {
  // Puppy Basics series
  'puppy-basics': {
    id: '1113072634',
    title: 'DOGG!T Puppy Basics',
    duration: 174, // 2:54 in seconds
    thumbnail: 'https://i.vimeocdn.com/video/1113072634.jpg', // You'll need to get actual thumbnail URL
    description: 'Master foundation puppy training fundamentals with proven techniques rooted in dog psychology.',
    category: 'Puppy Training'
  },
  
  // Add more videos as you upload them to Vimeo
  'crate-training': {
    id: 'YOUR_VIDEO_ID', // Replace with actual Vimeo ID
    title: 'Crate Training',
    duration: 600, // 10 min
    thumbnail: '/images/crate-training-thumb.jpg',
    description: 'Learn how to make your puppy love their crate.',
    category: 'Puppy Training'
  },
  
  'leash-training': {
    id: 'YOUR_VIDEO_ID', // Replace with actual Vimeo ID
    title: 'Leash Training', 
    duration: 900, // 15 min
    thumbnail: '/images/leash-training-thumb.jpg',
    description: 'Teach your pup to walk nicely on a leash.',
    category: 'Puppy Training'
  }
}

export type VideoKey = keyof typeof vimeoVideos