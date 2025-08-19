"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { SignUpModal } from "@/components/signup-modal"
import { SignInModal } from "@/components/signin-modal"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { VideoThumbnail } from "@/components/video-thumbnail"
import { 
  PlayCircle, 
  Star, 
  Users, 
  Award, 
  Clock,
  CheckCircle,
  Calendar,
  MapPin,
  Zap,
  Target,
  Trophy,
  Timer,
  Lock,
  BookOpen,
  Smartphone,
  Download
} from "lucide-react"

const instructors = [
  {
    id: 1,
    name: "Jo Simpson",
    title: "Co-founder & Behavior Specialist",
    avatar: "https://storage.googleapis.com/dogg-t.appspot.com/public/homepage/founders_jo.jpg",
    students: "45+ years",
    rating: 5.0,
    specialty: "Dog Psychology & Therapy",
    description: "Developed dog psychology and behavior therapy curriculum to rehabilitate dogs. Creator of Canine Connections Dog Therapy Program."
  },
  {
    id: 2,
    name: "Cameron Simpson",
    title: "Co-founder, Co-CEO",
    avatar: "https://storage.googleapis.com/dogg-t.appspot.com/public/homepage/founders_cameron.jpg",
    students: "20+ years",
    rating: 4.9,
    specialty: "Training & Showing",
    description: "Over 20+ years experience raising, training and showing dogs. Owner of a top 5 Spinone Italiano in 2022."
  },
  {
    id: 3,
    name: "Carley Simpson",
    title: "Co-founder, Co-CEO",
    avatar: "https://storage.googleapis.com/dogg-t.appspot.com/public/homepage/founders_carley.jpg",
    students: "25+ years",
    rating: 4.9,
    specialty: "Professional Showing",
    description: "2000 Westminster Kennel Club Junior Showmanship 3rd Place. Over 25+ years raising, training and showing dogs."
  }
]

const classes = [
  {
    id: 1,
    title: "Advanced Agility Training",
    instructor: "Sarah Johnson",
    duration: "8h 45m",
    lessons: 42,
    students: "8.4k",
    rating: 4.8,
    thumbnail: "https://images.unsplash.com/photo-1546975490-e8b92a360b24?w=800",
    category: "Training",
    level: "Advanced"
  },
  {
    id: 2,
    title: "Puppy Fundamentals",
    instructor: "Mike Rodriguez", 
    duration: "6h 20m",
    lessons: 28,
    students: "12.1k",
    rating: 4.9,
    thumbnail: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
    category: "Basics",
    level: "Beginner"
  },
  {
    id: 3,
    title: "Understanding Dog Behavior",
    instructor: "Emma Thompson",
    duration: "5h 15m", 
    lessons: 22,
    students: "15.6k",
    rating: 4.7,
    thumbnail: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800",
    category: "Behavior",
    level: "Intermediate"
  }
]

