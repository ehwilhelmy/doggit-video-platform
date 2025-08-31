import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const videoId = searchParams.get('id')
  
  if (!videoId) {
    return NextResponse.json({ error: 'Video ID required' }, { status: 400 })
  }
  
  try {
    // Use Vimeo's oEmbed API to get video information
    const response = await fetch(
      `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`,
      {
        headers: {
          'User-Agent': 'DOGGIT Training Platform'
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Vimeo')
    }
    
    const data = await response.json()
    
    // Convert duration from seconds to MM:SS or HH:MM:SS format
    const formatDuration = (seconds: number) => {
      if (!seconds || isNaN(seconds)) {
        return null
      }
      
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = Math.floor(seconds % 60)
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    }
    
    const formattedDuration = data.duration ? formatDuration(data.duration) : null
    
    return NextResponse.json({ 
      duration: data.duration || null,
      formattedDuration: formattedDuration,
      title: data.title,
      thumbnail: data.thumbnail_url
    })
  } catch (error) {
    console.error('Error fetching Vimeo info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video info' },
      { status: 500 }
    )
  }
}