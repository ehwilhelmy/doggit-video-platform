"use client"

import { useState } from 'react'
import { PlayCircle } from 'lucide-react'

interface VimeoPlayerProps {
  videoId: string
  title?: string
  className?: string
  thumbnail?: string
}

export function VimeoPlayer({ 
  videoId, 
  title = "Video",
  className = "",
  thumbnail
}: VimeoPlayerProps) {
  const [showCustomThumbnail, setShowCustomThumbnail] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    setHasError(true)
    setShowCustomThumbnail(true) // Show custom thumbnail on error
  }

  const handleThumbnailClick = () => {
    setShowCustomThumbnail(false) // Hide custom thumbnail to reveal Vimeo player
  }

  return (
    <div 
      className={`relative w-full ${className}`}
      style={{ paddingTop: '56.25%' }} // 16:9 aspect ratio
    >
      {/* Always show custom thumbnail initially */}
      {showCustomThumbnail && thumbnail && (
        <div 
          className="absolute inset-0 bg-black flex items-center justify-center cursor-pointer z-10"
          style={{
            backgroundImage: `url(${thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          onClick={handleThumbnailClick}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 text-center text-white">
            <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-90 hover:opacity-100 transition-opacity" />
            <p className="text-lg font-semibold">{title}</p>
            {hasError && (
              <p className="text-sm text-gray-300 mt-2">
                Click to attempt video playback
              </p>
            )}
          </div>
        </div>
      )}

      <iframe
        src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        title={title}
        onError={handleError}
      />
    </div>
  )
}