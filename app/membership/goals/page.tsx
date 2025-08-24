"use client"

export const dynamic = 'force-dynamic'

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, Check, Target, Heart, GraduationCap, Shield, Brain, Search, X } from "lucide-react"
import { Logo } from "@/components/logo"
import Image from "next/image"

const trainingGoals = [
  {
    id: "socialization",
    label: "Socialization",
    description: "Help your pup build confidence with other dogs and people",
    icon: Target,
    color: "from-queen-purple to-jade-purple",
    status: "coming-soon",
    priority: "high"
  },
  {
    id: "trust",
    label: "Building Trust", 
    description: "Strengthen the bond between you and your furry friend",
    icon: Heart,
    color: "from-queen-purple to-jade-purple",
    status: "coming-soon",
    priority: "high"
  },
  {
    id: "manners",
    label: "Basic Manners",
    description: "Essential commands and polite behavior (Available: Puppy Basics)",
    icon: GraduationCap,
    color: "from-green-600 to-green-700",
    status: "available",
    priority: "medium"
  },
  {
    id: "anxiety",
    label: "Reducing Anxiety",
    description: "Calm nervousness and build your pup's confidence",
    icon: Brain,
    color: "from-zinc-700 to-zinc-800",
    status: "coming-soon",
    priority: "medium"
  },
  {
    id: "aggression",
    label: "Managing Reactivity",
    description: "Address reactive behaviors with proven techniques",
    icon: Shield,
    color: "from-zinc-700 to-zinc-800",
    status: "coming-soon",
    priority: "low"
  },
  {
    id: "explore",
    label: "Just Exploring",
    description: "Browse all current courses and training videos",
    icon: Search,
    color: "from-blue-600 to-blue-700",
    status: "available",
    priority: "low"
  }
]

function MembershipGoalsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null)

  const fromModal = searchParams.get("from") === "modal"
  const videoId = searchParams.get("video")
  const pupName = searchParams.get("pup") || (typeof window !== 'undefined' ? localStorage.getItem("pupName") : '') || ''

  const toggleGoal = (goalId: string) => {
    if (goalId === "explore") {
      setSelectedGoals(["explore"])
    } else {
      setSelectedGoals(prev => {
        const filtered = prev.filter(g => g !== "explore")
        if (filtered.includes(goalId)) {
          return filtered.filter(g => g !== goalId)
        }
        return [...filtered, goalId]
      })
    }
  }

  const handleContinue = () => {
    // Store goals for later use in dashboard personalization
    if (typeof window !== 'undefined') {
      localStorage.setItem("trainingGoals", JSON.stringify(selectedGoals))
    }
    
    // Continue to payment with same parameters
    router.push(`/payment?from=${fromModal ? 'modal' : 'membership'}&video=${videoId || 'puppy-basics'}`)
  }

  const handleSkip = () => {
    // Continue to payment without storing goals
    router.push(`/payment?from=${fromModal ? 'modal' : 'membership'}&video=${videoId || 'puppy-basics'}`)
  }

  const handleBack = () => {
    router.back()
  }

  const isSelected = (goalId: string) => selectedGoals.includes(goalId)
  const canContinue = selectedGoals.length > 0

  return (
    <div className="min-h-screen bg-black">
      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 h-2">
        <div className="h-full bg-gradient-to-r from-queen-purple to-jade-purple" style={{ width: '50%' }}></div>
      </div>

      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" variant="white" />
            <button
              onClick={handleBack}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            {/* DOGGIT Logo Mark */}
            <div className="w-20 h-20 mx-auto mb-6">
              <Image
                src="/doggit-logo-mark.svg"
                alt="DOGGIT Logo"
                width={80}
                height={73}
                className="brightness-0 invert opacity-90"
              />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              WHAT WOULD YOU LIKE TO WORK ON WITH YOUR PUP?
            </h1>
            <p className="text-xl text-gray-300">
              Help us prioritize what content to create next. We'll notify you when new courses are available!
            </p>
          </div>

          {/* Goals Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {trainingGoals.map((goal) => {
              const Icon = goal.icon
              const selected = isSelected(goal.id)
              const isHovered = hoveredGoal === goal.id
              
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  onMouseEnter={() => setHoveredGoal(goal.id)}
                  onMouseLeave={() => setHoveredGoal(null)}
                  className={`
                    relative p-6 rounded-2xl border-2 transition-all duration-300
                    ${selected 
                      ? 'border-queen-purple bg-gradient-to-br from-queen-purple/20 to-jade-purple/20 scale-105 shadow-xl' 
                      : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/50'
                    }
                  `}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {selected ? (
                      <div className="bg-queen-purple rounded-full p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    ) : goal.status === "available" ? (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Available
                      </span>
                    ) : (
                      <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4
                    ${selected 
                      ? 'bg-gradient-to-br from-queen-purple to-jade-purple' 
                      : 'bg-zinc-800'
                    }
                  `}>
                    <Icon className={`h-8 w-8 ${selected ? 'text-white' : 'text-gray-400'}`} />
                  </div>

                  {/* Content */}
                  <h3 className={`font-bold text-lg mb-2 ${selected ? 'text-white' : 'text-gray-200'}`}>
                    {goal.label}
                  </h3>
                  <p className={`text-sm ${selected ? 'text-gray-200' : 'text-gray-400'}`}>
                    {goal.description}
                  </p>

                  {/* Hover Effect */}
                  {isHovered && !selected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-queen-purple/10 to-jade-purple/10 rounded-2xl pointer-events-none" />
                  )}
                </button>
              )
            })}
          </div>

          {/* What happens next */}
          {selectedGoals.length > 0 && (
            <div className="bg-zinc-900/50 rounded-2xl p-6 mb-8 border border-zinc-800">
              <h3 className="text-white font-semibold mb-3">What happens next:</h3>
              <div className="space-y-2 text-sm text-gray-300">
                {selectedGoals.includes('manners') || selectedGoals.includes('explore') ? (
                  <p>✓ Access current videos that match your interests</p>
                ) : null}
                <p>✓ Get notified when new {selectedGoals.join(' & ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()} courses are released</p>
                <p>✓ Help us prioritize what content to create next</p>
                <p>✓ Receive personalized training tips via email</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              className={`
                px-8 py-6 text-lg font-semibold rounded-xl
                transition-all duration-200 min-w-[200px]
                ${canContinue
                  ? 'bg-queen-purple hover:bg-queen-purple/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {selectedGoals.includes('manners') || selectedGoals.includes('explore') 
                ? 'Continue to Payment' 
                : 'Save & Continue'
              }
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            
            <button 
              onClick={handleSkip}
              className="text-gray-400 hover:text-white transition-colors text-sm underline"
            >
              Skip for now →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MembershipGoalsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-queen-purple/30 border-t-queen-purple rounded-full animate-spin" />
      </div>
    }>
      <MembershipGoalsContent />
    </Suspense>
  )
}