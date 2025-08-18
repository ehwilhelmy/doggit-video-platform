"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ArrowRight, CheckCircle } from "lucide-react"

export default function DemoPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)

  const demoSteps = [
    {
      title: "Welcome to DOGGIT Demo",
      description: "Experience the complete user journey from sign-up to subscription",
      action: "Start Demo",
      duration: 0
    },
    {
      title: "Step 1: User Signs Up",
      description: "New users create an account with basic information",
      action: "Sign Up",
      duration: 2000
    },
    {
      title: "Step 2: Browse Video Library",
      description: "Users see all available training videos on the dashboard",
      action: "View Dashboard",
      duration: 3000
    },
    {
      title: "Step 3: Watch Trailer",
      description: "Users click 'Watch Trailer' to preview content quality",
      action: "Watch Trailer",
      duration: 3000
    },
    {
      title: "Step 4: Subscribe Prompt",
      description: "After watching, users see a compelling subscription offer",
      action: "View Offer",
      duration: 2000
    },
    {
      title: "Step 5: Choose Membership",
      description: "Users select from different membership tiers",
      action: "Select Plan",
      duration: 3000
    },
    {
      title: "Step 6: Complete Payment",
      description: "Secure payment process with pre-filled demo data",
      action: "Process Payment",
      duration: 3000
    },
    {
      title: "Step 7: Access Granted",
      description: "Users get instant access to all training videos",
      action: "View Content",
      duration: 2000
    }
  ]

  const handleStepAction = (step: number) => {
    switch(step) {
      case 0:
        // Start demo
        setIsAutoPlaying(true)
        setCurrentStep(1)
        break
      case 1:
        // Clear any existing data and set up demo user
        localStorage.clear()
        localStorage.setItem("demoMode", "true")
        localStorage.setItem("user", JSON.stringify({
          firstName: "Demo",
          lastName: "User",
          email: "demo@doggit.app",
          isAuthenticated: true
        }))
        setCurrentStep(2)
        break
      case 2:
        // Go to dashboard
        router.push("/dashboard?demo=true")
        break
      case 3:
        // Go to trailer
        router.push("/trailer?v=puppy-basics&from=demo")
        break
      case 4:
        // Continue in trailer (subscription prompt shows automatically)
        setCurrentStep(5)
        break
      case 5:
        // Go to membership
        router.push("/membership?from=demo&video=puppy-basics")
        break
      case 6:
        // Go to payment
        router.push("/payment?from=demo&video=puppy-basics")
        break
      case 7:
        // Complete demo - go to subscribed dashboard
        localStorage.setItem("subscriptionActive", "true")
        localStorage.setItem("paymentCompleted", "true")
        localStorage.setItem("subscriptionPlan", "plus")
        router.push("/dashboard?demo=complete")
        break
      default:
        break
    }
  }

  // Auto-advance through steps if auto-playing
  useEffect(() => {
    if (isAutoPlaying && currentStep > 0 && currentStep < demoSteps.length - 1) {
      const timer = setTimeout(() => {
        handleStepAction(currentStep)
      }, demoSteps[currentStep].duration)
      
      return () => clearTimeout(timer)
    }
  }, [currentStep, isAutoPlaying])

  const resetDemo = () => {
    localStorage.clear()
    setCurrentStep(0)
    setIsAutoPlaying(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Logo size="lg" className="mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">DOGGIT Demo Experience</h1>
          <p className="text-xl text-muted-foreground">
            See the complete user journey from sign-up to subscription
          </p>
        </div>

        {/* Quick Demo Scenarios */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Non-Subscriber Demo */}
            <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-3">
                🚫 Non-Subscriber Experience
              </h2>
              <p className="text-red-600 dark:text-red-400 mb-4 text-sm">
                Shows subscription prompts, limited access, and paywall experience
              </p>
              <Button 
                onClick={() => {
                  localStorage.clear()
                  localStorage.setItem("demoMode", "true")
                  localStorage.setItem("subscriptionActive", "false")
                  localStorage.setItem("paymentCompleted", "false")
                  localStorage.setItem("user", JSON.stringify({
                    firstName: "Demo",
                    lastName: "User",
                    email: "demo@doggit.app",
                    isAuthenticated: true
                  }))
                  router.push("/dashboard")
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Demo Non-Subscriber Flow →
              </Button>
            </div>

            {/* Subscriber Demo */}
            <div className="bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-3">
                ✅ Subscriber Experience
              </h2>
              <p className="text-green-600 dark:text-green-400 mb-4 text-sm">
                Shows full access, no paywalls, and premium features
              </p>
              <Button 
                onClick={() => {
                  localStorage.clear()
                  localStorage.setItem("demoMode", "true")
                  localStorage.setItem("subscriptionActive", "true")
                  localStorage.setItem("paymentCompleted", "true")
                  localStorage.setItem("subscriptionPlan", "plus")
                  localStorage.setItem("user", JSON.stringify({
                    firstName: "Demo",
                    lastName: "Subscriber",
                    email: "subscriber@doggit.app",
                    isAuthenticated: true
                  }))
                  router.push("/dashboard")
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Demo Subscriber Flow →
              </Button>
            </div>
          </div>
        </div>

        {/* Full Demo Controls */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Demo Flow Controller</h2>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={resetDemo}
                  className="gap-2"
                >
                  Reset Demo
                </Button>
                <Button
                  onClick={() => {
                    setIsAutoPlaying(!isAutoPlaying)
                    if (!isAutoPlaying && currentStep === 0) {
                      setCurrentStep(1)
                    }
                  }}
                  className={isAutoPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                >
                  {isAutoPlaying ? "Pause Auto-Play" : "Auto-Play Demo"}
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep} of {demoSteps.length - 1}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / (demoSteps.length - 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-4">
              {demoSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-all ${
                    index === currentStep 
                      ? "bg-primary/10 border-2 border-primary" 
                      : index < currentStep
                      ? "bg-muted/50 opacity-75"
                      : "opacity-50"
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    index < currentStep 
                      ? "bg-green-500 text-white" 
                      : index === currentStep
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    
                    {index === currentStep && (
                      <Button
                        onClick={() => handleStepAction(index)}
                        className="gap-2"
                        size="sm"
                      >
                        {step.action}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Mode Banner */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">🎬 Demo Mode Active</h3>
            <p className="mb-4">
              This demo simulates a new user's complete journey through the DOGGIT platform.
              All data is pre-filled for demonstration purposes.
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div>
                <span className="font-semibold">Demo User:</span> demo@doggit.app
              </div>
              <div>
                <span className="font-semibold">Demo Card:</span> 4242 4242 4242 4242
              </div>
              <div>
                <span className="font-semibold">Demo Plan:</span> Plus ($15/mo)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}