"use client"

export const dynamic = 'force-dynamic'

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronRight, Check } from "lucide-react"
import Image from "next/image"

const trainingGoals = [
  {
    id: "socialization",
    label: "Socialization",
    description: "Help your pup interact confidently with others",
    color: "from-amber-400 to-amber-500",
    icon: "🐕‍🦺"
  },
  {
    id: "trust",
    label: "Trust",
    description: "Build a strong bond with your furry friend",
    color: "from-amber-400 to-amber-500",
    icon: "🤝"
  },
  {
    id: "manners",
    label: "Manners",
    description: "Teach polite behavior and basic commands",
    color: "from-gray-200 to-gray-300",
    icon: "🎓"
  },
  {
    id: "anxiety",
    label: "Anxiety",
    description: "Reduce stress and build confidence",
    color: "from-gray-200 to-gray-300",
    icon: "😌"
  },
  {
    id: "aggression",
    label: "Aggression",
    description: "Address reactive behaviors safely",
    color: "from-gray-200 to-gray-300",
    icon: "🛡️"
  },
  {
    id: "none",
    label: "Just Exploring",
    description: "Browse all training options",
    color: "from-gray-200 to-gray-300",
    icon: "👀"
  }
]

function OnboardingGoalsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [currentStep] = useState(3)
  const totalSteps = 3

  const email = searchParams.get("email") || ""
  const pupName = searchParams.get("pup") || ""

  const toggleGoal = (goalId: string) => {
    if (goalId === "none") {
      // If "none" is selected, clear all others and select only "none"
      setSelectedGoals(["none"])
    } else {
      // Remove "none" if it was selected and toggle the clicked goal
      setSelectedGoals(prev => {
        const filtered = prev.filter(g => g !== "none")
        if (filtered.includes(goalId)) {
          return filtered.filter(g => g !== goalId)
        }
        return [...filtered, goalId]
      })
    }
  }

  const handleContinue = () => {
    // Store selected goals
    localStorage.setItem("trainingGoals", JSON.stringify(selectedGoals))
    
    // Navigate to dashboard with personalized experience
    router.push(`/onboarding/welcome?email=${encodeURIComponent(email)}&pup=${encodeURIComponent(pupName)}`)
  }

  const isSelected = (goalId: string) => selectedGoals.includes(goalId)
  const canContinue = selectedGoals.length > 0

  return (
    <div className="min-h-screen bg-black">
      {/* Desktop-responsive container */}
      <div className="max-w-4xl mx-auto px-6 py-8 lg:py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Image
              src="/doggit-logo-mark.svg"
              alt="DOGGIT"
              width={32}
              height={29}
              className="opacity-90"
            />
            <span className="font-bold text-xl">DOGGIT</span>
          </div>
          <button className="text-gray-400 text-sm">
            skip
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-sm text-gray-500">Step {currentStep}/{totalSteps}</span>
        </div>

        {/* Question */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">
            What is your<br />training goal?
          </h1>
          {pupName && (
            <p className="text-gray-500">
              Let's customize {pupName}'s training journey
            </p>
          )}
        </div>

        {/* Goals List */}
        <div className="space-y-3 mb-8">
          {trainingGoals.map((goal) => {
            const selected = isSelected(goal.id)
            const isActive = goal.id === "socialization" || goal.id === "trust"
            
            return (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`
                  w-full p-4 rounded-2xl flex items-center justify-between
                  transition-all duration-200 transform
                  ${selected 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg scale-[1.02]' 
                    : isActive
                      ? 'bg-gray-100 hover:bg-gray-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <div className="text-left">
                    <p className={`font-semibold ${selected ? 'text-white' : 'text-gray-900'}`}>
                      {goal.label}
                    </p>
                    {selected && (
                      <p className="text-sm text-white/90 mt-0.5">
                        {goal.description}
                      </p>
                    )}
                  </div>
                </div>
                {selected && (
                  <div className="bg-white rounded-full p-1">
                    <Check className="h-4 w-4 text-amber-500" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`
            w-full py-6 text-lg font-semibold rounded-2xl
            transition-all duration-200
            ${canContinue
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Continue
        </Button>

        {/* Helper text */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Select all that apply • You can change this later
        </p>
      </div>
    </div>
  )
}

export default function OnboardingGoalsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    }>
      <OnboardingGoalsContent />
    </Suspense>
  )
}