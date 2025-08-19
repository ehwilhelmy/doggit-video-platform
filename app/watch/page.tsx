"use client"

export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { VideoThumbnail } from "@/components/video-thumbnail"
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
  Star,
  PlayCircle
} from "lucide-react"

const videosData = {
  "puppy-basics": {
    title: "Puppy Basics",
    description: "Master essential puppy training fundamentals with proven techniques from expert trainer Jayme Nolan. Learn the foundation skills every puppy needs for a lifetime of good behavior.",
    thumbnail: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=1920&h=1080&fit=crop",
    duration: "2:54",
    instructor: "Jayme Nolan",
    instructorBio: "Jayme Nolan has been training dogs for over 15 years and specializes in puppy development and positive reinforcement techniques. She's worked with thousands of puppies and their families.",
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
  "advanced-obedience": {
    title: "Advanced Obedience Commands",
    description: "Take your dog's training to the next level with advanced obedience commands and techniques for better control and communication.",
    thumbnail: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=1920&h=1080&fit=crop",
    duration: "18 min",
    instructor: "Mike Chen",
    instructorBio: "Mike Chen is a certified dog behaviorist with 12 years of experience. He specializes in advanced training techniques and has worked with working dogs and service animals.",
    videoUrl: "/videos/advanced-obedience.mp4",
    chapters: [
      { title: "Meet Your Instructor: Mike Chen", time: "0:00", duration: "2 min" },
      { title: "Advanced Heel Command", time: "2:30", duration: "4 min" },
      { title: "Distance Commands", time: "6:45", duration: "5 min" },
      { title: "Emergency Recall", time: "11:30", duration: "4 min" },
      { title: "Practice & Troubleshooting", time: "15:45", duration: "3 min" }
    ]
  },
  "leash-training": {
    title: "Leash Training Techniques",
    description: "Learn effective leash training techniques to make walks enjoyable for both you and your dog. End pulling and create positive walking experiences.",
    thumbnail: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=1920&h=1080&fit=crop",
    duration: "15 min",
    instructor: "Emily Rodriguez",
    instructorBio: "Emily Rodriguez has been a professional dog trainer for 10 years, specializing in leash reactivity and walking behavior. She's helped hundreds of dogs become confident walkers.",
    videoUrl: "/videos/leash-training.mp4",
    chapters: [
      { title: "Meet Your Instructor: Emily Rodriguez", time: "0:00", duration: "2 min" },
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
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [activeTab, setActiveTab] = useState<'lessons' | 'notes'>('lessons')
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  const handleBack = () => {
    router.push("/dashboard")
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

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => {
      setCurrentTime(videoEl.currentTime)
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

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
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
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            Share
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            Bookmark
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
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                src={video.videoUrl}
                playsInline
                poster={video.thumbnail}
                crossOrigin="anonymous"
              />

              {/* Video Thumbnail Overlay (only show before first play) */}
              {!isPlaying && currentTime === 0 && (
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

              {/* Center Play Button */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center z-40">
                  <button
                    onClick={togglePlay}
                    className="bg-white/20 backdrop-blur-sm rounded-full p-8 hover:bg-white/30 transition-colors"
                  >
                    <Play className="h-16 w-16 text-white" />
                  </button>
                </div>
              )}

              {/* Video Controls Overlay */}
              <div 
                className="absolute inset-0 z-30"
                onMouseMove={resetControlsTimeout}
                onClick={togglePlay}
              />

              {/* Bottom Controls */}
              <div className={`absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <div className="px-6 pb-4">
                  <div 
                    ref={progressBarRef}
                    className="relative h-1 bg-white/20 rounded-full cursor-pointer group mb-4"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="absolute h-full bg-queen-purple rounded-full transition-all"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
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
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 lg:h-5 lg:w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.9/5 rating</span>
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
                src={video.thumbnail}
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

          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`flex-1 px-4 lg:px-6 py-3 text-xs lg:text-sm font-medium transition-colors ${
                activeTab === 'lessons'
                  ? 'text-white border-b-2 border-queen-purple bg-queen-purple/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Lessons
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 px-4 lg:px-6 py-3 text-xs lg:text-sm font-medium transition-colors ${
                activeTab === 'notes'
                  ? 'text-white border-b-2 border-queen-purple bg-queen-purple/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              My Notes
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'lessons' && (
              <div className="p-4 lg:p-6">
                <p className="text-gray-300 text-xs lg:text-sm mb-4 lg:mb-6">
                  Pioneering training expert {video.instructor} teaches you the fundamentals of dog training through hands-on lessons.
                </p>
                
                <div className="text-xs lg:text-sm text-gray-400 mb-3 lg:mb-4">
                  {video.chapters.length} lessons • {video.duration}
                </div>

                {/* Current Lesson Chapters */}
                <div className="space-y-3 mb-8">
                  {video.chapters.map((chapter, index) => (
                    <button
                      key={index}
                      onClick={() => jumpToChapter(chapter.time)}
                      className="w-full text-left p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 bg-zinc-700 rounded flex items-center justify-center text-gray-400 group-hover:text-white">
                          <PlayCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white text-sm font-medium mb-1">
                            {index + 1}. {chapter.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{chapter.time}</span>
                            <span>•</span>
                            <span>{chapter.duration}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Other Videos */}
                <div className="border-t border-zinc-800 pt-6">
                  <h4 className="text-white font-medium mb-4">More Training Videos</h4>
                  <div className="space-y-3">
                    {allVideos.filter(v => v.id !== videoId).map((otherVideo) => (
                      <button
                        key={otherVideo.id}
                        onClick={() => router.push(`/watch?v=${otherVideo.id}`)}
                        className="w-full text-left p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={otherVideo.thumbnail}
                            alt={otherVideo.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h5 className="text-white text-sm font-medium mb-1 group-hover:text-queen-purple">
                              {otherVideo.title}
                            </h5>
                            <p className="text-xs text-gray-400">{otherVideo.instructor} • {otherVideo.duration}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="p-4 lg:p-6">
                <textarea
                  placeholder="Take notes while you watch..."
                  className="w-full h-64 lg:h-96 bg-zinc-800 border border-zinc-700 rounded-lg p-3 lg:p-4 text-sm lg:text-base text-white placeholder-gray-400 resize-none focus:outline-none focus:border-queen-purple"
                />
                <Button className="w-full mt-3 lg:mt-4 bg-queen-purple hover:bg-queen-purple/90 text-sm lg:text-base">
                  Save Notes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
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