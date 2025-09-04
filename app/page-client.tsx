"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { GlobalHeader } from "@/components/global-header"
import { SignUpModal } from "@/components/signup-modal"
import { SignInModal } from "@/components/signin-modal"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { VideoThumbnail } from "@/components/video-thumbnail"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Download,
  ChevronDown,
  Facebook,
  Instagram
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
    name: "Jayme Nolan",
    title: "AKC Breeder of Merit & Behavior Specialist",
    avatar: "/Jayme-Nolan.JPG",
    students: "15+ years",
    rating: 4.9,
    specialty: "Animal Behavior & Competition",
    description: "Degree in Animal Behavior with 15+ years running her own training and boarding business. Breeder of Merit of Vizslas, she fosters dogs, and competes in performance sports."
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
  const { user: supabaseUser, loading, signOut } = useAuth()
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [selectedTrainingGoals, setSelectedTrainingGoals] = useState<string[]>([])
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  
  // Use Supabase auth state
  const isAuthenticated = !!supabaseUser && !loading
  const user = supabaseUser ? { 
    firstName: supabaseUser.user_metadata?.first_name || supabaseUser.user_metadata?.pup_name,
    email: supabaseUser.email 
  } : null

  // Countdown timer effect
  useEffect(() => {
    const targetDate = new Date('2025-09-06T13:00:00-07:00') // September 6, 2025, 1:00 PM PST

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
    // Subscribe to DOGGIT training
    router.push('/membership')
  }

  const handleAddToCalendar = () => {
    // Event details
    const eventTitle = "DOGGIT Expert Dog Training Live Stream"
    const eventDescription = "Join renowned trainers Jayme Nolan and Jo Simpson for an exclusive live stream event on expert dog training techniques.\n\nWHERE TO WATCH:\nhttps://www.facebook.com/doggit.app.7/live_videos/\n\nWhen: September 6, 2025 - Live events at 1:00 PM PST and 3:00 PM PST\nWhat: Expert Dog Training Techniques\nWho: Jayme Nolan & Jo Simpson"
    const eventLocation = "Facebook Live - https://www.facebook.com/doggit.app.7/live_videos/"
    const startDate = new Date('2025-09-06T13:00:00-07:00') // Sept 6, 2025, 1:00 PM PST
    const endDate = new Date('2025-09-06T16:00:00-07:00') // 2 hour event
    
    // Format dates for calendar links
    const formatDateForICS = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    }
    
    // Generate Google Calendar link
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${formatDateForICS(startDate)}/${formatDateForICS(endDate)}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`
    
    // Open in new tab
    window.open(googleCalendarUrl, '_blank')
  }

  const downloadICSFile = () => {
    // Event details
    const eventTitle = "DOGGIT Expert Dog Training Live Stream"
    const eventDescription = "Join renowned trainers Jayme Nolan and Jo Simpson for an exclusive live stream event on expert dog training techniques.\\n\\n📍 WHERE TO WATCH:\\nhttps://www.facebook.com/doggit.app.7/live_videos/\\n\\n⏰ When: September 6, 2025 - Live events at 1:00 PM PST and 3:00 PM PST\\n🎯 What: Expert Dog Training Techniques\\n👥 Who: Jayme Nolan & Jo Simpson"
    const eventLocation = "Facebook Live - https://www.facebook.com/doggit.app.7/live_videos/"
    const startDate = new Date('2025-09-06T14:00:00-07:00')
    const endDate = new Date('2025-09-06T16:00:00-07:00')
    
    // Format date for ICS file
    const formatDateForICS = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    }
    
    // Create ICS file content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DOGGIT//Expert Dog Training//EN
BEGIN:VEVENT
UID:${Date.now()}@doggit.app
DTSTAMP:${formatDateForICS(new Date())}
DTSTART:${formatDateForICS(startDate)}
DTEND:${formatDateForICS(endDate)}
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription}
LOCATION:${eventLocation}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:DOGGIT Live Stream starts in 1 hour!
END:VALARM
END:VEVENT
END:VCALENDAR`
    
    // Create and download the file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'doggit-live-stream.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }


  const handleVideoPreview = (videoId: string) => {
    setSelectedVideoId(videoId)
    setShowSubscriptionPrompt(false) // Reset subscription prompt
    setShowTrailerModal(true)
  }

  const handleSignOut = async () => {
    await signOut()
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
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-20 sm:pb-0">
      {/* Sticky Mobile Subscribe Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-sm sm:hidden">
        <Button 
          size="lg"
          className="w-full bg-queen-purple hover:bg-queen-purple/90 text-white font-semibold py-4 text-lg shadow-2xl"
          onClick={handleGetStarted}
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Subscribe Now
        </Button>
      </div>
      
      {/* Global Parent Header */}
      <GlobalHeader />
      
      {/* Header */}
      <Header 
        variant="landing" 
        isAuthenticated={isAuthenticated}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Hero Section - Live Stream Focus */}
      <section className="relative h-[75vh] max-h-[700px] flex items-center justify-center overflow-hidden bg-black pt-20 sm:pt-24">
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
          <div className="max-w-5xl mx-auto space-y-6 pt-12">
            {/* Live Indicator 
            <div className="inline-flex items-center gap-2 text-queen-purple px-6 py-3">
              <div className="w-2 h-2 bg-queen-purple rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold tracking-wider">Subscribe Now</span>
            </div>*/}
            
            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-none tracking-tight">
                Expert Dog Training
              </h1>
              <h2 className="text-2xl lg:text-4xl font-semibold text-queen-purple">
                Live Stream Event
              </h2>
            </div>
            
            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join renowned trainers <span className="text-white font-semibold">Jayme Nolan</span> and <span className="text-white font-semibold">Jo Simpson</span> for an exclusive live stream.
            </p>
            
            {/* Event Details - White Box */}
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl">
                {/* Compact Countdown Timer */}
                <div className="flex items-center gap-1 sm:gap-3 w-full justify-center overflow-hidden">
                  <div className="px-1 sm:px-4 py-2 sm:py-3 text-center min-w-0 flex-1">
                    <div className="text-3xl sm:text-5xl font-bold text-queen-purple leading-none">{timeLeft.days.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-800 uppercase tracking-wide font-medium mt-1">Days</div>
                  </div>
                  <div className="text-queen-purple text-xl sm:text-3xl font-bold">:</div>
                  <div className="px-1 sm:px-4 py-2 sm:py-3 text-center min-w-0 flex-1">
                    <div className="text-3xl sm:text-5xl font-bold text-queen-purple leading-none">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-800 uppercase tracking-wide font-medium mt-1">Hours</div>
                  </div>
                  <div className="text-queen-purple text-xl sm:text-3xl font-bold">:</div>
                  <div className="px-1 sm:px-4 py-2 sm:py-3 text-center min-w-0 flex-1">
                    <div className="text-3xl sm:text-5xl font-bold text-queen-purple leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-800 uppercase tracking-wide font-medium mt-1">Min</div>
                  </div>
                  <div className="text-queen-purple text-xl sm:text-3xl font-bold">:</div>
                  <div className="px-1 sm:px-4 py-2 sm:py-3 text-center min-w-0 flex-1">
                    <div className="text-3xl sm:text-5xl font-bold text-queen-purple leading-none">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-800 uppercase tracking-wide font-medium mt-1">Sec</div>
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
                  <span className="text-sm font-medium">Live at 1:00 PM & 3:00 PM PST</span>
                </div>
               
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    size="lg" 
                    className="bg-queen-purple hover:bg-queen-purple/90 text-white px-10 py-4 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Save the Date
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={handleAddToCalendar} className="cursor-pointer">
                    <img 
                      src="https://www.google.com/favicon.ico" 
                      alt="Google" 
                      className="w-4 h-4 mr-2"
                    />
                    Google Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadICSFile} className="cursor-pointer">
                    <Calendar className="w-4 h-4 mr-2" />
                    Apple Calendar (.ics)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadICSFile} className="cursor-pointer">
                    <img 
                      src="https://www.microsoft.com/favicon.ico" 
                      alt="Outlook" 
                      className="w-4 h-4 mr-2"
                    />
                    Outlook Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadICSFile} className="cursor-pointer">
                    <Download className="w-4 h-4 mr-2" />
                    Download .ics file
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
      </section>

      {/* Essential Puppy Training Courses */}
      <section id="training" className="py-16 bg-black">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-jade-purple text-white text-xs sm:text-sm px-3 sm:px-4 py-1">
              The Puppy Pack
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Puppy Training Essentials
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-3 px-4 sm:px-0">
            Set your pup up for success with our Puppy Pack collection.

            </p>
            <p className="text-sm sm:text-base text-queen-purple font-semibold px-4 sm:px-0">
              Coming Soon: Training for all dogs - all breeds, mixes, and ages!
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Puppy Basics */}
            <div className="relative group">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <VideoThumbnail
                  videoUrl="https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/videos/1%20Puppy%20Basics%20(version%203%20-%20Brian%20VO)-compressed.mp4"
                  fallbackImage="https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/images/1%20Puppy%20Basics.png?v=3&t=1756419603"
                  videoId="puppy-basics"
                  alt="Cute puppy learning basic training"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  timeOffset={40}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className="mb-3 bg-jade-purple text-white">
                  Foundation
                  </Badge>
                  <h3 className="text-xl font-bold text-white mb-2">
                    PUPPY BASICS
                    
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Master foundation puppy training fundamentals with proven techniques rooted in dog psychology.
                  </p>
                  
                </div>
                
              </div>
            </div>

            {/* Advanced Obedience Commands */}
            <div className="relative group">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <img
                  src="https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/images/2%20Potty%20Training.png"
                  alt="Puppy learning advanced training techniques"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className="mb-3 bg-queen-purple text-white">
                  Training
                  </Badge>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Potty TRAINING
                   
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Take your dog's training to the next level with advanced training techniques.
                  </p>
                  
                </div>
                
              </div>
            </div>

            {/* Leash Training Techniques */}
            <div className="relative group">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <img
                  src="https://vbtucyswugifonwodopp.supabase.co/storage/v1/object/public/images/3%20Leash%20Training.png"
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
                    
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Learn effective leash training techniques for enjoyable walks.
                  </p>
                  
                </div>
                
              </div>
            </div>
          </div>
          
          {/* Watch Teaser and Subscribe Buttons */}
          <div className="text-center mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/90 text-gray-900 border-white hover:bg-white hover:text-gray-900 transition-all font-semibold px-8 py-3"
              onClick={() => handleVideoPreview("puppy-basics")}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch Teaser
            </Button>
            <Button 
              size="lg"
              className="bg-queen-purple hover:bg-queen-purple/90 text-white transition-all font-semibold px-8 py-3"
              onClick={handleGetStarted}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Subscribe Now
            </Button>
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
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
              What's included in your membership?
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
            {/* Special Offer Card - Left Side */}
            <div>
              <Card className="relative overflow-hidden bg-gradient-to-br from-queen-purple to-jade-purple border-purple-500/20 shadow-xl">
                <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 text-sm font-bold">
                  SPECIAL OFFER - Save 90%
                </div>
                <CardContent className="p-6 pt-10 pb-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-3">Get Started Today</h3>
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center gap-2 mb-1">
                        <span className="text-5xl font-bold text-white">$1</span>
                        <span className="text-purple-100 text-lg">first month</span>
                      </div>
                      <div className="text-sm text-purple-100 mb-1">Then $10/month</div>
                      <div className="text-xs text-purple-200">Save 90% on your first month</div>
                    </div>
                    
                    <Button 
                      className="w-full bg-white hover:bg-white/90 text-purple-900 py-4 text-lg font-bold shadow-lg transform transition-all duration-200 hover:scale-105"
                      onClick={handleGetStarted}
                    >
                      Subscribe Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Bullet points - Right Side */}
            <div>
              
              {/* Features List */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white text-lg font-medium">Expert Training Videos</span>
                    <p className="text-gray-400 text-sm mt-1">Access our complete library of professional dog training courses.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white text-lg font-medium">New Content Released Monthly</span>
                    <p className="text-gray-400 text-sm mt-1">Fresh content added regularly to expand your training knowledge.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white text-lg font-medium">Community Support</span>
                    <p className="text-gray-400 text-sm mt-1">Learn alongside other dog owners with guidance from our expert trainers. Plus live chat & AI training support.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-queen-purple flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-white text-lg font-medium">30-Day Money-Back Guarantee</span>
                    <p className="text-gray-400 text-sm mt-1">Try risk-free. Not satisfied? Get a full refund within 30 days.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section 
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
                className="bg-gray-500 text-gray-300 px-8 py-4 text-lg font-semibold cursor-not-allowed"
                disabled
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
      </section>*/}

      {/* Footer */}
      <footer className="bg-jade-purple py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-white text-sm">
              <span>Copyright © 2024 DOGGIT. All rights reserved</span>
              <div className="flex gap-4">
                <a 
                  href="https://doggit.app/terms-of-service" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  Terms & Conditions
                </a>
                <a 
                  href="https://doggit.app/privacy-policy" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/doggitapp" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a 
                href="https://www.instagram.com/doggit.app" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-white" />
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
                        router.push('/membership')
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