import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const videoId = searchParams.get('id')
  
  if (!videoId) {
    return NextResponse.json({ error: 'Video ID required' }, { status: 400 })
  }
  
  try {
    // Use Vimeo's oEmbed API to get the current thumbnail
    const response = await fetch(
      `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`,
      {
        headers: {
          'User-Agent': 'DOGGIT Training Platform'
        },
        next: { revalidate: 60 } // Cache for 1 minute to get fresh thumbnails
      }
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Vimeo')
    }
    
    const data = await response.json()
    
    // Get the highest quality thumbnail available
    let thumbnailUrl = data.thumbnail_url
    if (thumbnailUrl) {
      // Replace with larger size
      thumbnailUrl = thumbnailUrl
        .replace('_295x166', '_640x360')
        .replace('_200x150', '_640x360')
        .replace('_100x75', '_640x360')
    }
    
    return NextResponse.json({ 
      thumbnail: thumbnailUrl,
      title: data.title,
      author: data.author_name
    })
  } catch (error) {
    console.error('Error fetching Vimeo thumbnail:', error)
    return NextResponse.json(
      { error: 'Failed to fetch thumbnail' },
      { status: 500 }
    )
  }
}