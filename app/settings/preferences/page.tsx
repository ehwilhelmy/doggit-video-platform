"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ArrowLeft, Check, Target, Heart, GraduationCap, Shield, Brain, Search, Bell, Mail } from "lucide-react"

const trainingGoals = [
  {
    id: "socialization",
    label: "Socialization",
    description: "Help your pup build confidence with other dogs and people",
    icon: Target,
    status: "coming-soon",
    estimatedRelease: "Q1 2025"
  },
  {
    id: "trust",
    label: "Building Trust", 
    description: "Strengthen the bond between you and your furry friend",
    icon: Heart,
    status: "coming-soon",
    estimatedRelease: "Q1 2025"
  },
  {
    id: "manners",
    label: "Basic Manners",
    description: "Essential commands and polite behavior (Available: Puppy Basics)",
    icon: GraduationCap,
    status: "available"
  },
  {
    id: "anxiety",
    label: "Reducing Anxiety",
    description: "Calm nervousness and build your pup's confidence",
    icon: Brain,
    status: "coming-soon",
    estimatedRelease: "Q2 2025"
  },
  {
    id: "aggression",
    label: "Managing Reactivity",
    description: "Address reactive behaviors with proven techniques",
    icon: Shield,
    status: "coming-soon",
    estimatedRelease: "Q2 2025"
  },
  {
    id: "explore",
    label: "Just Exploring",
    description: "Browse all current courses and training videos",
    icon: Search,
    status: "available"
  }
]

function PreferencesContent() {
  const router = useRouter()
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [pupName, setPupName] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Load current preferences
    const storedGoals = JSON.parse(localStorage.getItem("trainingGoals") || "[]")
    const storedPupName = localStorage.getItem("pupName") || ""
    setSelectedGoals(storedGoals)
    setPupName(storedPupName)
  }, [])

  const toggleGoal = (goalId: string) => {
    const newGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter(g => g !== goalId)
      : [...selectedGoals, goalId]
    
    setSelectedGoals(newGoals)
    setHasChanges(true)
  }

  const handleSave = () => {
    localStorage.setItem("trainingGoals", JSON.stringify(selectedGoals))
    setHasChanges(false)
    
    // Show success message (could be a toast)
    router.push("/dashboard?preferences=updated")
  }

  const handleBack = () => {
    if (hasChanges) {
      const confirm = window.confirm("You have unsaved changes. Are you sure you want to leave?")
      if (!confirm) return
    }
    router.back()
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
              <Logo size="sm" variant="white" />
            </div>
            
            {hasChanges && (
              <Button
                onClick={handleSave}
                className="bg-queen-purple hover:bg-queen-purple/90 text-white"
              >
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Training Preferences</h1>
          <p className="text-gray-400">
            Manage your training goals and notification preferences for {pupName || 'your pup'}
          </p>
        </div>

        {/* Training Goals Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Training Goals</h2>
          <p className="text-gray-400 mb-6">
            Select the areas you'd like to work on. We'll notify you when new courses are available and prioritize content creation based on your interests.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainingGoals.map((goal) => {
              const Icon = goal.icon
              const isSelected = selectedGoals.includes(goal.id)
              
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`
                    relative p-6 rounded-2xl border-2 transition-all duration-300
                    ${isSelected 
                      ? 'border-queen-purple bg-gradient-to-br from-queen-purple/20 to-jade-purple/20 scale-105 shadow-xl' 
                      : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/50'
                    }
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4
                    ${isSelected 
                      ? 'bg-gradient-to-br from-queen-purple to-jade-purple' 
                      : 'bg-zinc-800'
                    }
                  `}>
                    <Icon className={`h-8 w-8 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                  </div>

                  {/* Content */}
                  <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {goal.label}
                  </h3>
                  <p className={`text-sm mb-4 ${isSelected ? 'text-gray-200' : 'text-gray-400'}`}>
                    {goal.description}
                  </p>

                  {/* Status Badge at bottom */}
                  <div className="flex justify-center">
                    {isSelected ? (
                      <div className="bg-queen-purple rounded-full p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    ) : goal.status === "available" ? (
                      <span className="bg-zinc-800 text-green-400 text-xs px-3 py-1 rounded-full font-medium border border-zinc-700">
                        Available
                      </span>
                    ) : (
                      <span className="bg-zinc-800 text-amber-400 text-xs px-3 py-1 rounded-full font-medium border border-zinc-700">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Expected Release Date */}
                  {goal.estimatedRelease && (
                    <p className="text-xs text-amber-400 mt-2 text-center">
                      Expected: {goal.estimatedRelease}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-white">Email Notifications</h3>
                  <p className="text-sm text-gray-400">Get notified when new courses matching your goals are released</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEmailNotifications(!emailNotifications)
                  setHasChanges(true)
                }}
                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${emailNotifications ? 'bg-queen-purple' : 'bg-zinc-700'}
                `}
              >
                <div className={`
                  absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${emailNotifications ? 'translate-x-6' : 'translate-x-0.5'}
                `} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-white">Push Notifications</h3>
                  <p className="text-sm text-gray-400">Get browser notifications for training reminders and updates</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPushNotifications(!pushNotifications)
                  setHasChanges(true)
                }}
                className={`
                  relative w-12 h-6 rounded-full transition-colors
                  ${pushNotifications ? 'bg-queen-purple' : 'bg-zinc-700'}
                `}
              >
                <div className={`
                  absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${pushNotifications ? 'translate-x-6' : 'translate-x-0.5'}
                `} />
              </button>
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        {selectedGoals.length > 0 && (
          <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
            <h3 className="font-semibold text-white mb-3">Your Impact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>✓ You've selected {selectedGoals.length} training {selectedGoals.length === 1 ? 'area' : 'areas'}</p>
              <p>✓ Your preferences help us prioritize content creation</p>
              <p>✓ You'll be among the first to know when new courses are ready</p>
              {selectedGoals.filter(g => !['manners', 'explore'].includes(g)).length > 0 && (
                <p>✓ We're actively working on {selectedGoals.filter(g => !['manners', 'explore'].includes(g)).join(', ').replace(/,([^,]*)$/, ' and$1')} content</p>
              )}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`
              px-6 py-3 font-semibold
              ${hasChanges
                ? 'bg-queen-purple hover:bg-queen-purple/90 text-white'
                : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PreferencesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-queen-purple/30 border-t-queen-purple rounded-full animate-spin" />
      </div>
    }>
      <PreferencesContent />
    </Suspense>
  )
}