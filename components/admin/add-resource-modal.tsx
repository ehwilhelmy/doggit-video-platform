"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { Loader2, X } from "lucide-react"

interface AddResourceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddResourceModal({ open, onOpenChange, onSuccess }: AddResourceModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingImage, setIsFetchingImage] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    url: "",
    published_date: new Date().toISOString().split('T')[0],
    tags: "",
    is_published: true
  })

  // Fetch image and tags from URL when URL changes
  const handleUrlChange = async (url: string) => {
    setFormData({ ...formData, url })

    // Only fetch if URL looks valid
    if (url && url.startsWith('http')) {
      setIsFetchingImage(true)
      try {
        const response = await fetch(`/api/fetch-og-image?url=${encodeURIComponent(url)}`)
        if (response.ok) {
          const data = await response.json()
          const updates: any = {}

          // Only update image_url if it's currently empty
          if (data.imageUrl && !formData.image_url) {
            updates.image_url = data.imageUrl
          }

          // Only update tags if they're currently empty
          if (data.tags && data.tags.length > 0 && !formData.tags) {
            updates.tags = data.tags.join(', ')
          }

          // Only update published_date if it's currently the default (today's date)
          if (data.publishedDate) {
            const today = new Date().toISOString().split('T')[0]
            if (formData.published_date === today) {
              updates.published_date = data.publishedDate
            }
          }

          if (Object.keys(updates).length > 0) {
            setFormData(prev => ({ ...prev, ...updates }))
          }
        }
      } catch (error) {
        console.error('Error fetching metadata:', error)
      } finally {
        setIsFetchingImage(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Not authenticated')
      }

      // Convert comma-separated tags to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const response = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create resource')
      }

      // Reset form and close modal
      setFormData({
        title: "",
        description: "",
        image_url: "",
        url: "",
        published_date: new Date().toISOString().split('T')[0],
        tags: "",
        is_published: true
      })
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error('Error creating resource:', error)
      alert('Failed to create resource')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Mythbusters! True Or False?"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the resource"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="url">Article URL *</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://resources.doggit.app/..."
              required
            />
          </div>

          <div>
            <Label htmlFor="image_url">Image URL {isFetchingImage && <span className="text-xs text-gray-500">(fetching...)</span>}</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://... (auto-filled from article URL)"
              disabled={isFetchingImage}
            />
            <p className="text-xs text-gray-500 mt-1">Will be automatically fetched from the article URL if available</p>
          </div>

          <div>
            <Label htmlFor="published_date">Published Date</Label>
            <Input
              id="published_date"
              type="date"
              value={formData.published_date}
              onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Auto-filled from article or defaults to today</p>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Dog's Health, Puppy Guide, Tips & Tricks"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-filled from article or enter manually (comma separated)</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
            />
            <Label htmlFor="is_published">Published</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-jade-purple hover:bg-jade-purple/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Resource'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
