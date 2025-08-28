"use client"

import { useEffect, useRef, useState } from 'react'
import Player from '@vimeo/player'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"

interface VimeoPlayerWithRatingProps {
  videoId: string
  title?: string
  className?: string
  onRatingSubmit?: (rating: number, feedback?: string) => void
}

export function VimeoPlayerWithRating({ 
  videoId, 
  title = "Video",
  className = "",
  onRatingSubmit
}: VimeoPlayerWithRatingProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<Player | null>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [hasRated, setHasRated] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    if (!iframeRef.current) return

    // Initialize Vimeo player
    const player = new Player(iframeRef.current)
    playerRef.current = player

    // Check if user has already rated this video
    const checkExistingRating = async () => {
      if (!user) return
      
      const { data } = await supabase
        .from('video_ratings')
        .select('rating')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .single()
      
      if (data) {
        setHasRated(true)
      }
    }
    
    checkExistingRating()

    // Listen for video end event
    player.on('ended', () => {
      if (!hasRated && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true
        setTimeout(() => {
          setShowRatingModal(true)
        }, 500) // Small delay for better UX
      }
    })

    // Listen for video progress to detect near end (95% complete)
    player.on('timeupdate', (data) => {
      if (data.percent > 0.95 && !hasRated && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true
        // Pre-emptively prepare the rating modal
      }
    })

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [videoId, hasRated, user])

  const handleRatingSubmit = async () => {
    if (!user || selectedRating === 0) return
    
    setSubmitting(true)
    
    try {
      // Save rating to database
      const { error } = await supabase
        .from('video_ratings')
        .upsert({
          user_id: user.id,
          video_id: videoId,
          rating: selectedRating,
          feedback: feedback || null,
          video_title: title
        }, {
          onConflict: 'user_id,video_id'
        })
      
      if (!error) {
        setHasRated(true)
        setShowRatingModal(false)
        onRatingSubmit?.(selectedRating, feedback)
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSkipRating = () => {
    setShowRatingModal(false)
    setHasRated(true) // Mark as rated to prevent showing again
  }

  return (
    <>
      <div 
        className={`relative w-full ${className}`}
        style={{ paddingTop: '56.25%' }} // 16:9 aspect ratio
      >
        <iframe
          ref={iframeRef}
          src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0`}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          title={title}
        />
      </div>

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
          <DialogTitle className="text-xl font-bold text-white text-center">
            How was this lesson?
          </DialogTitle>
          
          <div className="space-y-6 pt-4">
            {/* Star Rating */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoveredRating || selectedRating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-zinc-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Rating Text */}
            {selectedRating > 0 && (
              <p className="text-center text-gray-300">
                {selectedRating === 5 && "Excellent! 🌟"}
                {selectedRating === 4 && "Great! 👍"}
                {selectedRating === 3 && "Good 👌"}
                {selectedRating === 2 && "Could be better 🤔"}
                {selectedRating === 1 && "Needs improvement 📝"}
              </p>
            )}

            {/* Optional Feedback */}
            <div>
              <label htmlFor="feedback" className="text-sm text-gray-400 mb-2 block">
                Any feedback? (optional)
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think..."
                className="w-full bg-zinc-800 border-zinc-700 text-white rounded-lg p-3 min-h-[80px] resize-none focus:ring-2 focus:ring-queen-purple focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handleSkipRating}
                className="flex-1 text-gray-400 hover:text-white"
              >
                Skip
              </Button>
              <Button
                onClick={handleRatingSubmit}
                disabled={selectedRating === 0 || submitting}
                className="flex-1 bg-queen-purple hover:bg-queen-purple/90 text-white disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}