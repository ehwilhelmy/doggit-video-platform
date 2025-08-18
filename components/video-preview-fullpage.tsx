"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { X, Play, Clock, CheckCircle, ChevronLeft, Award } from "lucide-react"

interface VideoPreviewFullPageProps {
  open: boolean
  onClose: () => void
  videoTitle: string
  videoDescription?: string
  videoDuration?: string
  instructor?: string
  previewUrl?: string
  thumbnailUrl: string
  onGetStarted?: () => void
}

export function VideoPreviewFullPage({
  open,
  onClose,
  videoTitle,
  videoDescription,
  videoDuration,
  instructor,
  previewUrl,
  thumbnailUrl,
  onGetStarted
}: VideoPreviewFullPageProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <Logo size="sm" variant="white" />
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="h-full flex flex-col lg:flex-row">
        {/* Video Section - Full height */}
        <div className="flex-1 relative bg-black flex items-center justify-center">
          {previewUrl ? (
            <video
              src={previewUrl}
              poster={thumbnailUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <>
              <img
                src={thumbnailUrl}
                alt={videoTitle}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 shadow-2xl hover:bg-white/30 transition-colors cursor-pointer">
                  <Play className="h-16 w-16 text-white" />
                </div>
              </div>
            </>
          )}
          
          {/* Overlay gradient for better text visibility */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-96 bg-white dark:bg-gray-900 overflow-y-auto">
          <div className="p-6 lg:p-8 pt-20 lg:pt-8">
            {/* Title and metadata */}
            <div className="mb-6">
              <Badge className="bg-green-500 text-white mb-4">FREE PREVIEW</Badge>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {videoTitle}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                {instructor && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>{instructor}</span>
                  </div>
                )}
                {videoDuration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{videoDuration}</span>
                  </div>
                )}
              </div>
              
              {videoDescription && (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {videoDescription}
                </p>
              )}
            </div>

            {/* What you'll learn */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                What you'll learn in this video:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Step-by-step training techniques from certified professionals
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Common mistakes to avoid during training
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Tips for maintaining consistency and positive reinforcement
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Real-world examples and demonstrations
                  </span>
                </li>
              </ul>
            </div>

            {/* About the instructor */}
            {instructor && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  About your instructor
                </h3>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      {instructor}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Professional dog trainer with decades of experience in behavioral training and dog psychology.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3 sticky bottom-0 bg-white dark:bg-gray-900 pt-4 pb-2">
              {onGetStarted && (
                <Button
                  onClick={onGetStarted}
                  size="lg"
                  className="w-full bg-jade-purple text-white hover:bg-jade-purple/90"
                >
                  Continue to Full Course
                </Button>
              )}
              
              <Button
                onClick={onClose}
                size="lg"
                variant="outline"
                className="w-full"
              >
                Back to Course Selection
              </Button>
              
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                This is a free preview. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}