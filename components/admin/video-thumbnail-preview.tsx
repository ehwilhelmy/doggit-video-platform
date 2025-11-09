"use client"

import { useState, useEffect } from 'react'
import { getCachedVimeoThumbnail } from '@/utils/vimeo-thumbnail'
import { FileVideo } from 'lucide-react'

interface VideoThumbnailPreviewProps {
  thumbnailUrl?: string
  vimeoId?: string
  title: string
  className?: string
}

export function VideoThumbnailPreview({
  thumbnailUrl,
  vimeoId,
  title,
  className = "w-24 h-16 object-cover rounded"
}: VideoThumbnailPreviewProps) {
  const [thumbnail, setThumbnail] = useState<string>(thumbnailUrl || '')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchThumbnail = async () => {
      // If we have a custom thumbnail, use it
      if (thumbnailUrl) {
        setThumbnail(thumbnailUrl)
        return
      }

      // If we have a Vimeo ID, fetch from Vimeo
      if (vimeoId) {
        setIsLoading(true)
        const vimeoThumb = await getCachedVimeoThumbnail(vimeoId)
        if (vimeoThumb) {
          setThumbnail(vimeoThumb)
        }
        setIsLoading(false)
      }
    }

    fetchThumbnail()
  }, [thumbnailUrl, vimeoId])

  if (isLoading) {
    return (
      <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!thumbnail) {
    return (
      <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
        <FileVideo className="h-8 w-8 text-gray-400" />
      </div>
    )
  }

  return (
    <img
      src={thumbnail}
      alt={title}
      className={className}
    />
  )
}
