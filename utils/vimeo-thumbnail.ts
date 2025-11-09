// Utility to get Vimeo thumbnail URL from video ID

export async function getVimeoThumbnail(vimeoId: string): Promise<string> {
  try {
    const response = await fetch(
      `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Vimeo thumbnail')
    }

    const data = await response.json()
    return data.thumbnail_url || ''
  } catch (error) {
    console.error('Error fetching Vimeo thumbnail:', error)
    return ''
  }
}

// Get cached Vimeo thumbnail or fetch new one
export async function getCachedVimeoThumbnail(vimeoId: string): Promise<string> {
  const cacheKey = `vimeo-thumbnail-${vimeoId}`

  // Check localStorage cache
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    return cached
  }

  // Fetch and cache
  const thumbnail = await getVimeoThumbnail(vimeoId)
  if (thumbnail) {
    localStorage.setItem(cacheKey, thumbnail)
  }

  return thumbnail
}
