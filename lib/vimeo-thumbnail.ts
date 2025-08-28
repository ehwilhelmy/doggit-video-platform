// Fetch Vimeo thumbnail dynamically
export async function getVimeoThumbnail(videoId: string): Promise<string | null> {
  try {
    // Use Vimeo's oEmbed API to get video metadata including thumbnail
    const response = await fetch(
      `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    
    if (!response.ok) {
      console.error('Failed to fetch Vimeo thumbnail:', response.status)
      return null
    }
    
    const data = await response.json()
    
    // Vimeo provides multiple thumbnail sizes
    // thumbnail_url: Default size (usually 295x166)
    // thumbnail_url_with_play_button: With play button overlay
    // We can modify the URL to get different sizes
    
    if (data.thumbnail_url) {
      // Replace size in URL to get larger thumbnail
      // Default format: https://i.vimeocdn.com/video/[ID]_295x166
      // We can change to: _640x360, _1280x720, etc.
      return data.thumbnail_url.replace('_295x166', '_640x360')
    }
    
    return null
  } catch (error) {
    console.error('Error fetching Vimeo thumbnail:', error)
    return null
  }
}

// Get Vimeo thumbnail with fallback
export async function getVimeoThumbnailWithFallback(
  videoId: string, 
  fallback: string
): Promise<string> {
  const vimeoThumbnail = await getVimeoThumbnail(videoId)
  return vimeoThumbnail || fallback
}