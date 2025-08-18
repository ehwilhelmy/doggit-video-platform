"use client"

export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  ChevronLeft,
  Maximize,
  Lock,
  Star,
  Users,
  Award,
  BookOpen,
  Clock,
  Smartphone,
  Download
} from "lucide-react"

const videosData = {
  "puppy-basics": {
    title: "Puppy Basics",
    description: "Master essential puppy training fundamentals with proven techniques from expert trainer Brian",
    thumbnail: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=1920&h=1080&fit=crop",
    duration: "15 minutes",
    instructor: "Brian",
    videoUrl: "https://drive.google.com/uc?export=download&id=1Cb0R2HcNtovUx0gSuF_L6KQeoLZZhaDk",
    trailerDuration: "2:30"
  },
  "advanced-obedience": {
    title: "Advanced Obedience Commands",
    description: "Take your dog's training to the next level with advanced obedience commands",
    thumbnail: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=1920",
    duration: "18 minutes",
    instructor: "Mike Chen",
    trailerDuration: "2:15"
  },
  "leash-training": {
    title: "Leash Training Techniques",
    description: "Learn effective leash training techniques to make walks enjoyable",
    thumbnail: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=1920",
    duration: "15 minutes",
    instructor: "Emily Rodriguez",
    trailerDuration: "2:00"
  }
}

function TrailerPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const videoId = searchParams.get("v") || "puppy-basics"
  const from = searchParams.get("from") || "dashboard"
  const isDemoMode = from === "demo" || localStorage.getItem("demoMode") === "true"
  
  const video = videosData[videoId as keyof typeof videosData] || videosData["puppy-basics"]
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showSubscribeCTA, setShowSubscribeCTA] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isBuffering, setIsBuffering] = useState(false)
  const [volume, setVolume] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const volumeBarRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleSubscribe = () => {
    router.push(`/membership?from=trailer&video=${videoId}`)
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

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current || !videoRef.current) return
    const rect = volumeBarRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    setVolume(percentage)
    videoRef.current.volume = percentage
    if (percentage === 0) {
      setIsMuted(true)
      videoRef.current.muted = true
    } else if (isMuted) {
      setIsMuted(false)
      videoRef.current.muted = false
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

  // Show subscribe CTA after 20 seconds or when video ends
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubscribeCTA(true)
    }, 20000) // 20 seconds - shorter to capture interest

    return () => clearTimeout(timer)
  }, [])

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }
    const handleWaiting = () => setIsBuffering(true)
    const handlePlaying = () => setIsBuffering(false)
    const handleEnded = () => {
      setShowSubscribeCTA(true)
      setIsPlaying(false)
    }
    const handleVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('volumechange', handleVolumeChange)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [])

  // Auto-play on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Auto-play prevented:', err)
        setIsPlaying(false)
      })
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <div className="text-white">
                <h1 className="text-lg font-semibold">{video.title} - Trailer</h1>
                <p className="text-sm text-gray-300">{video.instructor}</p>
              </div>
            </div>
            
            <Logo size="sm" variant="white" />
          </div>
        </div>
      </header>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="absolute top-20 left-0 right-0 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4">
          <div className="container mx-auto text-center text-sm">
            <span className="font-semibold">🎬 DEMO MODE</span>
            <span className="ml-2">Watching trailer in demo mode - subscription CTA will appear after 20 seconds</span>
          </div>
        </div>
      )}

      {/* Video Player */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="w-full h-full relative">
          {video.videoUrl ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={video.videoUrl}
              poster={video.thumbnail}
              playsInline
              onMouseMove={resetControlsTimeout}
            />
          ) : (
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${video.thumbnail})` }}
            />
          )}
          
          {/* Video Controls Overlay */}
          <div 
            className="absolute inset-0 z-10"
            onMouseMove={resetControlsTimeout}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            onClick={togglePlay}
          />

          {/* Center Play/Pause Button */}
          {!isPlaying && !showSubscribeCTA && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlay()
                }}
                className="bg-white/20 backdrop-blur-sm rounded-full p-8 hover:bg-white/30 transition-colors pointer-events-auto"
              >
                <Play className="h-16 w-16 text-white" />
              </button>
            </div>
          )}

          {/* Buffering Indicator */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="bg-black/50 rounded-full p-4">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            {/* Progress Bar */}
            <div className="px-6 pb-2">
              <div 
                ref={progressBarRef}
                className="relative h-1 bg-white/20 rounded-full cursor-pointer group"
                onClick={handleProgressClick}
                onMouseEnter={() => setShowControls(true)}
              >
                <div 
                  className="absolute h-full bg-gradient-to-r from-jade-purple to-queen-purple rounded-full transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-white/80">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
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
                  
                  <div className="flex items-center gap-2 group">
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
                    
                    {/* Volume Slider */}
                    <div 
                      ref={volumeBarRef}
                      className="w-0 group-hover:w-20 overflow-hidden transition-all duration-200"
                    >
                      <div 
                        className="relative h-1 bg-white/20 rounded-full cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVolumeChange(e)
                        }}
                      >
                        <div 
                          className="absolute h-full bg-white rounded-full"
                          style={{ width: `${volume * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-white ml-4">
                    <p className="text-sm font-medium">Trailer • {video.trailerDuration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-white text-sm mr-4">
                    Full video: {video.duration}
                  </div>
                  
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

          {/* Enhanced Subscribe CTA Overlay with Comprehensive Value Props */}
          {showSubscribeCTA && (
            <div className="absolute inset-0 bg-black/95 backdrop-blur-sm overflow-y-auto z-40 animate-fade-in">
              <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center text-white max-w-6xl mx-auto transform animate-slide-up">
                  {/* Header Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-center mb-6">
                      <div className="bg-gradient-to-r from-queen-purple to-jade-purple p-4 rounded-full">
                        <Lock className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div className="inline-block bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 animate-pulse shadow-xl">
                      ⚡ LIMITED TIME OFFER - First Month Only $1
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
                      Unlock the Full Experience
                    </h2>
                    <p className="text-xl mb-2 text-gray-300">You've just watched {currentTime > 0 ? Math.floor(currentTime) : '30'} seconds of</p>
                    <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-queen-purple to-jade-purple bg-clip-text text-transparent">{video.title}</h3>
                    <p className="text-lg text-gray-400">Get instant access to the remaining {Math.floor((parseInt(video.duration) * 60 - currentTime) / 60)} minutes + our entire library</p>
                  </div>

                  {/* Value Proposition Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Expert Instructors */}
                    <div className="bg-gradient-to-br from-queen-purple/20 to-jade-purple/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="bg-gradient-to-r from-queen-purple to-jade-purple p-3 rounded-full w-fit mx-auto mb-4">
                        <Award className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Expert Instructors</h4>
                      <p className="text-gray-300 text-sm mb-3">Learn from certified trainers with 15+ years experience</p>
                      <div className="flex items-center justify-center gap-1 text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                      </div>
                      <p className="text-xs text-gray-400">Rated #1 by Professional Dog Trainers</p>
                    </div>

                    {/* Community */}
                    <div className="bg-gradient-to-br from-queen-purple/20 to-jade-purple/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="bg-gradient-to-r from-queen-purple to-jade-purple p-3 rounded-full w-fit mx-auto mb-4">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">50,000+ Students</h4>
                      <p className="text-gray-300 text-sm mb-3">Join our thriving community of successful dog owners</p>
                      <div className="text-2xl font-bold text-green-400 mb-1">94%</div>
                      <p className="text-xs text-gray-400">Success rate within 30 days</p>
                    </div>

                    {/* Results */}
                    <div className="bg-gradient-to-br from-queen-purple/20 to-jade-purple/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="bg-gradient-to-r from-queen-purple to-jade-purple p-3 rounded-full w-fit mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Proven Results</h4>
                      <p className="text-gray-300 text-sm mb-3">Science-backed methods that actually work</p>
                      <div className="text-2xl font-bold text-green-400 mb-1">7 Days</div>
                      <p className="text-xs text-gray-400">Average time to see results</p>
                    </div>
                  </div>

                  {/* What's Included Section */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
                    <h3 className="text-3xl font-bold mb-6">What's Included in Your Membership:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                      <div className="flex items-start gap-4">
                        <div className="bg-green-500 p-2 rounded-lg mt-1">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h5 className="font-semibold mb-1">Complete Video Library</h5>
                          <p className="text-sm text-gray-300">50+ training videos covering every aspect</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-green-500 p-2 rounded-lg mt-1">
                          <Smartphone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h5 className="font-semibold mb-1">Mobile App Access</h5>
                          <p className="text-sm text-gray-300">Train anywhere with offline downloads</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-green-500 p-2 rounded-lg mt-1">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h5 className="font-semibold mb-1">Community Access</h5>
                          <p className="text-sm text-gray-300">Get support from other dog owners</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-green-500 p-2 rounded-lg mt-1">
                          <Download className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h5 className="font-semibold mb-1">Bonus Materials</h5>
                          <p className="text-sm text-gray-300">PDFs, checklists, and quick guides</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="mb-8">
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border-2 border-green-400/50 relative overflow-hidden">
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                        LIMITED TIME
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Special Launch Pricing</h3>
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="text-gray-400 line-through text-xl">$29/month</div>
                        <div className="text-4xl font-bold text-green-400">$1</div>
                        <div className="text-lg text-gray-300">first month, then $10/month</div>
                      </div>
                      <p className="text-green-300 font-semibold mb-6">Save 97% on your first month!</p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <Button
                          onClick={handleSubscribe}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-4 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 border-green-400"
                        >
                          🚀 Start Training for $1
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => setShowSubscribeCTA(false)}
                          className="border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg hover:border-white transition-all duration-200"
                        >
                          Continue Preview
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-semibold">14-Day Free Trial</span>
                      </div>
                      <p className="text-xs text-gray-400">Full access, no strings attached</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                        <X className="h-5 w-5" />
                        <span className="font-semibold">Cancel Anytime</span>
                      </div>
                      <p className="text-xs text-gray-400">No long-term commitment required</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                        <Award className="h-5 w-5" />
                        <span className="font-semibold">Money-Back Guarantee</span>
                      </div>
                      <p className="text-xs text-gray-400">100% refund within 30 days</p>
                    </div>
                  </div>

                  {/* Success Stories */}
                  <div className="mb-6">
                    <h4 className="text-xl font-bold mb-4">Recent Success Stories:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex text-yellow-400 mb-2 justify-center">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                        </div>
                        <p className="text-sm text-gray-300 italic mb-2">
                          "My rescue dog went from aggressive to gentle in just 2 weeks!"
                        </p>
                        <p className="text-xs text-gray-400">- Sarah M.</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex text-yellow-400 mb-2 justify-center">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                        </div>
                        <p className="text-sm text-gray-300 italic mb-2">
                          "Finally! No more destroyed furniture. These techniques work!"
                        </p>
                        <p className="text-xs text-gray-400">- Mike R.</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex text-yellow-400 mb-2 justify-center">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                        </div>
                        <p className="text-sm text-gray-300 italic mb-2">
                          "Best investment I've made for my puppy. Highly recommend!"
                        </p>
                        <p className="text-xs text-gray-400">- Jennifer L.</p>
                      </div>
                    </div>
                  </div>

                  {/* Final CTA */}
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">Join 50,000+ successful dog owners • Instant access • No commitment</p>
                    <p className="text-xs text-gray-500">Secure payment powered by Stripe • Cancel online anytime</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TrailerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <TrailerPageContent />
    </Suspense>
  )
}