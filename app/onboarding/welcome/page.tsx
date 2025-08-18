"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Clock, BarChart3, User, Play, Star, Trophy, Target } from "lucide-react"
import Image from "next/image"

function OnboardingWelcomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userName, setUserName] = useState("")
  const [pupName, setPupName] = useState("")
  const [progress, setProgress] = useState(0)
  const [currentCourse, setCurrentCourse] = useState({
    title: "Building Trust",
    chapter: "Ch3: Elementary",
    progress: 83,
    thumbnail: "/videos/puppy-basics-thumb.jpg"
  })

  useEffect(() => {
    const pup = searchParams.get("pup") || localStorage.getItem("pupName") || "your pup"
    const email = searchParams.get("email") || localStorage.getItem("userEmail") || ""
    const name = email.split("@")[0] || "Friend"
    
    setPupName(pup)
    setUserName(name)
    
    // Animate progress
    setTimeout(() => setProgress(83), 500)
  }, [searchParams])

  const achievements = [
    { id: 1, name: "First Steps", icon: "🐾", unlocked: true },
    { id: 2, name: "Good Boy!", icon: "⭐", unlocked: true },
    { id: 3, name: "Trust Builder", icon: "💙", unlocked: false },
    { id: 4, name: "Social Star", icon: "🌟", unlocked: false },
  ]

  const courses = [
    {
      id: "health-wellness",
      title: "Health and Wellness: expert advice",
      instructor: "Dr. Allison Parker",
      duration: "25 min",
      thumbnail: "🏥",
      progress: 0,
      isNew: true
    },
    {
      id: "recall-pro",
      title: "Recall Training Pro",
      instructor: "Dr. John Smith",
      duration: "30 min",
      thumbnail: "🎯",
      progress: 45,
      isNew: false
    }
  ]

  const handleStartTraining = () => {
    router.push("/watch?v=puppy-basics&from=onboarding")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      {/* Mobile-first container */}
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 pt-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-500 text-sm">Hi {userName}! 👋</p>
              <h1 className="text-2xl font-bold">
                Ready<br />for learning?
              </h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Today's goal</p>
              <p className="text-lg font-bold">15 min</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-6 border-b border-gray-200">
            <button className="pb-3 font-semibold border-b-2 border-black">
              Courses
            </button>
            <button className="pb-3 text-gray-400">
              Tutors
            </button>
            <button className="pb-3 text-gray-400 flex items-center gap-1">
              Awards
              <span className="bg-gray-200 text-xs px-1.5 py-0.5 rounded-full">3</span>
            </button>
          </div>
        </div>

        {/* Current Progress Card */}
        <div className="px-6 py-4">
          <div className="relative">
            {/* Progress Ring */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl p-8 shadow-sm">
              <div className="flex flex-col items-center">
                {/* Circular Progress */}
                <div className="relative w-48 h-48 mb-4">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold text-gray-900">{progress}%</p>
                    <p className="text-gray-500 mt-2">Building Trust</p>
                    <p className="text-sm text-gray-400">[{currentCourse.chapter}]</p>
                  </div>
                </div>

                {/* Progress Details */}
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-3">/{pupName}'s progress: {progress}%</p>
                  <Button
                    onClick={handleStartTraining}
                    className="bg-black hover:bg-gray-800 text-white px-8 py-2 rounded-full flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Achievements</h3>
            <button className="text-sm text-blue-500">See all</button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex-shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center
                  ${achievement.unlocked 
                    ? 'bg-gradient-to-br from-amber-100 to-amber-50 shadow-sm' 
                    : 'bg-gray-100 opacity-50'
                  }
                `}
              >
                <span className="text-2xl mb-1">{achievement.icon}</span>
                <p className="text-xs text-center px-1">{achievement.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* More for You Section */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">More for {pupName}:</h3>
            <button className="text-sm text-blue-500">→</button>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
              >
                <div className={`
                  w-16 h-16 rounded-xl flex items-center justify-center
                  ${course.id === 'health-wellness' 
                    ? 'bg-gradient-to-br from-green-100 to-green-50' 
                    : 'bg-gradient-to-br from-amber-100 to-amber-50'
                  }
                `}>
                  <span className="text-2xl">{course.thumbnail}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-2">{course.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{course.instructor}</p>
                    </div>
                    {course.isNew && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{course.duration}</span>
                    </div>
                    {course.progress > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{course.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button className="p-2">
                  <Play className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="max-w-md mx-auto px-6 py-3">
            <div className="flex items-center justify-around">
              <button className="flex flex-col items-center gap-1 text-black">
                <Home className="h-5 w-5" />
                <span className="text-xs">Home</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-gray-400">
                <Clock className="h-5 w-5" />
                <span className="text-xs">Schedule</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-gray-400">
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs">Progress</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-gray-400">
                <User className="h-5 w-5" />
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingWelcomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    }>
      <OnboardingWelcomeContent />
    </Suspense>
  )
}