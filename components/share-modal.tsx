"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share2, Users, Heart } from "lucide-react"

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  videoTitle: string
}

export function ShareModal({ open, onOpenChange, videoTitle }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://training.doggit.app')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleSubscribe = () => {
    onOpenChange(false)
    window.location.href = '/membership'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Training Video
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Share DOGGIT Training</h3>
            <p className="text-gray-300 text-sm">
              Help fellow dog owners discover expert training techniques!
            </p>
          </div>

          <div className="bg-zinc-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3 text-queen-purple">
              <Users className="h-5 w-5" />
              <span className="font-medium">Spread the Love!</span>
            </div>
            <p className="text-gray-300 text-sm">
              Share our platform with dog owners who want professional training guidance.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleCopyLink}
              className="w-full bg-queen-purple hover:bg-queen-purple/90 text-white font-medium"
            >
              {copied ? 'Link Copied!' : 'Copy training.doggit.app'}
            </Button>
            
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Heart className="h-3 w-3" />
              <span>Sharing helps more people discover great dog training</span>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}