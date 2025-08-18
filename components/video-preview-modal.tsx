"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Play, Clock, CheckCircle } from "lucide-react"

interface VideoPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  videoTitle: string
  videoDescription?: string
  videoDuration?: string
  previewUrl?: string
  thumbnailUrl: string
  onGetStarted?: () => void
}

export function VideoPreviewModal({
  open,
  onOpenChange,
  videoTitle,
  videoDescription,
  videoDuration,
  previewUrl,
  thumbnailUrl,
  onGetStarted
}: VideoPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          {/* Video/Image preview */}
          <div className="relative aspect-video bg-black">
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
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-6 shadow-2xl">
                    <Play className="h-12 w-12 text-jade-purple" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-6 bg-white dark:bg-gray-900">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {videoTitle}
                </h2>
                {videoDuration && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <Clock className="h-4 w-4" />
                    <span>{videoDuration}</span>
                  </div>
                )}
                {videoDescription && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {videoDescription}
                  </p>
                )}
              </div>
            </div>

            {/* What's included */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                What you'll learn:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Step-by-step training techniques from certified professionals
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Common mistakes to avoid during training
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Tips for maintaining consistency and positive reinforcement
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="flex-1 bg-jade-purple text-white hover:bg-jade-purple/90"
              >
                Get Started - Watch Full Video
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                size="lg"
                variant="outline"
                className="flex-1"
              >
                Back to Browse
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              * No credit card needed. Free trial available.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}