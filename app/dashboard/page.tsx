"use client"

import { useState, useEffect, Suspense } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { VideoPreviewCard } from "@/components/video-preview-card"
import { VideoThumbnail } from "@/components/video-thumbnail"
import { VideoDuration } from "@/components/video-duration"
import { 
  PlayCircle,
  Clock,
  Bell,
  X,
  LogOut,
  User,
  Shield,
  Settings,
  Star,
  PartyPopper,
  Video,
  BookOpen
} from "lucide-react"

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading, signOut } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [userName, setUserName] = useState("")
  const [pupName, setPupName] = useState("")
  const [trainingGoals, setTrainingGoals] = useState<string[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [isPersonalized, setIsPersonalized] = useState(false)

  // Check subscription status and demo mode on mount
  useEffect(() => {
    const demoMode = localStorage.getItem("demoMode") === "true"
    const isDemo = searchParams.get("demo") === "true" || demoMode
    const isWelcome = searchParams.get("welcome") === "true"
    const personalized = searchParams.get("personalized") === "true"
    
    // Get pup's name and training goals from localStorage
    const storedPupName = localStorage.getItem("pupName") || ""
    const storedGoals = JSON.parse(localStorage.getItem("trainingGoals") || "[]")
    setPupName(storedPupName)
    setTrainingGoals(storedGoals)
    setIsPersonalized(personalized)
    
    // Get user data from Supabase auth
    if (user) {
      const firstName = user.user_metadata?.firstName || ""
      const pupNameFromMeta = user.user_metadata?.pup_name || storedPupName
      setUserName(firstName)
      setPupName(pupNameFromMeta)
      
      // Show welcome if redirected from account creation or user was created recently
      if (isWelcome) {
        setShowWelcome(true)
        // Auto-hide welcome after 8 seconds
        setTimeout(() => setShowWelcome(false), 8000)
      } else {
        const createdAt = new Date(user.created_at)
        const now = new Date()
        const timeDiff = now.getTime() - createdAt.getTime()
        if (timeDiff < 60000) { // 60 seconds
          setShowWelcome(true)
          // Auto-hide welcome after 8 seconds
          setTimeout(() => setShowWelcome(false), 8000)
        }
      }
    }
    
    // Check subscription status from localStorage or user auth
    const subscriptionActive = localStorage.getItem("subscriptionActive") === "true"
    const paymentCompleted = localStorage.getItem("paymentCompleted") === "true"
    const isAuthenticatedLocal = localStorage.getItem("isAuthenticated") === "true"
    const hasActiveSubscription = subscriptionActive || paymentCompleted
    
    // If user is authenticated (either through Supabase or localStorage) and has completed payment, they have access
    const isUserAuthenticated = !!user || isAuthenticatedLocal
    setIsSubscribed(isUserAuthenticated && hasActiveSubscription)
    setIsDemoMode(isDemo)
  }, [searchParams, user])

  // Load videos - use hardcoded data for now
  useEffect(() => {
    setVideosLoading(true)
    // Force hardcoded data instead of Supabase
    setVideos([
      {
        id: "puppy-basics",
        title: "PUPPY BASICS",
        duration: "2:54",
        thumbnail_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&crop=face",
        instructor: "Jayme Nolan",
        category: "Foundation",
        video_url: "https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/videos/1%20Puppy%20Basics%20(version%203%20-%20Brian%20VO)-compressed.mp4",
        description: "Master foundation puppy training fundamentals with proven techniques rooted in dog psychology.",
        tags: ["Foundation", "Puppy", "Basics"]
      },
      {
        id: "advanced-obedience",
        title: "Advanced Obedience Commands",
        duration: "18 min",
        thumbnail_url: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face", 
        instructor: "Mike Chen",
        category: "Obedience",
        description: "Take your dog's training to the next level with advanced obedience commands."
      },
      {
        id: "leash-training",
        title: "Leash Training Techniques", 
        duration: "15 min",
        thumbnail_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&crop=face",
        instructor: "Emily Rodriguez",
        category: "Walking",
        description: "Learn effective leash training techniques for enjoyable walks."
      }
    ])
    setVideosLoading(false)
  }, [])

  const handleVideoClick = (videoId: string) => {
    router.push(`/watch?v=${videoId}&from=dashboard`)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  // Show loading state while auth is initializing
  if (loading || videosLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-queen-purple/30 border-t-queen-purple rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4">
          <div className="flex items-center gap-4">
            <Logo size="sm" variant="white" />
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10 hidden md:flex"
              onClick={() => router.push('/classes')}
            >
              All Classes
            </Button>
            <Bell className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            
            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-queen-purple focus:ring-offset-2 focus:ring-offset-zinc-900">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-queen-purple text-white hover:bg-queen-purple/90 transition-colors">
                      {userName.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-zinc-800 border-zinc-700" align="end">
                <div className="px-3 py-2 border-b border-zinc-700">
                  <p className="text-sm font-medium text-white">{userName || "User"}</p>
                  <p className="text-xs text-gray-400">{user?.email || "user@example.com"}</p>
                </div>
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/classes'}
                  className="text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  All Classes
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/settings/preferences'}
                  className="text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/admin/simple'}
                  className="text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="text-white hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-2">
              <Video className="h-4 w-4" />
              <span className="font-semibold">DEMO MODE</span>
            </div>
            <span className="ml-2">This is a demonstration of the complete user journey</span>
          </div>
        </div>
      )}

      {/* Welcome Banner for New Users */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-jade-purple to-queen-purple text-white py-4 px-6 animate-slide-down">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <PartyPopper className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  Welcome to DOGGIT{userName ? `, ${userName}` : ''}! 
                  {pupName && ` Ready to start training ${pupName}?`}
                </h3>
                <p className="text-sm text-white/90">
                  {isPersonalized && trainingGoals.length > 0 
                    ? `Perfect! We've customized your experience based on your goals: ${trainingGoals.includes('socialization') ? 'Socialization' : trainingGoals.includes('trust') ? 'Building Trust' : 'Training'}. Let's start your journey!`
                    : "Your account has been created successfully. Let's begin with \"Puppy Basics\" - our most popular starting point!"
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowWelcome(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section - Always Show */}
      <div className="relative h-[60vh] min-h-[450px] overflow-hidden bg-black">
        {/* Video Background */}
        <div className="absolute inset-0">
          {videos.length > 0 && (
            <VideoThumbnail
              videoUrl={videos[0].video_url || videos[0].videoUrl}
              fallbackImage={videos[0].thumbnail_url || videos[0].thumbnail}
              videoId={videos[0].id}
              alt={videos[0].title}
              className="w-full h-full object-cover bg-black"
              timeOffset={40}
            />
          )}
          {/* Side gradients - dark to light */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
          {/* Bottom gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-lg space-y-4">
              {videos.length > 0 && (
                <>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {videos[0].title}
                  </h1>
                  
                  <p className="text-lg text-gray-200 leading-relaxed">
                    {videos[0].description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-300">
                    <button 
                      onClick={() => {
                        const instructorId = videos[0].instructor.toLowerCase().replace(/\s+/g, '-')
                        router.push(`/trainer/${instructorId}`)
                      }}
                      className="flex items-center gap-2 hover:text-jade-purple transition-colors"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-jade-purple text-white text-xs font-medium">
                          {videos[0].instructor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{videos[0].instructor}</span>
                    </button>
                    <VideoDuration 
                      videoUrl={videos[0].video_url || videos[0].videoUrl}
                      fallbackDuration={videos[0].duration}
                      showIcon={true}
                    />
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.9/5 rating</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    {isSubscribed ? (
                      <Button 
                        className="bg-jade-purple text-white hover:bg-jade-purple/90 px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-xl"
                        onClick={() => router.push(`/watch?v=${videos[0].id}&from=dashboard`)}
                      >
                        Watch Now
                      </Button>
                    ) : (
                      <Button 
                        className="bg-jade-purple text-white hover:bg-jade-purple/90 px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-xl"
                        onClick={() => router.push(`/trailer?v=${videos[0].id}&from=dashboard`)}
                      >
                        Watch Trailer
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <main className="p-4 lg:p-6 bg-black">
        <div className="max-w-[1040px] mx-auto space-y-4">
          <div className="mb-4">
            <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">All Training Videos</h2>
            <p className="text-gray-400 text-sm lg:text-base">Browse our complete training library</p>
          </div>

          {/* Video Grid - All Videos Including Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {videos.map((video) => (
              <VideoPreviewCard
                key={video.id}
                video={video}
                onVideoClick={handleVideoClick}
                isSubscribed={isSubscribed}
              />
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <div className="mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">Coming Soon</h2>
              <p className="text-gray-400 text-sm lg:text-base">New training courses we're working on based on your feedback</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {/* Coming Soon Video Cards */}
              <div className="relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 opacity-75">
                <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&crop=face"
                    alt="Coming Soon"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">Coming Soon</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">Advanced Socialization</h3>
                  <p className="text-sm text-gray-400 mb-2">Help your dog build confidence with other dogs and strangers</p>
                  <div className="text-xs text-gray-500">
                    <span>Expert: Sarah Johnson</span>
                  </div>
                </div>
              </div>

              <div className="relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 opacity-75">
                <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=face"
                    alt="Coming Soon"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">Coming Soon</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">Anxiety & Fear Management</h3>
                  <p className="text-sm text-gray-400 mb-2">Gentle techniques to help nervous and fearful dogs</p>
                  <div className="text-xs text-gray-500">
                    <span>Expert: Dr. Michael Torres</span>
                  </div>
                </div>
              </div>

              <div className="relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 opacity-75">
                <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop&crop=face"
                    alt="Coming Soon"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">Coming Soon</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">Agility & Exercise</h3>
                  <p className="text-sm text-gray-400 mb-2">Fun activities to keep your dog mentally and physically active</p>
                  <div className="text-xs text-gray-500">
                    <span>Expert: Lisa Chen</span>
                  </div>
                </div>
              </div>

              <div className="relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 opacity-75">
                <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&crop=face"
                    alt="Coming Soon"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">Coming Soon</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">Reactive Dog Training</h3>
                  <p className="text-sm text-gray-400 mb-2">Address leash reactivity and aggressive behaviors</p>
                  <div className="text-xs text-gray-500">
                    <span>Expert: Amanda Rodriguez</span>
                  </div>
                </div>
              </div>

              <div className="relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 opacity-75">
                <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face"
                    alt="Coming Soon"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">Coming Soon</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">Advanced House Training</h3>
                  <p className="text-sm text-gray-400 mb-2">Solutions for persistent house training challenges</p>
                  <div className="text-xs text-gray-500">
                    <span>Expert: Robert Kim</span>
                  </div>
                </div>
              </div>

              <div className="relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 opacity-75">
                <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face"
                    alt="Coming Soon"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">Coming Soon</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">Dogs & Children</h3>
                  <p className="text-sm text-gray-400 mb-2">Teaching dogs to be gentle and safe around kids</p>
                  <div className="text-xs text-gray-500">
                    <span>Expert: Jennifer Walsh</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm mb-4">
                Want to influence what we create next? Your training goals help us prioritize new content.
              </p>
              <Button 
                className="bg-jade-purple text-white hover:bg-jade-purple/90"
                onClick={() => window.location.href = '/settings/preferences'}
              >
                Update My Training Goals
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}