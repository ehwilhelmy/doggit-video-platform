"use client"

import { useVideoDuration } from '@/hooks/useVideoDuration'
import { Clock } from 'lucide-react'

interface VideoDurationProps {
  videoUrl?: string
  fallbackDuration?: string
  showIcon?: boolean
  className?: string
}

export function VideoDuration({ 
  videoUrl, 
  fallbackDuration = '--:--',
  showIcon = true,
  className = ''
}: VideoDurationProps) {
  const { duration, loading } = useVideoDuration(videoUrl || '')

  const displayDuration = loading ? fallbackDuration : (duration || fallbackDuration)

  if (showIcon) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Clock className="h-4 w-4" />
        <span>{displayDuration}</span>
      </div>
    )
  }

  return <span className={className}>{displayDuration}</span>
}