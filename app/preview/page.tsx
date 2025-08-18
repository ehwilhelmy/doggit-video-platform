"use client"

export const dynamic = 'force-dynamic'

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { X, Play, Clock, Award } from "lucide-react"

const videosData = {
  "puppy-basics": {
    title: "Puppy Basics",
    description: "Master essential puppy training fundamentals with proven techniques from expert trainer Brian. Learn the foundation skills every new puppy owner needs to know.",
    thumbnail: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=1200&h=800&fit=crop",
    duration: "15 minutes",
    instructor: "Brian",
    videoUrl: "/videos/puppy-basics-brian.mp4",
    free: true
  },
  "potty-training": {
    title: "Potty Training Mastery",
    description: "Master house training in just 2 weeks with proven techniques from our expert trainers. Learn the schedule, signals, and positive reinforcement methods that work.",
    thumbnail: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=1200",
    duration: "45 minutes",
    instructor: "Jo Simpson"
  },
  "stop-jumping": {
    title: "Stop Jumping on Humans",
    description: "End unwanted jumping behavior with gentle, effective methods. Learn how to redirect your puppy's energy and teach proper greetings.",
    thumbnail: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=1200",
    duration: "30 minutes",
    instructor: "Cameron Simpson"
  },
  "basic-commands": {
    title: "Basic Commands & Socialization",
    description: "Build confidence and teach essential commands like sit, stay, come, and proper socialization with other dogs and people.",
    thumbnail: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=1200",
    duration: "60 minutes",
    instructor: "Carley Simpson"
  }
}

function PreviewPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const videoId = searchParams.get("v") || "puppy-basics"
  const from = searchParams.get("from") || "welcome"
  
  const video = videosData[videoId as keyof typeof videosData] || videosData["puppy-basics"]

  const handleBack = () => {
    if (from === "landing") {
      router.push("/")
    } else {
      router.push("/welcome")
    }
  }

  const handleWatchTrailer = () => {
    router.push(`/watch?v=${videoId}&from=${from}`)
  }

  const handleFinishSignUp = () => {
    router.push("/membership")
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Logo size="sm" variant="white" />
            
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-88px)]">
        {/* Left Side - Hero Image */}
        <div className="w-1/2 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(64, 224, 208, 0.8), rgba(0, 191, 255, 0.8)), url(${video.thumbnail})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-400/90 to-blue-500/90" />
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="text-center">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-64 h-64 rounded-full object-cover mx-auto mb-8 shadow-2xl border-8 border-white/20"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Course Information */}
        <div className="w-1/2 bg-black text-white flex flex-col justify-center p-16">
          <div className="max-w-lg">
            {/* Free Badge */}
            {video.free && (
              <Badge className="mb-4 bg-green-500 text-white px-3 py-1 text-sm">
                FREE
              </Badge>
            )}
            
            {/* Course Title */}
            <h1 className="text-5xl font-bold tracking-wider mb-8 text-white">
              {video.title.toUpperCase()}
            </h1>
            
            {/* Subtitle */}
            <h2 className="text-xl font-light mb-8 text-gray-300">
              {video.description}
            </h2>

            {/* Meta Info */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{video.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{video.duration}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed mb-12 text-lg">
              Master the essential skills every new puppy owner needs with proven techniques from expert trainer Brian. 
              This comprehensive guide covers house training, basic commands, and proper socialization methods.
            </p>

            {/* CTA Button */}
            {video.free ? (
              <Button
                onClick={handleWatchTrailer}
                className="w-full bg-primary hover:bg-primary/90 text-white py-4 px-8 text-lg font-semibold rounded-lg mb-8"
              >
                Watch Free Video
              </Button>
            ) : (
              <Button
                onClick={handleFinishSignUp}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 px-8 text-lg font-semibold rounded-lg mb-8"
              >
                Finish Sign Up
              </Button>
            )}

            {/* Pricing Info */}
            {!video.free && (
              <p className="text-sm text-gray-400 text-center mb-12">
                Starting at $10/month (billed annually) for all classes. 30-day money back guaranteed.
              </p>
            )}

            {/* Action Buttons Row */}
            <div className="flex items-center justify-center gap-12">
              <button
                onClick={handleWatchTrailer}
                className="flex flex-col items-center gap-2 text-white hover:text-gray-300 transition-colors"
              >
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6" />
                </div>
                <span className="text-sm">Trailer</span>
              </button>

              <button className="flex flex-col items-center gap-2 text-white hover:text-gray-300 transition-colors">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-sm">Sample</span>
              </button>

              <button className="flex flex-col items-center gap-2 text-white hover:text-gray-300 transition-colors">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <PreviewPageContent />
    </Suspense>
  )
}