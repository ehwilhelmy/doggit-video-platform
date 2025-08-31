"use client"

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

interface VimeoDurationProps {
  vimeoId?: string
  fallbackDuration?: string
  showIcon?: boolean
  className?: string
}

export function VimeoDuration({ 
  vimeoId, 
  fallbackDuration = "0:00",
  showIcon = true,
  className = ""
}: VimeoDurationProps) {
  const [duration, setDuration] = useState(fallbackDuration)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!vimeoId) {
      setDuration(fallbackDuration)
      return
    }

    const fetchDuration = async () => {
      // Check if we have cached duration
      const cacheKey = `vimeo-duration-${vimeoId}`
      const cached = localStorage.getItem(cacheKey)
      
      if (cached) {
        const { duration: cachedDuration, timestamp } = JSON.parse(cached)
        // Use cache if less than 24 hours old
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setDuration(cachedDuration)
          return
        }
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/vimeo-info?id=${vimeoId}`)
        if (response.ok) {
          const data = await response.json()
          const formattedDuration = data.formattedDuration || fallbackDuration
          setDuration(formattedDuration)
          
          // Cache the duration
          localStorage.setItem(cacheKey, JSON.stringify({
            duration: formattedDuration,
            timestamp: Date.now()
          }))
        }
      } catch (error) {
        console.error('Failed to fetch Vimeo duration:', error)
        setDuration(fallbackDuration)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDuration()
  }, [vimeoId, fallbackDuration])

  if (isLoading) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {showIcon && <Clock className="h-4 w-4" />}
        <span className="animate-pulse">...</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showIcon && <Clock className="h-4 w-4" />}
      <span>{duration}</span>
    </div>
  )
}