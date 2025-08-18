import { useState, useEffect } from 'react'

export function useVideoDuration(videoUrl: string) {
  const [duration, setDuration] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!videoUrl) {
      setLoading(false)
      return
    }

    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = function() {
      const totalSeconds = Math.floor(video.duration)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      
      // Format as "MM:SS" for exact time
      const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`
      setDuration(formattedTime)
      setLoading(false)
    }

    video.onerror = function() {
      setDuration('--:--')
      setLoading(false)
    }

    video.src = videoUrl

    return () => {
      video.src = ''
    }
  }, [videoUrl])

  return { duration, loading }
}