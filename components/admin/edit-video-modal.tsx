"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Video {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: string
  vimeo_id?: string
  thumbnail_url?: string
  duration: string
  is_featured: boolean
}

interface EditVideoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  video: Video | null
}

export function EditVideoModal({ open, onOpenChange, onSuccess, video }: EditVideoModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "Puppy Training",
    level: "Beginner",
    vimeo_id: "",
    thumbnail_url: "",
    duration: "",
    is_featured: false
  })

  // Update form data when video changes
  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title,
        description: video.description || "",
        instructor: video.instructor || "",
        category: video.category || "Puppy Training",
        level: video.level || "Beginner",
        vimeo_id: video.vimeo_id || "",
        thumbnail_url: video.thumbnail_url || "",
        duration: video.duration || "",
        is_featured: video.is_featured || false
      })
    }
  }, [video])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!video) return

    setIsLoading(true)

    try {
      // Get session token for authentication
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`/api/admin/videos/${video.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update video')
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating video:', error)
      alert('Failed to update video')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="e.g., 15:30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Puppy Training">Puppy Training</SelectItem>
                  <SelectItem value="Obedience">Obedience</SelectItem>
                  <SelectItem value="Walking">Walking</SelectItem>
                  <SelectItem value="Behavior">Behavior</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="vimeo_id">Vimeo Video ID *</Label>
            <Input
              id="vimeo_id"
              value={formData.vimeo_id}
              onChange={(e) => setFormData({ ...formData, vimeo_id: e.target.value })}
              required
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="e.g., 1114969488"
            />
          </div>

          <div>
            <Label htmlFor="thumbnail_url">Thumbnail URL (optional)</Label>
            <Input
              id="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
            />
            <Label htmlFor="is_featured">Featured Video</Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-queen-purple hover:bg-queen-purple/90">
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Video
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
