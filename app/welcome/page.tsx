"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { PlayCircle, Clock, Award, ChevronRight } from "lucide-react"

const videos = [
  {
    id: "potty-training",
    title: "Potty Training Mastery",
    description: "Master house training in just 2 weeks with proven techniques",
    thumbnail: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800",
    duration: "45 minutes",
    instructor: "Jo Simpson",
    free: true
  },
  {
    id: "stop-jumping",
    title: "Stop Jumping on Humans",
    description: "End unwanted jumping behavior with gentle, effective methods",
    thumbnail: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=800",
    duration: "30 minutes",
    instructor: "Cameron Simpson",
    free: true
  },
  {
    id: "basic-commands",
    title: "Basic Commands & Socialization",
    description: "Build confidence and teach essential commands",
    thumbnail: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=800",
    duration: "60 minutes",
    instructor: "Carley Simpson",
    free: true
  }
]

export default function WelcomePage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserName(user.firstName || "")
      setSelectedGoals(user.trainingGoals || [])
    } else {
      // If no user data, redirect to home
      router.push("/")
    }
  }, [router])

  const handleVideoSelect = (videoId: string) => {
    router.push(`/preview?v=${videoId}&from=welcome`)
  }

  const handleContinueToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-jade-purple/5 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            <Button 
              onClick={handleContinueToDashboard}
              variant="outline"
              className="gap-2"
            >
              Go to Dashboard
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome Hero */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to DOGGIT, {userName}! 🎉
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Your dog training journey starts here. We've selected some free preview videos based on your interests.
          </p>
          
          {selectedGoals.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="text-sm text-gray-600 dark:text-gray-400">Your goals:</span>
              {selectedGoals.map((goal, index) => (
                <Badge key={index} className="bg-jade-purple/10 text-jade-purple border-jade-purple/20">
                  {goal}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Free Preview Videos */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <Badge className="bg-green-500 text-white mb-4">FREE PREVIEWS</Badge>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Start with These Essential Training Videos
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Watch these full-length training videos completely free to get started
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => handleVideoSelect(video.id)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 rounded-full p-4 shadow-xl">
                        <PlayCircle className="h-8 w-8 text-jade-purple" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Free badge */}
                  <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                    FREE
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Award className="h-4 w-4" />
                      <span>{video.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{video.duration}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-jade-purple text-white hover:bg-jade-purple/90">
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-jade-purple to-queen-purple rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Ready for More?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Unlock our complete library of professional dog training videos, live sessions, and personalized training plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-jade-purple hover:bg-gray-100"
              onClick={handleContinueToDashboard}
            >
              Explore All Courses
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/20"
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}