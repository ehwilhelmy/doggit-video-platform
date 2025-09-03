"use client"

export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { VideoThumbnail } from "@/components/video-thumbnail"
import { VimeoPlayer } from "@/components/vimeo-player"
import { ShareModal } from "@/components/share-modal"
import { vimeoVideos } from "@/lib/vimeo-config"
import { useAuth } from "@/contexts/auth-context"
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
  ChevronLeft,
  User,
  Clock,
  PlayCircle
} from "lucide-react"

const videosData = {
  "puppy-basics": {
    id: "puppy-basics",
    title: "PUPPY BASICS",
    description: "Master foundation puppy training fundamentals with proven techniques rooted in dog psychology.",
    thumbnail: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&h=1080&fit=crop",
    duration: "2:54",
    instructor: "Jayme Nolan",
    instructorBio: "Degree in Animal Behavior with 15+ years running her own training and boarding business. Breeder of Merit of Vizslas, she fosters dogs, and competes in performance sports.",
    videoUrl: "https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/videos/1%20Puppy%20Basics%20(version%203%20-%20Brian%20VO)-compressed.mp4",
    free: true,
    chapters: [
      { title: "Meet Your Instructor: Jayme Nolan", time: "0:00", duration: "2 min" },
      { title: "Understanding Puppy Development", time: "2:15", duration: "4 min" },
      { title: "Basic Commands: Sit & Stay", time: "6:30", duration: "3 min" },
      { title: "House Training Fundamentals", time: "9:45", duration: "3 min" },
      { title: "Socialization Basics", time: "12:30", duration: "2 min" }
    ]
  },
  "potty-training": {
    title: "POTTY TRAINING",
    description: "Essential techniques for successful house training and establishing good bathroom habits.",
    thumbnail: "https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/images/2%20Potty%20Training.png",
    duration: "2:14",
    instructor: "Jayme Nolan",
    instructorBio: "Degree in Animal Behavior with 15+ years running her own training and boarding business. Breeder of Merit of Vizslas, she fosters dogs, and competes in performance sports.",
    videoUrl: "/videos/crate-training.mp4",
    chapters: [
      { title: "Meet Your Instructor: Jayme Nolan", time: "0:00", duration: "2 min" },
      { title: "Understanding Crate Psychology", time: "2:30", duration: "4 min" },
      { title: "Creating Positive Associations", time: "6:45", duration: "5 min" },
      { title: "Gradual Crate Introduction", time: "11:30", duration: "4 min" },
      { title: "Troubleshooting Common Issues", time: "15:45", duration: "3 min" }
    ]
  },
  "leash-training": {
    title: "LEASH TRAINING",
    description: "Learn effective leash training techniques for enjoyable walks.",
    thumbnail: "https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/images/3%20Leash%20Training.png",
    duration: "2:46",
    instructor: "Jayme Nolan",
    instructorBio: "Degree in Animal Behavior with 15+ years running her own training and boarding business. Breeder of Merit of Vizslas, she fosters dogs, and competes in performance sports.",
    videoUrl: "/videos/leash-training.mp4",
    chapters: [
      { title: "Meet Your Instructor: Jayme Nolan", time: "0:00", duration: "2 min" },
      { title: "Understanding Pulling Behavior", time: "2:15", duration: "3 min" },
      { title: "Proper Equipment Setup", time: "5:30", duration: "3 min" },
      { title: "Training Techniques", time: "8:45", duration: "4 min" },
      { title: "Real-World Practice", time: "12:30", duration: "3 min" }
    ]
  }
}

const allVideos = [
  { id: "puppy-basics", ...videosData["puppy-basics"] },
  { id: "advanced-obedience", ...videosData["advanced-obedience"] },
  { id: "leash-training", ...videosData["leash-training"] }
]

function WatchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const videoId = searchParams.get("v") || "puppy-basics"
  const from = searchParams.get("from") || "welcome"
  
  const video = videosData[videoId as keyof typeof videosData] || videosData["puppy-basics"]
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(174) // Fallback to 2:54 (174 seconds)
  const [volume, setVolume] = useState(1)
  const [activeTab, setActiveTab] = useState<'lessons' | 'notes'>('lessons')
  const [showShareModal, setShowShareModal] = useState(false)
  const [notes, setNotes] = useState('')
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { user } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  const handleBack = () => {
    router.push("/dashboard")
  }

  // Load notes when component mounts
  useEffect(() => {
    if (user && videoId) {
      const storageKey = `notes-${videoId}-${user.id}`
      
      // First try localStorage (immediate)
      const storedNotes = localStorage.getItem(storageKey)
      if (storedNotes) {
        setNotes(storedNotes)
      }
      
      // Also try API (async)
      fetch(`/api/video-notes?videoId=${videoId}&userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.notes && data.notes !== storedNotes) {
            // API has different notes, use those and update localStorage
            setNotes(data.notes)
            localStorage.setItem(storageKey, data.notes)
          }
        })
        .catch(err => {
          // Silently fail - localStorage fallback is already loaded
        })
    }
  }, [user, videoId])

  // Auto-save notes with debouncing
  const saveNotes = useCallback(async (notesToSave: string) => {
    if (!user) return
    
    setIsSavingNotes(true)
    const storageKey = `notes-${videoId}-${user.id}`
    
    try {
      // Always save to localStorage as backup
      localStorage.setItem(storageKey, notesToSave)
      
      // Try to save to database
      const response = await fetch('/api/video-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          userId: user.id,
          notes: notesToSave
        })
      })
      
      if (response.ok) {
        setLastSaved(new Date())
      } else {
        // API failed but localStorage succeeded
        setLastSaved(new Date())
      }
    } catch (error) {
      // Still saved to localStorage, so show success
      setLastSaved(new Date())
    } finally {
      setIsSavingNotes(false)
    }
  }, [user, videoId])

  // Debounced save function
  const debouncedSave = useCallback((notesToSave: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      // Save even if empty to clear notes
      saveNotes(notesToSave)
    }, 1000) // Save 1 second after user stops typing
  }, [saveNotes])

  // Handle notes change with auto-save
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    debouncedSave(newNotes)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * duration
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleFullscreen = () => {
    if (!videoRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoRef.current.requestFullscreen()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    setShowControls(true)
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  const jumpToChapter = (time: string) => {
    if (!videoRef.current) return
    const [minutes, seconds] = time.split(':').map(Number)
    const totalSeconds = minutes * 60 + seconds
    videoRef.current.currentTime = totalSeconds
    setCurrentTime(totalSeconds)
  }

  // Set up video event listeners
  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    const handlePlay = () => {
      setIsPlaying(true)
      // Fallback: set duration when video starts playing if not already set
      if (duration === 0 && videoEl.duration) {
        setDuration(videoEl.duration)
      }
    }
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => {
      setCurrentTime(videoEl.currentTime)
      // Fallback: set duration during playback if not set
      if (duration === 0 && videoEl.duration) {
        setDuration(videoEl.duration)
      }
    }
    const handleLoadedMetadata = () => {
      setDuration(videoEl.duration)
    }
    const handleVolumeChange = () => {
      setVolume(videoEl.volume)
      setIsMuted(videoEl.muted)
    }

    videoEl.addEventListener('play', handlePlay)
    videoEl.addEventListener('pause', handlePause)
    videoEl.addEventListener('timeupdate', handleTimeUpdate)
    videoEl.addEventListener('loadedmetadata', handleLoadedMetadata)
    videoEl.addEventListener('volumechange', handleVolumeChange)

    return () => {
      videoEl.removeEventListener('play', handlePlay)
      videoEl.removeEventListener('pause', handlePause)
      videoEl.removeEventListener('timeupdate', handleTimeUpdate)
      videoEl.removeEventListener('loadedmetadata', handleLoadedMetadata)
      videoEl.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 lg:p-6 bg-black/90 backdrop-blur-sm relative z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <Logo size="sm" variant="white" />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10"
            onClick={() => setShowShareModal(true)}
          >
            Share
          </Button>
        </div>
      </header>

      {/* Main Container with max-width */}
      <div className="max-w-[1440px] mx-auto h-[calc(100vh-80px)]">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Main Video Area */}
          <div className="flex-1 bg-black flex flex-col">
            {/* Video Container with constrained dimensions */}
            <div className="relative w-full max-h-[50vh] lg:max-h-[70vh] bg-black" style={{ aspectRatio: '16/9' }}>
            
            {/* Video Player */}
            <div 
              className="relative w-full h-full bg-black overflow-hidden"
              onMouseMove={resetControlsTimeout}
            >
              {/* Use Vimeo player if video exists in vimeoVideos config, fallback to video element for others */}
              {vimeoVideos[videoId as keyof typeof vimeoVideos] ? (
                <VimeoPlayer
                  videoId={vimeoVideos[videoId as keyof typeof vimeoVideos].id}
                  title={video.title}
                  className="w-full h-full"
                />
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  src={video.videoUrl}
                  playsInline
                  poster={video.thumbnail}
                  crossOrigin="anonymous"
                  preload="metadata"
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      setDuration(videoRef.current.duration)
                      }
                  }}
                  onCanPlayThrough={() => {
                    if (videoRef.current && duration === 0) {
                      setDuration(videoRef.current.duration)
                    }
                  }}
                  onDurationChange={() => {
                    if (videoRef.current) {
                      setDuration(videoRef.current.duration)
                    }
                  }}
                  onError={(e) => {
                    console.error("Video error:", e)
                    console.error("Video src:", video.videoUrl)
                  }}
                />
              )}

              {/* Video Thumbnail Overlay (only show before first play and only for non-Vimeo videos) */}
              {!isPlaying && currentTime === 0 && !vimeoVideos[videoId as keyof typeof vimeoVideos] && (
                <div className="absolute inset-0 z-10">
                  <VideoThumbnail
                    videoUrl={video.videoUrl}
                    fallbackImage={video.thumbnail}
                    videoId={videoId}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    timeOffset={40}
                  />
                </div>
              )}

              {/* Center Play Button (only for non-Vimeo videos) */}
              {!isPlaying && !vimeoVideos[videoId as keyof typeof vimeoVideos] && (
                <div className="absolute inset-0 flex items-center justify-center z-40">
                  <button
                    onClick={togglePlay}
                    className="bg-white/20 backdrop-blur-sm rounded-full p-8 hover:bg-white/30 transition-colors"
                  >
                    <Play className="h-16 w-16 text-white" />
                  </button>
                </div>
              )}

              {/* Video Controls Overlay (only for non-Vimeo videos) */}
              {!vimeoVideos[videoId as keyof typeof vimeoVideos] && (
                <div 
                  className="absolute inset-0 z-30"
                  onMouseMove={resetControlsTimeout}
                  onClick={togglePlay}
                />
              )}

              {/* Bottom Controls (only for non-Vimeo videos) */}
              {!vimeoVideos[videoId as keyof typeof vimeoVideos] && (
                <div className={`absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <div className="px-6 pb-4">
                  <div 
                    ref={progressBarRef}
                    className="relative h-2 bg-white/30 rounded-full cursor-pointer group mb-4 hover:h-3 transition-all"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="absolute h-full bg-jade-purple rounded-full transition-all"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                    {/* Progress indicator dot */}
                    <div 
                      className="absolute top-1/2 w-4 h-4 bg-jade-purple rounded-full transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border-2 border-white"
                      style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePlay()
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6 text-white" />
                        ) : (
                          <Play className="h-6 w-6 text-white" />
                        )}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMute()
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="h-5 w-5 text-white" />
                        ) : (
                          <Volume2 className="h-5 w-5 text-white" />
                        )}
                      </button>
                      
                      <div className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFullscreen()
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <Maximize className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>

          {/* Video Info Section */}
          <div className="flex-1 p-4 lg:p-6 bg-black overflow-y-auto">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 lg:mb-3">{video.title}</h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-300 mb-3 lg:mb-4 leading-relaxed">{video.description}</p>
            
            <div className="flex items-center gap-6 text-gray-300 text-sm lg:text-base">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="font-medium">{video.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="font-medium">{video.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-96 bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col max-h-[50vh] lg:max-h-none">
          {/* Instructor Info */}
          <div className="p-4 lg:p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
              <img
                src="/Jayme-Nolan.JPG"
                alt={video.instructor}
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-white text-base lg:text-lg">{video.instructor}</h3>
                <p className="text-xs lg:text-sm text-gray-400">Dog Training Expert</p>
              </div>
            </div>
            <p className="text-xs lg:text-sm text-gray-300 leading-relaxed">{video.instructorBio}</p>
          </div>

          {/* Notes Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium">My Notes</h4>
                <div className="text-xs text-gray-400">
                  {isSavingNotes ? (
                    <span className="text-queen-purple flex items-center gap-1">
                      <div className="w-2 h-2 bg-queen-purple rounded-full animate-pulse"></div>
                      Saving...
                    </span>
                  ) : lastSaved ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  ) : notes.trim() ? (
                    <span className="text-yellow-400">Changes not saved</span>
                  ) : null}
                </div>
              </div>
              <textarea
                placeholder="Take notes while you watch... (auto-saves as you type)"
                value={notes}
                onChange={handleNotesChange}
                className="w-full h-64 lg:h-96 bg-zinc-800 border border-zinc-700 rounded-lg p-3 lg:p-4 text-sm lg:text-base text-white placeholder-gray-400 resize-none focus:outline-none focus:border-queen-purple"
              />
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Share Modal */}
      <ShareModal 
        open={showShareModal}
        onOpenChange={setShowShareModal}
        videoTitle={video.title}
      />
    </div>
  )
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-queen-purple/30 border-t-queen-purple rounded-full animate-spin" />
      </div>
    }>
      <WatchPageContent />
    </Suspense>
  )
}