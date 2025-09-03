"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { ArrowLeft, Check, Target, Heart, GraduationCap, Shield, Brain, Search, Save, User } from "lucide-react"
import type { Profile } from "@/types/database"

const trainingGoals = [
  {
    id: "socialization",
    label: "Socialization",
    description: "Help your pup build confidence with other dogs and people",
    icon: Target,
    status: "coming-soon",
    
  },
  {
    id: "trust",
    label: "Building Trust", 
    description: "Strengthen the bond between you and your furry friend",
    icon: Heart,
    status: "coming-soon",
   
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
   
  },
  {
    id: "aggression",
    label: "Managing Reactivity",
    description: "Address reactive behaviors with proven techniques",
    icon: Shield,
    status: "coming-soon",
  
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
  const { user } = useAuth()
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [pupName, setPupName] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Load profile from Supabase if user is logged in
    const loadProfile = async () => {
      if (!user) {
        // Fallback to localStorage if no user
        const storedGoals = JSON.parse(localStorage.getItem("trainingGoals") || "[]")
        const storedPupName = localStorage.getItem("pupName") || ""
        setSelectedGoals(storedGoals)
        setPupName(storedPupName)
        setLoading(false)
        return
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile && !error) {
          setFirstName(profile.first_name || '')
          setLastName(profile.last_name || '')
          setPupName(profile.pup_name || '')
          setPhone(profile.phone || '')
          setSelectedGoals(profile.training_goals || [])
        }
        
        // Also load from localStorage as fallback
        const storedGoals = JSON.parse(localStorage.getItem("trainingGoals") || "[]")
        const storedPupName = localStorage.getItem("pupName") || ""
        if (storedGoals.length > 0 && !profile?.training_goals) {
          setSelectedGoals(storedGoals)
        }
        if (storedPupName && !profile?.pup_name) {
          setPupName(storedPupName)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      }
      
      setLoading(false)
    }

    loadProfile()
  }, [user])

  const toggleGoal = (goalId: string) => {
    const newGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter(g => g !== goalId)
      : [...selectedGoals, goalId]
    
    setSelectedGoals(newGoals)
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!user) {
      // Fallback to localStorage if no user
      localStorage.setItem("trainingGoals", JSON.stringify(selectedGoals))
      localStorage.setItem("pupName", pupName)
      setHasChanges(false)
      router.push("/dashboard?preferences=updated")
      return
    }

    setSaving(true)

    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          pup_name: pupName,
          phone: phone,
          training_goals: selectedGoals
        }, {
          onConflict: 'id'
        })

      if (error) {
        console.error('Error saving profile:', error)
        // Fallback to localStorage
        localStorage.setItem("trainingGoals", JSON.stringify(selectedGoals))
        localStorage.setItem("pupName", pupName)
      }

      setHasChanges(false)
      router.push("/dashboard?preferences=updated")
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
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
                disabled={saving}
                className="bg-queen-purple hover:bg-queen-purple/90 text-white disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile & Preferences</h1>
          <p className="text-gray-400">
            Manage your profile information and training goals for {pupName || 'your pup'}
          </p>
        </div>

        {/* Profile Information Section */}
        {user && (
          <div className="mb-8 p-6 bg-zinc-900 rounded-lg border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                    setHasChanges(true)
                  }}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Your first name"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                    setHasChanges(true)
                  }}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Your last name"
                />
              </div>
              
              <div>
                <Label htmlFor="pupName" className="text-gray-300">Pup's Name</Label>
                <Input
                  id="pupName"
                  value={pupName}
                  onChange={(e) => {
                    setPupName(e.target.value)
                    setHasChanges(true)
                  }}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Your dog's name"
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-gray-300">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    setHasChanges(true)
                  }}
                  className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  placeholder="Your phone number"
                />
              </div>
            </div>
          </div>
        )}

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