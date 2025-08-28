"use client"

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface VideoRatingDisplayProps {
  videoId: string
  showCount?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function VideoRatingDisplay({ 
  videoId, 
  showCount = true,
  size = 'sm',
  className = ""
}: VideoRatingDisplayProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_video_rating_stats', { p_video_id: videoId })
          .single()

        if (data && !error) {
          setRating(data.average_rating)
          setCount(data.total_ratings)
        }
      } catch (error) {
        console.error('Error fetching ratings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRatings()
  }, [videoId])

  if (loading || !rating) {
    return null // Don't show anything if no ratings yet
  }

  const starSize = size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-4 w-4' : 'h-3 w-3'
  const textSize = size === 'lg' ? 'text-base' : size === 'md' ? 'text-sm' : 'text-xs'

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(rating) 
                ? 'fill-yellow-500 text-yellow-500' 
                : 'text-zinc-600'
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className={`text-gray-400 ${textSize} ml-1`}>
          {rating.toFixed(1)} ({count})
        </span>
      )}
    </div>
  )
}