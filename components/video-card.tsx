"use client"

import { Video } from "@/types/video"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Lock, Radio } from "lucide-react"
import { useState } from "react"

interface VideoCardProps {
  video: Video
  isSubscribed: boolean
  onPlay: (video: Video) => void
}

export function VideoCard({ video, isSubscribed, onPlay }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const canPlay = !video.isPremium || isSubscribed

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg p-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => canPlay && onPlay(video)}
    >
      <div className="relative aspect-video bg-muted">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover"
        />
        
        {video.isLivestream && (
          <Badge className="absolute left-2 top-2 bg-red-600 text-white">
            <Radio className="mr-1 h-3 w-3" />
            LIVE
          </Badge>
        )}
        
        {video.isPremium && !isSubscribed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Lock className="h-12 w-12 text-white" />
          </div>
        )}
        
        {isHovered && canPlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Play className="h-16 w-16 text-white" />
          </div>
        )}
        
        {!video.isLivestream && (
          <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
            {formatDuration(video.duration)}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="line-clamp-2 font-semibold text-sm md:text-base">{video.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground md:text-sm">
          {video.description}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {video.category}
          </Badge>
          {video.isPremium && (
            <Badge className="">
              Premium
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}