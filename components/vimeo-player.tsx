"use client"

import { useEffect, useRef } from 'react'
import Script from 'next/script'

interface VimeoPlayerProps {
  videoId: string
  title?: string
  onReady?: () => void
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (seconds: number, duration: number) => void
  className?: string
}

export function VimeoPlayer({ 
  videoId, 
  title = "Video",
  onReady,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  className = ""
}: VimeoPlayerProps) {
  console.log('VimeoPlayer rendering with videoId:', videoId)
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    // Initialize Vimeo Player when script loads
    if (window.Vimeo && containerRef.current) {
      const iframe = containerRef.current.querySelector('iframe')
      if (iframe) {
        playerRef.current = new window.Vimeo.Player(iframe)
        
        // Set up event listeners
        if (onReady) playerRef.current.on('loaded', onReady)
        if (onPlay) playerRef.current.on('play', onPlay)
        if (onPause) playerRef.current.on('pause', onPause)
        if (onEnded) playerRef.current.on('ended', onEnded)
        
        if (onTimeUpdate) {
          playerRef.current.on('timeupdate', (data: any) => {
            onTimeUpdate(data.seconds, data.duration)
          })
        }
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.off('loaded')
        playerRef.current.off('play')
        playerRef.current.off('pause')
        playerRef.current.off('ended')
        playerRef.current.off('timeupdate')
      }
    }
  }, [videoId, onReady, onPlay, onPause, onEnded, onTimeUpdate])

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ paddingTop: '56.25%' }} // 16:9 aspect ratio
    >
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
      />
    </div>
  )
}

// Add window type declaration
declare global {
  interface Window {
    Vimeo: any
  }
}