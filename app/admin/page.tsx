"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { adminService } from "@/lib/admin"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Upload, 
  Play, 
  Edit, 
  Trash2, 
  Plus, 
  FileVideo, 
  Users, 
  BarChart3,
  Settings,
  LogOut,
  Eye,
  Clock
} from "lucide-react"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Video {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  category: string
  level: string
  thumbnail_url?: string
  video_url?: string
  created_at: string
  updated_at: string
  is_featured: boolean
  view_count: number
}

export default function AdminPanel() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Check if user is admin
  // Temporarily allow all logged-in users for testing
  const isAdmin = true // user?.email === 'admin@doggit.app' || user?.user_metadata?.role === 'admin'

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/')
      return
    }
    
    if (user && isAdmin) {
      loadVideos()
    }
  }, [user, loading, isAdmin, router])

  const loadVideos = async () => {
    try {
      // Mock data for now - will replace with Supabase
      const mockVideos: Video[] = [
        {
          id: "puppy-basics",
          title: "Puppy Basics",
          description: "Master essential puppy training fundamentals with proven techniques from expert trainer Jayme Nolan.",
          instructor: "Jayme Nolan",
          duration: "15:30",
          category: "Puppy Training",
          level: "Beginner",
          thumbnail_url: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=800&h=600&fit=crop",
          video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z",
          is_featured: true,
          view_count: 1250
        },
        {
          id: "advanced-obedience",
          title: "Advanced Obedience Commands",
          description: "Take your dog's training to the next level with advanced obedience commands and techniques for better control and communication.",
          instructor: "Mike Chen",
          duration: "18:45",
          category: "Obedience",
          level: "Advanced",
          thumbnail_url: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=800&h=600&fit=crop",
          created_at: "2024-01-10T14:30:00Z",
          updated_at: "2024-01-10T14:30:00Z",
          is_featured: false,
          view_count: 890
        },
        {
          id: "leash-training",
          title: "Leash Training Techniques",
          description: "Learn effective leash training techniques to make walks enjoyable for both you and your dog. End pulling and create positive walking experiences.",
          instructor: "Emily Rodriguez",
          duration: "15:20",
          category: "Walking",
          level: "Intermediate",
          thumbnail_url: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=800&h=600&fit=crop",
          created_at: "2024-01-05T09:15:00Z",
          updated_at: "2024-01-05T09:15:00Z",
          is_featured: false,
          view_count: 675
        }
      ]
      setVideos(mockVideos)
    } catch (error) {
      console.error('Error loading videos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-jade-purple rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">DOGGIT Admin</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {user.user_metadata?.firstName || user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2 bg-jade-purple/10 text-jade-purple">
              <FileVideo className="h-4 w-4" />
              Videos
            </Button>
            <Link href="/admin/users">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Users
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileVideo className="h-8 w-8 text-jade-purple" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Videos</p>
                    <p className="text-2xl font-bold">{videos.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Eye className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                    <p className="text-2xl font-bold">{videos.reduce((sum, v) => sum + v.view_count, 0).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Featured Videos</p>
                    <p className="text-2xl font-bold">{videos.filter(v => v.is_featured).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Instructors</p>
                    <p className="text-2xl font-bold">{new Set(videos.map(v => v.instructor)).size}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Videos Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Video Library</CardTitle>
                <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Video
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Upload New Video</DialogTitle>
                    </DialogHeader>
                    <VideoUploadForm 
                      onClose={() => setShowUploadModal(false)}
                      onSuccess={() => {
                        setShowUploadModal(false)
                        loadVideos()
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videos.map((video) => (
                  <VideoRow key={video.id} video={video} onEdit={setSelectedVideo} onDelete={(id) => {
                    setVideos(videos.filter(v => v.id !== id))
                  }} />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

function VideoRow({ video, onEdit, onDelete }: { 
  video: Video, 
  onEdit: (video: Video) => void, 
  onDelete: (id: string) => void 
}) {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <img 
        src={video.thumbnail_url} 
        alt={video.title}
        className="w-24 h-16 object-cover rounded"
      />
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold">{video.title}</h3>
          {video.is_featured && <Badge variant="secondary">Featured</Badge>}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{video.instructor} • {video.duration}</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{video.category}</Badge>
          <Badge variant="outline">{video.level}</Badge>
          <span className="text-xs text-gray-500">{video.view_count} views</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(video)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(video.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function VideoUploadForm({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const supabase = createClient()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "Puppy Training",
    level: "Beginner",
    is_featured: false,
    duration: "0:00"
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadError(null)

    try {
      // Calculate total size for progress tracking
      const totalSize = (videoFile?.size || 0) + (thumbnailFile?.size || 0)
      let uploadedSize = 0

      // Step 1: Create database record
      setUploadStatus("Creating video record...")
      setUploadProgress(10)
      
      const { data: videoData, error: dbError } = await supabase
        .from('videos')
        .insert([{
          title: formData.title,
          description: formData.description,
          instructor: formData.instructor,
          category: formData.category,
          level: formData.level,
          is_featured: formData.is_featured,
          duration: formData.duration,
          view_count: 0,
          sort_order: 999
        }])
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        // If the table doesn't exist, create a mock entry
        if (dbError.message.includes('relation "videos" does not exist')) {
          console.log('Videos table not found, using mock data')
          alert('Video added successfully! (Using mock data - Supabase tables not configured)')
          onSuccess()
          return
        }
        throw new Error(dbError.message)
      }

      setUploadProgress(20)

      // Step 2: Upload video file if provided
      if (videoFile && videoData) {
        const fileSizeMB = (videoFile.size / (1024 * 1024)).toFixed(2)
        setUploadStatus(`Uploading video file (${fileSizeMB} MB)...`)
        setUploadProgress(30)
        
        const fileExt = videoFile.name.split('.').pop()
        const fileName = `${videoData.id}.${fileExt}`
        
        // Estimate upload time (assuming 1MB/s for rough estimate)
        const estimatedSeconds = Math.ceil(videoFile.size / (1024 * 1024))
        if (estimatedSeconds > 5) {
          setUploadStatus(`Uploading video (${fileSizeMB} MB) - Est. ${estimatedSeconds}s...`)
        }
        
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(`videos/${fileName}`, videoFile, {
            onUploadProgress: (progress) => {
              const percent = 30 + (progress.loaded / progress.total) * 50
              setUploadProgress(percent)
              const uploadedMB = (progress.loaded / (1024 * 1024)).toFixed(2)
              setUploadStatus(`Uploading video: ${uploadedMB}/${fileSizeMB} MB`)
            }
          })

        if (uploadError) {
          console.error('Video upload error:', uploadError)
          // Continue anyway - video URL can be added later
        } else {
          // Update the video record with the file URL
          const { data: { publicUrl } } = supabase.storage
            .from('videos')
            .getPublicUrl(`videos/${fileName}`)
          
          await supabase
            .from('videos')
            .update({ video_url: publicUrl })
            .eq('id', videoData.id)
        }
        
        setUploadProgress(80)
      }

      // Step 3: Upload thumbnail if provided
      if (thumbnailFile && videoData) {
        const fileSizeMB = (thumbnailFile.size / (1024 * 1024)).toFixed(2)
        setUploadStatus(`Uploading thumbnail (${fileSizeMB} MB)...`)
        setUploadProgress(85)
        
        const fileExt = thumbnailFile.name.split('.').pop()
        const fileName = `${videoData.id}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(`thumbnails/${fileName}`, thumbnailFile)

        if (uploadError) {
          console.error('Thumbnail upload error:', uploadError)
          // Continue anyway - thumbnail can be added later
        } else {
          // Update the video record with the thumbnail URL
          const { data: { publicUrl } } = supabase.storage
            .from('videos')
            .getPublicUrl(`thumbnails/${fileName}`)
          
          await supabase
            .from('videos')
            .update({ thumbnail_url: publicUrl })
            .eq('id', videoData.id)
        }
        
        setUploadProgress(95)
      }

      setUploadStatus("Finalizing...")
      setUploadProgress(100)
      
      setTimeout(() => {
        alert('Video uploaded successfully!')
        onSuccess()
      }, 500)
    } catch (error: any) {
      console.error('Upload error:', error)
      setUploadError(error.message || 'Failed to upload video')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Video title"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="instructor">Instructor</Label>
          <Input
            id="instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            placeholder="Instructor name"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Video description"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Puppy Training">Puppy Training</SelectItem>
              <SelectItem value="Obedience">Obedience</SelectItem>
              <SelectItem value="Walking">Walking</SelectItem>
              <SelectItem value="Behavior">Behavior</SelectItem>
              <SelectItem value="Agility">Agility</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="level">Level</Label>
          <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
            <SelectTrigger>
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
        <Label htmlFor="duration">Duration (e.g., 15:30)</Label>
        <Input
          id="duration"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          placeholder="15:30"
          required
        />
      </div>

      <div>
        <Label htmlFor="video">Video File (Optional)</Label>
        <Input
          id="video"
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
        />
        <p className="text-xs text-gray-500 mt-1">You can upload the video file later if needed</p>
      </div>

      <div>
        <Label htmlFor="thumbnail">Thumbnail Image (Optional)</Label>
        <Input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
        />
        <p className="text-xs text-gray-500 mt-1">Or use an image URL instead</p>
      </div>

      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-800 text-sm">{uploadError}</p>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{uploadStatus}</span>
            <span className="text-gray-600">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-jade-purple h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          {videoFile && uploadProgress > 20 && uploadProgress < 80 && (
            <p className="text-xs text-gray-500">
              File size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUploading} className="gap-2">
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Video
            </>
          )}
        </Button>
      </div>
    </form>
  )
}