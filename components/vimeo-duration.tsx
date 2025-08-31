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
        try {
          const { duration: cachedDuration, timestamp } = JSON.parse(cached)
          // Use cache if less than 24 hours old and valid
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000 && 
              cachedDuration && 
              cachedDuration !== 'NaN:NaN') {
            setDuration(cachedDuration)
            return
          } else {
            // Clear invalid cache
            localStorage.removeItem(cacheKey)
          }
        } catch (e) {
          // Clear corrupted cache
          localStorage.removeItem(cacheKey)
        }
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/vimeo-info?id=${vimeoId}`)
        if (response.ok) {
          const data = await response.json()
          // Use formatted duration if available, otherwise use fallback
          const formattedDuration = data.formattedDuration || fallbackDuration
          
          // Only update if we got a valid duration
          if (formattedDuration && formattedDuration !== 'NaN:NaN') {
            setDuration(formattedDuration)
            
            // Cache the duration
            localStorage.setItem(cacheKey, JSON.stringify({
              duration: formattedDuration,
              timestamp: Date.now()
            }))
          } else {
            // Use fallback if API didn't return valid duration
            setDuration(fallbackDuration)
          }
        } else {
          // API error, use fallback
          setDuration(fallbackDuration)
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