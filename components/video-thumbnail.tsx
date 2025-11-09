"use client"

import { useState, useEffect } from 'react'
import { extractVideoThumbnail, getCachedThumbnail, cacheThumbnail } from '@/utils/video-thumbnail'

interface VideoThumbnailProps {
  videoUrl?: string
  fallbackImage: string
  videoId: string
  alt: string
  className?: string
  timeOffset?: number
}

export function VideoThumbnail({ 
  videoUrl, 
  fallbackImage, 
  videoId, 
  alt, 
  className = "",
  timeOffset = 5 
}: VideoThumbnailProps) {
  const [thumbnailSrc, setThumbnailSrc] = useState(fallbackImage)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // For puppy-basics, always use the fallback image (our custom thumbnail)
    if (videoId === 'puppy-basics') {
      setThumbnailSrc(fallbackImage)
      // Clear any cached thumbnails for puppy-basics to force new image
      localStorage.removeItem(`thumbnail-${videoId}-${timeOffset}`)
      return
    }

    // For Vimeo videos or when no video URL, always use fallback image
    if (!videoUrl || videoUrl.includes('vimeo.com')) {
      setThumbnailSrc(fallbackImage)
      return
    }

    // Check if we have a cached thumbnail
    const cached = getCachedThumbnail(videoId, timeOffset)
    if (cached) {
      setThumbnailSrc(cached)
      return
    }

    // Extract thumbnail from video
    setIsLoading(true)
    extractVideoThumbnail(videoUrl, timeOffset)
      .then((thumbnail) => {
        setThumbnailSrc(thumbnail)
        cacheThumbnail(videoId, timeOffset, thumbnail)
      })
      .catch((error) => {
        console.warn('Failed to extract video thumbnail:', error)
        // Keep using fallback image
        setThumbnailSrc(fallbackImage)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [videoUrl, videoId, timeOffset, fallbackImage])

  return (
    <div className="relative w-full h-full" style={{ margin: 0, padding: 0, display: 'block', lineHeight: 0 }}>
      {thumbnailSrc ? (
        <img
          src={thumbnailSrc}
          alt={alt}
          className={`${className} block`}
          style={{ margin: 0, padding: 0, display: 'block', verticalAlign: 'top' }}
        />
      ) : (
        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}