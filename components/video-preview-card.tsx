"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VideoThumbnail } from "@/components/video-thumbnail"
import { VideoDuration } from "@/components/video-duration"
import { 
  PlayCircle, 
  Clock,
  Plus,
  ThumbsUp,
  ChevronDown,
  X
} from "lucide-react"

interface Video {
  id: string
  title: string
  duration: string
  thumbnail?: string
  thumbnail_url?: string
  instructor: string
  category: string
  videoUrl?: string
  video_url?: string
  description?: string
  free?: boolean
  tags?: string[]
}

interface VideoProgress {
  progress_percentage?: number
  completed?: boolean
  last_watched_at?: string
}

interface VideoPreviewCardProps {
  video: Video
  onVideoClick: (videoId: string) => void
  isSubscribed: boolean
  compact?: boolean
  progress?: VideoProgress
}

export function VideoPreviewCard({ video, onVideoClick, isSubscribed, compact = false, progress }: VideoPreviewCardProps) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(true)
      if (video.videoUrl && videoRef.current) {
        videoRef.current.currentTime = 10 // Start at 10 seconds
        setIsPlaying(true)
      }
    }, 500) // 500ms delay like Netflix
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsExpanded(false)
    setIsPlaying(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isSubscribed) {
      // Play full video
      router.push(`/watch?v=${video.id}&from=dashboard`)
    } else {
      // Play trailer with subscription CTA
      router.push(`/trailer?v=${video.id}&from=dashboard`)
    }
  }

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Add to watchlist functionality
    console.log('Add to watchlist:', video.id)
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Like functionality
    console.log('Like video:', video.id)
  }

  const handleMoreInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/preview?v=${video.id}&from=dashboard`)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 bg-background border border-border rounded-lg shadow-lg overflow-hidden hover:scale-[1.02] hover:-translate-y-1" style={{ padding: 0, margin: 0 }}>
      {/* Video Player/Thumbnail */}
      <div className="relative aspect-video bg-black overflow-hidden" style={{ margin: 0, padding: 0, display: 'block' }}>
          <VideoThumbnail
            videoUrl={video.videoUrl || video.video_url}
            fallbackImage={video.thumbnail_url || video.thumbnail}
            videoId={video.id}
            alt={video.title}
            className="w-full h-full object-cover block"
            timeOffset={video.id === 'puppy-basics' ? 40 : 3}
          />
          
          {/* Progress Bar */}
          {progress && progress.progress_percentage && progress.progress_percentage > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
              <div 
                className="h-full bg-queen-purple transition-all duration-300"
                style={{ width: `${Math.min(progress.progress_percentage, 100)}%` }}
              />
            </div>
          )}
          
          {/* Completion Badge */}
          {progress?.completed && (
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Action Buttons */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-white text-black hover:bg-white/90 font-semibold transform hover:scale-105 transition-transform duration-200 shadow-lg"
                onClick={handlePlayClick}
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                {progress?.progress_percentage && progress.progress_percentage > 5 ? 'Continue' : 'Watch Now'}
              </Button>
              
            </div>
          </div>
        </div>
        
        {/* Video Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-foreground mb-1">{video.title}</h3>
            </div>
            <VideoDuration
              videoUrl={video.videoUrl || video.video_url}
              fallbackDuration={video.duration}
              showIcon={true}
              className="text-xs text-muted-foreground"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="secondary" className="text-xs">{video.category}</Badge>
            {video.free && (
              <Badge className="text-xs bg-green-500 text-white">FREE</Badge>
            )}
            {video.tags && video.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs border-zinc-600 text-gray-400">
                {tag}
              </Badge>
            ))}
          </div>
          
          {video.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {video.description}
            </p>
          )}
        </div>
    </div>
  )
}