function LandingPageClient() {
  const router = useRouter()
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [selectedTrainingGoals, setSelectedTrainingGoals] = useState<string[]>([])
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ firstName?: string; email?: string } | null>(null)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Check authentication state
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const paymentCompleted = localStorage.getItem("paymentCompleted")
    const subscriptionActive = localStorage.getItem("subscriptionActive")
    
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setIsAuthenticated(parsedUser.isAuthenticated === true)
    }
  }, [])

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date('2025-09-06T14:00:00-07:00') // September 6, 2025, 2:00 PM PST

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleTrainingGoalChange = (goal: string, checked: boolean) => {
    setSelectedTrainingGoals(prev => 
      checked 
        ? [...prev, goal]
        : prev.filter(g => g !== goal)
    )
  }

  const handleGetStarted = () => {
    window.location.href = '/membership'
  }

  const handleVideoPreview = (videoId: string) => {
    setSelectedVideoId(videoId)
    setShowSubscriptionPrompt(false) // Reset subscription prompt
    setShowTrailerModal(true)
  }

  const handleSignOut = () => {
    localStorage.clear()
    setIsAuthenticated(false)
    setUser(null)
    router.push('/')
  }

  const getVideoUrl = (videoId: string) => {
    const videoUrls = {
      "puppy-basics": "https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/videos/1%20Puppy%20Basics%20(version%203%20-%20Brian%20VO)-compressed.mp4",
      "advanced-obedience": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800", // placeholder
      "leash-training": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&crop=face" // placeholder
    }
    return videoUrls[videoId as keyof typeof videoUrls] || videoUrls["puppy-basics"]
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <Header 
        variant="landing" 
        isAuthenticated={isAuthenticated}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Hero Section - Live Stream Focus */}
      <section className="relative h-[75vh] max-h-[700px] flex items-center justify-center overflow-hidden bg-black">
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          <img
            src="https://services.doggit.app/matchmaker/img/content/img-banner-3@2x.png"
            alt="Professional dog training session"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>
        
        {/* Main Content - Centered */}
        <div className="relative z-10 w-full text-center px-4 lg:px-8 py-16">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Live Indicator */}
            <div className="inline-flex items-center gap-2 text-queen-purple px-6 py-3">
              <div className="w-2 h-2 bg-queen-purple rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold tracking-wider">LIVE EVENT</span>
            </div>
            
            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-none tracking-tight">
                Expert Dog Training - LIVE NOW
              </h1>
              <h2 className="text-3xl lg:text-5xl font-semibold text-queen-purple">
                Live Stream
              </h2>
            </div>
            
            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join renowned trainer <span className="text-white font-semibold">Carley Simpson</span> for an exclusive live stream.
            </p>
            
            {/* Event Details - No Card */}
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-white mb-3">Event starts in</h3>
                
                {/* Compact Countdown Timer */}
                <div className="inline-flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{timeLeft.days.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Days</div>
                  </div>
                  <div className="text-white/40 text-2xl font-bold">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Hours</div>
                  </div>
                  <div className="text-white/40 text-2xl font-bold">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Min</div>
                  </div>
                  <div className="text-white/40 text-2xl font-bold">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Sec</div>
                  </div>
                </div>
              </div>
              
              {/* Event Info */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-queen-purple" />
                  <span className="text-sm font-medium">September 6, 2025</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-queen-purple" />
                  <span className="text-sm font-medium">2:00 PM PST</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-queen-purple" />
                  <span className="text-sm font-medium">Carley Simpson</span>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="flex justify-center">
              <Button 
                size="lg" 
                className="bg-queen-purple hover:bg-queen-purple/90 text-white px-10 py-4 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all"
                onClick={handleGetStarted}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Add to Calendar
              </Button>
            </div>
          </div>
        </div>
        
      </section>

      {/* Essential Puppy Training Courses */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Essential Puppy Training.
            </h2>
            <p className="text-lg text-gray-300">
              Start with the basics every puppy owner needs to know.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Puppy Basics */}
            <div 
              className="relative group cursor-pointer"
              onClick={() => handleVideoPreview("puppy-basics")}
            >
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <VideoThumbnail
                  videoUrl="https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/videos/1%20Puppy%20Basics%20(version%203%20-%20Brian%20VO)-compressed.mp4"
                  fallbackImage="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&crop=face"
                  videoId="puppy-basics"
                  alt="Cute puppy learning basic training"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  timeOffset={40}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className="mb-3 bg-jade-purple text-white">
                    Essential
                  </Badge>
                  <h3 className="text-xl font-bold text-white mb-2">
                    PUPPY BASICS
                    <br />
                    WITH JAYME NOLAN
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Master essential puppy training fundamentals with proven techniques from expert trainer Jayme Nolan.
                  </p>
                  
                  {/* Watch Teaser Button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/90 text-gray-900 border-white hover:bg-white hover:text-gray-900 transition-all group-hover:scale-105 font-semibold"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Watch Teaser
                  </Button>
                </div>
                
                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <PlayCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Obedience Commands */}
            <div 
              className="relative group cursor-pointer"
              onClick={() => handleVideoPreview("advanced-obedience")}
            >
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=face"
                  alt="Advanced dog obedience training"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className="mb-3 bg-queen-purple text-white">
                    Obedience
                  </Badge>
                  <h3 className="text-xl font-bold text-white mb-2">
                    ADVANCED OBEDIENCE
                    <br />
                    WITH MIKE CHEN
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Take your dog's training to the next level with advanced obedience commands.
                  </p>
                  
                  {/* Watch Teaser Button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/90 text-gray-900 border-white hover:bg-white hover:text-gray-900 transition-all group-hover:scale-105 font-semibold"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Watch Teaser
                  </Button>
                </div>
                
                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <PlayCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Leash Training Techniques */}
            <div 
              className="relative group cursor-pointer"
              onClick={() => handleVideoPreview("leash-training")}
            >
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&crop=face"
                  alt="Dog learning leash training techniques"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className="mb-3 bg-nettle-green text-white">
                    Walking
                  </Badge>
                  <h3 className="text-xl font-bold text-white mb-2">
                    LEASH TRAINING
                    <br />
                    WITH EMILY RODRIGUEZ
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Learn effective leash training techniques for enjoyable walks.
                  </p>
                  
                  {/* Watch Teaser Button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/90 text-gray-900 border-white hover:bg-white hover:text-gray-900 transition-all group-hover:scale-105 font-semibold"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Watch Teaser
                  </Button>
                </div>
                
                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <PlayCircle className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Instructors */}
      <section id="instructors" className="py-16 bg-gradient-to-b from-black to-zinc-900">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Learn from the Best, for Your Pup
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Our instructors are world-renowned experts with decades of experience training dogs of all breeds and temperaments.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <div key={instructor.id} className="group">
                <div className="relative overflow-hidden rounded-2xl bg-zinc-800/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-zinc-700/50">
                  {/* Large photo at top */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={instructor.avatar}
                      alt={instructor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Experience badge overlay */}
                    <div className="absolute bottom-4 left-4 bg-jade-purple/90 backdrop-blur-sm text-white rounded-full px-3 py-1 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-medium">{instructor.students}</span>
                    </div>
                  </div>
                  
                  {/* Content below photo */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-white mb-1">
                      {instructor.name}
                    </h3>
                    <p className="text-queen-purple font-medium mb-3">
                      {instructor.title}
                    </p>
                    
                    <Badge className="bg-queen-purple/10 text-queen-purple border-queen-purple/20 mb-4">
                      {instructor.specialty}
                    </Badge>
                    
                    <p className="text-sm text-gray-400 line-clamp-3">
                      {instructor.description}
                    </p>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-300">
              Choose the plan that works best for you
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            {/* Special Offer Card */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-queen-purple to-jade-purple border-purple-500/20 shadow-xl">
              <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 text-sm font-bold">
                SPECIAL OFFER - Save 90%
              </div>
              <CardContent className="p-8 pt-12">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-4">Get Started Today</h3>
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-5xl font-bold text-white">$1</span>
                      <span className="text-purple-100 text-lg">first month</span>
                    </div>
                    <div className="text-sm text-purple-100 mb-2">Then $10/month • Cancel anytime</div>
                    <div className="text-xs text-purple-200">Save 90% on your first month</div>
                  </div>
                  
                  <ul className="space-y-3 mb-8 text-left">
                    <li className="flex items-center gap-3 text-white">
                      <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <span>Expert Training Videos</span>
                    </li>
                    <li className="flex items-center gap-3 text-white">
                      <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <span>Mobile App + Offline Access</span>
                    </li>
                    <li className="flex items-center gap-3 text-white">
                      <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <span>Community Support (50,000+ members)</span>
                    </li>
                    <li className="flex items-center gap-3 text-white">
                      <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                      <span>30-Day Money-Back Guarantee</span>
                    </li>
                  </ul>
                  
                  <Button 
                    className="w-full bg-white text-purple-700 hover:bg-gray-100 py-4 text-lg font-bold shadow-lg transform hover:scale-105 transition-all"
                    onClick={handleGetStarted}
                  >
                    Start Your $1 Trial
                  </Button>
                  
                  <p className="text-xs text-purple-200 mt-4">
                    Cancel anytime • No commitments • Instant access
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Start your journey today.
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Special offer: <span className="line-through text-gray-500">$10</span> <span className="font-bold text-white">$1 first month</span>, then $10/month. 30-day money back guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-queen-purple hover:bg-queen-purple/90 text-white px-8 py-4 text-lg font-semibold"
                onClick={handleGetStarted}
              >
                Subscribe Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-zinc-600 text-white bg-zinc-800 hover:bg-zinc-700 px-8 py-4 text-lg font-semibold"
                onClick={() => window.location.href = '/classes'}
              >
                Explore Classes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-jade-purple py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-white text-sm">
              <span>Copyright © 2024 DOGGIT. All rights reserved</span>
              <div className="flex gap-4">
                <a href="#" className="underline hover:no-underline">Terms & Conditions</a>
                <a href="#" className="underline hover:no-underline">Privacy</a>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <span className="text-white text-sm font-bold">f</span>
              </a>
              <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <span className="text-white text-sm font-bold">@</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sign Up Modal */}
      <SignUpModal 
        open={showSignUpModal} 
        onOpenChange={setShowSignUpModal}
        selectedTrainingGoals={selectedTrainingGoals}
        onSwitchToSignIn={() => {
          setShowSignUpModal(false)
          setTimeout(() => setShowSignInModal(true), 100)
        }}
      />

      {/* Sign In Modal */}
      <SignInModal 
        open={showSignInModal} 
        onOpenChange={setShowSignInModal}
        onSwitchToSignUp={() => {
          setShowSignInModal(false)
          setTimeout(() => setShowSignUpModal(true), 100)
        }}
      />

      {/* Compact Teaser Modal with Subscribe CTA */}
      <Dialog open={showTrailerModal} onOpenChange={setShowTrailerModal}>
        <DialogContent className="max-w-2xl w-full p-0 bg-black border-0">
          <DialogPrimitive.Title className="sr-only">Video Preview</DialogPrimitive.Title>
          <div className="relative aspect-video">
            {selectedVideoId && (
              <video
                className="w-full h-full rounded-lg"
                src={getVideoUrl(selectedVideoId)}
                poster="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop&crop=face"
                controls
                autoPlay
                playsInline
                crossOrigin="anonymous"
                onTimeUpdate={(e) => {
                  // Stop video after 30 seconds for teaser
                  const video = e.target as HTMLVideoElement
                  if (video.currentTime >= 30) {
                    video.pause()
                    video.currentTime = 30
                    setShowSubscriptionPrompt(true)
                  }
                }}
                onError={(e) => {
                  console.error("Video error:", e)
                }}
                onLoadStart={() => {
                  console.log("Video loading started for:", selectedVideoId)
                }}
              />
            )}
            
            {/* Compact Paywall Overlay - Only show after 30 seconds */}
            {showSubscriptionPrompt && (
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end">
              <div className="w-full p-4 text-center">
                <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white mb-2">Want to see more?</h3>
                  <p className="text-gray-300 text-sm mb-4">Subscribe to access the full video and our entire training library</p>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      className="bg-queen-purple hover:bg-queen-purple/90 text-white px-5 py-2 text-sm"
                      onClick={() => {
                        setShowTrailerModal(false)
                        router.push(`/membership?v=${selectedVideoId}&from=modal`)
                      }}
                    >
                      Subscribe Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white bg-white text-black hover:bg-gray-100 px-4 py-2 text-sm"
                      onClick={() => setShowTrailerModal(false)}
                    >
                      Maybe Later
                    </Button>
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LandingPageClient