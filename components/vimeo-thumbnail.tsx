"use client"

import { useState, useEffect } from 'react'
import { getVimeoThumbnail } from '@/lib/vimeo-thumbnail'

interface VimeoThumbnailProps {
  videoId: string
  fallbackImage?: string
  alt: string
  className?: string
}

export function VimeoThumbnail({ 
  videoId, 
  fallbackImage = '/placeholder.jpg',
  alt,
  className = ""
}: VimeoThumbnailProps) {
  const [thumbnailSrc, setThumbnailSrc] = useState(fallbackImage)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch Vimeo thumbnail
    const fetchThumbnail = async () => {
      setIsLoading(true)
      try {
        const thumbnail = await getVimeoThumbnail(videoId)
        if (thumbnail) {
          setThumbnailSrc(thumbnail)
        }
      } catch (error) {
        console.error('Failed to load Vimeo thumbnail:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchThumbnail()
  }, [videoId])

  return (
    <div className="relative w-full h-full">
      <img
        src={thumbnailSrc}
        alt={alt}
        className={className}
        style={{ display: 'block' }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}