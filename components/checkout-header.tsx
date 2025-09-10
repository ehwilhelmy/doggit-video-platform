"use client"

import React from "react"
import { Logo } from "@/components/logo"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

interface CheckoutHeaderProps {
  currentStep: 'membership' | 'account' | 'payment'
  onClose?: () => void
}

export function CheckoutHeader({ currentStep, onClose }: CheckoutHeaderProps) {
  const router = useRouter()
  
  const handleClose = () => {
    if (onClose) {
      onClose()
    } else {
      router.push('/')
    }
  }

  const steps = [
    { id: 'membership', label: 'Membership' },
    { id: 'account', label: 'Account' },
    { id: 'payment', label: 'Payment' }
  ]

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <header className="bg-black border-b border-zinc-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo size="sm" variant="white" />
          
          {/* Progress Steps - Desktop */}
          <div className="hidden md:flex items-center">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep
              const isCompleted = index < currentStepIndex
              
              return (
                <React.Fragment key={step.id}>
                  {/* Line before step (except for first) */}
                  {index > 0 && (
                    <div 
                      className={`h-[2px] w-16 transition-colors ${
                        isCompleted || isActive
                          ? 'bg-queen-purple' 
                          : 'bg-zinc-700'
                      }`}
                    />
                  )}
                  
                  {/* Step Label */}
                  <span 
                    className={`text-sm font-medium transition-colors px-2 ${
                      isActive 
                        ? 'text-white' 
                        : isCompleted 
                        ? 'text-queen-purple' 
                        : 'text-zinc-500'
                    }`}
                  >
                    {step.label}
                  </span>
                  
                  {/* Line after step (except for last) */}
                  {index < steps.length - 1 && (
                    <div 
                      className={`h-[2px] w-16 transition-colors ${
                        isCompleted 
                          ? 'bg-queen-purple' 
                          : 'bg-zinc-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* Progress Steps - Mobile (Simplified) */}
          <div className="flex md:hidden items-center gap-2 text-sm">
            <span className="text-queen-purple font-medium">
              Step {currentStepIndex + 1}
            </span>
            <span className="text-zinc-500">
              of {steps.length}
            </span>
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>
      
      {/* Progress Bar - Full Width */}
      <div className="h-[2px] bg-zinc-800">
        <div 
          className="h-full bg-gradient-to-r from-queen-purple to-jade-purple transition-all duration-500"
          style={{ 
            width: `${((currentStepIndex + 1) / steps.length) * 100}%` 
          }}
        />
      </div>
    </header>
  )
}