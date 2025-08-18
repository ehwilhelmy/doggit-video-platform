"use client"

import { useEffect, useRef, useState } from "react"
import { Video } from "@/types/video"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, Pause, Volume2, VolumeX, Maximize, X } from "lucide-react"

interface VideoPlayerProps {
  video: Video | null
  isPreview?: boolean
  isSubscribed: boolean
  onClose?: () => void
  onSubscribe?: () => void
}

export function VideoPlayer({ video, isPreview = false, isSubscribed, onClose, onSubscribe }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [previewEnded, setPreviewEnded] = useState(false)

  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.src = isPreview && video.previewUrl ? video.previewUrl : video.videoUrl
      setIsPlaying(true)
      videoRef.current.play()
    }
  }, [video, isPreview])

  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3000)
    return () => clearTimeout(timer)
  }, [showControls])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
      
      if (isPreview && videoRef.current.currentTime >= 30) {
        videoRef.current.pause()
        setPreviewEnded(true)
      }
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  if (!video) return null

  if (video.isLivestream) {
    return (
      <Dialog open={!!video} onOpenChange={() => onClose?.()}>
        <DialogContent className="max-w-5xl p-0">
          <DialogHeader className="p-4">
            <DialogTitle>{video.title}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-black">
            <iframe
              src={video.livestreamUrl}
              className="h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={!!video} onOpenChange={() => onClose?.()}>
      <DialogContent className="max-w-5xl p-0">
        <div 
          className="relative aspect-video bg-black"
          onMouseMove={() => setShowControls(true)}
        >
          <video
            ref={videoRef}
            className="h-full w-full"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setPreviewEnded(true)}
          />
          
          {previewEnded && isPreview && !isSubscribed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-8 text-center">
              <h3 className="mb-4 text-2xl font-bold text-white">Preview Ended</h3>
              <p className="mb-6 text-white/80">Subscribe to watch the full video and access all premium content</p>
              <Button 
                size="lg" 
                onClick={onSubscribe}
                className=""
              >
                Subscribe Now
              </Button>
            </div>
          )}
          
          {showControls && !previewEnded && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="mb-2 h-1 bg-white/30">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause /> : <Play />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX /> : <Volume2 />}
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-white hover:bg-white/20"
                  >
                    <X />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}